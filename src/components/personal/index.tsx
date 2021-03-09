import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtAvatar } from 'taro-ui';
import List from '@components/list';

import './index.less';

function Personal(props) {
  const { userName, avatarUrl, personalInfo } = props;
  const { like, collect, record, dynamic } = personalInfo;

  const enterLikeList = () => {
    Taro.navigateTo({
      url: '/pages/UserDynamicList/index?type=0',
    });
  };

  const enterCollectList = () => {
    Taro.navigateTo({
      url: '/pages/UserDynamicList/index?type=1',
    });
  };

  const enterCompoList = () => {
    Taro.navigateTo({
      url: '/pages/RecordList/index',
    });
  };

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
          <View className="like" onClick={enterLikeList}>
            <Text className="count">{like}</Text>
            <Text>喜欢</Text>
          </View>
          <View className="collect" onClick={enterCollectList}>
            <Text className="count">{collect}</Text>
            <Text>收藏</Text>
          </View>
          <View className="composition" onClick={enterCompoList}>
            <Text className="count">{record}</Text>
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
          <View>
            {dynamic && dynamic.length > 0 && (
              <List list={dynamic} show={true} />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

export default React.memo(Personal);
