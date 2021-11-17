import { Button, Form, Input, Tabs, Toast } from 'antd-mobile';
import { MessageOutline, RedoOutline } from 'antd-mobile-icons';
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
  const [form] = Form.useForm();
  const [requested, setRequested] = useState(false);
  const [preloginId, setPreloginId] = useState(useQuery().preloginId);
  const onError = () => {
    Toast.show({
      icon: 'fail',
      content: '카메라를 실행할 수 없습니다.',
    });
  };

  const onScan = (value) => {
    const startsWith = `${window.location.origin}/auth/login?preloginId=`;
    if (!value || !value.startsWith(startsWith)) return;
    const newPreloginId = value.replace(startsWith, '');
    if (newPreloginId === preloginId) return;
    setPreloginId(newPreloginId);
  };

  const sendVerify = async () => {
    setRequested(true);
    const phoneNo = form.getFieldValue('phoneNo');
    await Client.get('/auth/phone', { params: { phoneNo } });
    Toast.show('문자를 발송하였습니다.');
  };

  const onVerifyPhone = async () => {
    const phoneNo = form.getFieldValue('phoneNo');
    const code = form.getFieldValue('code');
    if (!phoneNo || code.length !== 6) return;
    const { data } = await Client.post('/auth/phone', { phoneNo, code });

    const { phoneId } = data;
    form.setFieldsValue({ phoneId });
  };

  useEffect(() => {
    if (!preloginId) return;
    Client.get('/auth/prelogin', { params: { preloginId } }).then((res) => {
      Toast.show({ icon: 'success', content: '로그인하였습니다.' });
      localStorage.setItem('collector-session-id', res.data.sessionId);
      history.push('/');
    });
  }, [history, preloginId]);

  const SendVerify = (
    <Button size="mini" color="primary" onClick={sendVerify}>
      {requested ? <RedoOutline /> : <MessageOutline />}{' '}
      {requested ? '재전송' : '문자 발송'}
    </Button>
  );

  const onPhoneNoChange = (phoneNo) => {
    phoneNo = phoneNo
      .replace(/[^0-9]/, '')
      .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    form.setFieldsValue({ phoneNo });
  };

  const loginWithPhone = async () => {
    const phoneId = form.getFieldValue('phoneId');
    const { data } = await Client.get('/auth/login', { params: { phoneId } });
    Toast.show({ icon: 'success', content: '로그인하였습니다.' });
    localStorage.setItem('collector-session-id', data.sessionId);
    history.push('/');
  };

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
            <Form form={form} onFinish={loginWithPhone}>
              <Form.Item name="phoneNo" extra={SendVerify}>
                <Input
                  placeholder="전화번호"
                  onChange={onPhoneNoChange}
                  clearable
                />
              </Form.Item>
              <Form.Item name="code">
                <Input
                  type="text"
                  pattern="[0-9]*"
                  placeholder="인증번호"
                  onChange={onVerifyPhone}
                  clearable
                />
              </Form.Item>
              <Form.Item name="phoneId" />
              <Button color="primary" type="submit" block={true}>
                로그인
              </Button>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </DepthPage>
  );
});
