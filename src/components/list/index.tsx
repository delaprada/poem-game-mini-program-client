import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { getTitle, changeColor } from '@utils/index';

import './index.less';

function List(props) {
  const { list, show, highlight, searchText } = props;

  const getDynamicDesc = (item) => {
    const { resStr, exec_time } = getTitle(item);

    return (
      <View className="dynamic-desc">
        <Text>{resStr}</Text>
        <Text className="time">{exec_time}</Text>
      </View>
    );
  };

  const listItem = (item) => {
    let { id, category, title, content, author } = item.detail || item;

    content = content.replace(/\|/g, '');

    const handleClick = (id, category) => {
      Taro.navigateTo({
        url: `/pages/Poem/index?id=${id}&category=${category}`,
      });
    };

    // 对搜索关键字进行高亮操作
    const changeFormat = (text, searchText) => {
      return (
        <View
          dangerouslySetInnerHTML={{
            __html: changeColor(text, searchText),
          }}></View>
      );
    };

    return (
      <View className="item-container">
        {show ? <View>{getDynamicDesc(item)}</View> : null}
        <View
          className="item-content"
          hoverClass="hover-style"
          onClick={() => handleClick(id, category)}>
          <View className="profile">
            <View className="title">
              {highlight ? changeFormat(title, searchText) : title}
            </View>
            <View className="author">
              {highlight ? changeFormat(author, searchText) : author}
            </View>
          </View>
          <View className="content">
            {highlight ? changeFormat(content, searchText) : content}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="list-container">
      {list.map((item) => {
        return <View>{listItem(item)}</View>;
      })}
    </View>
  );
}

export default List;
