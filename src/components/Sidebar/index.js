import { Popup } from 'antd-mobile';
import { RightOutline, SystemQRcodeOutline } from 'antd-mobile-icons';
import { SidebarPrimaryButton, SidebarProfile } from '.';

export * from './SidebarOpener';
export * from './SidebarPrimary';
export * from './SidebarProfile';

export const Sidebar = ({ sidebar, setSidebar }) => (
  <Popup
    visible={sidebar}
    onMaskClick={() => setSidebar(false)}
    position="left"
    bodyStyle={{
      minWidth: '60vw',
      padding: '50px 0 0 30px',
    }}
  >
    <SidebarProfile user={{ realname: '엄다니엘' }} />
    <SidebarPrimaryButton
      name="QR코드"
      icon={<SystemQRcodeOutline />}
      href="/qrcode"
    />
    <SidebarPrimaryButton
      name="로그아웃"
      icon={<RightOutline />}
      href="/auth/logout"
    />
  </Popup>
);
