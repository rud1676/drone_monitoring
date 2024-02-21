import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  RefObject,
} from 'react';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system';

//vworld 임포트
import 'ol/ol.css';
import { Map as OlMap, View as OlView, Feature as OlFeature } from 'ol';
import * as olExtent from 'ol/extent';
import { XYZ as OlXYZ, Vector as OlVectorSource } from 'ol/source';
import { Tile as OlTile, Vector as OlVectorLayer } from 'ol/layer';
import { defaults } from 'ol/control';
import { fromLonLat } from 'ol/proj';
import {
  Point as OlPoint,
  LineString as OlLineString,
  Geometry,
  Point,
} from 'ol/geom';
import Map from 'ol/Map';
import Feature, { FeatureLike } from 'ol/Feature';

import GeoJSON from 'ol/format/GeoJSON';

import { cDefaultCenter, getDroneStyle } from '@/utils/define';
import {
  Style as OlStyle,
  Circle as OlCircle,
  Fill as OlFill,
  Stroke as OlStroke,
  Text as OlText,
} from 'ol/style';
import {
  MapDroneType,
  MissionType,
  MissionPointType,
  DroneType,
} from '@/type/type';

interface MuhanVwMapType {
  drones: Array<DroneType>;
  sx: SxProps;
  viewCenter: { lon: number; lat: number };
}

// 레이어에 정보를 추가하는 함수
function addFeaturesToLayer<ItemType>(
  featuresToAdd: ItemType[],
  sourceRef: RefObject<OlVectorSource> | undefined,
  createGeometry: (
    item: <ItemType>,
  ) => Geometry,
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

const MuhanVwMap = ({
  drones,
  sx = {},
  viewCenter = cDefaultCenter,
}: MuhanVwMapType) => {
  const [readyToMap, setReadyToMap] = useState(false);
  const [centerCoo, setCenterCoordinate] = useState(viewCenter);
  const olSrcForMissionRef = useRef<OlVectorSource>(null);
  const olSrcForMissionPathNumberRef = useRef<OlVectorSource>(null);
  const olSrcForDroneRef = useRef<OlVectorSource>(null);
  const olMapRef = useRef<OlMap>();

  useEffect(() => {
    if (viewCenter.lon !== centerCoo.lon || viewCenter.lat !== centerCoo.lat) {
      setCenterCoordinate({ ...viewCenter });
      if (olMapRef.current) {
        olMapRef.current
          .getView()
          .setCenter(fromLonLat([viewCenter.lon, viewCenter.lat]));
      }
    }
  }, [viewCenter]);
  useEffect(() => {
    if (readyToMap) {
      const newDrones = drones.map(drone => ({
        name: drone.name,
        lon: drone.data.droneLongitude,
        lat: drone.data.droneLatitude,
        color: drone.color,
      }));
      const newMissions: Array<{
        droneName: string;
        path: Array<{ lon: number; lat: number }>;
        color: string;
      }> = [];
      drones.forEach(drone => {
        if (drone.mission) {
          newMissions.push({
            droneName: drone.name,
            path: [...drone.mission],
            color: drone.color,
          });
        }
      });

      const newMissionPoints: Array<{
        droneName: string;
        coordinate: { lon: number; lat: number };
        color: string;
        index: number;
      }> = [];
      drones.forEach(drone => {
        if (drone.mission) {
          drone.mission.forEach((missionPoint, index) => {
            newMissionPoints.push({
              droneName: drone.name,
              coordinate: { ...missionPoint },
              color: drone.color,
              index,
            });
          });
        }
      });
      let addingDrones: Array<MapDroneType> = [...newDrones];
      let addingMissions = [...newMissions];
      let addingMissionPoints = [...newMissionPoints];
      const removingDroneFeatures: Array<Feature<Geometry>> = [];
      const removingMissionFeatures: Array<Feature<Geometry>> = [];
      const removingMissionPointFeatures: Array<Feature<Geometry>> = [];

      if (!olSrcForDroneRef.current) return;
      if (!olSrcForMissionRef.current) return;
      if (!olSrcForMissionPathNumberRef.current) return;

      olSrcForDroneRef.current
        .getFeatures()
        .forEach((feature: Feature<Geometry>) => {
          const ftCustomInfo = feature.get('customInfo');
          if (ftCustomInfo) {
            const ftType = ftCustomInfo.type;
            if (ftType === 'drone') {
              const ftDroneName = ftCustomInfo.name;
              const foundInfo = newDrones.find(
                droneInfo => droneInfo.name === ftDroneName,
              );
              if (foundInfo) {
                addingDrones = addingDrones.filter(
                  drone => drone.name !== ftDroneName,
                );
                const geometry = feature.getGeometry();
                if (geometry instanceof Point)
                  geometry.setCoordinates(
                    fromLonLat([foundInfo.lon, foundInfo.lat]),
                  );
              } else {
                removingDroneFeatures.push(feature);
              }
            }
          }
        });

      olSrcForMissionRef.current.getFeatures().forEach(feature => {
        const ftCustomInfo = feature.get('customInfo');
        if (ftCustomInfo) {
          const ftType = ftCustomInfo.type;
          if (ftType === 'mission') {
            const ftDroneName = ftCustomInfo.droneName;
            const foundInfo = newMissions.find(
              missionInfo => missionInfo.droneName === ftDroneName,
            );
            if (foundInfo) {
              addingMissions = addingMissions.filter(
                mission => mission.droneName !== ftDroneName,
              );
              const coordinates = foundInfo.path.map(ll =>
                fromLonLat([ll.lon, ll.lat]),
              );
              const geometry = feature.getGeometry();
              if (geometry instanceof Point)
                geometry.setCoordinates(coordinates);
            } else {
              removingMissionFeatures.push(feature);
            }
          }
        }
      });

      olSrcForMissionPathNumberRef.current.getFeatures().forEach(feature => {
        const ftCustomInfo = feature.get('customInfo');
        if (ftCustomInfo) {
          const ftType = ftCustomInfo.type;
          if (ftType === 'missionPoint') {
            const ftDroneName = ftCustomInfo.droneName;
            const ftIndex = ftCustomInfo.index;
            const foundInfo = newMissionPoints.find(
              missionPoint =>
                missionPoint.droneName === ftDroneName &&
                missionPoint.index === ftIndex,
            );
            if (foundInfo) {
              addingMissionPoints = addingMissionPoints.filter(
                missionPoint =>
                  missionPoint.droneName !== ftDroneName ||
                  missionPoint.index !== ftIndex,
              );

              const geometry = feature.getGeometry();
              if (geometry instanceof Point)
                geometry.setCoordinates(
                  fromLonLat([
                    foundInfo.coordinate.lon,
                    foundInfo.coordinate.lat,
                  ]),
                );
            } else {
              removingMissionPointFeatures.push(feature);
            }
          }
        }
      });
      if (removingDroneFeatures.length > 0) {
        removingDroneFeatures.forEach(feature => {
          if (olSrcForDroneRef.current)
            olSrcForDroneRef.current.removeFeature(feature);
        });
      }
      if (removingMissionFeatures.length > 0) {
        removingMissionFeatures.forEach(feature => {
          if (olSrcForMissionRef.current)
            olSrcForMissionRef.current.removeFeature(feature);
        });
      }
      if (removingMissionPointFeatures.length > 0) {
        removingMissionPointFeatures.forEach(feature => {
          if (olSrcForMissionPathNumberRef.current)
            olSrcForMissionPathNumberRef.current.removeFeature(feature);
        });
      }

      // 드론, 임무, 임무 지점 추가를 위한 개별 호출
      addFeaturesToLayer(
        addingDrones,
        olSrcForDroneRef,
        drone => new OlPoint(fromLonLat([drone.lon, drone.lat])),
        'drone',
      );
      addFeaturesToLayer(
        addingMissions,
        olSrcForMissionRef,
        mission =>
          new OlLineString(
            mission.path.map(ll => fromLonLat([ll.lon, ll.lat])),
          ),
        'mission',
      );
      addFeaturesToLayer(
        addingMissionPoints,
        olSrcForMissionPathNumberRef,
        missionPoint =>
          new OlPoint(
            fromLonLat([
              missionPoint.coordinate.lon,
              missionPoint.coordinate.lat,
            ]),
          ),
        'missionPoint',
      );
    }
  }, [drones, readyToMap]);

  const addVectorLayer = useCallback(async (paramMap: Map) => {
    //

    const getStyleForDefault = () => {
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
    // remote NoFlyZone info
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/area');
    const data = await response.json();

    const features = new GeoJSON({
      dataProjection: 'EPSG:900913',
      featureProjection: 'EPSG:3857',
    }).readFeatures(data.data.response.result.featureCollection);

    features.map((featureItem: Feature<Geometry>) => {
      const geomet = featureItem.getGeometry();
      if (geomet) olExtent.clone(geomet.getExtent());
    });

    // add a layer for NoFlyZone

    const getStyleForNoFlyZone = () => {
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

    const newLayerForNoFlyZone = new OlVectorLayer({
      source: new OlVectorSource({
        features: [...features],
      }),
      style: getStyleForNoFlyZone,
    });

    // missin path line
    const getStyleForMission = (feature: FeatureLike) => {
      const customInfo = feature.get('customInfo');

      if (customInfo) {
        if (customInfo.type === 'mission') {
          const style:
            | { basic: Array<number>; text: Array<number> }
            | undefined = getDroneStyle(customInfo.color);

          if (style) {
            const mColor = style.basic;
            return new OlStyle({
              image: new OlCircle({
                radius: 7,
                fill: new OlFill({ color: 'blue' }),
                stroke: new OlStroke({
                  color: [255, 0, 255],
                  width: 20,
                }),
              }),
              stroke: new OlStroke({
                width: 2,
                color: mColor,
              }),
              fill: new OlFill({
                color: [255, 0, 255, 0.15],
              }),
              text: new OlText({
                text: `mission\n${customInfo.droneName}`,
                fill: new OlFill({
                  color: 'black',
                }),
                stroke: new OlStroke({ color: 'yellow', width: 3 }),
                scale: 1.5,
              }),
            });
          }
        }
      }
      return getStyleForDefault();
    };
    olSrcForMissionRef.current = new OlVectorSource({
      features: [],
    });
    const newLayerForMission = new OlVectorLayer({
      source: olSrcForMissionRef.current,
      style: getStyleForMission,
    });

    // mission path number
    const getStyleForMissionPathNumber = (feature: FeatureLike) => {
      const customInfo = feature.get('customInfo');

      if (customInfo.type === 'missionPoint') {
        const style = getDroneStyle(customInfo.color);
        if (style) {
          const basicColor = style.basic;
          return new OlStyle({
            image: new OlCircle({
              radius: 7,
              fill: new OlFill({ color: 'white' }),
              stroke: new OlStroke({
                color: basicColor,
                width: 1,
              }),
            }),
            text: new OlText({
              text: `${customInfo.index}`,
              fill: new OlFill({
                color: basicColor,
              }),
              scale: 1.4,
              offsetY: 2,
            }),
          });
        }
      }
      return getStyleForDefault();
    };

    olSrcForMissionPathNumberRef.current = new OlVectorSource({
      features: [],
    });
    const newLayerForMissionPathNumber = new OlVectorLayer({
      source: olSrcForMissionPathNumberRef.current,
      style: getStyleForMissionPathNumber,
    });

    // drone
    const getStyleForDrone = (feature: FeatureLike) => {
      const customInfo = feature.get('customInfo');

      if (customInfo.type === 'drone') {
        const style = getDroneStyle(customInfo.color);
        if (style) {
          const mColor = style.basic;
          const mTextColor = style.text;

          return new OlStyle({
            image: new OlCircle({
              radius: 7,
              fill: new OlFill({ color: 'blue' }),
              stroke: new OlStroke({
                color: mColor,
                width: 20,
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
              text: customInfo.name,
              fill: new OlFill({
                color: mTextColor,
              }),
              stroke: new OlStroke({ color: mColor, width: 1 }),
              // scale: 1.5,
              font: 'bold 15px sans-serif',
            }),
          });
        }
      }
      return getStyleForDefault();
    };

    olSrcForDroneRef.current = new OlVectorSource({
      features: [],
    });
    const newLayerForDrone = new OlVectorLayer({
      source: olSrcForDroneRef.current,
      style: getStyleForDrone,
    });

    paramMap.addLayer(newLayerForNoFlyZone);
    paramMap.addLayer(newLayerForMission);
    paramMap.addLayer(newLayerForMissionPathNumber);
    paramMap.addLayer(newLayerForDrone);
    setReadyToMap(true);
  }, []);

  useEffect(() => {
    const myMap = new OlMap({
      controls: defaults({ zoom: true, rotate: false }).extend([]),
      layers: [
        // new Tile({
        //   source: new OSM(),
        // }),
        new OlTile({
          visible: true,
          source: new OlXYZ({
            url: `https://api.vworld.kr/req/wmts/1.0.0/${process.env.MAP_API_KEY}/Base/{z}/{y}/{x}.png`,
          }),
        }),
      ],
      target: 'map',
      view: new OlView({
        center: fromLonLat([127.189972804, 37.723058796]),
        zoom: 15,
      }),
    });
    olMapRef.current = myMap;
    addVectorLayer(myMap);
  }, [addVectorLayer]);

  return <Box id="map" sx={{ ...sx }} />;
};

export default MuhanVwMap;
