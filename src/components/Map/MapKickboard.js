import { Marker } from 'react-naver-maps';

export const MapKickboard = ({ kickboard, setSelectedKickboard }) => {
  const url = `https://cdn.hikick.kr/markers`;
  const setKickboard = () => setSelectedKickboard(kickboard);
  const TYPES = {
    BROKEN: url + '/broken.png',
    COLLECT_TARGET: url + '/collect_target.png',
    COLLECTED: url + '/collected.png',
    EMPTY_BATTERY: url + '/empty_battery.png',
    LOW_BATTERY: url + '/low_battery.png',
    NORMAL: url + '/normal.png',
    RIDING: url + '/riding.png',
  };

  const getIcon = () => {
    if (kickboard.mode === 1) return TYPES.RIDING;
    if (kickboard.mode === 2) return TYPES.BROKEN;
    if (kickboard.mode === 3) return TYPES.COLLECTED;
    if (kickboard.collect) return TYPES.COLLECT_TARGET;
    if (kickboard.status.power.scooter.battery <= 0) return TYPES.EMPTY_BATTERY;
    if (kickboard.status.power.scooter.battery <= 30) return TYPES.LOW_BATTERY;
    return TYPES.NORMAL;
  };

  return (
    <Marker
      key={kickboard.kickboardId}
      clickable={true}
      onClick={setKickboard}
      icon={{
        url: getIcon(),
        scaledSize: { width: 30, height: 45 },
      }}
      position={{
        lat: kickboard.status.gps.latitude,
        lng: kickboard.status.gps.longitude,
      }}
    />
  );
};
