import React, { Dispatch, SetStateAction } from 'react';
import * as ListStyle from './index.style';
import ConnectListItem from './ConnectListItem';
import CloseButton from '@/assets/img/CloseButton.svg';
import { DroneType } from '@/type/type';

interface DroneListType {
  onClickClose: () => void;
  drones: Array<DroneType>;
  setOpenDrone: Dispatch<SetStateAction<Array<DroneType>>>;
  setViewCenterCoordinate: Dispatch<
    SetStateAction<{ lon: number; lat: number }>
  >;
  dataLength: number;
}

const DroneList = ({
  onClickClose,
  drones,
  setOpenDrone,
  setViewCenterCoordinate,
  dataLength,
}: DroneListType) => {
  return (
    <ListStyle.ConnectLayout>
      <ListStyle.ConnectHeaderContainer>
        <ListStyle.ConnectTitleText>드론 접속 목록</ListStyle.ConnectTitleText>
        <ListStyle.ConnectDataText>{`데이터전송 ${dataLength} 건/초`}</ListStyle.ConnectDataText>
        <img
          style={{ cursor: 'pointer' }}
          onClick={onClickClose}
          src={CloseButton}
          width={10}
          height={10}
          alt="닫기"
        />
      </ListStyle.ConnectHeaderContainer>
      <ListStyle.ConnectListContainer>
        {drones.map(v => {
          return (
            <ConnectListItem
              key={v.name}
              drone={v}
              setOpenDrone={setOpenDrone}
              setViewCenterCoordinate={setViewCenterCoordinate}
            />
          );
        })}
      </ListStyle.ConnectListContainer>
    </ListStyle.ConnectLayout>
  );
};

export default DroneList;
