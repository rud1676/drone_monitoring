import React, { Dispatch, SetStateAction } from 'react';
import styled from '@emotion/styled';
import { Typography, Box } from '@mui/material';
import CloseButton from '@/assets/img/CloseButton.svg';
import { WeatherType } from '@/type/type';

interface WeatherBoxType {
  setWeatherinfo: Dispatch<SetStateAction<Array<WeatherType> | undefined>>;
  weather: Array<WeatherType>;
}

const Title = styled(Typography)`
  color: #1f2243;
  font-family: Noto Sans KR;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;
const ContentText = styled(Typography)`
  color: #1f1f1f;
  font-family: Noto Sans KR;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
`;

const WeatherWrapper = styled.div`
  position: absolute;
  top: 150px;
  left: 50px;
  border-radius: 6px;
  border: 1px solid #707070;
  background: #fff;
  box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.2);
  width: 220px;
  height: 215px;
  z-index: 99999;
`;
const TitleBox = styled(Box)`
  padding: 16px 17px 19px 30px;
  height: 61px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
`;
const ContentBox = styled(Box)`
  padding: 18px 30px 24px 30px;
  height: 61px;
  width: 100%;
`;

const WeatherBox = ({ setWeatherinfo, weather }: WeatherBoxType) => {
  console.log(weather);
  console.log("PR")
  const temperature = weather[3].obsrValue;
  const humidity = weather[1].obsrValue;
  const windSpeed = weather[7].obsrValue;
  return (
    <WeatherWrapper>
      <TitleBox>
        <Title>기상정보</Title>
        <img
          onClick={() => {
            setWeatherinfo(undefined);
          }}
          src={CloseButton}
          width={10}
          height={10}
          style={{ cursor: 'pointer' }}
          alt="닫기버튼"
        />
      </TitleBox>
      <ContentBox>
        <ContentText>{`온도 : ${temperature}C`} </ContentText>
        <ContentText>{`습도 : ${humidity}%`} </ContentText>
        <ContentText>{`풍속 : ${windSpeed}m/s`} </ContentText>
        {/* <ContentText>KP 지수 : ????? </ContentText> */}
      </ContentBox>
    </WeatherWrapper>
  );
};

export default WeatherBox;
