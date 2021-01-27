// 接口请求定义
import HTTPREQUEST from './http';

const getResData = () => {
  return HTTPREQUEST.get('/');
};

const getToken = (code) => {
  return HTTPREQUEST.post(
    '/login',
    {
      code: code,
    },
    'application/json'
  );
};

const getRequest = () => {
  return HTTPREQUEST.get('/request');
};

const postUserInfo = (userInfo) => {
  return HTTPREQUEST.post(
    '/userInfo',
    {
      userInfo: userInfo,
    },
    'application/json'
  );
};

export { getResData, getToken, getRequest, postUserInfo };
