import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import * as SDCard from './index.style';
import Battery from './Battery';
import DroneCardClose from '@/assets/img/DroneCardClose.svg';
import { CameraType, DroneType, WeatherType } from '@/type/type';
import { onClickClose } from '@/utils/func';

interface DroneCardType {
  drone: DroneType;
  order: number;
  setDrones: Dispatch<SetStateAction<Array<DroneType>>>;
  setCameras: Dispatch<SetStateAction<Array<CameraType>>>;
  setWeatherinfo: Dispatch<SetStateAction<Array<WeatherType> | undefined>>;
}

const DroneCard = ({
  drone,
  setDrones,
  setCameras,
  order = 0,
  setWeatherinfo,
  openDrone,
}: DroneCardType) => {
  const [isPress, setIsPress] = useState(false);
  const [prevX, setPrevX] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = cardRef.current;
    if (!target) return;

    const mouseDown = (e: MouseEvent) => {
      if (e.clientY - target.offsetTop >= 63) return;
      setPrevX(e.clientX);
      setPrevY(e.clientY);
      setIsPress(true);
    };

    const move = (e: MouseEvent) => {
      if (!isPress) return;

      const posX = prevX - e.clientX;
      const posY = prevY - e.clientY;

      setPrevX(e.clientX);
      setPrevY(e.clientY);

      target.style.left = `${target.offsetLeft - posX}px`;
      target.style.top = `${target.offsetTop - posY}px`;
    };

    const mouseup = () => setIsPress(false);

    target.addEventListener('mousedown', mouseDown);
    target.addEventListener('mouseup', mouseup);
    window.addEventListener('mousemove', move);
    return () => {
      target.removeEventListener('mousedown', mouseDown);
      target.removeEventListener('mouseup', mouseup);
      window.removeEventListener('mousemove', move);
    };
  }, [isPress, prevX, prevY]);
  return (
    <SDCard.CardWrapper num={order} backcolor={drone.color} ref={cardRef}>
      <SDCard.CardHeader>
        <SDCard.CardTitle>{`${
          drone.name.length >= 10 ? `${drone.name.slice(0, 10)}...` : drone.name
        } (${drone.data.mode})`}</SDCard.CardTitle>
        <SDCard.CardHeaderLeft>
          <Battery value={drone.data.batteryRemainPercent} />
          <SDCard.CardButtonBox
            onClick={() => {
              onClickClose(drone, setDrones);
            }}
          >
            <img src={DroneCardClose} width={10} height={10} alt="닫기" />
          </SDCard.CardButtonBox>
        </SDCard.CardHeaderLeft>
      </SDCard.CardHeader>
      <SDCard.CardContent>
        <SDCard.InfoBox>
          <SDCard.InfoTitle>⦁ 위치</SDCard.InfoTitle>
          <SDCard.InfoContent>{`위도 : ${drone.data.droneLatitude}`}</SDCard.InfoContent>
          <SDCard.InfoContent>{`경도 : ${drone.data.droneLongitude}`}</SDCard.InfoContent>
          <SDCard.InfoContent sx={{ marginBottom: '15px' }}>
            {`고도 : ${drone.data.droneAltitude}`}
          </SDCard.InfoContent>
        </SDCard.InfoBox>
        <SDCard.InfoBox>
          <SDCard.InfoTitle>⦁ 자세값</SDCard.InfoTitle>
          <SDCard.InfoContent>{`롤 : ${drone.data.droneRoll}`}</SDCard.InfoContent>
          <SDCard.InfoContent>{`피치 : ${drone.data.dronePitch}`}</SDCard.InfoContent>
          <SDCard.InfoContent sx={{ marginBottom: '15px' }}>
            {`요우 : ${drone.data.droneYaw}`}
          </SDCard.InfoContent>
        </SDCard.InfoBox>
        <SDCard.InfoBox>
          <SDCard.InfoTitle>⦁ 비행 속도</SDCard.InfoTitle>
          <SDCard.InfoContent>{`수평 속도 : ${drone.data.velocityHorizontal}`}</SDCard.InfoContent>
          <SDCard.InfoContent sx={{ marginBottom: '15px' }}>
            {`수직 속도 : ${drone.data.velocityVertical}`}
          </SDCard.InfoContent>
          <SDCard.InfoContent sx={{ marginBottom: '15px' }}>
            {`데이터전송 : ${drone.dataLength}건/초`}
          </SDCard.InfoContent>
        </SDCard.InfoBox>
        <SDCard.ButtonBox>
          <SDCard.CardButton
            onClick={() => {
              setWeatherinfo(drone.weather);
            }}
          >
            기상정보
          </SDCard.CardButton>
          <SDCard.CardButton
            onClick={() => {
              setCameras((prev): Array<CameraType> => {
                if (prev.findIndex(v => v.name === drone.name) === -1)
                  return [
                    ...prev,
                    {
                      name: drone.name,
                      videoSrc: drone.videoSrc,
                      color: drone.color,
                    },
                  ];
                return [...prev];
              });
            }}
          >
            드론영상
          </SDCard.CardButton>
        </SDCard.ButtonBox>
      </SDCard.CardContent>
    </SDCard.CardWrapper>
  );
};
export default DroneCard;
