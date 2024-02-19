import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import * as CStyle from './index.style';
import DroneCardClose from '@/assets/img/DroneCardClose.svg';

const CameraCard = ({ onClickCameraClose, drone, number = 0, children }) => {
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
    <CStyle.CardWrapper ref={cardRef} number={number} backcolor={drone.color}>
      <CStyle.CardHeader>
        <CStyle.CardTitle>{drone.name}</CStyle.CardTitle>
        <img
          src={DroneCardClose.src}
          width={10}
          height={10}
          alt="닫기"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            onClickCameraClose(drone);
          }}
        />
      </CStyle.CardHeader>
      <CStyle.CameraVideoBox> {children} </CStyle.CameraVideoBox>
    </CStyle.CardWrapper>
  );
};

CameraCard.propTypes = {
  drone: PropTypes.object.isRequired,
  number: PropTypes.number,
  children: PropTypes.node.isRequired,
  onClickCameraClose: PropTypes.func,
};

export default CameraCard;
