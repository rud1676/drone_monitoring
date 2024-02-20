import React, { Dispatch, SetStateAction } from 'react';

import * as ListStyle from './index.style';
import ListItem from './ListItem';
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
    <ListStyle.DronwConnectWrapper>
      <ListStyle.DronConnectHeader>
        <ListStyle.DroneRenderTitle>드론 접속 목록</ListStyle.DroneRenderTitle>
        <ListStyle.TotalDataTransform>{`데이터전송 ${dataLength} 건/초`}</ListStyle.TotalDataTransform>
        <img
          style={{ cursor: 'pointer' }}
          onClick={onClickClose}
          src={CloseButton}
          width={10}
          height={10}
          alt="닫기"
        />
      </ListStyle.DronConnectHeader>
      <ListStyle.DroneStack>
        {drones.map(v => {
          return (
            <ListItem
              key={v.name}
              drone={v}
              setOpenDrone={setOpenDrone}
              setViewCenterCoordinate={setViewCenterCoordinate}
            />
          );
        })}
      </ListStyle.DroneStack>
    </ListStyle.DronwConnectWrapper>
  );
};

export default DroneList;
