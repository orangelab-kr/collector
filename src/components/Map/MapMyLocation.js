import { geolocated } from 'react-geolocated';
import { Circle, Marker } from 'react-naver-maps';

const withGeolocated = geolocated({
  watchPosition: true,
  userDecisionTimeout: 5000,
  positionOptions: {
    enableHighAccuracy: true,
  },
});

export const MapMyLocation = withGeolocated(
  ({
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    currentLoc,
    setCurrentLoc,
  }) => {
    if (!isGeolocationAvailable || !isGeolocationEnabled || !coords) {
      return <></>;
    }

    const location = { lat: coords.latitude, lng: coords.longitude };
    if (
      setCurrentLoc &&
      currentLoc.lat !== location.lat &&
      currentLoc.lng !== location.lng
    ) {
      setCurrentLoc(location);
    }

    return (
      <>
        <Marker
          position={location}
          zIndex={101}
          icon={{
            url: 'https://cdn.hikick.kr/markers/current_location.png',
            scaledSize: { width: 18, height: 18 },
            anchor: { x: 9, y: 9 },
          }}
        />
        <Circle
          center={location}
          radius={coords.accuracy}
          fillColor="#007EEA"
          fillOpacity={0.2}
          zIndex={100}
        />
      </>
    );
  }
);
