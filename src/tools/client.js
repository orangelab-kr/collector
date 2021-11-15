import { Toast } from 'antd-mobile';
import axios from 'axios';
import { baseURL } from '..';

export const Client = axios.create();
export class ToastError extends Error {
  name = 'ToastError';

  constructor(content) {
    super();
    Toast.show({ icon: 'fail', content });
  }
}

Client.interceptors.request.use(getInterceptorRequest.bind(this));
Client.interceptors.response.use(
  getInterceptorResponse.bind(this),
  getInterceptorResponseError.bind(this)
);

function getInterceptorRequest(config) {
  const accessKey = getAccessKey();
  config.baseURL = `${baseURL}`;
  config.headers = { authorization: accessKey };

  return config;
}

function getInterceptorResponse(res) {
  if (!res) throw new ToastError('서버와 연결할 수 없습니다.');

  const { data } = res;
  if (data.opcode !== 0) throw new ToastError(data.message);
  return res;
}

function getInterceptorResponseError(err) {
  if (!err.response) throw new ToastError('서버와 연결할 수 없습니다.');

  const { data } = err.response;
  if (data.opcode === 0) return err;
  throw new ToastError(data.message);
}

export function getAccessKey() {
  const sessionId = localStorage.getItem('collector-session-id');
  if (!sessionId) return;
  return `Bearer ${sessionId}`;
}
