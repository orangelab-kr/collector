import { useCallback, useEffect, useState } from 'react';
import { NaverMap, RenderAfterNavermapsLoaded } from 'react-naver-maps';
import 'react-spring-bottom-sheet/dist/style.css';
import {
  Client,
  MapBottom,
  MapKickboard,
  MapMyLocation,
  MapRegion,
  Sidebar,
  SidebarOpener,
  useDebounce,
} from '..';

export const Kickboards = () => {
  const [zoom, setZoom] = useState(16);
  const [mode, setMode] = useState('static');
  const [kickboard, setKickboard] = useState();
  const [kickboards, setKickboards] = useState([]);
  const [regions, setRegions] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const [positionLoc, setPositionLoc] = useState({
    lat: 37.50526,
    lng: 127.054806,
  });

  const debouncedPositionLoc = useDebounce(positionLoc, 500);
  const [currentLoc, setCurrentLoc] = useState({
    lat: 37.50526,
    lng: 127.054806,
  });

  const radius = 3000;
  const onClick = () => setKickboard(null);
  const onCenterChanged = ({ _lat, _lng }) => {
    setPositionLoc({ lat: _lat, lng: _lng });
  };

  const onSelectedKickboard = (kickboard) => {
    const { latitude: lat, longitude: lng } = kickboard.status.gps;
    setPositionLoc({ lat, lng });
    setKickboard(kickboard);
  };

  const mergeKickboards = useCallback(
    (newKickboards) => {
      const updatedKickboards = kickboards;
      newKickboards.forEach((kickboard) => {
        if (
          !kickboard.status ||
          !kickboard.status.power ||
          !kickboard.status.gps
        ) {
          return;
        }

        const index = updatedKickboards.findIndex(
          (k) => k.kickboardId === kickboard.kickboardId
        );

        if (index !== -1) updatedKickboards.splice(index, 1);
        return updatedKickboards.push(kickboard);
      });

      setKickboards(updatedKickboards);
    },
    [kickboards]
  );

  const getKickboards = useCallback(() => {
    if (zoom < 14) return;
    Client.get('/kickboards', {
      params: { ...debouncedPositionLoc, radius },
    }).then((res) => mergeKickboards(res.data.kickboards));
  }, [debouncedPositionLoc, mergeKickboards]);

  const getRegions = useCallback(
    () => Client.get('/regions').then((res) => setRegions(res.data.regions)),
    []
  );

  const getCenter = () => {
    switch (mode) {
      case 'current':
        return currentLoc;
      default:
      case 'static':
        return positionLoc;
    }
  };

  const selectKickboardByCode = async (kickboardCode) => {
    const { data } = await Client.get(`/kickboards/${kickboardCode}`);
    mergeKickboards([data.kickboard]);
    onSelectedKickboard(data.kickboard);
  };

  useEffect(() => getKickboards(), [getKickboards]);
  useEffect(() => getRegions(), [getRegions]);

  return (
    <>
      <SidebarOpener setSidebar={setSidebar} />
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
      <MapBottom
        kickboard={kickboard}
        mode={mode}
        setMode={setMode}
        selectKickboardByCode={selectKickboardByCode}
        getKickboards={getKickboards}
      />
      <RenderAfterNavermapsLoaded ncpClientId="0bl6xi2j7x">
        <NaverMap
          onClick={onClick}
          onCenterChanged={onCenterChanged}
          onZoomChanged={setZoom}
          mapDivId={'maps-getting-started'}
          style={{ width: '100%', height: '100vh' }}
          center={getCenter()}
          mapDataControl={false}
          zoom={zoom}
        >
          <MapMyLocation
            currentLoc={currentLoc}
            setCurrentLoc={setCurrentLoc}
          />

          {kickboards.map((kickboard) => (
            <MapKickboard
              key={kickboard._id}
              kickboard={kickboard}
              setSelectedKickboard={onSelectedKickboard}
            />
          ))}

          {regions.map((region) => (
            <MapRegion key={region.regionId} region={region} />
          ))}
        </NaverMap>
      </RenderAfterNavermapsLoaded>
    </>
  );
};
