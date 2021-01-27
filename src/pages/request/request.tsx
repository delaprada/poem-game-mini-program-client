import React from 'react';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { getRequest } from '@servers/servers';

function Request() {
  const handleRequest = () => {
    getRequest()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <View>
      <AtButton type="primary" onClick={handleRequest}>
        发送请求
      </AtButton>
    </View>
  );
}

export default Request;
