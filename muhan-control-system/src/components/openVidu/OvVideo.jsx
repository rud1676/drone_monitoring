/* eslint-disable no-console */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/function-component-definition */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const StyledVideo = styled.video`
  width: 100%;
  height: auto;
  float: left;
  cursor: pointer;
`;

const OvVideo = streamManager => {
  const videoRef = useRef();
  useEffect(() => {
    if (videoRef) {
      streamManager.streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return <StyledVideo autoPlay ref={videoRef} />;
};
OvVideo.propTypes = {
  streamManager: PropTypes.object,
};

export default OvVideo;
