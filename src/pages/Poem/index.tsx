import React from 'react';
import { View } from '@tarojs/components';

import './index.less';

function Poem() {

  return (
    <View className="index">
      诗词详情
    </View>
  );
}

export default React.memo(Poem);
