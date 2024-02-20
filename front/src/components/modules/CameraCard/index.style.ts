import { IconButton, Card, Typography, Box, Stack } from '@mui/material';
import style from '@emotion/styled';

export const CardWrapper = style(Card)<{ number: number; backcolor: string }>`
  position:absolute;
  left:${props => props.number * 50}px;
  bottom:0px;
  width: 360px;
  height: 250px;
  flex-shrink: 0;
  border-radius: 6px;
  border: 1px solid #707070;
  box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.20);
  background-color:${props => props.backcolor};
  z-index:10;
`;
export const CardTitle = style(Typography)`
color: #FFF;
font-family: Noto Sans KR;
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: normal;
`;
export const CardHeader = style(Box)`
cursor:pointer;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:16px 17px 19px 30px;
  border-bottom:1px solid rgba(255, 255, 255, 0.30);
`;
export const CameraVideoBox = style(Box)<{ min?: string }>`
  ${props => (props.min === 'true' ? `display:none;` : `display:flex;`)}
  height:20vh;
`;

export const IconButtonCustom = style(IconButton)`
  width: 25px;
  height: 25px;
`;

export const CameraStack = style(Stack)`
  position:absolute;
  top:65%;
  left:1%;
  z-index:9999;
  background: rgba(255,255,255,0.4);
`;

export const OpenViduHeader = style(Box)`
  display: flex;
`;

export const OpenViduSessionName = style(Typography)`
  font-size: 15px;
  font-weight: bold;
  font-family: sans-serif;
`;

export const NoSignalBox = style(Box)`
  display:flex;
  align-items:center;
  justify-content:center;
  width: 360px;
height: 120px;
color: rgba(255, 255, 255, 0.60);

text-align: center;
font-family: Noto Sans KR;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 28px;
`;
