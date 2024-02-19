import { styled } from '@mui/system';
import { Typography, Button, Box } from '@mui/material';

export const HeaderLayout = styled(Box)`
  background: #1f2243;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  width: calc(100%);
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

export const HeaderText = styled(Typography)`
  color: #999dbf;
  font-family: 'Noto Sans KR';
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.6px;
  margin-left: 16px;
`;

export const LeftContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

export const DroneStatusButton = styled(Button)`
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

export const ButtonText = styled(Typography)`
  color: #fff;

  font-family: Noto Sans KR;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-left: 13px;
`;

export const RightContainer = styled(Box)`
  display: flex;
  align-items: center;
`;
export const StateBox = styled(Box)`
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

export const InfoBox = styled(Box)`
  color: #fff;
  margin-right: 50px;
`;
export const InfoText = styled(Typography)`
  margin: 0;
  font-family: Noto Sans KR;
`;
