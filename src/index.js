import React from 'react';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { Reset } from 'styled-reset';
import { AuthLogout, AuthPrelogin, Kickboards, RequiredAuth } from '.';

export * from './components';
export * from './pages';
export * from './tools';

export const baseURL =
  window.location.host === 'collector.hikick.kr'
    ? 'https://openapi.hikick.kr/v1/collector'
    : 'https://openapi.staging.hikick.kr/v1/collector';

const GlobalStyle = styled.div`
  * {
    user-select: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    -webkit-touch-callout: none;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <Reset />
    <GlobalStyle>
      <BrowserRouter>
        <Switch>
          <Route path="/auth/prelogin">
            <AuthPrelogin />
          </Route>
          <RequiredAuth>
            <Route path="/">
              <Kickboards />
            </Route>
            <Route path="/auth/logout">
              <AuthLogout />
            </Route>
          </RequiredAuth>
        </Switch>
      </BrowserRouter>
    </GlobalStyle>
  </React.StrictMode>,
  document.getElementById('root')
);
