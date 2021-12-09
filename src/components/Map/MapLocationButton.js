import { Button } from 'antd-mobile';
import { EnvironmentOutline, TravelOutline } from 'antd-mobile-icons';

export const MapLocationButton = (props) => {
  // static, current
  const { mode, onModeChange } = {
    mode: 'static',
    onModeChange: () => {},
    ...props,
  };

  const switchMode = () => {
    onModeChange(getNextMode());
  };

  const getNextMode = () => {
    switch (mode) {
      default:
      case 'static':
        return 'current';
      case 'current':
        return 'static';
    }
  };

  const getColor = () => {
    switch (mode) {
      default:
      case 'static':
        return 'default';
      case 'current':
        return 'primary';
    }
  };

  const getIcon = () => {
    switch (mode) {
      default:
      case 'static':
        return <EnvironmentOutline />;
      case 'current':
        return <TravelOutline />;
    }
  };

  return (
    <Button
      size="large"
      color={getColor()}
      onClick={switchMode}
      style={{
        position: 'absolute',
        top: -60,
        right: 5,
        borderRadius: '30%',
        padding: '12px 15px',
      }}
    >
      {getIcon()}
    </Button>
  );
};
