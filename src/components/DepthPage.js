import { LeftOutline } from 'antd-mobile-icons';
import { withRouter } from 'react-router';

export const DepthPage = withRouter(({ children, history }) => {
  const onClick = () => history.goBack();

  return (
    <div style={{ marginTop: 'env(safe-area-inset-top)' }}>
      <div
        onClick={onClick}
        style={{
          backgroundColor: 'white',
          marginTop: 'env(safe-area-inset-top)',
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
      <div style={{ marginTop: 'calc(env(safe-area-inset-top) + 65px)' }}>
        {children}
      </div>
    </div>
  );
});
