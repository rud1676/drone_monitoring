import dfsXyConv from '../../components/common/weatherUtil';
import { WEATHER_API_SERVICE_KEY } from '../../define';

function getBaseDatetime() {
  // 1. 현재 시간(Locale)
  const curr = new Date();
  // 2. UTC 시간 계산
  const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
  // 3. UTC to KST (UTC + 9시간)
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const krCurr = new Date(utc + KR_TIME_DIFF);

  const year = krCurr.getFullYear();
  const month = 1 + krCurr.getMonth();
  const strMonth = month >= 10 ? `${month}` : `0${month}`;
  const day = krCurr.getDate();
  const strDay = day >= 10 ? `${day}` : `0${day}`;

  const hours = krCurr.getHours();
  const reqHour = Math.floor(hours / 6) * 6;
  const strHour = reqHour >= 10 ? `${reqHour}00` : `0${reqHour}00`;
  //   const strHour = hours >= 10 ? `${hours}00` : `0${hours}00`;
  return { baseDate: `${year}${strMonth}${strDay}`, baseTime: strHour };
}

export default async (req, res) => {
  const { lat: strLat, lng: strLng } = req.query;
  const lat = parseFloat(strLat);
  const lng = parseFloat(strLng);
  const { x, y } = dfsXyConv('toXY', lat, lng);
  const { baseDate, baseTime } = getBaseDatetime();
  const query = new URLSearchParams({
    serviceKey: WEATHER_API_SERVICE_KEY,
    pageNo: '1',
    numOfRows: '1000',
    dataType: 'JSON',
    base_date: baseDate,
    base_time: baseTime,
    nx: x,
    ny: y,
  }).toString();

  const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?${query}`;
  const response = await fetch(url);
  const data = await response.json();
  res.statusCode = 200;
  res.json({ data });
};
