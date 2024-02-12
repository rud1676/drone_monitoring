import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

// Latitude, Longitude, Altitude
const missionInfo = [
  [37.473047, 128.870435, 30],
  [37.47723970382866, 128.91942858387085, 89],
  [37.477093629801246, 128.92015948396272, 97],
  [37.47691557227351, 128.92040025036195, 99],
  [37.47672573372901, 128.9206498176742, 102],
  [37.47653397838539, 128.92082201604106, 98],
  [37.47661072044296, 128.92093917294952, 102],
  [37.47640570035723, 128.9210892783022, 99],
];

const base = {
  batteryRemainPercent: 80,
  droneAltitude: 30,
  droneLatitude: 37.473047,
  droneLongitude: 128.870435,
  dronePitch: 0.0,
  droneRoll: 0.0,
  droneYaw: 0.0,
  homeLatitude: 37.473047,
  homeLongitude: 128.870435,
  mode: '대기중',
  status: 'connected',
  velocityHorizontal: 0.0,
  velocityVertical: 0.0,
};

const cpath = missionInfo.map(info => ({
  ...base,
  droneAltitude: info[2],
  droneLatitude: info[0],
  droneLongitude: info[1],
}));

const Drone = ({ d, i }) => {
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

Drone.propTypes = {
  d: PropTypes.object,
  i: PropTypes.number,
};

export default Drone;
