import { Button, Dialog, Input } from 'antd-mobile';
import { SearchOutline } from 'antd-mobile-icons';
import { useEffect, useState } from 'react';

export const MapKickboardInput = ({ selectKickboardByCode }) => {
  const [kickboardCode, setKickboardCode] = useState('');
  const [requestSearch, setRequestSearch] = useState(false);

  const KickboardCodeInput = ({ setKickboardCode }) => {
    const [viewKickboardCode, setViewKickboardCode] = useState('');
    const onChange = (kickboardCode) => {
      setKickboardCode(kickboardCode);
      setViewKickboardCode(kickboardCode);
    };

    return (
      <Input
        placeholder="ex. DE20KP"
        value={viewKickboardCode}
        onChange={onChange}
        clearable
      />
    );
  };

  const onClick = async () => {
    const search = await Dialog.confirm({
      title: '킥보드 코드를 입력해주세요.',
      content: <KickboardCodeInput setKickboardCode={setKickboardCode} />,
      confirmText: '찾기',
      cancelText: '취소',
    });

    if (!search) return;
    setRequestSearch(true);
  };

  useEffect(() => {
    if (!requestSearch || kickboardCode.length !== 6) return;
    selectKickboardByCode(kickboardCode);
    setRequestSearch(false);
  }, [requestSearch, kickboardCode, selectKickboardByCode]);

  return (
    <Button
      size="large"
      color="primary"
      onClick={onClick}
      style={{
        position: 'absolute',
        top: -60,
        left: 5,
        borderRadius: 100,
        padding: '12px 15px',
      }}
    >
      <SearchOutline />
    </Button>
  );
};
