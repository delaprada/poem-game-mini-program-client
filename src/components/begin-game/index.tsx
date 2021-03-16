import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';

import './index.less';

function BeginGame(props) {
  const [begin, setBegin] = useState<boolean>(false);

  const { clickBegin } = props;

  useEffect(() => {
    setTimeout(() => {
      setBegin(true);
    }, 3000);

    setTimeout(() => {
      clickBegin();
    }, 4000);
  }, []);

  return (
    <View className="begin-container">
      <View className="title">{begin ? '游戏开始' : '加载中...'}</View>

      <View className="progress-bar stripes animated reverse slower">
        <View className="progress-bar-inner"></View>
      </View>
    </View>
  );
}

export default BeginGame;
