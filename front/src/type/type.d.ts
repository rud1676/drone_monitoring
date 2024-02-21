export interface SocketDroneType {
  data: string;
  droneName: string;
  mission: string;
}

export interface DroneType {
  clearFunctionId?: numeber | null;
  color: string;
  data: {
    batteryRemainPercent: number;
    droneAltitude: number;
    droneLatitude: number;
    droneLongitude: number;
    dronePitch: number;
    droneRoll: number;
    droneYaw: number;
    homeLatitude: number;
    homeLongitude: number;
    mode: '대기중' | '연결중' | '수행중';
    status: 'conntected' | 'disconnected';
    velocityHorizontal: number;
    velocityVertical: number;
  };
  mission: Array<{
    lon: number;
    lat: number;
  }>;
  name: string;
  state: Array<{
    title: string;
    content: string;
  }>;
  videoSrc: string;
  weather?: Array<WeatherType> | undefined;
  dataLength: number;
}

export interface CameraType {
  name: string;
  videoSrc: string;
  color: string;
}

export interface WeatherType {
  baseDate: string;
  baseTime: string;
  category: string;
  nx: number;
  ny: number;
  obsrValue: string;
}

export interface MissionType {
  color: string;
  droneName: string;
  path: Array<{ lat: number; lon: number }>;
}

export interface MissionPointType {
  color: string;
  coordinate: { lon: number; lat: number };
  droneName: string;
  index: number;
}

export interface MapDroneType {
  name: string;
  lon: number;
  lat: number;
  color: string;
}
