import { Stack, IconButton, Card, Typography, Box } from '@mui/material';
import Button from '@mui/material/Button';
import style from '@emotion/styled';

export const CardWrapper = style(Card)<{ num: number; backcolor: string }>`
position:absolute;
left:${props => props.num * 5 + 500}px;
top:${props => props.num * 20 + 100}px;
  z-index:10;
  border-radius: 6px;
border: 1px solid #707070;
background: ${props => props.backcolor};
box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.20);
width: 320px;
height: 560px;
flex-shrink: 0;
`;
export const CardTitle = style(Typography)`
color: #FFF;

font-family: Noto Sans KR;
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: normal;
`;

export const CardButtonBox = style(Box)`
`;

export const CardHeader = style(Box)`
  cursor:pointer;
  padding:16px 17px 19px 30px;
  display:flex;
  width:100%;
  align-items:center;
  justify-content:space-between;
  height:61px;
  border-bottom:1px solid rgba(255, 255, 255, 0.30);;
  z-index:10;
`;

export const IconButtonCustom = style(IconButton)`
  width: 25px;
  height: 25px;
`;

export const InfoOne = style(Box)`
  padding:0 0 0 10px;
  align-items:center;
  display:flex;
`;
export const DroneStack = style(Stack)`
 background: rgba(255,255,255,0.4);
 max-height:559px;
 width: 500px;
 overflow:scroll;
`;

export const DroneRenderTitle = style(Typography)`

 color: #FFF;

font-family: Noto Sans KR;
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: normal;
 `;

export const DronwConnectWrapper = style(Box)`
  position:absolute;
  top:90px;
  left:calc(100% - 499px);
  z-index:10;
  border: 1px solid #6D7198;
  background: #FFF;
`;

export const DronConnectHeader = style(Box)`
  width: 499px;
  height: 73px;
  flex-shrink: 0;
  background: #6d7198;
  padding: 24px 12px 24px 39px;
  display:flex;
  justify-content:space-between;
  align-items:center;
`;

export const OneDroneBox = style(Box)`
cursor:pointer;
  display:flex;
  align-items:center;
  margin-top:15px;
  padding: 0px 0px 18px 40px;
  border-bottom:1px solid #D8D9E6;
`;

export const OneDroneTitle = style(Typography)<{ tcolor: string }>`
color: ${props => props.tcolor};

font-family: Noto Sans KR;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: normal;
margin-left:15px;
`;

export const CardHeaderLeft = style(Box)`
  display:flex;
  align-items:center;
`;

export const CardContent = style(Box)`
  padding: 18px 31px 25px 31px;
`;

export const InfoBox = style(Box)`

`;

export const InfoTitle = style(Typography)`
color: #FFF;
font-family: Noto Sans KR;
font-size: 14px;
font-style: normal;
font-weight: 700;
line-height: normal;
margin-bottom:5px;
`;

export const InfoContent = style(Typography)`
margin-left:8px;
color: #1F1F1F;

font-family: Noto Sans KR;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 28px; 
`;

export const ButtonBox = style(Box)`
margin-top:40px;
display:grid;
grid-template-columns: 1fr 1fr;
`;

export const CardButton = style(Button)`
width: 120px;
height: 40px;
flex-shrink: 0;
border-radius: 20px;
background: rgba(255, 255, 255, 0.50);
color: #3F3F3F;

text-align: center;
font-family: Noto Sans KR;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 28px; /* 175% */
&:hover{
background: rgba(255, 255, 255, 0.50);
  
}
`;

export const TotalDataTransform = style.p`
margin-bottom: 15px;
    margin-left: 8px;
    color: #1F1F1F;
    font-family: Noto Sans KR;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
`;

/* 코드 짬통
  background: ${props => props.backcolor};
  ${props =>
    props.isclick === 'false' &&
    `animation: blink 0.5s ease-in-out infinite alternate;`}

    export const InfoBox = style(Box)`
  ${props => (props.min === 'true' ? `display:none;` : `display:block;`)}
  padding: 20px 0 10px 0;
`;
*/
