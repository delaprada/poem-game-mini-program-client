import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { View, Text } from '@tarojs/components';
import { login } from '@utils';

import './index.less';

function Index() {
  useEffect(() => {
    // 页面渲染完成后登录
    // 老用户直接获取用户信息，新用户在后台创建新用户
    login();
  }, []);

  return (
    <View className="index">
      <View>
        <Text>首页自动登录</Text>
      </View>
    </View>
  );
}

export default connect(null, null)(React.memo(Index));
