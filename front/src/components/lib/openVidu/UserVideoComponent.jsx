import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import OpenViduVideoComponent from './OvVideo';

const Streamcomponent = styled.div`
  background: rgba(0, 0, 0, 0);
  color: #777777;
  font-weight: bold;
  border-bottom-right-radius: 4px;
  display: flex;
  flex-direction: column;
  margin: auto;
`;

const UserVideoComponent = streamManager => {
  const getNicknameTag = useCallback(() => {
    const { stream } = streamManager.streamManager;
    const jsonstr = stream.connection.data;
    return JSON.parse(jsonstr).clientData;
  }, [streamManager]);

  return (
    <div>
      {streamManager !== undefined ? (
        <Streamcomponent>
          <OpenViduVideoComponent streamManager={streamManager.streamManager} />
          <div>
            <p>{getNicknameTag()}</p>
          </div>
        </Streamcomponent>
      ) : null}
    </div>
  );
};

UserVideoComponent.propTypes = {
  streamManager: PropTypes.object,
};

export default UserVideoComponent;
