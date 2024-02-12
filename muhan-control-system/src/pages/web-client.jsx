/* eslint-disable react/no-array-index-key */
/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import useClientSocket from '../hooks/useClientSocket';

export default function Home() {
  const [wellcom, setWellcom] = useState('');
  const [receivedMessage, setReceivedMessage] = useState([]);
  const [receivedMission, setReceivedMission] = useState([]);
  const [nowStatus, setNowStatus] = useState([]); // 현재 드론들의 접속 상태

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socket, disconnect] = useClientSocket();

  useEffect(() => {
    // 초기 접속 에코
    socket?.on('hello', data => {
      setWellcom(data);
    });

    socket?.on('dronsConnetStatus', data => {
      console.log(data);
      setNowStatus(data);
    });

    // 메시지
    socket?.on('message', data => {
      console.log(data); // json 으로 볼경우
      setReceivedMessage(prev => [...prev, data]);
    });

    // 미션 정보
    socket?.on('mission', data => {
      console.log(data);
      setReceivedMission(prev => [...prev, data]);
    });

    return () => {
      socket?.off('message');
    };
  }, [socket]);

  return (
    <Box sx={{ padding: '30px' }}>
      <Box>관제탑 통신 테스트 페이지 입니다.</Box>
      <Box>{wellcom}</Box>
      <Box sx={{ mt: '10px' }}>초기 드론의 접속 상태 입니다.</Box>
      {nowStatus.map(data => {
        return (
          <Box sx={{ mt: '5px' }} key={data.droneName}>
            <Box>드론 이름: {data.droneName}</Box>
            <Box>미션: {data.mission}</Box>
          </Box>
        );
      })}
      <Box sx={{ mt: '20px' }}>드론 미션</Box>
      {receivedMission.map((data, indx) => (
        <Box sx={{ mt: '20px' }} key={indx}>
          <Box>드론 이름: {data.droneName}</Box>
          <Box>데이터: {data.data}</Box>
        </Box>
      ))}
      <Box sx={{ mt: '50px' }}>드론 실시간 메시지</Box>
      {receivedMessage.map((data, index) => (
        <Box sx={{ mt: '20px' }} key={index}>
          <Box>드론 이름: {data.droneName}</Box>
          <Box>데이터: {data.data}</Box>
        </Box>
      ))}
    </Box>
  );
}
