import { useEffect, useState } from 'react';
import QrReader from 'react-qr-reader';
import { Client, DepthPage, PageHeader, useQuery } from '../..';
import styled from 'styled-components';
import { Toast } from 'antd-mobile';
import { withRouter } from 'react-router';

const MessageContainer = styled.div`
  background-color: #eee;
  border-radius: 4px;
  margin: 10px 0;
  padding: 10px;
`;

export const AuthPrelogin = withRouter(({ history }) => {
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
        <PageHeader>QR코드로 로그인</PageHeader>
        <MessageContainer>
          화면에 나와있는 QR 코드를 스캔하여 더욱 간편하게 로그인하세요.
        </MessageContainer>
        <QrReader
          delay={300}
          onError={onError}
          onScan={onScan}
          style={{ width: '100%' }}
        />
      </div>
    </DepthPage>
  );
});
