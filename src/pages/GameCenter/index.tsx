import React from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import './index.less';

function GameCenter() {
  const handleClick = (option) => {
    Taro.navigateTo({
      url: `/pages/Round/index?type=${option}`,
    })
  }

  return (
    <View className="game-container">
      <View className="title">诗词游戏</View>
      <View className="options">
        <View className="choice" onClick={() => handleClick(0)}>选择题</View>
        <View className="crossword" onClick={() => handleClick(1)}>填字游戏</View>
        <View className="identification" onClick={() => handleClick(2)}>识别游戏</View>
        <View className="more">敬请期待...</View>
      </View>
    </View>
  );
}

export default React.memo(GameCenter);
