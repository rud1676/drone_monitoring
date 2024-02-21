import { RefObject, Dispatch, SetStateAction } from 'react';
import { DroneType, CameraType, WeatherType } from '@/type/type';
import { Coordinate } from 'ol/coordinate';
import 'ol/ol.css';
import { Feature as OlFeature } from 'ol';
import { Vector as OlVectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { Geometry, Point } from 'ol/geom';

import {
  Style as OlStyle,
  Circle as OlCircle,
  Fill as OlFill,
  Stroke as OlStroke,
  Text as OlText,
} from 'ol/style';
import { MapDroneType, MissionType, MissionPointType } from '@/type/type';

// 연창을 닫을 때 state에서 지워주는 함수
export const onClickClose = (
  v: CameraType | DroneType,
  setState: Dispatch<SetStateAction<Array<any>>>,
) => {
  setState(prev => {
    const temp = prev.filter(drone => drone.name !== v.name);
    return [...temp];
  });
};

// 드론 카메라 버튼 누를때
export const onClickDroneCamera = (
  v: DroneType,
  setState: Dispatch<SetStateAction<Array<CameraType>>>,
) => {
  setState((prev): Array<CameraType> => {
    if (prev.findIndex(drone => drone.name === v.name) === -1)
      return [...prev, { name: v.name, videoSrc: v.videoSrc, color: v.color }];
    return [...prev];
  });
};

export const fetchWeather = async (
  lat: number,
  lng: number,
): Promise<Array<WeatherType> | undefined> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/weather?lat=${lat}&lng=${lng}`,
  );
  const data = await response.json();
  return data.data.response.body.items.item;
};

////////////////////////VwMap함수부분/////////////////bin/

type ItemType = MapDroneType | MissionType | MissionPointType;
// 레이어에 정보를 추가하는 함수
export const getStyleForDefault = () => {
  return new OlStyle({
    image: new OlCircle({
      radius: 7,
      fill: new OlFill({ color: 'black' }),
      stroke: new OlStroke({
        color: [255, 0, 0],
        width: 2,
      }),
    }),
    stroke: new OlStroke({
      width: 2,
      color: [255, 0, 0, 1],
    }),
    fill: new OlFill({
      color: [255, 0, 255, 0.15],
    }),
  });
};
export const getStyleForNoFlyZone = () => {
  return new OlStyle({
    image: new OlCircle({
      radius: 7,
      fill: new OlFill({ color: 'black' }),
      stroke: new OlStroke({
        color: [255, 0, 0],
        width: 2,
      }),
    }),
    stroke: new OlStroke({
      width: 2,
      color: [255, 0, 0, 1],
    }),
    fill: new OlFill({
      color: [255, 0, 255, 0.15],
    }),
    text: new OlText({
      text: '비행금지구역',
      fill: new OlFill({
        color: 'black',
      }),
      stroke: new OlStroke({ color: 'yellow', width: 3 }),
      scale: 1.5,
    }),
  });
};

export function addFeaturesToLayer(
  featuresToAdd: ItemType[],
  sourceRef: RefObject<OlVectorSource> | undefined,
  createGeometry: (item: ItemType) => Geometry,
  functype: 'drone' | 'mission' | 'missionPoint',
) {
  if (featuresToAdd.length > 0 && sourceRef && sourceRef.current) {
    featuresToAdd.forEach(item => {
      const name = 'name' in item ? item.name : item.droneName;
      const index = 'index' in item ? item.index : undefined;
      const newFeature = new OlFeature({
        geometry: createGeometry(item), // 지오메트리 생성 콜백 호출
        customInfo: {
          // 공통 정보
          type: functype,
          name: name, // name 또는 droneName 사용
          color: item.color,
          ...(index !== undefined && { index }), // index가 있으면 추가
        },
      });
      if (sourceRef.current) sourceRef.current.addFeature(newFeature);
    });
  }
}

// 지워야될 정보를 담고있는 배열의 갱신함수
export function removeFeaturesFromLayer(
  featuresToRemove: OlFeature[],
  sourceRef: RefObject<OlVectorSource>,
) {
  if (featuresToRemove.length > 0 && sourceRef.current) {
    featuresToRemove.forEach(feature => {
      if (sourceRef.current) sourceRef.current.removeFeature(feature);
    });
  }
}

// 드론정보를 갱신해야되는 드론들 업데이트
export function updateFeatures(
  sourceRef: RefObject<OlVectorSource>,
  items: Array<ItemType>,
  type: 'drone' | 'mission' | 'missionPoint',
  addingItems: Array<ItemType>,
  removingFeatures: OlFeature<Geometry>[],
) {
  const featuresToUpdate = sourceRef.current?.getFeatures() ?? [];

  featuresToUpdate.forEach(feature => {
    const ftCustomInfo = feature.get('customInfo');
    if (ftCustomInfo && ftCustomInfo.type === type) {
      const foundItem = items.find(item => {
        if (type === 'drone') {
          return 'name' in item && item.name === ftCustomInfo.name;
        }
        if (type === 'mission')
          return (
            'droneName' in item && item.droneName === ftCustomInfo.droneName
          );
        if (type === 'missionPoint')
          return (
            'droneName' in item &&
            'index' in item &&
            item.droneName === ftCustomInfo.droneName &&
            item.index === ftCustomInfo.index
          );
      });

      if (foundItem) {
        let coordinates: Coordinate | Coordinate[] = [0, 0];
        if (type === 'drone' && 'lon' in foundItem && 'lat' in foundItem) {
          coordinates = fromLonLat([foundItem.lon, foundItem.lat]);
        } else if (type === 'mission' && 'path' in foundItem) {
          coordinates = foundItem.path.map(ll => fromLonLat([ll.lon, ll.lat]));
        } else if (type === 'missionPoint' && 'coordinate' in foundItem) {
          coordinates = fromLonLat([
            foundItem.coordinate.lon,
            foundItem.coordinate.lat,
          ]);
        }

        const geometry = feature.getGeometry();
        if (geometry instanceof Point) geometry.setCoordinates(coordinates);

        addingItems = addingItems.filter(item =>
          type === 'missionPoint'
            ? !(
                'droneName' in item &&
                'droneName' in foundItem &&
                'index' in item &&
                'index' in foundItem &&
                item.droneName === foundItem.droneName &&
                item.index === foundItem.index
              )
            : !(
                ('name' in item &&
                  'name' in foundItem &&
                  item.name === foundItem.name) ||
                ('droneName' in item &&
                  'droneName' in foundItem &&
                  item.droneName === foundItem.droneName)
              ),
        );
      } else {
        removingFeatures = [...removingFeatures, feature];
      }
    }
  });
}
