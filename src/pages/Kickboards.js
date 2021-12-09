import { useCallback, useEffect, useMemo, useState } from 'react';
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
  useLocalStorage,
} from '..';

export const Kickboards = () => {
  const defaultLoc = { lat: 37.50526, lng: 127.054806 };
  const defaultSetting = {
    priority: [0, 1, 2, 3],
    batteryRange: [0, 100],
    statusFilter: ['normal', 'riding', 'broken', 'collected', 'collect_target'],
  };

  const [user, setUser] = useState();
  const [zoom, setZoom] = useState(16);
  const [mode, setMode] = useState('static');
  const [kickboard, setKickboard] = useState();
  const [kickboards, setKickboards] = useState([]);
  const [regions, setRegions] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const [kickboardCode] = useQueryParam('kickboardCode', StringParam);
  const [currentLoc, setCurrentLoc] = useState(defaultLoc);
  const [positionLoc, setPositionLoc] = useState(defaultLoc);
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

    setMode('static');
    setPositionLoc({ lat, lng });
    setKickboard(kickboard);
  };

  const getCurrentStatus = (kickboard) => {
    if (kickboard.mode === 1) return 'riding';
    if (kickboard.mode === 2) return 'broken';
    if (kickboard.mode === 3) return 'collected';
    if (kickboard.collect) return 'collect_target';
    return 'normal';
  };

  const filteredKickboards = useMemo(
    () =>
      kickboards.filter((kickboard) => {
        if (
          !setting.batteryRange ||
          kickboard.status.power.scooter.battery < setting.batteryRange[0] ||
          kickboard.status.power.scooter.battery > setting.batteryRange[1]
        ) {
          return false;
        }

        if (
          setting.statusFilter &&
          !setting.statusFilter.includes(getCurrentStatus(kickboard))
        ) {
          return false;
        }

        return true;
      }),
    [kickboards, setting.batteryRange, setting.statusFilter]
  );

  const mergeKickboards = useCallback(
    (newKickboards) =>
      setKickboards((kickboards) => {
        const updatedKickboards = [...kickboards];
        newKickboards.forEach((newKickboard) => {
          if (
            !newKickboard.status ||
            !newKickboard.status.power ||
            !newKickboard.status.gps
          ) {
            return;
          }

          const index = updatedKickboards.findIndex(
            (k) => k.kickboardId === newKickboard.kickboardId
          );

          if (index !== -1) updatedKickboards.splice(index, 1);
          updatedKickboards.push(newKickboard);

          setKickboard((k) => {
            if (!k || k.kickboardId !== newKickboard.kickboardId) return k;
            return newKickboard;
          });
        });

        return updatedKickboards;
      }),
    []
  );

  const getKickboards = useCallback(async () => {
    const take = 100;
    let skip = 0;
    while (true) {
      const params = { take, skip, status: true };
      const { data } = await Client.get('/kickboards', { params });
      if (data.kickboards.length <= 0) break;
      mergeKickboards(data.kickboards);
      skip += take;
    }
  }, [mergeKickboards]);

  const getUser = useCallback(
    () => Client.get('/auth').then((res) => setUser(res.data.user)),
    []
  );

  const getRegions = useCallback(async () => {
    const { data } = await Client.get('/regions/all');
    setRegions(data.regions);
  }, []);

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
  useEffect(() => getUser(), [getUser]);
  useEffect(
    () => selectKickboardByCode(kickboardCode),
    [kickboardCode, selectKickboardByCode]
  );

  return (
    <>
      <SidebarOpener setSidebar={setSidebar} />
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} user={user} />
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

          {filteredKickboards.map((kickboard) => (
            <MapKickboard
              key={kickboard._id}
              kickboard={kickboard}
              setSelectedKickboard={onSelectedKickboard}
            />
          ))}

          {regions.map((region) => (
            <MapRegion
              key={region.regionId}
              region={region}
              priority={setting.priority}
            />
          ))}
        </NaverMap>
      </RenderAfterNavermapsLoaded>
    </>
  );
};
