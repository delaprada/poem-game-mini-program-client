import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import './index.less';

function VerticalItem(props) {
  const { category, title, desc } = props.item;

  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/PoemList/index?category=${category}&title=${title}&desc=${desc}`,
    })
  }

  return (
    <View className="vertical-container" onClick={handleClick}>
      <Text className="item title">{title}</Text>
      <Text className="item desc">{desc}</Text>
    </View>
  );
}

export default VerticalItem;
