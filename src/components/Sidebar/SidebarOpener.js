import { UnorderedListOutline } from 'antd-mobile-icons';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  margin: 20px 0 0 20px;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

export const SidebarOpener = ({ setSidebar }) => (
  <Container>
    <UnorderedListOutline fontSize={25} onClick={() => setSidebar(true)} />
  </Container>
);
