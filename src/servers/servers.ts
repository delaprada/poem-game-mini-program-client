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

const getPersonalList = (type) => {
  return HTTPREQUEST.get('/personal/list', {
    type: type,
  });
};

const getSentence = () => {
  return HTTPREQUEST.get('/sentence');
};

const getRecommend = () => {
  return HTTPREQUEST.get('/recommend');
};

const getPoemDetail = (id, category) => {
  return HTTPREQUEST.get('/poem', {
    id: id,
    category: category,
  });
};

const getAuthorDetail = (id, category) => {
  return HTTPREQUEST.get('/author', {
    id: id,
    category: category,
  });
};

const getDynamic = (composition_id, category) => {
  return HTTPREQUEST.get('/dynamic', {
    composition_id: composition_id,
    category: category,
  });
};

const getCompositionList = (author_id, category) => {
  return HTTPREQUEST.get('/author/list', {
    author_id: author_id,
    category: category,
  });
};

const getPoemList = (category) => {
  return HTTPREQUEST.get('/poemList', {
    category: category,
  });
};

const getSearchResult = (searchText) => {
  return HTTPREQUEST.get('/search', {
    searchText: searchText,
  });
};

const getAudio = (poem_id, category) => {
  return HTTPREQUEST.get('/audio', {
    poem_id: poem_id,
    category: category,
  });
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

const postLike = (composition_id, category, status) => {
  return HTTPREQUEST.post(
    '/like',
    {
      composition_id: composition_id,
      category: category,
      status: status,
    },
    'application/json'
  );
};

const postCollect = (composition_id, category, status) => {
  return HTTPREQUEST.post(
    '/collect',
    {
      composition_id: composition_id,
      category: category,
      status: status,
    },
    'application/json'
  );
};

export {
  getResData,
  getToken,
  getRequest,
  getPersonalInfo,
  getPersonalList,
  getSentence,
  getRecommend,
  getPoemDetail,
  getAuthorDetail,
  getDynamic,
  getCompositionList,
  getPoemList,
  getSearchResult,
  getAudio,
  postUserInfo,
  postLike,
  postCollect,
};
