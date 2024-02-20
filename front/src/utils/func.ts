import { Dispatch, SetStateAction } from 'react';
import { DroneType, CameraType, WeatherType } from '@/type/type';

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

// 드론 카메라 버튼 누를때
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

export const fetchWeather = async (
  lat: number,
  lng: number,
): Promise<Array<WeatherType> | undefined> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/weather?lat=${lat}&lng=${lng}`,
  );
  const data = await response.json();
  return data.data.response.body.items.item;
};
