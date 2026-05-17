package br.com.sinalseguro.app.media

import android.media.MediaCodec
import android.media.MediaCodecInfo
import android.media.MediaFormat
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
  private val outputFile = File(outputDirectory, "${safeFileStem(recordingId)}-${UUID.randomUUID()}.mp4")
  private val startedAt = Instant.now().toString()
  private val startedAtMs = System.currentTimeMillis()
  private var baseTimestampUs: Long? = null
  private var codec: MediaCodec? = null
  private var muxer: MediaMuxer? = null
  private var muxerStarted = false
  private var trackIndex = -1
  private var width = 0
  private var height = 0
  private var orientationHint = 0
  private var frameCount = 0
  @Volatile private var stopping = false
  @Volatile private var stopped = false

  fun start() {
    outputDirectory().mkdirs()
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

    val format = MediaFormat.createVideoFormat(MediaFormat.MIMETYPE_VIDEO_AVC, width, height)
    format.setInteger(MediaFormat.KEY_COLOR_FORMAT, MediaCodecInfo.CodecCapabilities.COLOR_FormatYUV420Flexible)
    format.setInteger(MediaFormat.KEY_BIT_RATE, targetBitrate)
    format.setInteger(MediaFormat.KEY_FRAME_RATE, targetFps)
    format.setInteger(MediaFormat.KEY_I_FRAME_INTERVAL, 1)

    val encoder = MediaCodec.createEncoderByType(MediaFormat.MIMETYPE_VIDEO_AVC)
    encoder.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE)
    encoder.start()
    codec = encoder

    muxer = MediaMuxer(outputFile.absolutePath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4).also { mediaMuxer ->
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

    releaseEncoder()
    if (frameCount <= 0 || !outputFile.exists() || outputFile.length() <= 0) {
      outputFile.delete()
      throw IllegalStateException("live_video_recording_empty")
    }
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
      audioCaptured = false
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
