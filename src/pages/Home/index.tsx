import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { login, formatDateToMb } from '@utils';
import { getSentence } from '@servers/servers';
import { AtIcon } from 'taro-ui';
import VerticalItem from '@baseUI/vertical-item';
import List from '@components/list';
import { uniqueElementBy } from '@utils/index';
import { collectionList, supList } from '@utils/config';
import { getRecommend } from '@servers/servers';
import { CompoList, SentenceType } from '@constants/commonType';

import './index.less';

function Home() {
  const [date, setDate] = useState<Array<string | number>>([]);
  const [recommendList, setRecommendList] = useState<CompoList>([]);
  const [curList, setCurList] = useState<CompoList>([]);
  const [index, setIndex] = useState<number>(3);
  const [sentence, setSentence] = useState<SentenceType>({
    id: 0,
    category: 0,
    composition_id: 0,
    author: '',
    title: '',
    content: '',
    dynasty: '',
  });

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
    // 获取每日一句
    getSentence()
      .then((res) => {
        const dailySentence = res[0];
        setSentence(dailySentence);
      })
      .catch((err) => {
        console.error(err);
      });

    const currentDate = formatDateToMb();
    setDate(currentDate);

    // 获取热门推荐
    getRecommend()
      .then((res: any) => {
        const list = uniqueElementBy(res.concat(supList));
        setRecommendList(list);
        setCurList(list.slice(index - 3, index));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleClickSentence = () => {
    const { category, composition_id } = sentence;

    Taro.navigateTo({
      url: `/pages/Poem/index?id=${composition_id}&category=${category}`,
    });
  };

  const handleClick = () => {
    Taro.navigateTo({
      url: '/pages/Search/index',
    });
  };

  const handleChange = () => {
    let curIndex = index + 3;

    if (curIndex <= 15) {
      const list = recommendList.slice(curIndex - 3, curIndex);
      setCurList(list);
    } else {
      curIndex = 3;
      const list = recommendList.slice(curIndex - 3, curIndex);
      setCurList(list);
    }

    setIndex(curIndex);
  };

  return (
    <View className="home-container">
      <View className="top">
        <View className="daily">
          <View className="date">
            <View>
              <View className="title">每日一诗</View>
              <View className="day">{date[2]}</View>
            </View>
            <View className="time">
              <View className="v-time month">{date[1]}</View>
              <View className="v-time year">{date[0]}</View>
            </View>
          </View>
          <View className="content" onClick={handleClickSentence}>
            {sentence.content}
          </View>
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
          <View className="change" onClick={handleChange}>
            <Text className="content">换一批</Text>
            <AtIcon value="reload" size="10" color="#666"></AtIcon>
          </View>
        </View>
        <View className="recommend-list">
          {curList.length > 0 && <List list={curList} show={false} />}
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
          {collectionList.map((item) => (
            <VerticalItem item={item} />
          ))}
        </View>
      </View>
    </View>
  );
}

export default React.memo(Home);
