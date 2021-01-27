import Taro from '@tarojs/taro';
import { getToken } from '@servers/servers';

const login = () => {
  Taro.login({})
    .then((res) => {
      if (res.code) {
        // 将code发送到后台，以获取token
        getToken(res.code)
          .then((res) => {
            const { token, userExist } = res;

            console.log('获取token');
            console.log(token);

            // 将token存储到Storage中
            Taro.setStorageSync('token', token);

            // 如果是老用户，获取用户信息
            if (userExist) {
              const { userInfo } = res;
              Taro.setStorageSync('userInfo', userInfo);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        console.log('登录失败! ' + res.errMsg);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

export { login };
