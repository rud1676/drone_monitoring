export const { MAP_API_KEY } = process.env;

export const backUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

export const WEATHER_API_SERVICE_KEY = process.env.WEATHER_API;

export const cDroneColorKeys = [
  '#E9485F',
  '#E4547F',
  '#E261A7',
  '#BF4FAD',
  '#A24FBF',
  '#845BC8',
  '#736BD7',
  '#6B83D7',
  '#6B9DD7',
  '#66ABD1',
  '#5FC1C1',
  '#63BEA9',
  '#71C793',
  '#8DD486',
  '#A3CD6E',
  '#CCC868',
  '#E1C560',
  '#E1A864',
  '#EF8D6E',
  '#E87C75',
];
const cDroneStyles = new Map([
  ['red', { basic: [0xff, 0, 0, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['green', { basic: [0, 0x80, 0, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['blue', { basic: [0, 0, 0xff, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['purple', { basic: [0x80, 0, 0x80, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['lime', { basic: [0, 0xff, 0, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['yellow', { basic: [0xff, 0xff, 0, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['aqua', { basic: [0, 0xff, 0xff, 1], text: [0xff, 0xff, 0xff, 1] }],

  ['#E9485F', { basic: [233, 72, 95, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#E4547F', { basic: [228, 84, 127, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#E261A7', { basic: [226, 97, 167, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#BF4FAD', { basic: [191, 79, 173, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#A24FBF', { basic: [162, 79, 191, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#845BC8', { basic: [132, 91, 200, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#736BD7', { basic: [115, 107, 215, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#6b83d7', { basic: [107, 131, 215, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#6B9DD7', { basic: [107, 157, 215, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#66ABD1', { basic: [102, 171, 209, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#5FC1C1', { basic: [95, 193, 193, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#63BEA9', { basic: [99, 190, 169, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#71C793', { basic: [113, 199, 147, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#8DD486', { basic: [141, 212, 134, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#A3CD6E', { basic: [163, 205, 110, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#CCC868', { basic: [204, 200, 104, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#E1C560', { basic: [225, 197, 96, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#E1A864', { basic: [225, 168, 100, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#EF8D6E', { basic: [239, 141, 110, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['#E87C75', { basic: [232, 124, 117, 1], text: [0xff, 0xff, 0xff, 1] }],
]);

export const getDroneStyle = (key: string) => {
  return cDroneStyles.get(key) || cDroneStyles.get('red');
};
export const cDefaultCenter = {
  lon: 127.189972804,
  lat: 37.723058796,
};
