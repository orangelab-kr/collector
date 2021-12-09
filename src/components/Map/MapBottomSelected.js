import { Button, Dialog, Loading, Switch } from 'antd-mobile';
import {
  ArrowDownCircleOutline,
  BellMuteOutline,
  BellOutline,
  ExclamationOutline,
  EyeInvisibleOutline,
  EyeOutline,
  LockOutline,
  MailOpenOutline,
  MailOutline,
  UndoOutline,
  UnlockOutline,
  UploadOutline,
} from 'antd-mobile-icons';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Client } from '../..';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 4px;
`;

const ControlContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: solid 1px #eee;
  border-radius: 10px;
  margin: 10px 12px;
  padding: 12px;
  background-color: #eee;
`;

const ControlStyledButton = styled(Button)`
  width: 48%;
  height: ${({ small }) => (small ? 4 : 8)}em;
  border-radius: 10px;

  .antd-mobile-icon {
    font-size: ${({ small }) => (small ? 20 : 40)}px;
  }
`;

const ControlButton = ({ children, loading, icon, small, onClick }) => (
  <ControlStyledButton size="large" small={small} onClick={onClick}>
    {loading ? <Loading color="default" /> : icon}
    {small ? ' ' : ''}
    <div
      style={{
        display: small ? 'contents' : 'block',
        marginTop: 10,
      }}
    >
      {children}
    </div>
  </ControlStyledButton>
);

export const MapBottomSelected = ({ kickboard, refreshKickboards }) => {
  const [loading, setLoading] = useState({});
  const [kickboardCode, setKickboardCode] = useState();
  const [alarm, setAlarm] = useState(false);
  const onClick =
    (path, refresh = false, confirm = false) =>
    async () => {
      try {
        if (confirm) {
          const confirmDialog = await Dialog.confirm({
            content: '정말로 진행하시겠습니까?',
            confirmText: '네',
            cancelText: '아니요',
          });

          if (!confirmDialog) return;
        }

        if (window.navigator.vibrate) window.navigator.vibrate(100);
        setLoading((loading) => ({ ...loading, [path]: true }));
        await Client.get(`/kickboards/${kickboard.kickboardCode}${path}`);
        if (refresh) await refreshKickboards();
      } finally {
        setLoading((loading) => ({ ...loading, [path]: false }));
      }
    };

  const onAlarmClick = async () => {
    try {
      if (window.navigator.vibrate) window.navigator.vibrate(100);
      setLoading((loading) => ({ ...loading, '/alarm': true }));

      if (alarm) {
        await Client.get(`/kickboards/${kickboard.kickboardCode}/alarm/off`);
        await Client.get(`/kickboards/${kickboard.kickboardCode}/stop`);
        setAlarm(false);
      } else {
        await Client.get(`/kickboards/${kickboard.kickboardCode}/start`);
        await Client.get(`/kickboards/${kickboard.kickboardCode}/alarm/on`);
        setAlarm(true);
      }
    } finally {
      setLoading((loading) => ({ ...loading, '/alarm': false }));
    }
  };

  const onBrokenChange = async (checked) => {
    try {
      const mode = checked ? 2 : 0;
      setLoading((loading) => ({ ...loading, '/broken': true }));
      await Client.post(`/kickboards/${kickboard.kickboardCode}`, { mode });
      await refreshKickboards();
    } finally {
      setLoading((loading) => ({ ...loading, '/broken': false }));
    }
  };

  useEffect(() => {
    if (!kickboard || kickboard.kickboardCode === kickboardCode) return;
    setKickboardCode(kickboard.kickboardCode);
    setLoading({});
  }, [kickboard, kickboardCode]);

  return (
    <MainContainer>
      <ControlContainer>
        <ControlButton
          loading={loading['/start']}
          onClick={onClick('/start', false)}
          icon={<UnlockOutline />}
        >
          시작
        </ControlButton>
        <ControlButton
          loading={loading['/stop']}
          onClick={onClick('/stop', false)}
          icon={<LockOutline />}
        >
          종료
        </ControlButton>
      </ControlContainer>
      <ControlContainer>
        <ControlButton
          loading={loading['/collect']}
          onClick={onClick('/collect', true)}
          icon={<ArrowDownCircleOutline />}
        >
          수거
        </ControlButton>
        <ControlButton
          loading={loading['/eruption']}
          onClick={onClick('/eruption', true)}
          icon={<UploadOutline />}
        >
          분출
        </ControlButton>
      </ControlContainer>
      <ControlContainer>
        <ControlButton
          loading={loading['/battery/unlock']}
          onClick={onClick('/battery/unlock', false)}
          icon={<MailOpenOutline />}
          small
        >
          배터리 열기
        </ControlButton>
        <ControlButton
          loading={loading['/battery/lock']}
          onClick={onClick('/battery/lock', false)}
          icon={<MailOutline />}
          small
        >
          배터리 닫기
        </ControlButton>
      </ControlContainer>
      <ControlContainer>
        <ControlButton
          loading={loading['/lights/on']}
          onClick={onClick('/lights/on', false)}
          icon={<EyeOutline />}
          small
        >
          불 켜기
        </ControlButton>
        <ControlButton
          loading={loading['/lights/off']}
          onClick={onClick('/lights/off', false)}
          icon={<EyeInvisibleOutline />}
          small
        >
          불 끄기
        </ControlButton>
      </ControlContainer>
      <ControlContainer>
        <ControlButton
          loading={loading['/buzzer/on']}
          onClick={onClick('/buzzer/on', false)}
          icon={<BellOutline />}
          small
        >
          소리 켜기
        </ControlButton>
        <ControlButton
          loading={loading['/buzzer/off']}
          onClick={onClick('/buzzer/off', false)}
          icon={<BellMuteOutline />}
          small
        >
          소리 끄기
        </ControlButton>
      </ControlContainer>
      <ControlContainer>
        <ControlButton
          loading={loading['/reboot']}
          onClick={onClick('/reboot', false, true)}
          icon={<UndoOutline />}
          small
        >
          재부팅
        </ControlButton>
        <ControlButton
          icon={<ExclamationOutline />}
          onClick={onAlarmClick}
          small
        >
          {loading['/alarm'] ? '멈춤' : '찾기'}
        </ControlButton>
      </ControlContainer>
      <ControlContainer>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Switch
            checked={kickboard && kickboard.mode === 2}
            onChange={onBrokenChange}
            loading={loading['/broken']}
          />
          <p style={{ marginLeft: 10 }}>고장 처리</p>
        </div>
      </ControlContainer>
    </MainContainer>
  );
};
