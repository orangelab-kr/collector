import { UnorderedListOutline } from 'antd-mobile-icons';
import styled from 'styled-components';

const Container = styled.p`
  padding: 8px;
  position: fixed;
  margin: 20px 0 0 20px;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: #fff;
  border-radius: 30%;
`;

export const SidebarOpener = ({ setSidebar }) => (
  <Container>
    <UnorderedListOutline fontSize={25} onClick={() => setSidebar(true)} />
  </Container>
);
