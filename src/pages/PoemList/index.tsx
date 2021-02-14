import React, { useEffect } from 'react';
import { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';

import './index.less';

function PoemList() {

  useEffect(() => {
    const router = getCurrentInstance().router;
    if(router) {
      console.log(router.params);
    }
  }, []);

  return (
    <View className="index">
      诗词列表
    </View>
  );
}

export default React.memo(PoemList);
