import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import {
  CardWrapper,
  CardHeader,
  CardTitle,
  CardContent,
  CardButtonBox,
  CardHeaderLeft,
  InfoBox,
  InfoTitle,
  InfoContent,
  ButtonBox,
  CardButton,
} from '../../../assets/style/DroneStyle';
import Battery from './Battery';
import DroneCardClose from '../../../assets/img/DroneCardClose.svg';

export default function DroneCard({
  drone,
  order = 0,
  onClickDroneClose,
  onClickDroneCamera,
  onClickDroneWeather,
}) {
  const [isPress, setIsPress] = useState(false);
  const [prevX, setPrevX] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const cardRef = useRef();

  useEffect(() => {
    const target = cardRef.current;

    const mouseDown = e => {
      if (e.clientY - target.offsetTop >= 63) return;
      setPrevX(e.clientX);
      setPrevY(e.clientY);
      setIsPress(true);
    };

    const move = e => {
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
    <CardWrapper num={order} backcolor={drone.color} ref={cardRef}>
      <CardHeader>
        <CardTitle>{`${
          drone.name.length >= 10 ? `${drone.name.slice(0, 10)}...` : drone.name
        } (${drone.data.mode})`}</CardTitle>
        <CardHeaderLeft>
          <Battery value={drone.data.batteryRemainPercent} />
          <CardButtonBox
            onClick={() => {
              onClickDroneClose(drone);
            }}
          >
            <img src={DroneCardClose.src} width={10} height={10} alt="닫기" />
          </CardButtonBox>
        </CardHeaderLeft>
      </CardHeader>
      <CardContent>
        <InfoBox>
          <InfoTitle>⦁ 위치</InfoTitle>
          <InfoContent>{`위도 : ${drone.data.droneLatitude}`}</InfoContent>
          <InfoContent>{`경도 : ${drone.data.droneLongitude}`}</InfoContent>
          <InfoContent sx={{ marginBottom: '15px' }}>
            {`고도 : ${drone.data.droneAltitude}`}
          </InfoContent>
        </InfoBox>
        <InfoBox>
          <InfoTitle>⦁ 자세값</InfoTitle>
          <InfoContent>{`롤 : ${drone.data.droneRoll}`}</InfoContent>
          <InfoContent>{`피치 : ${drone.data.dronePitch}`}</InfoContent>
          <InfoContent sx={{ marginBottom: '15px' }}>
            {`요우 : ${drone.data.droneYaw}`}
          </InfoContent>
        </InfoBox>
        <InfoBox>
          <InfoTitle>⦁ 비행 속도</InfoTitle>
          <InfoContent>{`수평 속도 : ${drone.data.velocityHorizontal}`}</InfoContent>
          <InfoContent sx={{ marginBottom: '15px' }}>
            {`수직 속도 : ${drone.data.velocityVertical}`}
          </InfoContent>
          <InfoContent sx={{ marginBottom: '15px' }}>
            {`데이터전송 : ${drone.dataLength}건/초`}
          </InfoContent>
        </InfoBox>
        <ButtonBox>
          <CardButton
            onClick={() => {
              onClickDroneWeather(drone);
            }}
          >
            기상정보
          </CardButton>
          <CardButton
            onClick={() => {
              onClickDroneCamera(drone);
            }}
          >
            드론영상
          </CardButton>
        </ButtonBox>
      </CardContent>
    </CardWrapper>
  );
}

DroneCard.propTypes = {
  drone: PropTypes.object,
  order: PropTypes.number,
  onClickDroneClose: PropTypes.func,
  onClickDroneCamera: PropTypes.func,
  onClickDroneWeather: PropTypes.func,
};
