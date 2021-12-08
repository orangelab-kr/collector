import { Steps } from 'antd-mobile';

export const IoTSteps = ({ step }) => (
  <Steps current={step}>
    <Steps.Step title="킥보드" description="조회" />
    <Steps.Step title="프렌차이즈" description="선택" />
    <Steps.Step title="지역" description="선택" />
  </Steps>
);
