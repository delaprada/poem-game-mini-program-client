import React, { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import List from '@components/list';
import { getPersonalList } from '@servers/servers';
import { getDynamicType } from '@utils/index';
import { CompoList } from '@constants/commonType';

import './index.less';

function UserDynamicList() {
  const [type, setType] = useState<string>('');
  const [list, setList] = useState<CompoList>([]);

  useEffect(() => {
    const router = getCurrentInstance().router;
    if (router?.params?.type) {
      const { type } = router.params;
      setType(type);

      Taro.setNavigationBarTitle({
        title: `我的${getDynamicType(type)}`,
      });
    }
  }, []);

  // 获取用户喜欢/收藏/作品列表
  useEffect(() => {
    if (type) {
      getPersonalList(type)
        .then((res) => {
          setList(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [type]);

  return (
    <View className="dynamic-container">
      <View className="top">
        <Text className="title">诗词</Text>
        <Text className="count">共{list.length}首</Text>
      </View>
      <View className="list">
        {list.length > 0 && <List list={list} show={false} />}
      </View>
    </View>
  );
}

export default UserDynamicList;
