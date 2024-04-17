import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-hls';
//@ts-ignore
import WebRtcStreaner from './webrtcstreamer';
import './adapter.min';
const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef(null);
  const webRtcServer = useRef(null);
  useEffect(() => {
    if (!src) {
      return;
    }
    let player: Player;
    if (videoRef.current) {
      player = videojs(videoRef.current, {
        autoplay: true,
        controls: true,
        sources: [
          {
            src: src,
            type: 'application/x-mpegURL',
          },
        ],
      });
    }
    webRtcServer.current = new WebRtcStreaner(
      'video',
      location.protocol + '//' + window.location.hostname + ':8000',
    );
    // console.log(location.protocol + '//' + window.location.hostname + ':8000');
    if (webRtcServer.current) {
      //@ts-ignore
      webRtcServer.current.connect(src);
      //@ts-ignore
      webRtcServer.current.videoElement = videoRef.current;
    }

    return () => {
      if (player) {
        player.dispose();
      }
      //@ts-ignore
      webRtcServer.current.disconnect();
    };
  }, [src]);

  return (
    <div className="video-item" data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
};

export default VideoPlayer;
