import React, { useState, useEffect } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View } from '@tarojs/components';
import Login from '@components/login';
import Personal from '@components/personal';
import { getPersonalInfo } from '@servers/servers';

import './index.less';

function User() {
  const [auth, setAuth] = useState(false);
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [personalInfo, setPersonalInfo] = useState({});

  const canIUse = Taro.canIUse('button.open-type.getUserInfo');

  // useEffect(() => {
  //   console.log('effect here');
  //   /**
  //    * 进入user页
  //    * 若用户已授权过，则展示详细个人中心页面
  //    * 若未授权过，则展示登录页面
  //    * 通过属性auth来控制展示什么页面
  //    * 這種方案太慢了
  //    * 後續改為從Storage中取數據
  //    */
  //   // Taro.getSetting({})
  //   //   .then((res) => {
  //   //     if (res.authSetting['scope.userInfo']) {
  //   //       console.log('已经授权，可以直接调用getUserInfo获取头像昵称');

  //   //       // 必须是在用户已经授权的情况下调用
  //   //       Taro.getUserInfo({}).then((res) => {
  //   //         console.log('获取到用户信息');
  //   //         console.log(res.userInfo);
  //   //         setAuth(true);
  //   //         setUserName(res.userInfo.nickName);
  //   //         setAvatarUrl(res.userInfo.avatarUrl);
  //   //       });
  //   //     }
  //   //   })
  //   //   .catch((err) => {
  //   //     console.error(err);
  //   //   });

  //   // storage内信息除非手动删除小程序，否则一直存在
  //   const userInfo = Taro.getStorageSync('userInfo');
  //   if (userInfo) {
  //     const { nickName, avatarUrl } = userInfo;
  //     setAuth(true);
  //     setUserName(nickName);
  //     setAvatarUrl(avatarUrl);
  //   }
  // }, []);

  useDidShow(() => {
    // storage内信息除非手动删除小程序，否则一直存在
    const userInfo = Taro.getStorageSync('userInfo');
    if (userInfo) {
      const { nickName, avatarUrl } = userInfo;
      setAuth(true);
      setUserName(nickName);
      setAvatarUrl(avatarUrl);

      // 獲取like、collect、composition數量
      getPersonalInfo()
        .then((res) => {
          console.log(res);
          setPersonalInfo(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });

  // 解决auth改变不触发User页面的useDidShow生命周期函数导致子组件获取的personalInfo为空
  useEffect(() => {
    // 獲取like、collect、composition數量
    getPersonalInfo()
      .then((res) => {
        console.log(res);
        setPersonalInfo(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [auth]);

  const changeAuth = (userInfo) => {
    const { nickName, avatarUrl } = userInfo;
    Taro.setStorageSync('userInfo', userInfo);
    setUserName(nickName);
    setAvatarUrl(avatarUrl);
    setAuth(true);
  };

  return (
    <View className="user-container">
      {auth ? (
        <Personal
          userName={userName}
          avatarUrl={avatarUrl}
          personalInfo={personalInfo}
        />
      ) : (
        <Login changeAuth={changeAuth} />
      )}
    </View>
  );
}

export default React.memo(User);
