import { UnorderedListOutline } from 'antd-mobile-icons';
import styled from 'styled-components';

const Container = styled.p`
  padding: 8px;
  position: sticky;
  margin: 20px 0 0 20px;
  top: calc(max(15px, env(safe-area-inset-top)) - 15px);
  left: 0;
  background-color: #fff;
  border-radius: 30%;
`;

export const SidebarOpener = ({ setSidebar }) => (
  <Container>
    <UnorderedListOutline fontSize={25} onClick={() => setSidebar(true)} />
  </Container>
);
