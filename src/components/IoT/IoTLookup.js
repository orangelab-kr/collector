import { Button, Form, Input, Toast } from 'antd-mobile';
import { SearchOutline } from 'antd-mobile-icons';
import { QrReader } from 'react-qr-reader';

export const IoTLookup = ({ onScan }) => {
  const onError = () => Toast.show({ content: '카메라를 실행할 수 없습니다.' });

  return (
    <>
      <QrReader
        delay={300}
        onError={onError}
        onScan={onScan}
        style={{ width: '100%', marginTop: 20 }}
      />
      <Form onFinish={({ kickboardCode }) => onScan(kickboardCode)}>
        <Form.Item
          label='킥보드 코드'
          name='kickboardCode'
          extra={
            <Button color='primary' style={{ marginTop: 8 }} type='submit'>
              <SearchOutline /> 입력
            </Button>
          }
        >
          <Input placeholder='킥보드 코드를 입력하세요.' />
        </Form.Item>
      </Form>
    </>
  );
};
