package br.com.sinalseguro.app.media

import android.media.MediaCodec
import android.media.MediaCodecInfo
import android.media.MediaExtractor
import android.media.MediaFormat
import android.media.MediaMetadataRetriever
import android.media.MediaRecorder
import android.media.MediaMuxer
import android.net.Uri
import java.io.File
import java.nio.ByteBuffer
import java.security.MessageDigest
import java.time.Instant
import java.util.UUID
import java.util.concurrent.Executors
import java.util.concurrent.Future
import java.util.concurrent.TimeUnit
import org.webrtc.VideoFrame
import org.webrtc.VideoSink
import org.webrtc.VideoTrack

data class SinalSeguroLiveVideoRecordingSummary(
  val recordingId: String,
  val sourceUri: String,
  val fileName: String,
  val sizeBytes: Long,
  val sha256: String,
  val startedAt: String,
  val completedAt: String,
  val durationMs: Long,
  val frameCount: Int,
  val width: Int,
  val height: Int,
  val audioCaptured: Boolean
)

class SinalSeguroLiveVideoRecorder(
  private val recordingId: String,
  private val videoTrack: VideoTrack,
  outputDirectory: File,
  private val targetBitrate: Int = 520_000,
  private val targetFps: Int = 12
) : VideoSink {
  private val executor = Executors.newSingleThreadExecutor()
  private val outputStem = "${safeFileStem(recordingId)}-${UUID.randomUUID()}"
  private val outputFile = File(outputDirectory, "$outputStem.mp4")
  private val videoFile = File(outputDirectory, "$outputStem-video.mp4")
  private val audioFile = File(outputDirectory, "$outputStem-audio.m4a")
  private val startedAt = Instant.now().toString()
  private val startedAtMs = System.currentTimeMillis()
  private var baseTimestampUs: Long? = null
  private var codec: MediaCodec? = null
  private var muxer: MediaMuxer? = null
  private var audioRecorder: MediaRecorder? = null
  private var muxerStarted = false
  private var trackIndex = -1
  private var width = 0
  private var height = 0
  private var orientationHint = 0
  private var frameCount = 0
  private var audioCaptured = false
  @Volatile private var stopping = false
  @Volatile private var stopped = false

  fun start() {
    outputDirectory().mkdirs()
    outputFile.delete()
    videoFile.delete()
    audioFile.delete()
    startAudioCapture()
    videoTrack.addSink(this)
  }

  override fun onFrame(frame: VideoFrame) {
    if (stopping || stopped) return
    frame.retain()
    executor.execute {
      try {
        if (!stopping && !stopped) encodeFrame(frame)
      } finally {
        frame.release()
      }
    }
  }

  fun stop(): SinalSeguroLiveVideoRecordingSummary {
    stopping = true
    videoTrack.removeSink(this)
    val future: Future<SinalSeguroLiveVideoRecordingSummary> = executor.submit<SinalSeguroLiveVideoRecordingSummary> {
      finishOnEncoderThread()
    }
    return try {
      future.get(12, TimeUnit.SECONDS)
    } finally {
      executor.shutdown()
    }
  }

  private fun encodeFrame(frame: VideoFrame) {
    val i420Buffer = frame.buffer.toI420() ?: return
    try {
      if (codec == null) {
        configureEncoder(i420Buffer.width, i420Buffer.height, frame.rotation)
      }

      val encoder = codec ?: return
      drainEncoder(false)
      val inputBufferIndex = encoder.dequeueInputBuffer(0)
      if (inputBufferIndex < 0) return

      val inputBuffer = encoder.getInputBuffer(inputBufferIndex) ?: return
      inputBuffer.clear()
      copyI420ToInputBuffer(i420Buffer, inputBuffer)
      val presentationTimeUs = presentationTimeUs(frame.timestampNs)
      encoder.queueInputBuffer(inputBufferIndex, 0, inputBuffer.position(), presentationTimeUs, 0)
      frameCount += 1
      drainEncoder(false)
    } finally {
      i420Buffer.release()
    }
  }

  private fun configureEncoder(frameWidth: Int, frameHeight: Int, rotation: Int) {
    width = frameWidth
    height = frameHeight
    orientationHint = when (rotation) {
      90, 180, 270 -> rotation
      else -> 0
    }
    outputFile.parentFile?.mkdirs()
    outputFile.delete()
    videoFile.delete()

    val format = MediaFormat.createVideoFormat(MediaFormat.MIMETYPE_VIDEO_AVC, width, height)
    format.setInteger(MediaFormat.KEY_COLOR_FORMAT, MediaCodecInfo.CodecCapabilities.COLOR_FormatYUV420Flexible)
    format.setInteger(MediaFormat.KEY_BIT_RATE, targetBitrate)
    format.setInteger(MediaFormat.KEY_FRAME_RATE, targetFps)
    format.setInteger(MediaFormat.KEY_I_FRAME_INTERVAL, 1)

    val encoder = MediaCodec.createEncoderByType(MediaFormat.MIMETYPE_VIDEO_AVC)
    encoder.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE)
    encoder.start()
    codec = encoder

    muxer = MediaMuxer(videoFile.absolutePath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4).also { mediaMuxer ->
      if (orientationHint in setOf(90, 180, 270)) {
        mediaMuxer.setOrientationHint(orientationHint)
      }
    }
  }

  private fun finishOnEncoderThread(): SinalSeguroLiveVideoRecordingSummary {
    if (stopped) {
      return buildSummary()
    }
    stopped = true

    val encoder = codec
    if (encoder != null) {
      val inputBufferIndex = encoder.dequeueInputBuffer(10_000)
      if (inputBufferIndex >= 0) {
        encoder.queueInputBuffer(inputBufferIndex, 0, 0, nextPresentationTimeUs(), MediaCodec.BUFFER_FLAG_END_OF_STREAM)
      }
      drainEncoder(true)
    }

    val capturedAudioFile = stopAudioCapture()
    releaseEncoder()
    if (frameCount <= 0 || !videoFile.exists() || videoFile.length() <= 0) {
      cleanupTemporaryFiles()
      throw IllegalStateException("live_video_recording_empty")
    }
    audioCaptured = buildFinalOutput(capturedAudioFile)
    cleanupTemporaryFiles()
    return buildSummary()
  }

  private fun drainEncoder(endOfStream: Boolean) {
    val encoder = codec ?: return
    val mediaMuxer = muxer ?: return
    val bufferInfo = MediaCodec.BufferInfo()

    while (true) {
      val outputBufferIndex = encoder.dequeueOutputBuffer(bufferInfo, if (endOfStream) 10_000 else 0)
      when {
        outputBufferIndex == MediaCodec.INFO_TRY_AGAIN_LATER -> {
          if (!endOfStream) return
        }
        outputBufferIndex == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED -> {
          if (muxerStarted) throw IllegalStateException("live_video_format_changed_twice")
          trackIndex = mediaMuxer.addTrack(encoder.outputFormat)
          mediaMuxer.start()
          muxerStarted = true
        }
        outputBufferIndex >= 0 -> {
          val encodedBuffer = encoder.getOutputBuffer(outputBufferIndex)
          if (encodedBuffer != null && bufferInfo.size > 0 && muxerStarted) {
            if (bufferInfo.flags and MediaCodec.BUFFER_FLAG_CODEC_CONFIG == 0) {
              encodedBuffer.position(bufferInfo.offset)
              encodedBuffer.limit(bufferInfo.offset + bufferInfo.size)
              mediaMuxer.writeSampleData(trackIndex, encodedBuffer, bufferInfo)
            }
          }
          encoder.releaseOutputBuffer(outputBufferIndex, false)
          if (bufferInfo.flags and MediaCodec.BUFFER_FLAG_END_OF_STREAM != 0) {
            return
          }
        }
      }
    }
  }

  private fun releaseEncoder() {
    try {
      codec?.stop()
    } catch (_: Exception) {
    }
    try {
      codec?.release()
    } catch (_: Exception) {
    }
    codec = null

    try {
      if (muxerStarted) muxer?.stop()
    } catch (_: Exception) {
    }
    try {
      muxer?.release()
    } catch (_: Exception) {
    }
    muxer = null
    muxerStarted = false
  }

  private fun startAudioCapture() {
    try {
      audioFile.parentFile?.mkdirs()
      audioFile.delete()
      val recorder = MediaRecorder()
      recorder.setAudioSource(MediaRecorder.AudioSource.MIC)
      recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
      recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
      recorder.setAudioSamplingRate(44_100)
      recorder.setAudioChannels(1)
      recorder.setAudioEncodingBitRate(64_000)
      recorder.setOutputFile(audioFile.absolutePath)
      recorder.prepare()
      recorder.start()
      audioRecorder = recorder
    } catch (_: Exception) {
      releaseAudioRecorder()
      audioFile.delete()
    }
  }

  private fun stopAudioCapture(): File? {
    val recorder = audioRecorder ?: return null
    audioRecorder = null
    var stoppedCleanly = false
    try {
      recorder.stop()
      stoppedCleanly = true
    } catch (_: Exception) {
    } finally {
      try {
        recorder.reset()
      } catch (_: Exception) {
      }
      try {
        recorder.release()
      } catch (_: Exception) {
      }
    }

    return if (stoppedCleanly && audioFile.exists() && audioFile.length() > 0 && hasTrack(audioFile, "audio")) {
      audioFile
    } else {
      audioFile.delete()
      null
    }
  }

  private fun releaseAudioRecorder() {
    val recorder = audioRecorder
    audioRecorder = null
    if (recorder != null) {
      try {
        recorder.release()
      } catch (_: Exception) {
      }
    }
  }

  private fun buildFinalOutput(capturedAudioFile: File?): Boolean {
    outputFile.delete()
    if (capturedAudioFile != null) {
      try {
        muxVideoAndAudio(videoFile, capturedAudioFile, outputFile)
        if (outputFile.exists() && outputFile.length() > 0 && hasTrack(outputFile, "audio")) {
          return true
        }
      } catch (_: Exception) {
        outputFile.delete()
      }
    }

    videoFile.copyTo(outputFile, overwrite = true)
    return false
  }

  private fun cleanupTemporaryFiles() {
    videoFile.delete()
    audioFile.delete()
  }

  private fun presentationTimeUs(timestampNs: Long): Long {
    val timestampUs = timestampNs / 1000L
    val baseUs = baseTimestampUs ?: timestampUs.also { baseTimestampUs = it }
    return maxOf(0L, timestampUs - baseUs)
  }

  private fun nextPresentationTimeUs(): Long =
    if (frameCount <= 0) 0L else ((frameCount + 1L) * 1_000_000L) / targetFps

  private fun copyI420ToInputBuffer(source: VideoFrame.I420Buffer, target: ByteBuffer) {
    copyPlane(source.dataY, source.strideY, source.width, source.height, target)
    copyPlane(source.dataU, source.strideU, (source.width + 1) / 2, (source.height + 1) / 2, target)
    copyPlane(source.dataV, source.strideV, (source.width + 1) / 2, (source.height + 1) / 2, target)
  }

  private fun copyPlane(source: ByteBuffer, stride: Int, width: Int, height: Int, target: ByteBuffer) {
    val row = ByteArray(width)
    for (rowIndex in 0 until height) {
      val duplicate = source.duplicate()
      duplicate.position(rowIndex * stride)
      duplicate.get(row, 0, width)
      target.put(row)
    }
  }

  private fun buildSummary(): SinalSeguroLiveVideoRecordingSummary {
    val completedAt = Instant.now().toString()
    return SinalSeguroLiveVideoRecordingSummary(
      recordingId = recordingId,
      sourceUri = Uri.fromFile(outputFile).toString(),
      fileName = outputFile.name,
      sizeBytes = outputFile.length(),
      sha256 = sha256HexFile(outputFile),
      startedAt = startedAt,
      completedAt = completedAt,
      durationMs = maxOf(0L, System.currentTimeMillis() - startedAtMs),
      frameCount = frameCount,
      width = width,
      height = height,
      audioCaptured = audioCaptured
    )
  }

  private fun outputDirectory(): File = outputFile.parentFile ?: outputFile
}

private fun safeFileStem(value: String): String =
  value.replace(Regex("[^A-Za-z0-9._-]"), "_").take(96).ifBlank { "live-video" }

private fun sha256HexFile(file: File): String {
  val digest = MessageDigest.getInstance("SHA-256")
  file.inputStream().use { input ->
    val buffer = ByteArray(64 * 1024)
    var read: Int
    while (input.read(buffer).also { read = it } != -1) {
      digest.update(buffer, 0, read)
    }
  }
  return digest.digest().joinToString("") { byte -> "%02x".format(byte) }
}

private fun muxVideoAndAudio(videoFile: File, audioFile: File, outputFile: File) {
  val muxer = MediaMuxer(outputFile.absolutePath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)
  var muxerStarted = false
  val videoExtractor = MediaExtractor()
  val audioExtractor = MediaExtractor()
  try {
    videoExtractor.setDataSource(videoFile.absolutePath)
    audioExtractor.setDataSource(audioFile.absolutePath)
    val sourceVideoTrackIndex = findTrackIndex(videoExtractor, "video")
      ?: throw IllegalStateException("live_video_track_missing")
    val sourceAudioTrackIndex = findTrackIndex(audioExtractor, "audio")
      ?: throw IllegalStateException("live_audio_track_missing")
    val outputVideoTrackIndex = muxer.addTrack(videoExtractor.getTrackFormat(sourceVideoTrackIndex))
    val outputAudioTrackIndex = muxer.addTrack(audioExtractor.getTrackFormat(sourceAudioTrackIndex))
    applyOrientationHint(muxer, videoFile)
    muxer.start()
    muxerStarted = true
    writeTrackSamples(videoExtractor, sourceVideoTrackIndex, outputVideoTrackIndex, muxer)
    writeTrackSamples(audioExtractor, sourceAudioTrackIndex, outputAudioTrackIndex, muxer)
  } catch (error: Exception) {
    outputFile.delete()
    throw error
  } finally {
    videoExtractor.release()
    audioExtractor.release()
    try {
      if (muxerStarted) muxer.stop()
    } catch (_: Exception) {
    }
    muxer.release()
  }
}

private fun findTrackIndex(extractor: MediaExtractor, trackKind: String): Int? {
  for (trackIndex in 0 until extractor.trackCount) {
    val format = extractor.getTrackFormat(trackIndex)
    if (trackKind(format) == trackKind) return trackIndex
  }
  return null
}

private fun hasTrack(file: File, expectedKind: String): Boolean {
  val extractor = MediaExtractor()
  return try {
    extractor.setDataSource(file.absolutePath)
    findTrackIndex(extractor, expectedKind) != null
  } catch (_: Exception) {
    false
  } finally {
    extractor.release()
  }
}

private fun writeTrackSamples(
  extractor: MediaExtractor,
  sourceTrackIndex: Int,
  outputTrackIndex: Int,
  muxer: MediaMuxer
) {
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
    bufferInfo.set(0, sampleSize, sampleTimeUs, extractor.sampleFlags)
    muxer.writeSampleData(outputTrackIndex, buffer, bufferInfo)
    extractor.advance()
  }
  extractor.unselectTrack(sourceTrackIndex)
}

private fun trackKind(format: MediaFormat): String? {
  val mime = format.getString(MediaFormat.KEY_MIME) ?: return null
  return when {
    mime.startsWith("video/") -> "video"
    mime.startsWith("audio/") -> "audio"
    else -> null
  }
}

private fun applyOrientationHint(muxer: MediaMuxer, videoFile: File) {
  val retriever = MediaMetadataRetriever()
  val rotation = try {
    retriever.setDataSource(videoFile.absolutePath)
    retriever
      .extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_ROTATION)
      ?.toIntOrNull()
      ?: 0
  } finally {
    retriever.release()
  }
  if (rotation == 0 || rotation == 90 || rotation == 180 || rotation == 270) {
    muxer.setOrientationHint(rotation)
  }
}
