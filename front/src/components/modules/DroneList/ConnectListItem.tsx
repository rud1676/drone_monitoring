import React, { Dispatch, SetStateAction } from 'react';
import * as ListStyle from './index.style';
import DroneIcon from './DroneIcon';
import { DroneType } from '@/type/type';

interface ConnectListItemType {
  setOpenDrone: Dispatch<SetStateAction<Array<DroneType>>>;
  setViewCenterCoordinate: Dispatch<
    SetStateAction<{ lon: number; lat: number }>
  >;
  drone: DroneType;
}

const ConnectListItem = ({
  drone,
  setOpenDrone,
  setViewCenterCoordinate,
}: ConnectListItemType) => {
  const onClickOpenDrone = () => {
    setOpenDrone(prev => {
      if (prev.findIndex(v => v.name === drone.name) === -1)
        return [...prev, drone];
      return [...prev];
    });
  };
  const cord = {
    lat: drone.data.droneLatitude,
    lon: drone.data.droneLongitude,
  };
  return (
    <ListStyle.ConnectItem
      onClick={() => {
        onClickOpenDrone();
        setViewCenterCoordinate(cord);
      }}
    >
      <DroneIcon color={drone.color} />
      <ListStyle.ConnectItemText tcolor={drone.color}>
        {drone.name}
      </ListStyle.ConnectItemText>
    </ListStyle.ConnectItem>
  );
};

export default ConnectListItem;
