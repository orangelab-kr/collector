import { LeftOutline } from 'antd-mobile-icons';
import { withRouter } from 'react-router';

export const DepthPage = withRouter(({ children, history }) => {
  const onClick = () => history.goBack();

  return (
    <>
      <div
        onClick={onClick}
        style={{
          backgroundColor: 'white',
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 30,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <LeftOutline />
      </div>
      <div style={{ marginTop: 65 }}>{children}</div>
    </>
  );
});
