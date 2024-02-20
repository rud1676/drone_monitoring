export default async (req, res) => {
  // 비행금지구역
  //   const geomFilter =
  //     'BOX(14135923.110455,4518476.7106496,14135942.219712,4518495.8199067)';
  const geomFilter = 'BOX(13835923, 4708476,14835923, 3808476)';
  const query = new URLSearchParams({
    service: 'data',
    version: '2.0',
    request: 'GetFeature',
    key: process.env.MAP_API_KEY,
    domain: 'https://muhan-control-system.vercel.app/',
    data: 'LT_C_AISPRHC',
    geomFilter,
    crs: 'EPSG:900913'
  }).toString();

  const url = `https://api.vworld.kr/req/data?${query}`;
  const response = await fetch(url);
  const data = await response.json();
  res.statusCode = 200;
  res.json({ data });
};
