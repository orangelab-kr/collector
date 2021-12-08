import { CheckList } from 'antd-mobile';
import styled from 'styled-components';

const Container = styled.div`
  margin: 8px 0px;
`;

const Name = styled.p`
  font-size: 20px;
`;

const Description = styled.p`
  font-size: 14px;
  font-weight: 300;
  color: #303030;
  margin-top: 3px;
`;

export const IoTSelectItem = ({ value, name, description }) => (
  <CheckList.Item value={value}>
    <Container>
      <Name>{name}</Name>
      <Description>{description}</Description>
    </Container>
  </CheckList.Item>
);
