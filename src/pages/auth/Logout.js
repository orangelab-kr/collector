import { Redirect } from 'react-router';

export const AuthLogout = () => {
  localStorage.removeItem('collector-session-id');
  return <Redirect to="/auth/login" />;
};
