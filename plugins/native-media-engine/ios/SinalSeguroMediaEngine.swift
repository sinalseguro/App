import CryptoKit
import Foundation
import React
import Security

@objc(SinalSeguroMediaEngine)
class SinalSeguroMediaEngine: NSObject {
  private var playbackHandles: [String: URL] = [:]
  private let fileManager = FileManager.default

  @objc
  static func requiresMainQueueSetup() -> Bool {
    false
  }

  @objc(encryptSegment:resolver:rejecter:)
  func encryptSegment(
    _ input: NSDictionary,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    do {
      let sourceUri = try requiredString(input, "sourceUri")
      let segmentId = try requiredString(input, "segmentId")
      let keyBase64 = try requiredString(input, "keyBase64")
      let aad = optionalString(input, "aad") ?? ""
      let deleteSource = input["deleteSource"] as? Bool ?? false
      let sourceURL = try privateFileURL(from: sourceUri)
      guard fileManager.fileExists(atPath: sourceURL.path) else {
        throw MediaEngineError("native_source_unavailable")
      }

      let outputDirectory = try optionalString(input, "outputDirectoryUri")
        .map { try privateDirectoryURL(from: $0) }
        ?? nativeSegmentDirectory()
      try prepareSecureDirectory(outputDirectory)

      guard let keyData = Data(base64Encoded: keyBase64), keyData.count == 32 else {
        throw MediaEngineError("native_key_size_invalid")
      }

      let plaintext = try Data(contentsOf: sourceURL)
      let nonceData = try randomBytes(count: 12)
      let sealedBox = try AES.GCM.seal(
        plaintext,
        using: SymmetricKey(data: keyData),
        nonce: AES.GCM.Nonce(data: nonceData),
        authenticating: Data(aad.utf8)
      )
      var sealedBytes = Data()
      sealedBytes.append(sealedBox.ciphertext)
      sealedBytes.append(sealedBox.tag)
      let targetURL = outputDirectory.appendingPathComponent("\(safeFileStem(segmentId)).nseg")
      try sealedBytes.write(to: targetURL, options: [.atomic])
      try protectMediaFile(targetURL)
      let sourceDeleted = deleteSource && ((try? fileManager.removeItem(at: sourceURL)) != nil)

      resolve([
        "schemaVersion": "sinalseguro.native-media-segment.v1",
        "status": "encrypted",
        "engine": "SinalSeguroMediaEngine",
        "storageEngine": "native_segmented_v1",
        "segmentId": segmentId,
        "segmentUri": targetURL.absoluteString,
        "algorithm": "aes-256-gcm",
        "nonceBase64": nonceData.base64EncodedString(),
        "tagBase64": sealedBox.tag.base64EncodedString(),
        "plaintextSizeBytes": plaintext.count,
        "encryptedSizeBytes": sealedBytes.count,
        "plaintextSha256": sha256Hex(plaintext),
        "ciphertextSha256": sha256Hex(sealedBytes),
        "sourceDeleted": sourceDeleted,
        "completedAt": isoTimestamp()
      ])
    } catch {
      reject("native_encrypt_segment_failed", "Segment encryption failed.", error)
    }
  }

  @objc(openEncryptedAsset:resolver:rejecter:)
  func openEncryptedAsset(
    _ input: NSDictionary,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    do {
      let sourceUri = try requiredString(input, "sourceUri")
      let assetId = try requiredString(input, "assetId")
      let keyBase64 = try requiredString(input, "keyBase64")
      let nonceBase64 = try requiredString(input, "nonceBase64")
      let aad = optionalString(input, "aad") ?? ""
      let encryptedURL = try privateFileURL(from: sourceUri)
      guard fileManager.fileExists(atPath: encryptedURL.path) else {
        throw MediaEngineError("native_playback_source_unavailable")
      }

      let sealedBytes = try Data(contentsOf: encryptedURL)
      if let expectedCiphertextSha256 = optionalString(input, "ciphertextSha256"),
         !expectedCiphertextSha256.isEmpty,
         sha256Hex(sealedBytes) != expectedCiphertextSha256 {
        throw MediaEngineError("native_playback_source_integrity_failed")
      }

      guard let keyData = Data(base64Encoded: keyBase64), keyData.count == 32,
            let nonceData = Data(base64Encoded: nonceBase64), nonceData.count == 12,
            sealedBytes.count >= 16 else {
        throw MediaEngineError("native_playback_crypto_material_invalid")
      }

      let ciphertext = Data(sealedBytes.dropLast(16))
      let tag = Data(sealedBytes.suffix(16))
      if let tagBase64 = optionalString(input, "tagBase64"),
         !tagBase64.isEmpty,
         tag.base64EncodedString() != tagBase64 {
        throw MediaEngineError("native_playback_tag_mismatch")
      }
      let sealedBox = try AES.GCM.SealedBox(
        nonce: AES.GCM.Nonce(data: nonceData),
        ciphertext: ciphertext,
        tag: tag
      )
      let plaintext = try AES.GCM.open(
        sealedBox,
        using: SymmetricKey(data: keyData),
        authenticating: Data(aad.utf8)
      )

      let playbackDirectory = cacheDirectory()
        .appendingPathComponent("sinalseguro-native-media", isDirectory: true)
        .appendingPathComponent("playback", isDirectory: true)
      try prepareSecureDirectory(playbackDirectory)
      let playableURL = playbackDirectory.appendingPathComponent("\(safeFileStem(assetId))-\(UUID().uuidString).mp4")
      do {
        try plaintext.write(to: playableURL, options: [.atomic])
        try protectMediaFile(playableURL)
      } catch {
        try? fileManager.removeItem(at: playableURL)
        throw error
      }

      let handleId = UUID().uuidString
      playbackHandles[handleId] = playableURL
      resolve([
        "schemaVersion": "sinalseguro.native-playback-handle.v1",
        "status": "opened",
        "engine": "SinalSeguroMediaEngine",
        "adapter": "native_encrypted_source",
        "handleId": handleId,
        "playableUri": playableURL.absoluteString,
        "openedAt": isoTimestamp()
      ])
    } catch {
      reject("native_open_playback_failed", "Native playback open failed.", error)
    }
  }

  @objc(closePlaybackHandle:resolver:rejecter:)
  func closePlaybackHandle(
    _ handleId: String,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    if let playableURL = playbackHandles.removeValue(forKey: handleId) {
      try? fileManager.removeItem(at: playableURL)
    }
    resolve(nil)
  }

  @objc(cleanupMediaResidues:rejecter:)
  func cleanupMediaResidues(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    do {
      let root = cacheDirectory().appendingPathComponent("sinalseguro-native-media", isDirectory: true)
      let summary = try cleanupDirectory(root)
      resolve([
        "schemaVersion": "sinalseguro.native-media-cleanup.v1",
        "status": "ok",
        "engine": "SinalSeguroMediaEngine",
        "deletedFiles": summary.deletedFiles,
        "deletedBytes": summary.deletedBytes,
        "completedAt": isoTimestamp()
      ])
    } catch {
      reject("native_cleanup_failed", "Native residue cleanup failed.", error)
    }
  }

  private func requiredString(_ input: NSDictionary, _ key: String) throws -> String {
    guard let value = optionalString(input, key), !value.isEmpty else {
      throw MediaEngineError("\(key)_required")
    }
    return value
  }

  private func optionalString(_ input: NSDictionary, _ key: String) -> String? {
    input[key] as? String
  }

  private func privateDirectoryURL(from value: String) throws -> URL {
    let url = try privateFileURL(from: value)
    var isDirectory: ObjCBool = false
    if fileManager.fileExists(atPath: url.path, isDirectory: &isDirectory), !isDirectory.boolValue {
      throw MediaEngineError("native_output_not_directory")
    }
    return url
  }

  private func privateFileURL(from value: String) throws -> URL {
    guard let url = URL(string: value), url.isFileURL else {
      throw MediaEngineError("native_file_uri_required")
    }
    let resolved = url.standardizedFileURL.resolvingSymlinksInPath()
    let allowedRoots = [
      documentsDirectory(),
      cacheDirectory(),
      applicationSupportDirectory(),
      URL(fileURLWithPath: NSTemporaryDirectory(), isDirectory: true)
    ].map { $0.standardizedFileURL.resolvingSymlinksInPath() }

    guard allowedRoots.contains(where: { root in
      resolved.path == root.path || resolved.path.hasPrefix(root.path + "/")
    }) else {
      throw MediaEngineError("native_file_outside_app_private_storage")
    }
    return resolved
  }

  private func nativeSegmentDirectory() -> URL {
    documentsDirectory()
      .appendingPathComponent("sinalseguro-native-media", isDirectory: true)
      .appendingPathComponent("segments", isDirectory: true)
  }

  private func prepareSecureDirectory(_ url: URL) throws {
    try fileManager.createDirectory(at: url, withIntermediateDirectories: true)
    try markExcludedFromBackup(url)
    try? fileManager.setAttributes(
      [.protectionKey: FileProtectionType.completeUntilFirstUserAuthentication],
      ofItemAtPath: url.path
    )
  }

  private func protectMediaFile(_ url: URL) throws {
    try markExcludedFromBackup(url)
    try? fileManager.setAttributes(
      [.protectionKey: FileProtectionType.completeUnlessOpen],
      ofItemAtPath: url.path
    )
  }

  private func markExcludedFromBackup(_ url: URL) throws {
    var resourceURL = url
    var values = URLResourceValues()
    values.isExcludedFromBackup = true
    try? resourceURL.setResourceValues(values)
  }

  private func documentsDirectory() -> URL {
    fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
  }

  private func cacheDirectory() -> URL {
    fileManager.urls(for: .cachesDirectory, in: .userDomainMask)[0]
  }

  private func applicationSupportDirectory() -> URL {
    fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
  }

  private func cleanupDirectory(_ root: URL) throws -> CleanupTotals {
    guard fileManager.fileExists(atPath: root.path) else {
      return CleanupTotals(deletedFiles: 0, deletedBytes: 0)
    }
    var deletedFiles = 0
    var deletedBytes: Int64 = 0
    let keys: Set<URLResourceKey> = [.isDirectoryKey, .fileSizeKey]
    let urls = fileManager.enumerator(at: root, includingPropertiesForKeys: Array(keys))?.allObjects as? [URL] ?? []

    for url in urls.reversed() {
      let values = try url.resourceValues(forKeys: keys)
      if values.isDirectory == true {
        try? fileManager.removeItem(at: url)
      } else {
        deletedBytes += Int64(values.fileSize ?? 0)
        if (try? fileManager.removeItem(at: url)) != nil {
          deletedFiles += 1
        }
      }
    }
    try? fileManager.removeItem(at: root)
    return CleanupTotals(deletedFiles: deletedFiles, deletedBytes: deletedBytes)
  }

  private func randomBytes(count: Int) throws -> Data {
    var bytes = [UInt8](repeating: 0, count: count)
    let status = SecRandomCopyBytes(kSecRandomDefault, count, &bytes)
    guard status == errSecSuccess else {
      throw MediaEngineError("native_random_failed")
    }
    return Data(bytes)
  }

  private func sha256Hex(_ data: Data) -> String {
    SHA256.hash(data: data).map { String(format: "%02x", $0) }.joined()
  }

  private func safeFileStem(_ value: String) -> String {
    let allowed = CharacterSet(charactersIn: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-")
    let scalars = value.unicodeScalars.map { allowed.contains($0) ? Character($0) : "_" }
    let result = String(scalars)
    return result.isEmpty ? UUID().uuidString : result
  }

  private func isoTimestamp() -> String {
    ISO8601DateFormatter().string(from: Date())
  }
}

private struct CleanupTotals {
  let deletedFiles: Int
  let deletedBytes: Int64
}

private struct MediaEngineError: Error, LocalizedError {
  let message: String

  init(_ message: String) {
    self.message = message
  }

  var errorDescription: String? {
    message
  }
}
