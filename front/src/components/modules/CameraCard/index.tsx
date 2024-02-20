import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';
import CameraOpenVidu from './CameraOpenVidu';

import * as CStyle from './index.style';
import DroneCardClose from '@/assets/img/DroneCardClose.svg';

import { CameraType } from '@/type/type';
import { onClickClose } from '@/utils/func';

interface CameraCardType {
  setCameras: Dispatch<SetStateAction<Array<CameraType>>>;
  oneCamera: CameraType;
  number: number;
}

const CameraCard = ({ setCameras, oneCamera, number = 0 }: CameraCardType) => {
  const [isPress, setIsPress] = useState(false);
  const [prevX, setPrevX] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const splitarr = oneCamera.videoSrc.split('/');
  const sessionId = useRef<string>(splitarr[splitarr.length - 1]);

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
    <CStyle.CardWrapper
      ref={cardRef}
      number={number}
      backcolor={oneCamera.color}
    >
      <CStyle.CardHeader>
        <CStyle.CardTitle>{oneCamera.name}</CStyle.CardTitle>
        <img
          src={DroneCardClose}
          width={10}
          height={10}
          alt="닫기"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            onClickClose(oneCamera, setCameras);
          }}
        />
      </CStyle.CardHeader>
      <CStyle.CameraVideoBox>
        <CameraOpenVidu mySessionId={sessionId} />
      </CStyle.CameraVideoBox>
    </CStyle.CardWrapper>
  );
};

export default React.memo(CameraCard);
