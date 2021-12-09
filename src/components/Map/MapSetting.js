import { Button, Checkbox, Dialog, Form, Slider, Space } from 'antd-mobile';
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
        <Form.Item label="상태 필터" name="statusFilter">
          <Checkbox.Group>
            <Space direction="vertical">
              <Checkbox value="normal">정상</Checkbox>
              <Checkbox value="riding">이용 중</Checkbox>
              <Checkbox value="broken">고장</Checkbox>
              <Checkbox value="collect_target">수거 대상</Checkbox>
              <Checkbox value="collected">미분출</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="배터리 필터링" name="batteryRange">
          <Slider
            range
            ticks
            min={0}
            max={100}
            step={10}
            marks={{
              0: 0,
              10: 10,
              20: 20,
              30: 30,
              40: 40,
              50: 50,
              60: 60,
              70: 70,
              80: 80,
              90: 90,
              100: 100,
            }}
          />
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
        borderRadius: '30%',
        padding: '12px 15px',
      }}
    >
      <SetOutline />
    </Button>
  );
};
