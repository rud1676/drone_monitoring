import React, { useState, useEffect } from 'react';

import useClientSocket from '@/hooks/useClientSocket';
import useWeather from '@/hooks/useWeather';
import useData from '@/hooks/useData';
import { SocketDroneType, DroneType, CameraType } from '@/type/type';
import { onClickClose } from '@/utils/func';

import CameraCard from '@/components/modules/CameraCard';
import DroneList from '@/components/modules/DroneList';
import DroneCard from '@/components/modules/drone/DroneCard';
import WeatherBox from '@/components/modules/weather';
import Header from '@/components/modules/header';
import { cDroneColorKeys } from '@/utils/define';
import MuhanVwMap from '@/components/lib/MuhanVWMap';

// 드론 데이터 랜더링하기 위한 state배열 생성
const ParseDataToRender = str => {
  const parsData = JSON.parse(str);
  const state = [
    { title: '고도', content: parsData.droneAltitude.toString() },
    { title: '위도', content: parsData.droneLatitude.toFixed(3).toString() },
    { title: '경도', content: parsData.droneLongitude.toFixed(3).toString() },
    { title: '피치', content: parsData.dronePitch.toString() },
    { title: '롤', content: parsData.droneRoll.toString() },
    { title: '요', content: parsData.droneYaw.toString() },
    { title: '모드', content: parsData.mode },
    { title: '상태', content: parsData.status },
    { title: '수평속도', content: parsData.velocityHorizontal.toString() },
    { title: '수직속도', content: parsData.velocityVertical.toString() },
  ];
  return state;
};

const Home = () => {
  const [drones, setDrones] = useState<Array<DroneType>>([]);
  const [openDrone, setOpenDrone] = useState<Array<DroneType>>([]);
  const [cameras, setCameras] = useState<Array<CameraType>>([]);
  const [weatherinfo, setWeatherinfo] = useState(undefined);
  const [showdrone, setShowdrone] = useState(false);

  const [dataLength] = useData(drones);

  const [socket, _disconnect] = useClientSocket();

  const [viewCenterCoordinate, setViewCenterCoordinate] = useState<{
    lon: number;
    lat: number;
  }>();

  // 드론 통신 끊켰을 때 불러오는 함수
  const createTimerFunction = (insertData: DroneType) => {
    setDrones(previous => {
      const temp = previous.filter(e => e.name !== insertData.name);
      return [...temp];
    });
    onClickClose(insertData, setOpenDrone);
    onClickClose(insertData, setCameras);
  };

  // 드론 날씨 버튼 눌럿을시 weather를 설정해준다.
  const onClickDroneWeather = drone => {
    setWeatherinfo(drone.weather);
  };

  // 날씨 닫기 버튼 눌럿을 시 weather를 undefined로 설정해줌.
  const onClickWeatherClose = () => {
    setWeatherinfo(undefined);
  };
  useEffect(() => {
    // 소켓 부분
    socket?.on('message', (data: SocketDroneType) => {
      setDrones(prev => {
        const parseState = ParseDataToRender(data.data);
        const parseData = JSON.parse(data.data);
        const parseMissionData = JSON.parse(data?.mission);

        const missionData = parseMissionData
          ? parseMissionData.map(e => ({
              lon: e[1],
              lat: e[0],
            }))
          : null;
        const randData = Math.ceil(
          data.data.length * ((90 + Math.ceil(Math.random() * 30)) / 100),
        );

        const insertData = {
          name: data.droneName,
          state: parseState,
          data: parseData,
          mission: missionData,
          dataLength: randData >= 200 ? randData : 200, // 각 드론이 소켓에서 얻는 문자열 수를 데이터 전송값으로 저장
          color: '',
          videoSrc: '',
          clearFunctionId: 0,
        };

        let isDroneHere = false;
        for (let i = 0; i < prev.length; i += 1) {
          // 기존에 통신된 드론이라면...내용 업데이트
          if (prev[i].name === insertData.name) {
            prev[i].state = insertData.state;
            prev[i].data = insertData.data;
            prev[i].mission = insertData.mission;
            prev[i].dataLength = insertData.dataLength;

            // 타이머 제거
            clearTimeout(prev[i].clearFunctionId);

            // 10 초 지나면 통신 끊긴걸로 간주하고 드론 삭제
            prev[i].clearFunctionId = setTimeout(
              createTimerFunction,
              10000,
              insertData,
            );
            isDroneHere = true;
            break;
          }
        }
        if (!isDroneHere) {
          // 최초 생성시 랜더링 컬러정보 입력
          insertData.color =
            cDroneColorKeys[prev.length % cDroneColorKeys.length];
          // 최초 생성시 비디오 주소 입력(테스트데이터);
          const src = insertData.name.replace('drone-', '');
          insertData.videoSrc = `https://demos.openvidu.io/openvidu-call/#/${src}`;

          // 최초 생성시 10초뒤에  drone정보를 그동안 받지 못하면 drone을 없애주는 함수 등록- 해당 배열에 저장
          insertData.clearFunctionId = setTimeout(
            createTimerFunction,
            10000,
            insertData,
          );

          // 최초 생성시 날씨 데이터 불러옴
          const weatherData = useWeather(
            insertData.data.droneLatitude,
            insertData.data.droneLongitude,
          );
          weatherData.then(e => {
            insertData.weather = e;
          });
          return [...prev, insertData];
        }
        // 이미 생성된 데이터

        return [...prev];
      });
    });
    return () => {
      socket?.off('message');
    };
  }, [socket, drones]);
  return (
    <div>
      <Header
        drones={drones}
        onClickHandle={() => setShowdrone(prev => !prev)}
      />
      {weatherinfo && (
        <WeatherBox
          onClickWeatherClose={onClickWeatherClose}
          weather={weatherinfo}
        />
      )}
      {cameras.length !== 0 &&
        cameras.map((v, i) => (
          <CameraCard
            key={v.name}
            setCameras={setCameras}
            oneCamera={v}
            number={i}
          />
        ))}
      {showdrone && ( // 드론 접속 목록창 띄우기
        <DroneList
          setOpenDrone={setOpenDrone}
          onClickClose={() => setShowdrone(false)}
          drones={drones}
          dataLength={dataLength}
          setViewCenterCoordinate={setViewCenterCoordinate}
        />
      )}
      {openDrone.length !== 0 &&
        openDrone.map((v, i) => {
          return (
            <DroneCard // 드론 상태창 띄우기
              setCameras={setCameras}
              setDrones={setDrones}
              onClickDroneWeather={onClickDroneWeather}
              order={i}
              key={v.name}
              drone={v}
            />
          );
        })}
      <MuhanVwMap
        drones={drones}
        sx={{ height: '100vh' }}
        viewCenter={viewCenterCoordinate}
      />
    </div>
  );
};
export default Home;
