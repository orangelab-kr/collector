import { Button } from 'antd-mobile';
import { UndoOutline } from 'antd-mobile-icons';

export const MapKickboardRefresh = ({ onRefresh }) => (
  <Button
    size="large"
    onClick={onRefresh}
    style={{
      position: 'absolute',
      top: -60,
      left: 5,
      borderRadius: '30%',
      padding: '12px 15px',
    }}
  >
    <UndoOutline />
  </Button>
);
