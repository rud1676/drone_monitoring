/* eslint-disable react/button-has-type */
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { Box, Button, Typography } from '@mui/material';
import io from 'socket.io-client';
import Loading from '../components/common/Loading';
import DroneComponent from '../components/UIRender/drone-simul/drone';
import { backUrl } from '../define';

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

export default function Drone() {
  // 드론은 메시지를 보내기만 한다.
  const [showDrone, setShowDrone] = useState('');
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendMissionInfo, setSendMissionInfo] = useState(false);

  useEffect(() => {
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loading />;
  }

  const connectServer = async () => {
    setSendMissionInfo(missionInfo);
    if (drones.length >= 50) return;
    const droneName = nanoid(3); // 랜덤 3문자열 생성
    setShowDrone(droneName);
    const newSocket = await io(`${backUrl}/drone-${droneName}`, {
      transports: ['websocket'],
    });
    setDrones(prev => [
      ...prev,
      { name: droneName, socket: newSocket, path: null, missionInfo: null },
    ]);
  };

  const onClickGenerator50 = async () => {
    for (let i = drones.length; i < 50; i += 1) {
      // eslint-disable-next-line
      await connectServer();
    }
  };

  return (
    <Box sx={{ p: '20px' }}>
      <Typography variant="h4">Virturl Drone Generator</Typography>
      <Typography variant="h6">
        접속 Url: {`${backUrl}/drone-${showDrone}`}
      </Typography>

      <Button
        variant="contained"
        onClick={() => {
          connectServer();
        }}
      >
        Generator
      </Button>
      <Button
        onClick={onClickGenerator50}
        sx={{ marginLeft: '40px' }}
        variant="contained"
      >
        Generator 50
      </Button>
      <Box>미션 전송: {sendMissionInfo}</Box>
      <Box>현재 드론 갯수: {drones.length}</Box>

      {drones.map((drone, i) => (
        <DroneComponent key={drone.name} i={i} d={drone} />
      ))}
    </Box>
  );
}
