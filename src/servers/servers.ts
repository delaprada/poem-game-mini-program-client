// 接口请求定义
import HTTPREQUEST from './http';

const getResData = () => {
  return HTTPREQUEST.get('/');
};

const getToken = (code, userInfo) => {
  return HTTPREQUEST.post(
    '/login',
    {
      code: code,
      userInfo: userInfo,
    },
    'application/json'
  );
};

const getRequest = () => {
  return HTTPREQUEST.get('/request');
};

export { getResData, getToken, getRequest };
