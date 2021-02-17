import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtAvatar } from 'taro-ui';
import List from '@components/list';
import { getPersonalInfo } from '@servers/servers';

import './index.less';

function Personal(props) {
  const [likeNum, setLikeNum] = useState(0);
  const [collectNum, setCollectNum] = useState(0);
  const [recordNum, setRecordNum] = useState(0);
  const [dynamicList, setDynamicList] = useState([]);

  const { userName, avatarUrl } = props;

  useEffect(() => {
    // 獲取like、collect、composition數量
    getPersonalInfo()
      .then((res) => {
        const { like, collect, record, dynamic } = res;
        setLikeNum(like);
        setCollectNum(collect);
        setRecordNum(record);
        setDynamicList(dynamic);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <View className="personal-container">
      <View className="top">
        <View className="background">
          <Image src={avatarUrl} style="width: 100%;" mode="aspectFill"></Image>
        </View>
        <View className="background layer"></View>
        <View className="profile">
          <AtAvatar className="avatar" circle image={avatarUrl}></AtAvatar>
          <Text className="username">{userName}</Text>
        </View>
        <View className="info">
          <View className="like">
            <Text className="count">{likeNum}</Text>
            <Text>喜欢</Text>
          </View>
          <View className="collect">
            <Text className="count">{collectNum}</Text>
            <Text>收藏</Text>
          </View>
          <View className="composition">
            <Text className="count">{recordNum}</Text>
            <Text>作品</Text>
          </View>
        </View>
      </View>
      <View className="dynamic">
        <View className="content">
          <View className="title">
            <View className="decorate"></View>
            动态
          </View>
          <View>{dynamicList.length > 0 && <List list={dynamicList} show={true} />}</View>
        </View>
      </View>
    </View>
  );
}

export default React.memo(Personal);
