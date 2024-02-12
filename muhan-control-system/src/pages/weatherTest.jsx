import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

export default function WeatherTest() {
  const [weatherItems, setWeatherItems] = useState([]);
  useEffect(() => {
    const load = async () => {
      const response = await fetch(
        '/api/weather?lat=37.5613701195967&lng=127.68654835646093',
      );
      try {
        const data = await response.json();

        // PTY - 강수형태 - 코드값
        // (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
        // (단기) 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)
        // ex)"obsrValue": "1"

        // REH - 습도 - %
        // ex)"obsrValue": "94"

        // RN1 - 1시간 강수량 - mm
        // ex) "obsrValue": "1"

        // T1H - 기온 - ℃
        // ex) "obsrValue": "23.9"

        // UUU - 동서바람성분 - m/s
        // ex) "obsrValue": "0"

        // VEC - 풍향 - deg
        // ex) "obsrValue": "180"

        // VVV - 남북바람성분 - m/s
        // ex) "obsrValue": "0.1"

        // WSD - 풍속 - m/s
        // ex) "obsrValue": "0.1"
        setWeatherItems(data.data.response.body.items.item);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('weather api', error);
      }
    };
    load();
  }, []);
  return (
    <Box>
      <Box>WeatherTest{`(${weatherItems.length})`}</Box>
      <Box>
        {weatherItems.map(item => {
          let title = '';
          let value = '';
          if (item.category === 'PTY') {
            title = `강수형태 (PTY,코드값)`;
            if (item.obsrValue === '0') {
              value = '없음';
            } else if (item.obsrValue === '1') {
              value = '비';
            } else if (item.obsrValue === '2') {
              value = '비/눈';
            } else if (item.obsrValue === '3') {
              value = '눈';
            } else if (item.obsrValue === '4') {
              value = '소나기';
            } else if (item.obsrValue === '5') {
              value = '빗방울';
            } else if (item.obsrValue === '6') {
              value = '빗방울눈날림';
            } else if (item.obsrValue === '7') {
              value = '눈날림';
            }
          } else if (item.category === 'REH') {
            title = `습도 (REH,%)`;
            value = `${item.obsrValue} %`;
          } else if (item.category === 'RN1') {
            title = `1시간 강수량 (RN1,mm)`;
            value = `${item.obsrValue} mm`;
          } else if (item.category === 'T1H') {
            title = `기온 (T1H,℃)`;
            value = `${item.obsrValue} ℃`;
          } else if (item.category === 'UUU') {
            title = `동서바람성분 (UUU,m/s)`;
            value = `${item.obsrValue} m/s`;
          } else if (item.category === 'VEC') {
            title = `풍향 (VEC,deg)`;
            value = `${item.obsrValue} deg`;
          } else if (item.category === 'VVV') {
            title = `남북바람성분(VVV,m/s)`;
            value = `${item.obsrValue} m/s`;
          } else if (item.category === 'WSD') {
            title = `1시간 풍속 (WSD,m/s)`;
            value = `${item.obsrValue} m/s`;
          }
          return (
            <Box
              key={`weather-info-${item.category}`}
            >{`${title} : ${value}`}</Box>
          );
        })}
      </Box>
    </Box>
  );
}
