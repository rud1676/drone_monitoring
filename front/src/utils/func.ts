import { Dispatch, SetStateAction } from 'react';
import { DroneType, CameraType } from '@/type/type';

// 연창을 닫을 때 state에서 지워주는 함수
export const onClickClose = (
  v: CameraType | DroneType,
  setState: Dispatch<SetStateAction<Array<any>>>,
) => {
  setState(prev => {
    const temp = prev.filter(drone => drone.name !== v.name);
    return [...temp];
  });
};

export const onClickDroneCamera = (
  v: DroneType,
  setState: Dispatch<SetStateAction<Array<CameraType>>>,
) => {
  setState((prev): Array<CameraType> => {
    if (prev.findIndex(drone => drone.name === v.name) === -1)
      return [...prev, { name: v.name, videoSrc: v.videoSrc, color: v.color }];
    return [...prev];
  });
};
