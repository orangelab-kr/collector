import { BottomSheet } from 'react-spring-bottom-sheet';
import styled from 'styled-components';
import {
  MapBottomSelected,
  MapKickboardInput,
  MapLocationButton,
  MapSetting,
} from '.';

const Header = styled.div`
  margin: 15px 0 10px 10px;
  text-align: left;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: 700;
`;

export const MapBottom = ({
  kickboard,
  mode,
  setMode,
  selectKickboardByCode,
  getKickboards,
  setting,
  setSetting,
}) => {
  const onSnapPoints = ({ maxHeight }) => {
    const points = [70];
    if (kickboard) {
      points.push(270);
      points.push(460);
      points.push(580);
      points.push(maxHeight * 0.92);
    }

    return points;
  };

  return (
    <BottomSheet
      open
      blocking={false}
      skipInitialTransition
      expandOnContentDrag
      snapPoints={onSnapPoints}
      header={
        <Header>
          <MapSetting setting={setting} setSetting={setSetting} />
          <MapKickboardInput selectKickboardByCode={selectKickboardByCode} />
          <MapLocationButton mode={mode} onModeChange={setMode} />
          <Title>
            {!kickboard
              ? '킥보드를 선택하세요.'
              : `${kickboard.kickboardCode} 선택됨 (🛴 ${kickboard.status.power.scooter.battery}%,  📟 ${kickboard.status.power.iot.battery}%)`}
          </Title>
        </Header>
      }
    >
      <MapBottomSelected
        kickboard={kickboard}
        refreshKickboards={getKickboards}
      />
    </BottomSheet>
  );
};
