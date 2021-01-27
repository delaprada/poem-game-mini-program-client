import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { postUserInfo } from '@servers/servers';

// 登录页逻辑
function Login() {
  const [auth, setAuth] = useState(false);
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const canIUse = Taro.canIUse('button.open-type.getUserInfo');

  useEffect(() => {
    const userInfo = Taro.getStorageSync('userInfo');

    if (userInfo) {
      // 老用户则直接在storage中获取用户信息
      setAuth(true);
      setUserName(userInfo.nickname);
      setAvatarUrl(userInfo.avatar_url);
    } else {
      // 新用户调用getUserInfo方法获取用户信息
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
    }
  }, []);

  const getUserInfo = (e) => {
    const userInfo = e.detail.userInfo;
    setAuth(true);
    setUserName(userInfo.nickName);
    setAvatarUrl(userInfo.avatarUrl);

    // 授权成功后将用户信息发送到后台
    postUserInfo(userInfo);
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
    <View>
      <Text>测试登录功能</Text>
      {auth ? userDesc() : authButton()}
    </View>
  );
}

export default Login;
