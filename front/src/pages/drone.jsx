/* eslint-disable react/button-has-type */
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { Box, Button, Typography } from '@mui/material';
import io from 'socket.io-client';
import Loading from '../components/common/Loading';
import { backUrl } from '../define';

const missionInfo = `[
  [37.473047, 128.870435, 30],
  [37.47723970382866, 128.91942858387085, 89],
  [37.477093629801246, 128.92015948396272, 97],
  [37.47691557227351, 128.92040025036195, 99],
  [37.47672573372901, 128.9206498176742, 102],
  [37.47653397838539, 128.92082201604106, 98],
  [37.47661072044296, 128.92093917294952, 102],
  [37.47640570035723, 128.9210892783022, 99]
]`;

const path = `{
  "batteryRemainPercent": 80,
  "droneAltitude": 0.0,
  "droneLatitude": 37.473047,
  "droneLongitude": 128.870435,
  "dronePitch": 0.0,
  "droneRoll": 0.0,
  "droneYaw": 0.0,
  "homeLatitude": 37.473047,
  "homeLongitude": 128.870435,
  "mode": "대기중",
  "status": "connected",
  "velocityHorizontal": 0.0,
  "velocityVertical": 0.0
}`;

export default function Drone() {
  // 드론은 메시지를 보내기만 한다.

  const [droneName, setDroneName] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [helloMsg, setHelloMsg] = useState(null);

  useEffect(() => {
    setDroneName(nanoid(3));
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loading />;
  }

  const connectServer = async () => {
    const newSocket = await io(`${backUrl}/drone-${droneName}`, {
      transports: ['websocket'],
    });
    setSocket(newSocket);
    newSocket?.on('hello', data => {
      setHelloMsg(data);
    });
  };

  return (
    <Box sx={{ p: '20px' }}>
      <Typography variant="h4">드론 소켓 테스트</Typography>
      <Typography variant="h6">
        접속 Url: {`${backUrl}/drone-${droneName}`}
      </Typography>
      <Typography sx={{ mt: '20px' }}>드론 이름 : {droneName}</Typography>

      <Button
        variant="contained"
        onClick={() => {
          connectServer();
        }}
        disabled={socket}
      >
        서버 접속
      </Button>
      {/* <p>Received message: {receivedMessage}</p> */}
      {helloMsg && <Box>{helloMsg}</Box>}
      {helloMsg && (
        <Box sx={{ mt: '50px' }}>
          <Typography>미션 정보 보내기</Typography>
          {missionInfo}
          <Box>
            <Button
              variant="contained"
              onClick={() => {
                socket.emit('mission', missionInfo);
              }}
            >
              보내기
            </Button>
          </Box>
          <Box sx={{ mt: '50px' }}>
            <Typography>드론 실시간 데이터 보내기</Typography>
            {missionInfo}
            <Box>
              <Button
                variant="contained"
                onClick={() => {
                  socket.emit('message', path);
                }}
              >
                보내기
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
