import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { AtModal } from 'taro-ui';

function ReLogin() {
  const [show, setShow] = useState(true);

  const handleConfirm = () => {
    console.log('点击确认');
    setShow(false);
    Taro.switchTab({
      url: '/pages/index/index',
    });
  };

  const handleCancel = () => {
    console.log('点击取消');
    setShow(false);
  };

  const handleClose = () => {
    console.log('点击关闭');
    setShow(false);
  };

  return (
    <AtModal
      isOpened={show}
      title='登录信息过期'
      cancelText='取消'
      confirmText='确认'
      onClose={handleClose}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      content='您的用户信息已过期，是否重新登录？'
    />
  );
}

export default ReLogin;
