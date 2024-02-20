import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Subscriber } from 'openvidu-browser';

const Video = styled.video`
  width: 100%;
  height: auto;
  float: left;
  cursor: pointer;
`;

const StreamConatiner = styled.div`
  background: rgba(0, 0, 0, 0);
  color: #777777;
  font-weight: bold;
  border-bottom-right-radius: 4px;
  display: flex;
  flex-direction: column;
  margin: auto;
`;

interface UserVideoComponentType {
  streamManager: Subscriber;
}

const UserVideoComponent = ({ streamManager }: UserVideoComponentType) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <div>
      {streamManager !== undefined ? (
        <StreamConatiner>
          <Video autoPlay ref={videoRef} />
        </StreamConatiner>
      ) : null}
    </div>
  );
};

export default UserVideoComponent;
