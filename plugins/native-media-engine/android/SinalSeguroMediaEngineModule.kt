package br.com.sinalseguro.app.media

import android.net.Uri
import android.util.Base64
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import java.io.File
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.Instant
import java.util.UUID
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

class SinalSeguroMediaEngineModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {
  private val random = SecureRandom()
  private val playbackHandles = mutableMapOf<String, File>()

  override fun getName(): String = "SinalSeguroMediaEngine"

  @ReactMethod
  fun encryptSegment(input: ReadableMap, promise: Promise) {
    try {
      val sourceUri = requireString(input, "sourceUri")
      val segmentId = requireString(input, "segmentId")
      val keyBase64 = requireString(input, "keyBase64")
      val aad = optionalString(input, "aad") ?: ""
      val deleteSource = input.hasKey("deleteSource") && input.getBoolean("deleteSource")
      val sourceFile = privateFileFromUri(sourceUri)
      if (!sourceFile.exists() || !sourceFile.isFile) {
        throw IllegalArgumentException("native_source_unavailable")
      }

      val outputDirectory = optionalString(input, "outputDirectoryUri")
        ?.let { privateDirectoryFromUri(it) }
        ?: File(reactContext.filesDir, "sinalseguro-native-media/segments")
      outputDirectory.mkdirs()

      val keyBytes = Base64.decode(keyBase64, Base64.NO_WRAP)
      if (keyBytes.size != 32) {
        throw IllegalArgumentException("native_key_size_invalid")
      }

      val plaintext = sourceFile.readBytes()
      val nonce = ByteArray(12)
      random.nextBytes(nonce)
      val cipher = Cipher.getInstance("AES/GCM/NoPadding")
      cipher.init(Cipher.ENCRYPT_MODE, SecretKeySpec(keyBytes, "AES"), GCMParameterSpec(128, nonce))
      if (aad.isNotEmpty()) {
        cipher.updateAAD(aad.toByteArray(Charsets.UTF_8))
      }
      val sealedBytes = cipher.doFinal(plaintext)
      val tag = sealedBytes.takeLast(16).toByteArray()
      val targetFile = File(outputDirectory, "${safeFileStem(segmentId)}.nseg")
      targetFile.writeBytes(sealedBytes)
      val sourceDeleted = deleteSource && sourceFile.delete()

      val result = Arguments.createMap()
      result.putString("schemaVersion", "sinalseguro.native-media-segment.v1")
      result.putString("status", "encrypted")
      result.putString("engine", "SinalSeguroMediaEngine")
      result.putString("storageEngine", "native_segmented_v1")
      result.putString("segmentId", segmentId)
      result.putString("segmentUri", Uri.fromFile(targetFile).toString())
      result.putString("algorithm", "aes-256-gcm")
      result.putString("nonceBase64", Base64.encodeToString(nonce, Base64.NO_WRAP))
      result.putString("tagBase64", Base64.encodeToString(tag, Base64.NO_WRAP))
      result.putDouble("plaintextSizeBytes", plaintext.size.toDouble())
      result.putDouble("encryptedSizeBytes", sealedBytes.size.toDouble())
      result.putString("plaintextSha256", sha256Hex(plaintext))
      result.putString("ciphertextSha256", sha256Hex(sealedBytes))
      result.putBoolean("sourceDeleted", sourceDeleted)
      result.putString("completedAt", Instant.now().toString())
      promise.resolve(result)
    } catch (error: Exception) {
      promise.reject("native_encrypt_segment_failed", "Segment encryption failed.", error)
    }
  }

  @ReactMethod
  fun openEncryptedAsset(input: ReadableMap, promise: Promise) {
    try {
      val playableUri = optionalString(input, "playableUri") ?: optionalString(input, "sourceUri")
      if (playableUri.isNullOrBlank()) {
        throw IllegalArgumentException("native_playable_uri_required")
      }
      val playableFile = privateFileFromUri(playableUri)
      if (!playableFile.exists() || !playableFile.isFile) {
        throw IllegalArgumentException("native_playable_source_unavailable")
      }
      val handleId = UUID.randomUUID().toString()
      playbackHandles[handleId] = playableFile

      val result = Arguments.createMap()
      result.putString("schemaVersion", "sinalseguro.native-playback-handle.v1")
      result.putString("status", "opened")
      result.putString("engine", "SinalSeguroMediaEngine")
      result.putString("adapter", "native_encrypted_source")
      result.putString("handleId", handleId)
      result.putString("playableUri", Uri.fromFile(playableFile).toString())
      result.putString("openedAt", Instant.now().toString())
      promise.resolve(result)
    } catch (error: Exception) {
      promise.reject("native_open_playback_failed", "Native playback open failed.", error)
    }
  }

  @ReactMethod
  fun closePlaybackHandle(handleId: String, promise: Promise) {
    playbackHandles.remove(handleId)
    promise.resolve(null)
  }

  @ReactMethod
  fun cleanupMediaResidues(promise: Promise) {
    try {
      val cleanupRoot = File(reactContext.cacheDir, "sinalseguro-native-media")
      val summary = cleanupDirectory(cleanupRoot)
      val result = Arguments.createMap()
      result.putString("schemaVersion", "sinalseguro.native-media-cleanup.v1")
      result.putString("status", "ok")
      result.putString("engine", "SinalSeguroMediaEngine")
      result.putDouble("deletedFiles", summary.deletedFiles.toDouble())
      result.putDouble("deletedBytes", summary.deletedBytes.toDouble())
      result.putString("completedAt", Instant.now().toString())
      promise.resolve(result)
    } catch (error: Exception) {
      promise.reject("native_cleanup_failed", "Native residue cleanup failed.", error)
    }
  }

  private fun requireString(input: ReadableMap, key: String): String {
    val value = optionalString(input, key)
    if (value.isNullOrBlank()) throw IllegalArgumentException("${key}_required")
    return value
  }

  private fun optionalString(input: ReadableMap, key: String): String? =
    if (input.hasKey(key) && !input.isNull(key)) input.getString(key) else null

  private fun privateDirectoryFromUri(value: String): File {
    val directory = privateFileFromUri(value)
    if (directory.exists() && !directory.isDirectory) {
      throw IllegalArgumentException("native_output_not_directory")
    }
    return directory
  }

  private fun privateFileFromUri(value: String): File {
    val uri = Uri.parse(value)
    if (uri.scheme != "file") {
      throw IllegalArgumentException("native_file_uri_required")
    }
    val path = uri.path ?: throw IllegalArgumentException("native_file_path_required")
    val file = File(path).canonicalFile
    val allowedRoots = listOfNotNull(
      reactContext.filesDir,
      reactContext.cacheDir,
      reactContext.noBackupFilesDir,
      reactContext.externalCacheDir,
      reactContext.getExternalFilesDir(null)
    ).map { it.canonicalFile }

    if (allowedRoots.none { root -> file.path == root.path || file.path.startsWith("${root.path}/") }) {
      throw IllegalArgumentException("native_file_outside_app_private_storage")
    }
    return file
  }

  private fun cleanupDirectory(root: File): CleanupTotals {
    if (!root.exists()) return CleanupTotals(0, 0)
    var deletedFiles = 0
    var deletedBytes = 0L
    root.walkBottomUp().forEach { file ->
      if (file == root) return@forEach
      if (file.isFile) {
        val length = file.length()
        if (file.delete()) {
          deletedFiles += 1
          deletedBytes += length
        }
      } else if (file.isDirectory) {
        file.delete()
      }
    }
    root.delete()
    return CleanupTotals(deletedFiles, deletedBytes)
  }

  private fun sha256Hex(bytes: ByteArray): String =
    MessageDigest.getInstance("SHA-256")
      .digest(bytes)
      .joinToString("") { "%02x".format(it) }

  private fun safeFileStem(value: String): String =
    value.replace(Regex("[^A-Za-z0-9._-]"), "_").ifBlank { UUID.randomUUID().toString() }
}

private data class CleanupTotals(val deletedFiles: Int, val deletedBytes: Long)
