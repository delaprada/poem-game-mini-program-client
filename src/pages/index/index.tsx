import React from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { getSkey } from '../../servers/servers';

import './index.less';

function Index() {

  const login = () => {
    Taro.login({})
      .then((res) => {
        if (res.code) {
          console.log(res.code);
          getSkey(res.code)
            .then((key) => {
              console.log('获取session_key+openid');
              const skey = key;
              console.log(skey);
              Taro.setStorageSync('skey', skey);
            })
            .catch((err2) => {
              console.error(err2);
            });
          // Taro.request({
          //   url: 'http://127.0.0.1:7001/login',
          //   data: {
          //     code: res.code,
          //   },
          //   method: 'POST',
          // })
          //   .then((res2) => {
          //     console.log('获取session_key+openid');
          //     const skey = res2.data;
          //     Taro.setStorageSync('skey', skey);
          //   })
          //   .catch((err2) => {
          //     console.error(err2);
          //   });
        } else {
          console.log('登录失败! ' + res.errMsg);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClick = () => {
    // 获取skey
    const loginFlag = Taro.getStorageSync('skey');

    if (loginFlag) {
      console.log('存在skey');

      // 检查session是否过期
      Taro.checkSession({})
        .then((res) => {
          console.log(res);
          console.log('session没过期，不用重新登录');
          console.log('skey为' + loginFlag);
        })
        .catch((err) => {
          console.log(err);
          console.log('session已过期，要重新登录');
          
          // 重新登录
          login();
        });
    } else {
      console.log('不存在skey，要登录');
      login();
    }
  };

  const clearSesstion = () => {
    Taro.clearStorageSync();
  };

  return (
    <View className='index'>
      <View>
        <Text>测试登录鉴权</Text>
        <View>
          <AtButton type='primary' onClick={handleClick}>
            点击登录
          </AtButton>
          <AtButton type='primary' onClick={clearSesstion}>
            清空session
          </AtButton>
        </View>
      </View>
    </View>
  );
}

export default connect(null, null)(React.memo(Index));
