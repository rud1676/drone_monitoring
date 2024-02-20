import { Dispatch, SetStateAction } from 'react';
import { DroneType, CameraType } from './type';
// 드론 영상 닫기시 카메라 배열에 드론을 지운다.
export const onClickClose = (v, setState) => {
  setState(prev => {
    const temp = prev.filter(drone => drone.name !== v.name);
    return [...temp];
  });
};
export const onClickCameraClose = v => {
  setCameras(prev => {
    const temp = prev.filter(drone => drone.name !== v.name);
    return [...temp];
  });
};
// 드론 상태창 닫기를 누르면 열려있는드론 목록에서 지워준다.
export const onClickDroneClose = v => {
  setOpenDrone(prev => {
    const temp = prev.filter(drone => drone.name !== v.name);
    return [...temp];
  });
};

// 드론 통신 끊켰을 때 불러오는 함수
export const createTimerFunction = insertData => {
  setDrones(previous => {
    const temp = previous.filter(e => e.name !== insertData.name);
    return [...temp];
  });
  onClickDroneClose(insertData);
  onClickCameraClose(insertData);
};

// 드론 영상 클릭시 카메라 배열에 드론을 담아준다.
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

// 드론 날씨 버튼 눌럿을시 weather를 설정해준다.
export const onClickDroneWeather = drone => {
  setWeatherinfo(drone.weather);
};

// 날씨 닫기 버튼 눌럿을 시 weather를 undefined로 설정해줌.
export const onClickWeatherClose = () => {
  setWeatherinfo(undefined);
};
