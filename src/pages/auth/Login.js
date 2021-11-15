import { Button, Input, Tabs, Toast } from 'antd-mobile';
import { List } from 'antd-mobile/es/components/list/list';
import { useEffect, useState } from 'react';
import QrReader from 'react-qr-reader';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import { Client, DepthPage, PageHeader, useQuery } from '../..';

const MessageContainer = styled.div`
  background-color: #eee;
  border-radius: 4px;
  margin: 10px 0;
  padding: 10px;
`;

export const AuthLogin = withRouter(({ history }) => {
  const [preloginId, setPreloginId] = useState(useQuery().preloginId);
  const onError = () => {
    Toast.show({
      icon: 'fail',
      content: '카메라를 실행할 수 없습니다.',
    });
  };

  const onScan = (value) => {
    const startsWith = `${window.location.origin}/auth/prelogin?preloginId=`;
    if (!value || !value.startsWith(startsWith)) return;
    const newPreloginId = value.replace(startsWith, '');
    if (newPreloginId === preloginId) return;
    setPreloginId(newPreloginId);
  };

  useEffect(() => {
    if (!preloginId) return;
    Client.get('/auth/prelogin', { params: { preloginId } }).then((res) => {
      Toast.show({ icon: 'success', content: '로그인하였습니다.' });
      localStorage.setItem('collector-session-id', res.data.sessionId);
      history.push('/');
    });
  }, [history, preloginId]);

  return (
    <DepthPage>
      <div style={{ marginLeft: 28, marginRight: 28 }}>
        <PageHeader>로그인</PageHeader>
        <Tabs>
          <Tabs.TabPane title="카메라" key="camera">
            <MessageContainer>
              화면에 나와있는 QR 코드를 스캔하여 더욱 간편하게 로그인하세요.
            </MessageContainer>
            <QrReader
              delay={300}
              onError={onError}
              onScan={onScan}
              style={{ width: '100%' }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane title="전화번호" key="phone">
            <List.Item title="전화번호" extra={<a>문자 발송</a>}>
              <Input placeholder="010-0000-0000" clearable />
            </List.Item>
            <List.Item title="인증번호">
              <Input placeholder="000000" clearable />
            </List.Item>
            <Button color="primary" block={true}>
              로그인
            </Button>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </DepthPage>
  );
});
