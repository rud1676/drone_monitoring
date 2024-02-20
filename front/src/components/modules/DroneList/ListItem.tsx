import React, { Dispatch, SetStateAction } from 'react';
import * as ListStyle from './index.style';
import DroneIcon from './DroneIcon';
import { DroneType } from '@/type/type';

interface ListItemType {
  setOpenDrone: Dispatch<SetStateAction<Array<DroneType>>>;
  setViewCenterCoordinate: Dispatch<
    SetStateAction<{ lon: number; lat: number }>
  >;
  drone: DroneType;
}

const ListItem = ({
  drone,
  setOpenDrone,
  setViewCenterCoordinate,
}: ListItemType) => {
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
    <ListStyle.OneDroneBox
      onClick={() => {
        onClickOpenDrone();
        setViewCenterCoordinate(cord);
      }}
    >
      <DroneIcon color={drone.color} />
      <ListStyle.OneDroneTitle tcolor={drone.color}>
        {drone.name}
      </ListStyle.OneDroneTitle>
    </ListStyle.OneDroneBox>
  );
};

export default ListItem;
