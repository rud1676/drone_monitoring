import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system';

//vworld 임포트
import 'ol/ol.css';
import { Map as OlMap, View as OlView } from 'ol';
import * as olExtent from 'ol/extent';
import { XYZ as OlXYZ, Vector as OlVectorSource } from 'ol/source';
import { Tile as OlTile, Vector as OlVectorLayer } from 'ol/layer';
import { defaults } from 'ol/control';
import { fromLonLat } from 'ol/proj';
import {
  Geometry,
  Point as OlPoint,
  LineString as OlLineString,
} from 'ol/geom';
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
import {
  getStyleForDefault,
  getStyleForNoFlyZone,
  addFeaturesToLayer,
  removeFeaturesFromLayer,
  updateFeatures,
} from '@/utils/func';

interface MuhanVwMapType {
  drones: Array<DroneType>;
  sx: SxProps;
  viewCenter: { lon: number; lat: number };
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

  // 드론창을 클릭햇을 때 센터로 가는 함수
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

  //드론이 변경될 때 마다 그려주는 함수 - 소켓 데이터 받을때 마다임
  useEffect(() => {
    if (readyToMap) {
      const newDrones: MapDroneType[] = [];
      const newMissions: MissionType[] = [];
      const newMissionPoints: MissionPointType[] = [];

      drones.forEach(drone => {
        newDrones.push({
          name: drone.name,
          lon: drone.data.droneLongitude,
          lat: drone.data.droneLatitude,
          color: drone.color,
        });
        if (drone.mission) {
          drone.mission.forEach((missionPoint, index) => {
            newMissionPoints.push({
              droneName: drone.name,
              coordinate: { ...missionPoint },
              color: drone.color,
              index,
            });
            newMissions.push({
              droneName: drone.name,
              path: [...drone.mission],
              color: drone.color,
            });
          });
        }
      });

      const addingDrones = [...newDrones];
      const addingMissions = [...newMissions];
      const addingMissionPoints = [...newMissionPoints];
      const removingDroneFeatures: Array<Feature<Geometry>> = [];
      const removingMissionFeatures: Array<Feature<Geometry>> = [];
      const removingMissionPointFeatures: Array<Feature<Geometry>> = [];

      if (!olSrcForDroneRef.current) return;
      if (!olSrcForMissionRef.current) return;
      if (!olSrcForMissionPathNumberRef.current) return;

      updateFeatures(
        olSrcForDroneRef,
        newDrones,
        'drone',
        addingDrones,
        removingDroneFeatures,
      );
      updateFeatures(
        olSrcForMissionRef,
        newDrones,
        'mission',
        addingMissions,
        removingMissionFeatures,
      );
      updateFeatures(
        olSrcForMissionPathNumberRef,
        newDrones,
        'missionPoint',
        addingMissionPoints,
        removingMissionPointFeatures,
      );

      //지워야될 정보 담는 함수 호출 - 그려진 드론목록에서 소켓에서 받은 드론들 확인
      removeFeaturesFromLayer(removingDroneFeatures, olSrcForDroneRef);
      removeFeaturesFromLayer(removingMissionFeatures, olSrcForMissionRef);
      removeFeaturesFromLayer(
        removingMissionPointFeatures,
        olSrcForMissionPathNumberRef,
      );

      // 드론, 임무, 임무 지점 추가를 위한 개별 호출
      addFeaturesToLayer(
        addingDrones,
        olSrcForDroneRef,
        drone => {
          const lon = 'lon' in drone ? drone.lon : 0;
          const lat = 'lat' in drone ? drone.lat : 0;
          return new OlPoint(fromLonLat([lon, lat]));
        },
        'drone',
      );
      addFeaturesToLayer(
        addingMissions,
        olSrcForMissionRef,
        mission => {
          const path = 'path' in mission ? mission.path : [];
          return new OlLineString(path.map(ll => fromLonLat([ll.lon, ll.lat])));
        },
        'mission',
      );
      addFeaturesToLayer(
        addingMissionPoints,
        olSrcForMissionPathNumberRef,
        missionPoint => {
          const cord =
            'coordinate' in missionPoint
              ? missionPoint.coordinate
              : { lon: 0, lat: 0 };
          return new OlPoint(fromLonLat([cord.lon, cord.lat]));
        },
        'missionPoint',
      );
    }
  }, [drones, readyToMap]);

  const addVectorLayer = useCallback(async (paramMap: OlMap) => {
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
