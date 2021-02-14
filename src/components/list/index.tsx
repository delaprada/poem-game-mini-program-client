import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { getTitle } from '@utils';

import './index.less';

function List(props) {
  const { list } = props;

  const getDynamicDesc = (item) => {
    const { resStr, exec_time } = getTitle(item);

    return (
      <View className="dynamic-desc">
        <Text>{resStr}</Text>
        <Text className="time">{exec_time}</Text>
      </View>
    );
  };

  const listItem = (item, show) => {
    let { title, content, author } = item.detail;
    content = content.replace(/\|/g, '');

    return (
      <View className="item-container">
        {show ? <View>{getDynamicDesc(item)}</View> : null}
        <View className="item-content" hoverClass="hover-style">
          <View className="profile">
            <Text className="title">{title}</Text>
            <Text className="author">{author}</Text>
          </View>
          <View className="content">{content}</View>
        </View>
      </View>
    );
  };

  return (
    <View>
      {list.map((item) => {
        return <View>{listItem(item, true)}</View>;
      })}
    </View>
  );
}

export default List;
