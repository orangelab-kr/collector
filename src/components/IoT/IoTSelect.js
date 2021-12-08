import { CheckList } from 'antd-mobile';
import { CheckOutline } from 'antd-mobile-icons';

export const IoTSelect = ({ children, value, onChange }) => {
  const onInternalChange = (value) => onChange(value[0]);

  return (
    <CheckList
      activeIcon={<CheckOutline style={{ fontSize: 20 }} />}
      onChange={onInternalChange}
      value={[value]}
    >
      {children}
    </CheckList>
  );
};
