// 接口请求定义
import HTTPREQUEST from './http';

const getResData = () => {
  return HTTPREQUEST.get('/');
};

const getSkey = (code) => {
  return HTTPREQUEST.post(
    '/login',
    {
      code: code,
    },
    'application/json'
  );
};

export { getResData, getSkey };
