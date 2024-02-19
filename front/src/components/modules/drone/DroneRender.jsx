import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DroneIcon from './DroneIcon';

import {
  DroneStack,
  DroneRenderTitle,
  DronwConnectWrapper,
  DronConnectHeader,
  OneDroneBox,
  OneDroneTitle,
  TotalDataTransform,
} from './index.style';
import CloseButton from '@/assets/img/CloseButton.svg';

const DroneRender = ({
  onClickClose,
  drones,
  setOpenDrone,
  onClickMoveCenter,
}) => {
  const [dataLength, setDataLength] = useState(0);

  const dronesRef = useRef(drones);
  // drones 상태가 변경될 때마다 dronesRef 업데이트
  useEffect(() => {
    dronesRef.current = drones;
  }, [drones]);

  // 데이터 전송값 계산하기 10초마다!

  useEffect(() => {
    // 데이터 전송량 최초 계산
    const calculateDataLength = () => {
      let sumDataLength = 0;
      dronesRef.current.forEach(v => {
        sumDataLength += v.dataLength;
      });
      setDataLength(sumDataLength);
    };

    calculateDataLength();

    // 10초마다 데이터 전송량 재계산
    const intervalId = setInterval(() => {
      calculateDataLength();
    }, 1000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      clearInterval(intervalId);
    };
  }, []); // 의존성 배열에 drones 추가

  return (
    <DronwConnectWrapper>
      <DronConnectHeader>
        <DroneRenderTitle>드론 접속 목록</DroneRenderTitle>
        <TotalDataTransform>{`데이터전송 ${dataLength} 건/초`}</TotalDataTransform>

        <img
          style={{ cursor: 'pointer' }}
          onClick={onClickClose}
          src={CloseButton}
          width={10}
          height={10}
          alt="닫기"
        />
      </DronConnectHeader>
      <DroneStack>
        {drones.map(v => {
          const onClickOpenDrone = () => {
            setOpenDrone(prev => {
              if (prev.findIndex(drone => drone.name === v.name) === -1)
                return [...prev, v];
              return [...prev];
            });
          };
          const cord = {
            lat: v.data.droneLatitude,
            lon: v.data.droneLongitude,
          };
          return (
            <OneDroneBox
              key={v.name}
              onClick={() => {
                onClickOpenDrone();
                onClickMoveCenter(cord);
              }}
            >
              <DroneIcon color={v.color} />
              <OneDroneTitle tcolor={v.color}>{v.name}</OneDroneTitle>
            </OneDroneBox>
          );
        })}
      </DroneStack>
    </DronwConnectWrapper>
  );
};

DroneRender.propTypes = {
  onClickClose: PropTypes.func,
  drones: PropTypes.array,
  map: PropTypes.object,
  onClickMoveCenter: PropTypes.func,
  setOpenDrone: PropTypes.func,
};
export default DroneRender;
