import { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { Client, FullScreenLoading } from '..';

export const RequiredAuth = withRouter(({ children, history }) => {
  const [loading, setLoading] = useState(true);
  const loadUser = useCallback(async () => {
    try {
      await Client.get('/auth');
      setLoading(false);
    } catch (err) {
      history.push('/auth/prelogin');
    }
  }, [history]);

  useEffect(() => loadUser(), [loadUser, setLoading]);
  return <FullScreenLoading loading={loading}>{children}</FullScreenLoading>;
});
