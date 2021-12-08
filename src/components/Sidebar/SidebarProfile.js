import styled from 'styled-components';

const NameContainer = styled.p`
  margin: 20px 0 50px;
  font-size: 25px;
  font-weight: 600;
`;

export const SidebarProfile = ({ user }) => {
  return <NameContainer>{user && user.username}</NameContainer>;
};
 