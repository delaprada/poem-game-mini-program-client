// 拦截器
import Taro from '@tarojs/taro';
import { HTTP_STATUS } from './config';
import { check } from '@utils/index';

const customInterceptor = async (chain) => {
  const requestParams = chain.requestParams;

  // 检查session是否过期
  check();

  return chain.proceed(requestParams).then((res) => {
    // 只要请求成功，不管返回什么状态码，都走这个回调
    switch (res.statusCode) {
      case HTTP_STATUS.NOT_FOUND:
        return Promise.reject('请求资源不存在');
      case HTTP_STATUS.BAD_GATEWAY:
        return Promise.reject('服务端出现了问题');
      case HTTP_STATUS.FORBIDDEN: {
        Taro.setStorageSync('token', '');
        // pageToLogin();
        // TODO 根据自身业务修改
        return Promise.reject('没有权限访问');
      }
      case HTTP_STATUS.AUTHENTICATE: {
        Taro.setStorageSync('token', '');

        // 跳转到重新登录页面
        Taro.switchTab({
          url: '/pages/reLogin/reLogin',
        });
        return Promise.reject('需要鉴权');
      }
      case HTTP_STATUS.SUCCESS:
        return res.data;
    }
  });
};

// Taro 提供了两个内置拦截器
// logInterceptor - 用于打印请求的相关信息
// timeoutInterceptor - 在请求超时时抛出错误。
const interceptors = [customInterceptor, Taro.interceptors.logInterceptor];

export default interceptors;
