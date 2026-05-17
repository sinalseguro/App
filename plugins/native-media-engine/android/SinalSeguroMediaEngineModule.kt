package br.com.sinalseguro.app.media

import android.app.Application
import android.media.MediaCodec
import android.media.MediaExtractor
import android.media.MediaFormat
import android.media.MediaMetadataRetriever
import android.media.MediaMuxer
import android.net.Uri
import android.util.Base64
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.oney.WebRTCModule.SinalSeguroWebRtcAccess
import com.oney.WebRTCModule.WebRTCModule
import java.io.BufferedInputStream
import java.io.BufferedOutputStream
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.RandomAccessFile
import java.nio.ByteBuffer
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.Instant
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import javax.crypto.Cipher
import javax.crypto.CipherOutputStream
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

object SinalSeguroNativeMediaResidueCleaner {
  fun cleanup(application: Application) {
    cleanupDirectory(File(application.cacheDir, "sinalseguro-native-media/playback"))
  }

  private fun cleanupDirectory(root: File) {
    if (!root.exists()) return
    root.walkBottomUp().forEach { file ->
      if (file == root) return@forEach
      file.delete()
    }
    root.delete()
  }
}

class SinalSeguroMediaEngineModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {
  private val random = SecureRandom()
  private val playbackHandles = mutableMapOf<String, File>()
  private val liveVideoRecorders = ConcurrentHashMap<String, SinalSeguroLiveVideoRecorder>()
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

      val nonce = ByteArray(12)
      random.nextBytes(nonce)
      val cipher = Cipher.getInstance("AES/GCM/NoPadding")
      cipher.init(Cipher.ENCRYPT_MODE, SecretKeySpec(keyBytes, "AES"), GCMParameterSpec(128, nonce))
      if (aad.isNotEmpty()) {
        cipher.updateAAD(aad.toByteArray(Charsets.UTF_8))
      }
      val targetFile = File(outputDirectory, "${safeFileStem(segmentId)}.nseg")
      val plaintextDigest = MessageDigest.getInstance("SHA-256")
      var plaintextSizeBytes = 0L

      BufferedInputStream(FileInputStream(sourceFile), 65536).use { input ->
        CipherOutputStream(BufferedOutputStream(FileOutputStream(targetFile), 65536), cipher).use { output ->
          val buffer = ByteArray(65536)
          var read: Int
          while (input.read(buffer).also { read = it } != -1) {
            plaintextDigest.update(buffer, 0, read)
            plaintextSizeBytes += read
            output.write(buffer, 0, read)
          }
        }
      }

      val encryptedSizeBytes = targetFile.length()
      val tag = readFileTail(targetFile, 16)
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
      result.putDouble("plaintextSizeBytes", plaintextSizeBytes.toDouble())
      result.putDouble("encryptedSizeBytes", encryptedSizeBytes.toDouble())
      result.putString("plaintextSha256", hexDigest(plaintextDigest.digest()))
      result.putString("ciphertextSha256", sha256HexFile(targetFile))
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
      val assetId = requireString(input, "assetId")
      val playableFile = writeDecryptedAssetForPlayback(input, assetId)
      promise.resolve(buildPlaybackHandle(playableFile, 1))
    } catch (error: Exception) {
      promise.reject("native_open_playback_failed", "Native playback open failed.", error)
    }
  }

  @ReactMethod
  fun openEncryptedAssets(input: ReadableMap, promise: Promise) {
    try {
      val assets = input.getArray("assets") ?: throw IllegalArgumentException("native_playback_assets_required")
      if (assets.size() == 0) {
        throw IllegalArgumentException("native_playback_assets_required")
      }

      val assetSetId = optionalString(input, "assetSetId")
        ?: optionalString(input, "packageId")
        ?: UUID.randomUUID().toString()

      if (assets.size() == 1) {
        val singleAsset = assets.getMap(0) ?: throw IllegalArgumentException("native_playback_asset_required")
        val singleAssetId = optionalString(singleAsset, "assetId") ?: assetSetId
        val playableFile = writeDecryptedAssetForPlayback(singleAsset, singleAssetId)
        promise.resolve(buildPlaybackHandle(playableFile, 1))
        return
      }

      val playbackDirectory = nativePlaybackDirectory()
      val decryptedSegments = mutableListOf<File>()
      val playableFile = File(playbackDirectory, "${safeFileStem(assetSetId)}-${UUID.randomUUID()}.mp4")

      try {
        for (index in 0 until assets.size()) {
          val assetInput = assets.getMap(index) ?: throw IllegalArgumentException("native_playback_asset_required")
          val assetId = optionalString(assetInput, "assetId") ?: "segment-$index"
          decryptedSegments.add(writeDecryptedAssetForPlayback(assetInput, "$assetSetId-part-$index-$assetId"))
        }

        muxMp4Segments(decryptedSegments, playableFile)
        decryptedSegments.forEach { it.delete() }
        promise.resolve(buildPlaybackHandle(playableFile, assets.size()))
      } catch (error: Exception) {
        decryptedSegments.forEach { it.delete() }
        playableFile.delete()
        throw error
      }
    } catch (error: Exception) {
      promise.reject("native_open_package_playback_failed", "Native package playback open failed.", error)
    }
  }

  @ReactMethod
  fun closePlaybackHandle(handleId: String, promise: Promise) {
    playbackHandles.remove(handleId)?.delete()
    promise.resolve(null)
  }

  @ReactMethod
  fun cleanupMediaResidues(promise: Promise) {
    try {
      val cleanupRoot = File(reactContext.cacheDir, "sinalseguro-native-media")
      val nativeSummary = cleanupDirectory(cleanupRoot)
      val result = Arguments.createMap()
      result.putString("schemaVersion", "sinalseguro.native-media-cleanup.v1")
      result.putString("status", "ok")
      result.putString("engine", "SinalSeguroMediaEngine")
      result.putDouble("deletedFiles", nativeSummary.deletedFiles.toDouble())
      result.putDouble("deletedBytes", nativeSummary.deletedBytes.toDouble())
      result.putString("completedAt", Instant.now().toString())
      promise.resolve(result)
    } catch (error: Exception) {
      promise.reject("native_cleanup_failed", "Native residue cleanup failed.", error)
    }
  }

  @ReactMethod
  fun startLiveVideoRecording(input: ReadableMap, promise: Promise) {
    try {
      val streamReactTag = requireString(input, "streamReactTag")
      val recordingId = optionalString(input, "recordingId") ?: UUID.randomUUID().toString()
      if (liveVideoRecorders.containsKey(recordingId)) {
        throw IllegalArgumentException("live_video_recording_already_started")
      }

      val webRtcModule = reactContext.getNativeModule(WebRTCModule::class.java)
        ?: throw IllegalArgumentException("webrtc_module_unavailable")
      val videoTrack = SinalSeguroWebRtcAccess.getVideoTrackForReactTag(webRtcModule, streamReactTag)
        ?: throw IllegalArgumentException("live_video_track_unavailable")
      val outputDirectory = File(reactContext.cacheDir, "sinalseguro-native-media/live-recordings")
      val recorder = SinalSeguroLiveVideoRecorder(recordingId, videoTrack, outputDirectory)
      recorder.start()
      liveVideoRecorders[recordingId] = recorder

      val result = Arguments.createMap()
      result.putString("schemaVersion", "sinalseguro.live-video-recording.v1")
      result.putString("status", "recording")
      result.putString("engine", "SinalSeguroMediaEngine")
      result.putString("recordingId", recordingId)
      result.putString("startedAt", Instant.now().toString())
      result.putBoolean("audioCaptured", false)
      promise.resolve(result)
    } catch (error: Exception) {
      promise.reject("live_video_recording_start_failed", "Live video recording start failed.", error)
    }
  }

  @ReactMethod
  fun stopLiveVideoRecording(recordingId: String, promise: Promise) {
    try {
      val recorder = liveVideoRecorders.remove(recordingId)
        ?: throw IllegalArgumentException("live_video_recording_not_found")
      val summary = recorder.stop()
      val result = Arguments.createMap()
      result.putString("schemaVersion", "sinalseguro.live-video-recording.v1")
      result.putString("status", "stopped")
      result.putString("engine", "SinalSeguroMediaEngine")
      result.putString("recordingId", summary.recordingId)
      result.putString("sourceUri", summary.sourceUri)
      result.putString("fileName", summary.fileName)
      result.putDouble("sizeBytes", summary.sizeBytes.toDouble())
      result.putString("sha256", summary.sha256)
      result.putString("startedAt", summary.startedAt)
      result.putString("completedAt", summary.completedAt)
      result.putDouble("durationMs", summary.durationMs.toDouble())
      result.putDouble("frameCount", summary.frameCount.toDouble())
      result.putDouble("width", summary.width.toDouble())
      result.putDouble("height", summary.height.toDouble())
      result.putBoolean("audioCaptured", summary.audioCaptured)
      promise.resolve(result)
    } catch (error: Exception) {
      promise.reject("live_video_recording_stop_failed", "Live video recording stop failed.", error)
    }
  }

  private fun writeDecryptedAssetForPlayback(input: ReadableMap, fileStem: String): File {
    val sourceUri = requireString(input, "sourceUri")
    val keyBase64 = requireString(input, "keyBase64")
    val nonceBase64 = requireString(input, "nonceBase64")
    val aad = optionalString(input, "aad") ?: ""
    val encryptedFile = privateFileFromUri(sourceUri)
    if (!encryptedFile.exists() || !encryptedFile.isFile) {
      throw IllegalArgumentException("native_playback_source_unavailable")
    }

    val expectedCiphertextSha256 = optionalString(input, "ciphertextSha256")
    if (!expectedCiphertextSha256.isNullOrBlank() && sha256HexFile(encryptedFile) != expectedCiphertextSha256) {
      throw IllegalArgumentException("native_playback_source_integrity_failed")
    }

    val keyBytes = Base64.decode(keyBase64, Base64.NO_WRAP)
    val nonceBytes = Base64.decode(nonceBase64, Base64.NO_WRAP)
    if (keyBytes.size != 32 || nonceBytes.size != 12) {
      throw IllegalArgumentException("native_playback_crypto_material_invalid")
    }

    val cipher = Cipher.getInstance("AES/GCM/NoPadding")
    cipher.init(Cipher.DECRYPT_MODE, SecretKeySpec(keyBytes, "AES"), GCMParameterSpec(128, nonceBytes))
    if (aad.isNotEmpty()) {
      cipher.updateAAD(aad.toByteArray(Charsets.UTF_8))
    }

    val playableFile = File(nativePlaybackDirectory(), "${safeFileStem(fileStem)}-${UUID.randomUUID()}.mp4")
    try {
      decryptAesGcmFile(encryptedFile, playableFile, cipher)
      return playableFile
    } catch (error: Exception) {
      playableFile.delete()
      throw error
    }
  }

  private fun nativePlaybackDirectory(): File {
    val playbackDirectory = File(reactContext.cacheDir, "sinalseguro-native-media/playback")
    playbackDirectory.mkdirs()
    return playbackDirectory
  }

  private fun buildPlaybackHandle(playableFile: File, segmentCount: Int) = Arguments.createMap().apply {
    val handleId = UUID.randomUUID().toString()
    playbackHandles[handleId] = playableFile
    putString("schemaVersion", "sinalseguro.native-playback-handle.v1")
    putString("status", "opened")
    putString("engine", "SinalSeguroMediaEngine")
    putString("adapter", "native_encrypted_source")
    putString("handleId", handleId)
    putString("playableUri", Uri.fromFile(playableFile).toString())
    putDouble("segmentCount", segmentCount.toDouble())
    putString("openedAt", Instant.now().toString())
  }

  private fun muxMp4Segments(segmentFiles: List<File>, outputFile: File) {
    if (segmentFiles.isEmpty()) {
      throw IllegalArgumentException("native_playback_assets_required")
    }
    if (segmentFiles.size == 1) {
      segmentFiles[0].copyTo(outputFile, overwrite = true)
      return
    }

    val trackFormats = collectMuxTrackFormats(segmentFiles[0])
    if (trackFormats.isEmpty()) {
      throw IllegalArgumentException("native_playback_segment_tracks_unavailable")
    }
    validateMuxSegmentCompatibility(segmentFiles, trackFormats)

    outputFile.delete()
    val muxer = MediaMuxer(outputFile.absolutePath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)
    val outputTrackByKind = mutableMapOf<String, Int>()
    try {
      applyOrientationHint(muxer, segmentFiles[0])
      trackFormats.forEach { (kind, format) ->
        outputTrackByKind[kind] = muxer.addTrack(format)
      }
      muxer.start()

      var segmentOffsetUs = 0L
      segmentFiles.forEach { segmentFile ->
        val metadataDurationUs = readDurationUs(segmentFile)
        var maxSampleTimeUs = 0L

        outputTrackByKind.forEach { (kind, outputTrackIndex) ->
          maxSampleTimeUs = maxOf(
            maxSampleTimeUs,
            writeTrackSamples(segmentFile, kind, outputTrackIndex, segmentOffsetUs, muxer)
          )
        }

        segmentOffsetUs += if (metadataDurationUs > 0) metadataDurationUs else maxSampleTimeUs + 33_333L
      }
    } finally {
      try {
        muxer.stop()
      } catch (_: Exception) {
      }
      muxer.release()
    }
  }

  private fun collectMuxTrackFormats(segmentFile: File): Map<String, MediaFormat> {
    val extractor = MediaExtractor()
    val formats = linkedMapOf<String, MediaFormat>()
    try {
      extractor.setDataSource(segmentFile.absolutePath)
      for (trackIndex in 0 until extractor.trackCount) {
        val format = extractor.getTrackFormat(trackIndex)
        val kind = trackKind(format) ?: continue
        if (!formats.containsKey(kind)) {
          formats[kind] = format
        }
      }
    } finally {
      extractor.release()
    }
    return formats
  }

  private fun validateMuxSegmentCompatibility(
    segmentFiles: List<File>,
    referenceFormats: Map<String, MediaFormat>
  ) {
    val referenceTrackKinds = referenceFormats.keys
    val referenceRotation = readVideoRotation(segmentFiles[0])

    segmentFiles.drop(1).forEach { segmentFile ->
      val nextFormats = collectMuxTrackFormats(segmentFile)
      if (nextFormats.keys != referenceTrackKinds) {
        throw IllegalArgumentException("native_playback_segment_track_mismatch")
      }
      if (readVideoRotation(segmentFile) != referenceRotation) {
        throw IllegalArgumentException("native_playback_segment_rotation_mismatch")
      }
      referenceFormats.forEach { (kind, referenceFormat) ->
        val nextFormat = nextFormats[kind] ?: throw IllegalArgumentException("native_playback_segment_track_mismatch")
        if (!isMuxFormatCompatible(kind, referenceFormat, nextFormat)) {
          throw IllegalArgumentException("native_playback_segment_format_mismatch")
        }
      }
    }
  }

  private fun isMuxFormatCompatible(kind: String, referenceFormat: MediaFormat, nextFormat: MediaFormat): Boolean {
    if (formatString(referenceFormat, MediaFormat.KEY_MIME) != formatString(nextFormat, MediaFormat.KEY_MIME)) {
      return false
    }
    return when (kind) {
      "video" ->
        formatInteger(referenceFormat, MediaFormat.KEY_WIDTH) == formatInteger(nextFormat, MediaFormat.KEY_WIDTH) &&
          formatInteger(referenceFormat, MediaFormat.KEY_HEIGHT) == formatInteger(nextFormat, MediaFormat.KEY_HEIGHT)
      "audio" ->
        formatInteger(referenceFormat, MediaFormat.KEY_SAMPLE_RATE) == formatInteger(nextFormat, MediaFormat.KEY_SAMPLE_RATE) &&
          formatInteger(referenceFormat, MediaFormat.KEY_CHANNEL_COUNT) == formatInteger(nextFormat, MediaFormat.KEY_CHANNEL_COUNT)
      else -> true
    }
  }

  private fun formatString(format: MediaFormat, key: String): String? =
    if (format.containsKey(key)) format.getString(key) else null

  private fun formatInteger(format: MediaFormat, key: String): Int? =
    if (format.containsKey(key)) format.getInteger(key) else null

  private fun writeTrackSamples(
    segmentFile: File,
    trackKind: String,
    outputTrackIndex: Int,
    segmentOffsetUs: Long,
    muxer: MediaMuxer
  ): Long {
    val extractor = MediaExtractor()
    var maxSampleTimeUs = 0L
    try {
      extractor.setDataSource(segmentFile.absolutePath)
      val sourceTrackIndex = (0 until extractor.trackCount).firstOrNull { index ->
        trackKind(extractor.getTrackFormat(index)) == trackKind
      } ?: return 0L

      val format = extractor.getTrackFormat(sourceTrackIndex)
      val maxInputSize = if (format.containsKey(MediaFormat.KEY_MAX_INPUT_SIZE)) {
        format.getInteger(MediaFormat.KEY_MAX_INPUT_SIZE)
      } else {
        1024 * 1024
      }
      val buffer = ByteBuffer.allocate(maxOf(maxInputSize * 2, 1024 * 1024))
      val bufferInfo = MediaCodec.BufferInfo()
      extractor.selectTrack(sourceTrackIndex)

      while (true) {
        buffer.clear()
        val sampleSize = extractor.readSampleData(buffer, 0)
        if (sampleSize < 0) break

        val sampleTimeUs = maxOf(0L, extractor.sampleTime)
        bufferInfo.set(0, sampleSize, segmentOffsetUs + sampleTimeUs, extractor.sampleFlags)
        muxer.writeSampleData(outputTrackIndex, buffer, bufferInfo)
        maxSampleTimeUs = maxOf(maxSampleTimeUs, sampleTimeUs)
        extractor.advance()
      }
    } finally {
      extractor.release()
    }
    return maxSampleTimeUs
  }

  private fun trackKind(format: MediaFormat): String? {
    val mime = format.getString(MediaFormat.KEY_MIME) ?: return null
    return when {
      mime.startsWith("video/") -> "video"
      mime.startsWith("audio/") -> "audio"
      else -> null
    }
  }

  private fun applyOrientationHint(muxer: MediaMuxer, segmentFile: File) {
    val rotation = readVideoRotation(segmentFile)
    if (rotation == 0 || rotation == 90 || rotation == 180 || rotation == 270) {
      muxer.setOrientationHint(rotation)
    }
  }

  private fun readDurationUs(segmentFile: File): Long {
    val retriever = MediaMetadataRetriever()
    return try {
      retriever.setDataSource(segmentFile.absolutePath)
      val durationMs = retriever
        .extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION)
        ?.toLongOrNull()
        ?: 0L
      durationMs * 1000L
    } finally {
      retriever.release()
    }
  }

  private fun readVideoRotation(segmentFile: File): Int {
    val retriever = MediaMetadataRetriever()
    return try {
      retriever.setDataSource(segmentFile.absolutePath)
      retriever
        .extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_ROTATION)
        ?.toIntOrNull()
        ?: 0
    } finally {
      retriever.release()
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
      reactContext.noBackupFilesDir
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

  private fun sha256HexFile(file: File): String {
    val digest = MessageDigest.getInstance("SHA-256")
    BufferedInputStream(FileInputStream(file), 65536).use { input ->
      val buffer = ByteArray(65536)
      var read: Int
      while (input.read(buffer).also { read = it } != -1) {
        digest.update(buffer, 0, read)
      }
    }
    return hexDigest(digest.digest())
  }

  private fun hexDigest(bytes: ByteArray): String =
    bytes.joinToString("") { "%02x".format(it) }

  private fun readFileTail(file: File, byteCount: Int): ByteArray {
    RandomAccessFile(file, "r").use { accessFile ->
      if (accessFile.length() < byteCount) {
        throw IllegalArgumentException("native_file_too_small")
      }
      val bytes = ByteArray(byteCount)
      accessFile.seek(accessFile.length() - byteCount)
      accessFile.readFully(bytes)
      return bytes
    }
  }

  private fun decryptAesGcmFile(sourceFile: File, targetFile: File, cipher: Cipher) {
    BufferedInputStream(FileInputStream(sourceFile), 65536).use { input ->
      BufferedOutputStream(FileOutputStream(targetFile), 65536).use { output ->
        val buffer = ByteArray(65536)
        var read: Int
        while (input.read(buffer).also { read = it } != -1) {
          val decryptedChunk = cipher.update(buffer, 0, read)
          if (decryptedChunk != null && decryptedChunk.isNotEmpty()) {
            output.write(decryptedChunk)
          }
        }
        val finalChunk = cipher.doFinal()
        if (finalChunk != null && finalChunk.isNotEmpty()) {
          output.write(finalChunk)
        }
      }
    }
  }

  private fun safeFileStem(value: String): String =
    value.replace(Regex("[^A-Za-z0-9._-]"), "_").ifBlank { UUID.randomUUID().toString() }
}

private data class CleanupTotals(val deletedFiles: Int, val deletedBytes: Long)
