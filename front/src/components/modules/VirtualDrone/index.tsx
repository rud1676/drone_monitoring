import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { missionInfo, base } from '@/utils/simulation';

const cpath = missionInfo.map(info => ({
  ...base,
  droneAltitude: info[2],
  droneLatitude: info[0],
  droneLongitude: info[1],
}));

const VirtualDrone = ({ d, i }) => {
  const [path, setPath] = useState(null);

  useEffect(() => {
    const startSimulation = step => {
      // 시뮬레이션 로직...
      if (step === 1) {
        // 미션 정보 전송
        d.socket.emit('mission', JSON.stringify(missionInfo));

        setTimeout(() => {
          startSimulation(2);
        }, 1000);
      }
      if (step > 1 && cpath.length > step - 2) {
        d.socket.emit('message', JSON.stringify(cpath[step - 2]));
        const newPath = {
          ...base,
          droneAltitude: missionInfo[step - 2][2],
          droneLatitude: missionInfo[step - 2][0],
          droneLongitude: missionInfo[step - 2][1],
        };
        setPath(newPath);

        setTimeout(() => {
          startSimulation(step + 1);
        }, 1000);
      } else {
        setTimeout(() => {
          startSimulation(2);
        }, 1000);
      }
    };

    if (d.socket) {
      startSimulation(1);
    }
  }, [d.socket]);
  return (
    <Box key={d.name}>
      <Box>{`${i + 1}. 드론이름 : ${d.name}`}</Box>
      <Box sx={{ width: '100%', border: '1px solid black' }}>
        <p
          style={{
            overflow: 'auto',
            letterSpacing: 'normal',
            wordBreak: 'break-all',
          }}
        >{`실시간 경로 전송: ${JSON.stringify(path)}`}</p>
      </Box>
    </Box>
  );
};

VirtualDrone.propTypes = {
  d: PropTypes.object,
  i: PropTypes.number,
};

export default VirtualDrone;
