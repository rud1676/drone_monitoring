import React, { useState, useEffect } from 'react';

import useClientSocket from '@/hooks/useClientSocket';
import useData from '@/hooks/useData';
import {
  SocketDroneType,
  DroneType,
  CameraType,
  WeatherType,
} from '@/type/type';
import {
  onClickClose,
  CreateNewDroneData,
  CheckNewDrone,
  ChangeDroneData,
  AddDroneData,
  AddDroneWeatherData,
  AddDroneArray,
} from '@/utils/func';

import CameraCard from '@/components/modules/CameraCard';
import DroneList from '@/components/modules/DroneList';
import DroneCard from '@/components/modules/drone/DroneCard';
import WeatherBox from '@/components/modules/weather';
import Header from '@/components/modules/header';
import VwMap from '@/components/lib/VwMap';

const Home = () => {
  const [drones, setDrones] = useState<Array<DroneType>>([]);
  const [openDrone, setOpenDrone] = useState<Array<DroneType>>([]);
  const [cameras, setCameras] = useState<Array<CameraType>>([]);
  const [weatherinfo, setWeatherinfo] = useState<
    Array<WeatherType> | undefined
  >(undefined);
  const [showdrone, setShowdrone] = useState(false);

  const [dataLength] = useData(drones);

  const [socket, _disconnect] = useClientSocket();

  const [viewCenterCoordinate, setViewCenterCoordinate] = useState<{
    lon: number;
    lat: number;
  }>({ lon: 0, lat: 0 });

  // 드론 통신 끊켰을 때 불러오는 함수
  const OnDisconnectDrone = (drone: DroneType) => {
    onClickClose(drone, setOpenDrone);
    onClickClose(drone, setCameras);
    onClickClose(drone, setDrones);
  };

  const onDroneConnect = (data: SocketDroneType) => {
    //소켓 데이터를 드론 데이터로 생성
    const newDroneData = CreateNewDroneData(data);

    //드론 찾아보기
    const droneidx = CheckNewDrone(drones, newDroneData); //idx == -1 not found

    //이미 있는 드론이라면 정보만 변경
    if (droneidx !== -1) {
      ChangeDroneData(droneidx, newDroneData, setDrones, OnDisconnectDrone);
      return;
    }
    AddDroneData(newDroneData, drones.length, OnDisconnectDrone);
    AddDroneWeatherData(newDroneData);
    AddDroneArray(newDroneData, setDrones);
  };
  useEffect(() => {
    // 소켓 부분
    if (socket)
      socket.on('message', (data: SocketDroneType) => {
        console.log(drones);
        onDroneConnect(data);
      });

    return () => {
      if (socket) socket.off('message');
    };
  }, [socket, drones]);
  return (
    <div>
      <Header
        drones={drones}
        onClickHandle={() => setShowdrone(prev => !prev)}
      />
      {weatherinfo && (
        <WeatherBox setWeatherinfo={setWeatherinfo} weather={weatherinfo} />
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
              setDrones={setOpenDrone}
              setWeatherinfo={setWeatherinfo}
              order={i}
              key={v.name}
              drone={v}
            />
          );
        })}
      <VwMap
        drones={drones}
        sx={{ height: 'calc(100vh - 90px)' }}
        viewCenter={viewCenterCoordinate}
      />
    </div>
  );
};

export default Home;
