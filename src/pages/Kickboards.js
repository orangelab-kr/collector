import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { NaverMap, RenderAfterNavermapsLoaded } from 'react-naver-maps';
import 'react-spring-bottom-sheet/dist/style.css';
import { StringParam, useQueryParam } from 'use-query-params';
import {
  Client,
  MapBottom,
  MapKickboard,
  MapMyLocation,
  MapRegion,
  Sidebar,
  SidebarOpener,
  useDebounce,
  useLocalStorage,
} from '..';

export const Kickboards = () => {
  const radius = 3000;
  const defaultLoc = { lat: 37.50526, lng: 127.054806 };
  const defaultSetting = { priority: [0, 1, 2, 3] };

  const [zoom, setZoom] = useState(16);
  const [mode, setMode] = useState('static');
  const [kickboard, setKickboard] = useState();
  const [kickboards, setKickboards] = useState([]);
  const [regions, setRegions] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const [kickboardCode] = useQueryParam('kickboardCode', StringParam);
  const [currentLoc, setCurrentLoc] = useState(defaultLoc);
  const [positionLoc, setPositionLoc] = useState(defaultLoc);
  const debouncedPositionLoc = useDebounce(positionLoc, 500);
  const [setting, setSetting] = useLocalStorage(
    'collector-setting',
    defaultSetting
  );

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

  const getRegions = useCallback(async () => {
    const priority = _.get(setting, 'priority');
    const { data } = await Client.get('/regions', { params: { priority } });
    setRegions(data.regions);
  }, [setting]);

  const getCenter = () => {
    switch (mode) {
      case 'current':
        return currentLoc;
      default:
      case 'static':
        return positionLoc;
    }
  };

  const selectKickboardByCode = useCallback(
    async (kickboardCode) => {
      if (!kickboardCode) return;
      const { data } = await Client.get(`/kickboards/${kickboardCode}`);
      mergeKickboards([data.kickboard]);
      onSelectedKickboard(data.kickboard);
    },
    [mergeKickboards]
  );

  useEffect(() => getKickboards(), [getKickboards]);
  useEffect(() => getRegions(), [getRegions]);
  useEffect(
    () => selectKickboardByCode(kickboardCode),
    [kickboardCode, selectKickboardByCode]
  );

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
        setting={setting}
        setSetting={setSetting}
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
