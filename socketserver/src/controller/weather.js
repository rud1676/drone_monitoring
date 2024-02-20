// LCC DFS 좌표변환을 위한 기초 자료
const RE = 6371.00877; // 지구 반경(km)
const GRID = 5.0; // 격자 간격(km)
const SLAT1 = 30.0; // 투영 위도1(degree)
const SLAT2 = 60.0; // 투영 위도2(degree)
const OLON = 126.0; // 기준점 경도(degree)
const OLAT = 38.0; // 기준점 위도(degree)
const XO = 43; // 기준점 X좌표(GRID)
const YO = 136; // 기1준점 Y좌표(GRID)
// LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )

// export default function dfs_xy_conv(code, v1, v2) {
function dfsXyConv(code, v1, v2) {
  const DEGRAD = Math.PI / 180.0;
  const RADDEG = 180.0 / Math.PI;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  // sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  sf = (sf ** sn * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  // ro = (re * sf) / Math.pow(ro, sn);
  ro = (re * sf) / ro ** sn;
  const rs = {};
  // if (code == 'toXY') {
  if (code === 'toXY') {
    // rs['lat'] = v1;
    // rs['lng'] = v2;
    rs.lat = v1;
    rs.lng = v2;
    let ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
    // ra = (re * sf) / Math.pow(ra, sn);
    ra = (re * sf) / ra ** sn;
    let theta = v2 * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    // rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    // rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    rs.x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs.y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  } else {
    // rs['x'] = v1;
    // rs['y'] = v2;
    rs.x = v1;
    rs.y = v2;
    const xn = v1 - XO;
    const yn = ro - v2 + YO;
    let ra = Math.sqrt(xn * xn + yn * yn);
    if (sn < 0.0) ra = -ra;
    // const alat = Math.pow((re * sf) / ra, 1.0 / sn);
    let alat = ((re * sf) / ra) ** (1.0 / sn);
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;
    let theta;
    if (Math.abs(xn) <= 0.0) {
      theta = 0.0;
    } else {
      if (Math.abs(yn) <= 0.0) {
        theta = Math.PI * 0.5;
        if (xn < 0.0) {
          theta = -theta;
        }
      } else theta = Math.atan2(xn, yn);
    }
    const alon = theta / sn + olon;
    rs.lat = alat * RADDEG;
    rs.lng = alon * RADDEG;
  }
  return rs;
}

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
    serviceKey: process.env.WEATHER_API,
    pageNo: '1',
    numOfRows: '1000',
    dataType: 'JSON',
    base_date: baseDate,
    base_time: baseTime,
    nx: x,
    ny: y
  }).toString();

  const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?${query}`;
  const response = await fetch(url);
  const data = await response.json();
  res.statusCode = 200;
  res.json({ data });
};
