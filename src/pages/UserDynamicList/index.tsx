import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import List from '@components/list';
import { getPersonalList } from '@servers/servers';
import { getDynamicType } from '@utils/index';
import { CompoList } from '@constants/commonType';

import './index.less';

function UserDynamicList(props) {
  const [type, setType] = useState<string>('');
  const [list, setList] = useState<CompoList>([]);

  useEffect(() => {
    const router = getCurrentInstance().router;
    if (router?.params?.type) {
      const { type } = router.params;
      setType(type);

      Taro.setNavigationBarTitle({
        title: `${getDynamicType(type)}`,
      });
    }
  }, []);

  // 获取用户喜欢/收藏/作品列表
  useEffect(() => {
    if (type) {
      if (type === '3') {
        const { searchRes: immutableSearchRes } = props;
        const searchRes = immutableSearchRes.toJS();
        
        setList(searchRes.poem);
      } else {
        getPersonalList(type)
          .then((res) => {
            setList(res);
          })
          .catch((err) => {
            console.error(err);
          });
      }
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

const mapStateToProps = (state) => ({
  searchRes: state.getIn(['search', 'searchRes']),
});

export default connect(mapStateToProps, null)(React.memo(UserDynamicList));
