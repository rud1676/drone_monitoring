/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const center = {
  lat: 37.541,
  lng: 126.986,
};

// eslint-disable-next-line react/prop-types
function MuhanGoogleMap({ style }) {
  return (
    <LoadScript googleMapsApiKey="AIzaSyAmNMigl_WSj9R1V5zYmJ6FIGybbOmrg90">
      <GoogleMap mapContainerStyle={style} center={center} zoom={10}>
        {/* Child components, such as markers, info windows, etc. */}
        <></>
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(MuhanGoogleMap);
