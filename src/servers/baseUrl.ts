// 设置不同环境不同路径请求的url地址
const getBaseUrl = (url: string) => {
  let BASE_URL = 'http://127.0.0.1:7001';
  if (process.env.NODE_ENV === 'development') {
    //开发环境 - 根据请求不同返回不同的BASE_URL
    console.log('开发模式')
    if (url.includes('/api/')) {
      BASE_URL = '';
    } else if (url.includes('/iatadatabase/')) {
      BASE_URL = '';
    }
  } else {
    // 生产环境
    if (url.includes('/api/')) {
      BASE_URL = '';
    } else if (url.includes('/iatadatabase/')) {
      BASE_URL = '';
    }
  }
  return BASE_URL;
};

export default getBaseUrl;
