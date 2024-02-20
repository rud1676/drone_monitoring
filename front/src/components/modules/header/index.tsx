import React, { useState, useRef, useEffect } from 'react';
import { GiDeliveryDrone } from 'react-icons/gi';
import * as HStyle from './index.style';
import { DroneType } from '@/type/type';

interface HeadersType {
  drones: Array<DroneType>;
  onClickHandle: () => void;
}

// 전역변수로 선언해 이벤트 등록시점이랑 상관없이 dronesSum값 불러옴
const dronesSum: Array<{ name: string; sumData: number }> = [];

const Headers = ({ drones, onClickHandle }: HeadersType) => {
  const [totalData, setTotalData] = useState(0);

  // 각 드론에 대한 총량을 구하고
  // 드론이 빠질 때 합을 빼면 됨.

  const dronesRef = useRef(drones);
  // drones 상태가 변경될 때마다 dronesRef 업데이트
  useEffect(() => {
    dronesRef.current = drones;
  }, [drones]);

  // 데이터 전송값 계산하기 10초마다!

  useEffect(() => {
    // 데이터 전송량 최초 계산
    const calculateDataLength = () => {
      // 드론 어떤게 빠졋는지 비교하기 위한 배열
      const checkDisConnect = Array(dronesSum.length).fill(false);

      // 통신 되고 있는 드론이랑 비교하기
      dronesRef.current.forEach(v => {
        // 각 드론이랑 합쳐지고 있는 드론이랑 비교중

        // dronesSum이랑 비교합니다! 소켓드론들이랑
        const idx = dronesSum.findIndex(e => e.name === v.name);

        // 만약 드론이 최초생성됬음.
        if (idx === -1) {
          dronesSum.push({ name: v.name, sumData: v.dataLength });
        } else {
          if (dronesSum[idx].sumData <= Number.MAX_SAFE_INTEGER)
            dronesSum[idx].sumData += v.dataLength;
          checkDisConnect[idx] = true;
        }
        console.log(dronesSum);
      });

      // 빠진 드론은 합에서 제외시킨다.
      let totaldata = 0;
      checkDisConnect.forEach((v, i) => {
        if (
          v &&
          totalData <= Number.MAX_SAFE_INTEGER &&
          dronesSum[i]?.sumData
        ) {
          totaldata += Math.ceil((dronesSum[i].sumData * 20) / 1024);
        }
        if (!v) dronesSum.splice(i, 1);
      });
      setTotalData(totaldata);
    };

    calculateDataLength();

    // 10초마다 데이터 전송량 재계산
    const intervalId = setInterval(() => {
      calculateDataLength();
    }, 10000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <HStyle.HeaderLayout>
      <HStyle.LeftContainer>
        <HStyle.HeaderText>드론 모니터링 앱</HStyle.HeaderText>
      </HStyle.LeftContainer>
      <HStyle.RightContainer>
        <HStyle.StateBox>
          인증
          <br />
          진행중
        </HStyle.StateBox>
        <HStyle.InfoBox>
          <HStyle.InfoText>접속: {dronesSum.length}</HStyle.InfoText>
          <HStyle.InfoText>인증: {totalData}MB</HStyle.InfoText>
        </HStyle.InfoBox>
        <HStyle.DroneStatusButton onClick={onClickHandle}>
          <GiDeliveryDrone size="2em" color="white" />
          <HStyle.ButtonText>드론 접속 목록</HStyle.ButtonText>
        </HStyle.DroneStatusButton>
      </HStyle.RightContainer>
    </HStyle.HeaderLayout>
  );
};

export default Headers;
