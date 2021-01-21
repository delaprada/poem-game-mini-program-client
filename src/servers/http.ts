// Taro.request处理
import Taro from '@tarojs/taro';
import getBaseUrl from './baseUrl';
import interceptors from './interceptors';
import type { reqMethod } from './types';

interceptors.forEach((i) => Taro.addInterceptor(i));

class httpRequest {
  baseOptions(params, method: reqMethod = 'GET') {
    const { url, data } = params;
    const BASE_URL = getBaseUrl(url);
    let contentType = 'application/json';
    contentType = params.contentType || contentType;

    console.log(url);
    console.log(data);
    console.log(contentType);

    const option = {
      url: BASE_URL + url,
      data: data,
      method: method,
      header: {
        'content-type': contentType,
        Authorization: Taro.getStorageSync('Authorization'),
      },
    };
    return Taro.request(option);
  }

  get(url: string, data = '') {
    let option = { url, data };
    return this.baseOptions(option);
  }

  post(url: string, data, contentType: string) {
    let params = { url, data, contentType };
    return this.baseOptions(params, 'POST');
  }

  put(url: string, data = '') {
    let option = { url, data };
    return this.baseOptions(option, 'PUT');
  }

  delete(url: string, data = '') {
    let option = { url, data };
    return this.baseOptions(option, 'DELETE');
  }
}

export default new httpRequest();
