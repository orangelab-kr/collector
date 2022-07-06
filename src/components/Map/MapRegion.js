import { Polygon } from 'react-naver-maps';

export const MapRegion = ({ geofences, priority }) => {
  const getOpacity = (geofence) =>
    parseInt(geofence.profile.color.substr(7, 2) || '1a', 16) / 255;

  return (
    <>
      {geofences
        .filter((geofence) => priority.includes(geofence.profile.priority))
        .map((geofence) => (
          <Polygon
            key={geofence.geofenceId}
            paths={geofence.geojson.coordinates}
            zIndex={geofence.profile.priority}
            fillColor={geofence.profile.color}
            strokeColor={geofence.profile.color}
            fillOpacity={getOpacity(geofence)}
            strokeOpacity={0.8}
          />
        ))}
    </>
  );
};
