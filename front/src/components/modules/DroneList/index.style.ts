import { Stack, Typography, Box, ListItem } from '@mui/material';
import style from '@emotion/styled';

export const ConnectListContainer = style(Stack)`
 background: rgba(255,255,255,0.4);
 max-height:559px;
 width: 500px;
 overflow:scroll;
`;

export const ConnectTitleText = style(Typography)`
 color: #FFF;
font-family: Noto Sans KR;
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: normal;
 `;

export const ConnectLayout = style(Box)`
  position:absolute;
  top:90px;
  left:calc(100% - 499px);
  z-index:10;
  border: 1px solid #6D7198;
  background: #FFF;
`;

export const ConnectHeaderContainer = style(Box)`
  width: 499px;
  height: 73px;
  flex-shrink: 0;
  background: #6d7198;
  padding: 24px 12px 24px 39px;
  display:flex;
  justify-content:space-between;
  align-items:center;
`;

export const ConnectItem = style(ListItem)`
cursor:pointer;
  display:flex;
  align-items:center;
  margin-top:15px;
  padding: 0px 0px 18px 40px;
  border-bottom:1px solid #D8D9E6;
`;

export const ConnectItemText = style(Typography)<{ tcolor: string }>`
color: ${props => props.tcolor};
font-family: Noto Sans KR;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: normal;
margin-left:15px;
`;

export const ConnectDataText = style.p`
margin-bottom: 15px;
    margin-left: 8px;
    color: #1F1F1F;
    font-family: Noto Sans KR;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
`;
