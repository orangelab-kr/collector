import { Button, Toast } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { Tabs } from 'antd-mobile/es/components/tabs/tabs';
import { useState } from 'react';
import QrReader from 'react-qr-reader';
import 'react-spring-bottom-sheet/dist/style.css';
import { Client, DepthPage, PageHeader } from '..';

export const Qrcode = () => {
  const [mode, setMode] = useState('battery');
  const [isProcessing, setIsProcessing] = useState(false);
  const [kickboardCode, setKickboardCode] = useState();

  const onError = () => Toast.show({ content: '카메라를 실행할 수 없습니다.' });
  const getKickboardCode = async (url) => {
    const { data } = await Client.get(`/kickboards/parse`, { params: { url } });
    setKickboardCode(data.kickboardCode);
    return data.kickboardCode;
  };

  const actionKickboard = async (kickboardCode, action) => {
    await Client.get(`/kickboards/${kickboardCode}${action}`);
  };

  const onScan = async (value) => {
    if (isProcessing || !value) return;
    if (window.navigator.vibrate) window.navigator.vibrate(100);
    setIsProcessing(true);
    const kickboardCode = await getKickboardCode(value);
    if (mode === 'battery') {
      await actionKickboard(kickboardCode, '/battery/unlock');
      setIsProcessing(false);
      return Toast.show({
        content: '배터리 잠금이 해제되었습니다.',
        position: 'bottom',
      });
    }

    if (mode === 'collect') {
      await actionKickboard(kickboardCode, '/collect');
      setIsProcessing(false);
      setKickboardCode(null);
      return Toast.show({
        content: '수거되었습니다.',
        position: 'bottom',
      });
    }

    if (mode === 'eruption') {
      await actionKickboard(kickboardCode, '/eruption');
      setIsProcessing(false);
      setKickboardCode(null);
      return Toast.show({
        content: '분출되었습니다.',
        position: 'bottom',
      });
    }
  };

  const onClick = async () => {
    if (mode !== 'battery' || isProcessing || !kickboardCode) return;
    if (window.navigator.vibrate) window.navigator.vibrate(100);
    setIsProcessing(true);
    await actionKickboard(kickboardCode, '/battery/lock');
    setIsProcessing(false);
    setKickboardCode(null);
    Toast.show({
      content: '배터리 교체가 완료되었습니다.',
      position: 'bottom',
    });
  };

  return (
    <DepthPage>
      <div style={{ marginLeft: 28, marginRight: 28, marginBottom: 50 }}>
        <PageHeader>QR코드</PageHeader>
        <Tabs activeKey={mode} onChange={setMode}>
          <Tabs.TabPane
            title="배터리 교체"
            key="battery"
            disabled={kickboardCode}
          />
          <Tabs.TabPane
            title="킥보드 수거"
            key="collect"
            disabled={kickboardCode}
          />
          <Tabs.TabPane
            title="킥보드 분출"
            key="eruption"
            disabled={kickboardCode}
          />
        </Tabs>
        <QrReader
          delay={300}
          onError={onError}
          onScan={onScan}
          style={{ width: '100%', marginTop: 20 }}
        />
        {mode === 'battery' && (
          <Button
            size="large"
            onClick={onClick}
            color="primary"
            block={true}
            icon={<RightOutline />}
            loading={isProcessing && kickboardCode}
            style={{
              position: 'fixed',
              margin: '0 auto',
              bottom: 15,
              left: 0,
              right: 0,
              width: '90%',
              height: 50,
              borderRadius: 15,
            }}
          >
            {isProcessing && kickboardCode
              ? '데이터를 받아오는 중입니다.'
              : !isProcessing && kickboardCode
              ? '다음'
              : '먼저, 킥보드 QR코드를 촬영하세요.'}
          </Button>
        )}
      </div>
    </DepthPage>
  );
};
