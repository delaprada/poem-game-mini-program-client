import React, { useState } from 'react';
import Taro, { useDidHide } from '@tarojs/taro';
import { View, Image, Text, Radio } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { postUserInfo } from '@servers/servers';

import './index.less';

function Login(props) {
  const [check, setCheck] = useState(false);
  const [disable, setDisable] = useState(true);

  useDidHide(() => {
      setCheck(false);
  });

  const handleChange = () => {
    setCheck(!check);
    setDisable(check);
  };

  const getUserInfo = (e) => {
    const userInfo = e.detail.userInfo;
    if (userInfo) {
      // 授权成功后将用户信息发送到后台
      postUserInfo(userInfo);

      props.changeAuth(userInfo);
    } else {
      // 拒絕授權
      setCheck(false);
    }
  };

  const handleCancel = () => {
    Taro.switchTab({
      url: '/pages/Home/index',
    });
  };

  return (
    <View className="login-container">
      <View className="image">
        <Image
          src="https://mini-program-1301716802.cos.ap-guangzhou.myqcloud.com/homebg.jpg"
          style="width: 100%; height: 400rpx"
          mode="top"></Image>
      </View>
      <View className="content">
        <View className="title-container">
          <View className="title">你还未登录</View>
          <Text className="subtitle">
            请先<Text className="login">登录</Text>才能进行操作
          </Text>
        </View>
        <Text className="desc">需要获取头像、昵称等信息</Text>
        <View className="radio-container" onClick={handleChange}>
          <Radio className="radio" color="#597ef7" checked={check} />
          <Text className="radio-text">
            我已阅读并同意《用户协议》《用户隐私政策》
          </Text>
        </View>
        <View className="button-container">
          <AtButton className="button" type="secondary" onClick={handleCancel}>
            拒绝
          </AtButton>
          <AtButton
            className="button"
            type="primary"
            openType="getUserInfo"
            disabled={disable}
            onGetUserInfo={getUserInfo}>
            登录
          </AtButton>
        </View>
      </View>
    </View>
  );
}

export default React.memo(Login);
