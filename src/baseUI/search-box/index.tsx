import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtIcon, AtSearchBar } from 'taro-ui';

import {
  RecordListType,
  AuthorListType,
  PoemListType,
} from '@constants/commonType.ts';

import './index.less';

function SearchBox(props) {
  const [searchText, setSearchText] = useState<string>('');
  const [recordList, setRecordList] = useState<RecordListType>(
    Taro.getStorageSync('search_cache')
  );
  const [authorList, setAuthorList] = useState<AuthorListType>([]);
  const [poemList, setPoemList] = useState<PoemListType>([]);

  const { hotList, getSearchText } = props;

  const handleChange = (e) => {
    setSearchText(e);
  };

  const search = (text) => {
    console.log('searchText is ' + text);

    if (text === '') {
      Taro.showToast({
        title: '请输入关键字',
        icon: 'none',
        duration: 1000,
      });
    } else {
      const list = Taro.getStorageSync('search_cache');

      if (list === '') {
        const tmpList: Array<string> = [];
        tmpList.push(text);
        Taro.setStorageSync('search_cache', tmpList);
      } else {
        if (list.length > 5) {
          let flag: boolean = true;

          for (let i = 0; i < list.length; ++i) {
            if (list[i] === text) {
              list.splice(i, 1);
              flag = false;
            }
          }
          if (flag) {
            list.pop();
          }
        } else {
          for (let i = 0; i < list.length; ++i) {
            if (list[i] === text) {
              list.splice(i, 1);
            }
          }
        }

        list.unshift(text);
        Taro.setStorageSync('search_cache', list);
      }

      getSearchText(text);
    }
  };

  const handleClick = () => {
    search(searchText);
  };

  const keywordsClick = (item) => {
    search(item);
  };

  const delHistory = () => {
    setRecordList([]);
    Taro.setStorage({
      key: 'search_cache',
      data: [],
    });
  };

  const renderAuthorList = () => {
    return <View>诗人列表</View>;
  };

  const renderPoemList = () => {
    return <View>诗词列表</View>;
  };

  return (
    <View className="search-box-container">
      <View>
        <AtSearchBar
          value={searchText}
          focus={false}
          onChange={handleChange}
          onActionClick={handleClick}
        />
      </View>
      {recordList.length > 0 &&
      authorList.length === 0 &&
      poemList.length === 0 ? (
        <View className="history">
          <View className="title">
            <Text>搜索历史</Text>
            <AtIcon
              className="trash"
              prefixClass="fa"
              value="trash-o"
              size="14"
              onClick={delHistory}></AtIcon>
          </View>
          <View className="content">
            {recordList.map((item, index) => {
              return (
                <View key={index} onClick={() => keywordsClick(item)}>
                  {item}
                </View>
              );
            })}
          </View>
        </View>
      ) : null}
      {authorList.length === 0 && poemList.length === 0 ? (
        <View className="recommend">
          <View className="title">热门推荐</View>
          <View className="content">
            {hotList.map((item, index) => {
              return (
                <View key={index} onClick={() => keywordsClick(item)}>
                  {item}
                </View>
              );
            })}
          </View>
        </View>
      ) : null}
      {renderAuthorList()}
      {renderPoemList()}
    </View>
  );
}

export default SearchBox;
