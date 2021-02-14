import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { login, formatDateToMb } from '@utils';
import { getSentence } from '@servers/servers';
import { AtIcon, AtList, AtListItem } from 'taro-ui';
import VerticalItem from '@baseUI/vertical-item';
import { collectionList } from '@utils/config';

import './index.less';

function Home() {
  const [date, setDate] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const token = Taro.getStorageSync('token');

    /**
     * 判斷是否有token
     * 若無，代表剛打開小程序，需調用login方法獲取token
     * 若有則無需重新登錄
     */
    if (!token) {
      login();
    }
  }, []);

  useEffect(() => {
    getSentence()
      .then((res) => {
        const dailyContent = res[0].content;
        setContent(dailyContent);
      })
      .catch((err) => {
        console.error(err);
      });

    const currentDate = formatDateToMb();
    setDate(currentDate);
  }, []);

  const handleClick = () => {
    Taro.navigateTo({
      url: '/pages/Search/index',
    });
  };

  return (
    <View className="home-container">
      <View className="top">
        <View className="daily">
          {/* <Image className="background-image" src={homePic}></Image> */}
          <View className="date">
            <View>
              <View className="title">每日一诗</View>
              <View className="day">{date[2]}</View>
            </View>
            <View>
              <Text className="v-time year">{date[0]}</Text>
              <Text className="v-time month">{date[1]}</Text>
            </View>
          </View>
          <View className="content">{content}</View>
        </View>
        <View className="search" onClick={handleClick}>
          <View className="search-box">
            <AtIcon value="search" size="18" color="#bbb"></AtIcon>
            <Text className="placeholder">点击搜索诗词、诗人</Text>
          </View>
        </View>
      </View>
      <View className="recommend">
        <View className="header">
          <View className="title">
            <AtIcon value="list" size="16" color="#597ef7"></AtIcon>
            <Text className="content">热门推荐</Text>
          </View>
          <View className="change">
            <Text className="content">换一批</Text>
            <AtIcon value="reload" size="10" color="#666"></AtIcon>
          </View>
        </View>
        <View className="recommend-list">
          <AtList>
            <AtListItem className="item" title="标题文字" note="描述信息" />
            <AtListItem className="item" title="标题文字" note="描述信息" />
            <AtListItem className="item" title="标题文字" note="描述信息" />
          </AtList>
        </View>
      </View>
      <View className="collection">
        <View className="header">
          <View className="title">
            <AtIcon value="list" size="16" color="#597ef7"></AtIcon>
            <Text className="content">选集</Text>
          </View>
        </View>
        <View className="collection-list">
          {collectionList.map((item) => <VerticalItem item={item} />)}
        </View>
      </View>
    </View>
  );
}

export default React.memo(Home);
