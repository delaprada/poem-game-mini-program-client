import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtIcon, AtSearchBar } from 'taro-ui';
import List from '@components/list';
import { getSearchResult } from '@servers/servers';
import { getDynasty, getAuthorCategory, changeColor } from '@utils/index';
import {
  RecordListType,
  AuthorListType,
  PoemListType,
} from '@constants/commonType.ts';

import './index.less';

function SearchBox() {
  const [searchText, setSearchText] = useState<string>('');
  const [focus, setFocus] = useState<boolean>(false);
  const [authorList, setAuthorList] = useState<AuthorListType>([]);
  const [poemList, setPoemList] = useState<PoemListType>([]);
  const [recordList, setRecordList] = useState<RecordListType>(
    Taro.getStorageSync('search_cache')
  );

  const hotList = ['李白', '杜甫'];

  // 请求操作
  const getSearchRes = (text) => {
    getSearchResult(text)
      .then((res) => {
        setAuthorList(res.author);
        setPoemList(res.poem);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 聚焦
  const handleFocus = () => {
    setFocus(true);
    setRecordList(Taro.getStorageSync('search_cache'));
  };

  // 失焦
  const handleBlur = () => {
    setFocus(false);
  };

  // 搜索框内容改变
  const handleChange = (e) => {
    setSearchText(e);
  };

  const search = (text) => {
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

      getSearchRes(text);
    }
  };

  const handleClick = () => {
    search(searchText);
  };

  const keywordsClick = (item) => {
    setSearchText(item);
    search(item);
  };

  const delHistory = () => {
    setRecordList([]);
    Taro.setStorage({
      key: 'search_cache',
      data: [],
    });
  };

  const enterDetail = (item) => {
    const category = getAuthorCategory(item.dynasty);

    Taro.navigateTo({
      url: `/pages/Poet/index?id=${item.id}&category=${category}`,
    });
  };

  const renderAuthorList = () => {
    return (
      <View>
        {authorList.length > 0 && !focus ? (
          <View className="author-list">
            <View className="topic">诗人</View>
            {authorList.map((item) => {
              return (
                <View className="author-item" onClick={() => enterDetail(item)}>
                  <View
                    dangerouslySetInnerHTML={{
                      __html: changeColor(item.name, searchText),
                    }}></View>
                  <Text className="dynasty">{getDynasty(item.dynasty)}</Text>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
    );
  };

  const renderPoemList = () => {
    return (
      <View>
        {poemList.length > 0 && !focus ? (
          <View className="poem-list">
            <View className="topic">诗词</View>
            <View className="list">
              <List
                list={poemList}
                show={false}
                highlight={true}
                searchText={searchText}
              />
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View className="search-box-container">
      <View>
        <AtSearchBar
          value={searchText}
          focus={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onActionClick={handleClick}
        />
      </View>
      {recordList.length > 0 &&
      ((authorList.length === 0 && poemList.length === 0) || focus) ? (
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
      {(authorList.length === 0 && poemList.length === 0) || focus ? (
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
