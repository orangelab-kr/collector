import { Button, Form, Toast } from 'antd-mobile';
import { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import 'react-spring-bottom-sheet/dist/style.css';
import { Client, DepthPage, PageHeader, ToastError } from '..';
import {
  IoTLookup,
  IoTSelect,
  IoTSelectItem,
  IoTSteps,
} from '../components/IoT';

export const IoT = withRouter(({ history }) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [regions, setRegions] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [kickboard, setKickboard] = useState();

  const getKickboardCode = async (url) => {
    if (url.length === 6) return url;
    const { data } = await Client.get(`/kickboards/parse`, { params: { url } });
    return data.kickboardCode;
  };

  const getKickboard = async (kickboardCode) => {
    const { data } = await Client.get(`/kickboards/${kickboardCode}`);
    setKickboard(data.kickboard);
    return data.kickboard;
  };

  const getRegions = useCallback(async () => {
    const { data } = await Client.get('/regions');
    setRegions(data.regions);
  }, []);

  const getFranchises = useCallback(async () => {
    const { data } = await Client.get('/franchises');
    setFranchises(data.franchises);
  }, []);

  const onScan = async (value) => {
    if (isProcessing || !value) return;
    if (window.navigator.vibrate) window.navigator.vibrate(100);
    setIsProcessing(true);
    await getKickboardCode(value).then(getKickboard);
    setIsProcessing(false);
    setStep(1);
  };

  const onClick = async () => {
    const formValue = form.getFieldsValue();
    if (step === 1 && !formValue.franchiseId) {
      throw new ToastError('프렌차이즈를 반드시 선택해주세요.');
    }

    if (step === 2 && !formValue.regionId) {
      throw new ToastError('지역을 반드시 선택해주세요.');
    }

    if (step < 2) {
      return setStep((step) => step + 1);
    }

    setIsProcessing(true);
    await Client.post(`/kickboards/${kickboard.kickboardCode}`, formValue);
    Toast.show({ content: '적용되었습니다.' });
    setStep(0);
    setKickboard();
    setIsProcessing(false);
  };

  useEffect(() => getRegions(), [getRegions]);
  useEffect(() => getFranchises(), [getFranchises]);
  return (
    <DepthPage>
      <div style={{ marginLeft: 28, marginRight: 28, marginBottom: 50 }}>
        <PageHeader>IoT 교체</PageHeader>
        <IoTSteps step={step} />
        {step === 0 && <IoTLookup onScan={onScan} />}
        {step !== 0 && kickboard && (
          <Form
            form={form}
            initialValues={kickboard}
            style={{ marginTop: 20, border: 'none' }}
          >
            <Form.Item name='franchiseId' noStyle>
              {step === 1 && (
                <IoTSelect>
                  {franchises.map((franchise) => (
                    <IoTSelectItem
                      key={franchise.franchiseId}
                      name={franchise.name}
                      value={franchise.franchiseId}
                      description={franchise.franchiseId}
                    />
                  ))}
                </IoTSelect>
              )}
            </Form.Item>

            <Form.Item name='regionId' noStyle>
              {step === 2 && (
                <IoTSelect>
                  {regions.map((region) => (
                    <IoTSelectItem
                      key={region.regionId}
                      name={region.name}
                      value={region.regionId}
                      description={region.regionId}
                    />
                  ))}
                </IoTSelect>
              )}
            </Form.Item>

            <Button
              size='large'
              onClick={onClick}
              color='primary'
              block={true}
              loading={isProcessing}
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
              {step < 2 ? '다음' : '저장'}
            </Button>
          </Form>
        )}
      </div>
    </DepthPage>
  );
});
