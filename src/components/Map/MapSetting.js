import { Button, Checkbox, Dialog, Form, Space } from 'antd-mobile';
import { SetOutline } from 'antd-mobile-icons';

export const MapSetting = ({ setting, setSetting }) => {
  const SettingInput = ({ onForm }) => {
    const [form] = Form.useForm();
    onForm(form);

    return (
      <Form initialValues={setting} form={form}>
        <Form.Item label="구역 표시" name="priority">
          <Checkbox.Group>
            <Space direction="vertical">
              <Checkbox value={0}>미운영</Checkbox>
              <Checkbox value={1}>운영</Checkbox>
              <Checkbox value={2}>아파트, 공원</Checkbox>
              <Checkbox value={3}>어린이보호구역</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    );
  };

  const onClick = async () => {
    let form;
    const onForm = (f) => (form = f);
    await Dialog.alert({
      title: '설정',
      content: <SettingInput onForm={onForm} />,
      confirmText: '완료',
    });

    setSetting(form.getFieldsValue());
  };

  return (
    <Button
      size="large"
      color="success"
      onClick={onClick}
      style={{
        position: 'absolute',
        top: -120,
        right: 5,
        borderRadius: 100,
        padding: '12px 15px',
      }}
    >
      <SetOutline />
    </Button>
  );
};
