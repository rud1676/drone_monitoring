import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import 'ol/ol.css';
// import { Feature, Map, View } from 'ol';
// import { XYZ, Vector as VectorSource, OSM } from 'ol/source';
// import { Point as OlPoint, LineString as OlLineString } from 'ol/geom';
import { Map as OlMap, View as OlView, Feature as OlFeature } from 'ol';
import * as olExtent from 'ol/extent';
import { XYZ as OlXYZ, Vector as OlVectorSource } from 'ol/source';
import { Tile as OlTile, Vector as OlVectorLayer } from 'ol/layer';
import { defaults } from 'ol/control';
import { fromLonLat } from 'ol/proj';
import { Point as OlPoint, LineString as OlLineString } from 'ol/geom';
import GeoJSON from 'ol/format/GeoJSON';
import {
  Style as OlStyle,
  Circle as OlCircle,
  Fill as OlFill,
  Stroke as OlStroke,
  Text as OlText,
} from 'ol/style';
import { MAP_API_KEY } from '../../define';

const cDroneStyles = new Map([
  ['red', { basic: [0xff, 0, 0, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['green', { basic: [0, 0x80, 0, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['blue', { basic: [0, 0, 0xff, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['purple', { basic: [0x80, 0, 0x80, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['lime', { basic: [0, 0xff, 0, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['yellow', { basic: [0xff, 0xff, 0, 1], text: [0xff, 0xff, 0xff, 1] }],
  ['aqua', { basic: [0, 0xff, 0xff, 1], text: [0xff, 0xff, 0xff, 1] }],
]);

const getDroneStyle = key => {
  return cDroneStyles.get(key) || cDroneStyles.get('red');
};
const cDefaultCenter = {
  lon: 127.189972804,
  lat: 37.723058796,
};
function MuhanVwMap({ drones, sx, onNoFlyZone, viewCenter }) {
  const [readyToMap, setReadyToMap] = useState(false);
  const [centerCoo, setCenterCoordinate] = useState(viewCenter);
  const olSrcRef = useRef();
  const olMapRef = useRef();
  const [noFlyZones, setNoFlyZones] = useState([]);

  useEffect(() => {
    if (viewCenter.lon !== centerCoo.lon || viewCenter.lat !== centerCoo.lat) {
      setCenterCoordinate({ ...viewCenter });
      olMapRef.current
        ?.getView()
        ?.setCenter(fromLonLat([viewCenter.lon, viewCenter.lat]));
    }
  }, [viewCenter]);
  useEffect(() => {
    if (readyToMap && olSrcRef.current) {
      const newDrones = drones.map(drone => ({
        name: drone.name,
        lon: drone.data.droneLongitude,
        lat: drone.data.droneLatitude,
        color: drone.color,
      }));
      const newMissions = [];
      drones.forEach(drone => {
        if (drone.mission) {
          newMissions.push({
            droneName: drone.name,
            path: [...drone.mission],
            color: drone.color,
          });
        }
      });
      let addingDrones = [...newDrones];
      let addingMissions = [...newMissions];
      const removingDroneFeatures = [];
      const removingMissionFeatures = [];

      const colorMap = new Map();
      olSrcRef.current.getFeatures().forEach(feature => {
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
              feature
                .getGeometry()
                .setCoordinates(fromLonLat([foundInfo.lon, foundInfo.lat]));
              colorMap.set(ftDroneName, ftCustomInfo.colorIndex);
            } else {
              removingDroneFeatures.push(feature);
            }
          } else if (ftType === 'mission') {
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
              feature.getGeometry()?.setCoordinates(coordinates);
            } else {
              removingMissionFeatures.push(feature);
            }
          }
        }
      });
      if (removingDroneFeatures.length > 0) {
        removingDroneFeatures.forEach(feature => {
          olSrcRef.current.removeFeature(feature);
        });
      }
      if (removingMissionFeatures.length > 0) {
        removingMissionFeatures.forEach(feature => {
          olSrcRef.current.removeFeature(feature);
        });
      }

      if (addingDrones.length > 0) {
        addingDrones.forEach(drone => {
          const newFeature = new OlFeature({
            geometry: new OlPoint(fromLonLat([drone.lon, drone.lat])),
            name: drone.name,
            customInfo: {
              type: 'drone',
              name: drone.name,
              color: drone.color,
            },
          });

          olSrcRef.current.addFeature(newFeature);
          newFeature.getGeometry().on('change', () => {
            if (onNoFlyZone) {
              const isNoFlyZone = noFlyZones.some(zone =>
                olExtent.containsCoordinate(
                  zone,
                  newFeature.getGeometry().getFlatCoordinates(),
                ),
              );
              if (isNoFlyZone) {
                onNoFlyZone(drone.name);
              }
            }
          });
        });
      }

      if (addingMissions.length > 0) {
        addingMissions.forEach(mission => {
          const coordinates = mission.path.map(ll =>
            fromLonLat([ll.lon, ll.lat]),
          );
          const newFeature = new OlFeature({
            geometry: new OlLineString(coordinates),
            customInfo: {
              type: 'mission',
              droneName: mission.droneName,
              color: mission.color,
            },
          });
          olSrcRef.current.addFeature(newFeature);
        });
      }
    }
  }, [drones, readyToMap]);

  const addVectorLayer = useCallback(async paramMap => {
    const response = await fetch('/api/vworld');
    const data = await response.json();

    const features = new GeoJSON({
      dataProjection: 'EPSG:900913',
      featureProjection: 'EPSG:3857',
    }).readFeatures(data.data.response.result.featureCollection);

    const featureExtents = features.map(featureItem =>
      olExtent.clone(featureItem.getGeometry().getExtent()),
    );
    setNoFlyZones(featureExtents);

    const getStyle = feature => {
      const customInfo = feature.get('customInfo');

      if (customInfo) {
        if (customInfo.type === 'drone') {
          const style = getDroneStyle(customInfo.color);
          const mColor = style.basic;
          const mTextColor = style.text;
          // if (
          //   customInfo.colorIndex !== undefined &&
          //   customInfo.colorIndex !== null
          // ) {
          //   const style = getDroneStyle(customInfo.color);
          //   mColor = style.basic;
          //   mTextColor = style.text;
          // }

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
                width: 2,
              }),
              stroke: new OlStroke({ color: mColor, width: 1 }),
              // scale: 1.5,
              font: 'bold 15px sans-serif',
            }),
          });
        }
        if (customInfo.type === 'mission') {
          const style = getDroneStyle(customInfo.color);
          const mColor = style.basic;
          // if (
          //   customInfo.colorIndex !== undefined &&
          //   customInfo.colorIndex !== null
          // ) {
          //   const style = getDroneStyle(customInfo.color);
          //   mColor = style.basic;
          // }
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

    olSrcRef.current = new OlVectorSource({
      features: [...features],
    });
    const newLayer = new OlVectorLayer({
      source: olSrcRef.current,
      style: getStyle,
    });
    // newLayer.set('name', 'vector-layer');
    paramMap.addLayer(newLayer);
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
            url: `https://api.vworld.kr/req/wmts/1.0.0/${MAP_API_KEY}/Base/{z}/{y}/{x}.png`,
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
}

MuhanVwMap.propTypes = {
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  drones: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      data: PropTypes.shape({
        droneLongitude: PropTypes.number,
        droneLatitude: PropTypes.number,
      }).isRequired,
      color: PropTypes.string,
      mission: PropTypes.arrayOf(
        PropTypes.shape({
          lon: PropTypes.number,
          lat: PropTypes.number,
        }),
      ),
    }),
  ),
  onNoFlyZone: PropTypes.func,
  viewCenter: PropTypes.shape({
    lon: PropTypes.number,
    lat: PropTypes.number,
  }),
};

MuhanVwMap.defaultProps = {
  sx: {},
  drones: [],
  onNoFlyZone: null,
  viewCenter: cDefaultCenter,
};

export default MuhanVwMap;
