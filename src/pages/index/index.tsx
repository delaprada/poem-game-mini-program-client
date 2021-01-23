import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { getToken, getRequest } from '../../servers/servers';

import './index.less';

function Index() {
  const [auth, setAuth] = useState(false);
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const canIUse = Taro.canIUse('button.open-type.getUserInfo');

  useEffect(() => {
    Taro.getSetting({})
      .then((res) => {
        if (res.authSetting['scope.userInfo']) {
          console.log('已经授权，可以直接调用getUserInfo获取头像昵称');

          // 必须是在用户已经授权的情况下调用
          Taro.getUserInfo({}).then((res) => {
            console.log('获取到用户信息');
            console.log(res.userInfo);
            setAuth(true);
            setUserName(res.userInfo.nickName);
            setAvatarUrl(res.userInfo.avatarUrl);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const login = (userInfo) => {
    Taro.login({})
      .then((res) => {
        if (res.code) {
          console.log('code为' + res.code);

          // 将code和userInfo发送到后台，以获取token
          getToken(res.code, userInfo)
            .then((token) => {
              console.log('获取token');
              console.log(token);

              // 将token存储到Storage中
              Taro.setStorageSync('token', token);
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

  const getUserInfo = (e) => {
    const userInfo = e.detail.userInfo;
    setAuth(true);
    setUserName(userInfo.nickName);
    setAvatarUrl(userInfo.avatarUrl);

    // 获取token
    const loginFlag = Taro.getStorageSync('token');

    if (loginFlag) {
      console.log('存在token');

      // 检查session是否过期
      Taro.checkSession({})
        .then((res) => {
          console.log(res);
          console.log('session没过期，不用重新登录');
          console.log('token为' + loginFlag);
        })
        .catch((err) => {
          console.log(err);
          console.log('session已过期，要重新登录');

          // 重新登录
          login(userInfo);
        });
    } else {
      console.log('不存在token，要登录');
      login(userInfo);
    }
  };

  const handleRequest = () => {
    getRequest();
  };

  const userDesc = () => {
    return (
      <View>
        <Image src={avatarUrl}></Image>
        <View>{userName}</View>
      </View>
    );
  };

  const authButton = () => {
    return (
      <View>
        {canIUse ? (
          <AtButton
            type="primary"
            openType="getUserInfo"
            onGetUserInfo={getUserInfo}>
            点击登录
          </AtButton>
        ) : null}
      </View>
    );
  };

  return (
    <View className="index">
      <View>
        <Text>测试登录鉴权</Text>
        <View>
          <View>
            <View>测试用户信息授权</View>
            {auth ? userDesc() : authButton()}
          </View>
          <AtButton type="primary" onClick={handleRequest}>
            发送请求
          </AtButton>
        </View>
      </View>
    </View>
  );
}

export default connect(null, null)(React.memo(Index));
