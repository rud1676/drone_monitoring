import React, { useCallback, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Subscriber } from 'openvidu-browser';

const StyledVideo = styled.video`
  width: 100%;
  height: auto;
  float: left;
  cursor: pointer;
`;

const Streamcomponent = styled.div`
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

  const getNicknameTag = useCallback(() => {
    const { stream } = streamManager;
    const jsonstr = stream.connection.data;
    return JSON.parse(jsonstr).clientData;
  }, [streamManager]);

  useEffect(() => {
    if (videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <div>
      {streamManager !== undefined ? (
        <Streamcomponent>
          <StyledVideo autoPlay ref={videoRef} />
          <div>
            <p>{getNicknameTag()}</p>
          </div>
        </Streamcomponent>
      ) : null}
    </div>
  );
};

export default UserVideoComponent;
