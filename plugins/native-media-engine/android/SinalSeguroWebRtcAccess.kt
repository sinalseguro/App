package com.oney.WebRTCModule

import org.webrtc.MediaStream
import org.webrtc.VideoTrack

object SinalSeguroWebRtcAccess {
  @JvmStatic
  fun getStreamForReactTag(module: WebRTCModule, streamReactTag: String): MediaStream? =
    module.getStreamForReactTag(streamReactTag)

  @JvmStatic
  fun getVideoTrackForReactTag(module: WebRTCModule, streamReactTag: String): VideoTrack? =
    getStreamForReactTag(module, streamReactTag)?.videoTracks?.firstOrNull()
}
