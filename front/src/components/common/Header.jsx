import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import Logo from '../../assets/img/Logo.svg';
import DroneLogo from '../../assets/img/DroneLogo.svg';

const HeaderBox = styled(Box)`
  background: #1f2243;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  width: 100%;
  height: 90px;
  flex-shrink: 0;
  position: fixed;
  top: 0px;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  padding: 29px 40px;
  align-items: center;
`;

const HeaderText = styled(Typography)`
  color: #999dbf;
  font-family: Noto Sans KR;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.6px;
  margin-left: 16px;
`;

const LogoWrapper = styled(Box)`
  display: flex;
  align-items: center;
`;

const DroneStatusButton = styled(Button)`
  border-radius: 25px;
  background: #575b83;
  width: 190px;
  height: 50px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #575b83;
  }
`;

const ButtonText = styled(Typography)`
  color: #fff;

  font-family: Noto Sans KR;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-left: 13px;
`;

const RightBox = styled(Box)`
  display: flex;
  align-items: center;
`;
const StateBox = styled(Box)`
  width: 56px;
  height: 56px;
  text-align: center;
  line-height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(184, 198, 228, 1);
  border-radius: 50%;
  font-family: Noto Sans KR;
  margin-right: 20px;
`;

const InfoBox = styled(Box)`
  color: #fff;
  margin-right: 50px;
`;
const InfoText = styled(Typography)`
  margin: 0;
  font-family: Noto Sans KR;
`;

// 전역변수로 선언해 이벤트 등록시점이랑 상관없이 dronesSum값 불러옴
const dronesSum = [];

export default function Headers({ drones, onClickHandle }) {
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
  }, []); // 의존성 배열에 drones 추가

  return (
    <HeaderBox>
      <LogoWrapper>
        <img src={Logo.src} width={40} height={33} alt="로고" />
        <HeaderText>드론 실시간 통합 관제 플랫폼</HeaderText>
      </LogoWrapper>
      <RightBox>
        <StateBox>
          인증
          <br />
          진행중
        </StateBox>
        <InfoBox>
          <InfoText>접속: {dronesSum.length}</InfoText>
          <InfoText>인증: {totalData}MB</InfoText>
        </InfoBox>
        <DroneStatusButton onClick={onClickHandle}>
          <img src={DroneLogo.src} width={29} height={18} alt="드론로고" />
          <ButtonText>드론 접속 목록</ButtonText>
        </DroneStatusButton>
      </RightBox>
    </HeaderBox>
  );
}

Headers.propTypes = {
  drones: PropTypes.array,
  onClickHandle: PropTypes.func,
};
