import React from 'react';
import { View } from '@tarojs/components';

import './index.less';

function Loading() {

  return (
    <View className="loading-container">
      <View></View>
      <View></View>
    </View>
  );
}

export default React.memo(Loading);