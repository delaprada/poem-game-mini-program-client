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

const getPersonalInfo = () => {
  return HTTPREQUEST.get('/personal');
};

const getSentence = () => {
  return HTTPREQUEST.get('/sentence');
};

const postUserInfo = (userInfo) => {
  return HTTPREQUEST.post(
    '/postInfo',
    {
      userInfo: userInfo,
    },
    'application/json'
  );
};

export {
  getResData,
  getToken,
  getRequest,
  getPersonalInfo,
  getSentence,
  postUserInfo,
};
