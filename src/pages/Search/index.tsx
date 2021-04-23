import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtIcon, AtSearchBar } from 'taro-ui';
import List from '@components/list';
import Loading from '@baseUI/loading';
import * as actionTypes from './store/actionCreators';
import { getDynasty, getAuthorCategory, changeColor } from '@utils/index';
import { RecordListType } from '@constants/commonType';

import './index.less';

function Search(props) {
  const [searchText, setSearchText] = useState<string>('');
  const [focus, setFocus] = useState<boolean>(false);
  const [recordList, setRecordList] = useState<RecordListType>(
    Taro.getStorageSync('search_cache')
  );

  const { searchRes: immutableSearchRes, loading } = props;
  const searchRes = immutableSearchRes && immutableSearchRes.toJS();
  const authorList = searchRes && searchRes.author;
  const poemList = searchRes && searchRes.poem;

  const { getSearchResDispatch, changeLoadingDispatch } = props;

  const hotList = ['李白', '杜甫'];

  // 解决点击清空按钮再点击关键字导致两次输入的关键字拼接问题
  useEffect(() => {
    if (!searchText) {
      changeLoadingDispatch(true);
      getSearchResDispatch('');
    }
  }, [searchText]);

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

  // 搜索
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

          list.forEach((cacheItem, index) => {
            if (cacheItem === text) {
              list.splice(index, 1);
              flag = false;
            }
          });

          if (flag) {
            list.pop();
          }
        } else {
          list.forEach((cacheItem, index) => {
            if (cacheItem === text) {
              list.splice(index, 1);
            }
          });
        }

        list.unshift(text);
        Taro.setStorageSync('search_cache', list);
      }

      // 请求操作
      changeLoadingDispatch(true);
      getSearchResDispatch(text);
    }
  };

  // 点击搜索按钮
  const handleClick = () => {
    search(searchText);
  };

  // 点击关键字
  const keywordsClick = (item) => {
    setSearchText(item);
    search(item);
  };

  // 点击删除历史
  const delHistory = () => {
    setRecordList([]);
    Taro.setStorage({
      key: 'search_cache',
      data: [],
    });
  };

  // 点击诗人进入诗人详情页
  const enterDetail = (item) => {
    const category = getAuthorCategory(item.dynasty);

    Taro.navigateTo({
      url: `/pages/Poet/index?id=${item.id}&category=${category}`,
    });
  };

  const handleMore = () => {
    Taro.navigateTo({
      url: '/pages/UserDynamicList/index?type=3',
    });
  };

  const renderAuthorList = () => {
    return (
      <View>
        {authorList && authorList.length > 0 && !focus ? (
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
        {poemList && poemList.length > 0 && !focus ? (
          <View className="poem-list">
            <View className="topic">诗词</View>
            <View className="list">
              <List
                list={poemList.slice(0, 5)}
                show={false}
                highlight={true}
                searchText={searchText}
              />
            </View>
            {poemList.length - 5 > 0 ? (
              <View className="more" onClick={handleMore}>
                <Text className="text">
                  查看更多结果({poemList.length - 5})
                </Text>
                <AtIcon value="chevron-right" size="15" color="#666"></AtIcon>
              </View>
            ) : null}
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
      {recordList.length > 0 && ((!authorList && !poemList) || focus) ? (
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
      {(!authorList && !poemList) || focus ? (
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
      {loading ? <Loading /> : null}
    </View>
  );
}

const mapStateToProps = (state) => ({
  searchRes: state.getIn(['search', 'searchRes']),
  loading: state.getIn(['search', 'loading']),
});

const mapDispatchToProps = (dispatch) => {
  return {
    getSearchResDispatch(searchText) {
      dispatch(actionTypes.getSearchRes(searchText));
    },
    changeLoadingDispatch(curState) {
      dispatch(actionTypes.changeLoading(curState));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search));
