import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtIcon, AtButton } from 'taro-ui';
import shuimoUrl from '@assets/images/shuimo2.png';

import './index.less';

function GameCenter(props) {
  const handleClick = (option) => {
    switch (option) {
      case 0: {
        Taro.navigateTo({
          url: '/pages/ChoiceGame/index',
        })
      }
      case 1: {
        Taro.navigateTo({
          url: '/pages/CrossWordGame/index',
        })
      }
    }
  }

  return (
    <View className="game-container">
      {/* <View className="title">
        <View className="letter">诗</View>
        <View className="letter">词</View>
        <View className="letter">游</View>
        <View className="letter">戏</View>
      </View> */}
      <View className="title">诗词游戏</View>
      <View className="options">
        <View className="choice" onClick={() => handleClick(0)}>选择题</View>
        <View className="crossword" onClick={() => handleClick(1)}>填字游戏</View>
        <View className="more">敬请期待...</View>
      </View>
    </View>
  );
}

export default React.memo(GameCenter);
