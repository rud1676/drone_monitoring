import { DroneType } from '@/type/type';
import { useState, useRef, useEffect } from 'react';

const useData = (drones: Array<DroneType>) => {
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);

  const dronesRef = useRef(drones);
  // drones 상태가 변경될 때마다 dronesRef 업데이트
  useEffect(() => {
    dronesRef.current = drones;
  }, [drones]);

  useEffect(() => {
    // 데이터 전송량 최초 계산
    const calculateDataLength = () => {
      let sumDataLength = 0;
      dronesRef.current.forEach(v => {
        sumDataLength += v.dataLength;
      });
      setCurrent(sumDataLength);
    };

    calculateDataLength();

    // 10초마다 데이터 전송량 재계산
    const intervalId = setInterval(calculateDataLength, 1000);
    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      clearInterval(intervalId);
    };
  }, []); // 의존성 배열에 drones 추가

  return [current];
};

export default useData;
