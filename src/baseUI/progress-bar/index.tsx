import React from 'react';
import { View, Slider } from '@tarojs/components';

import './index.less';

function ProgressBar(props) {
  const { percent } = props;
  const { onChange, onChanging } = props;

  return (
    <View className="progress-bar-wrapper">
      <Slider
        value={percent}
        blockSize={12}
        backgroundColor="#666"
        activeColor="#597ef7"
        onChange={(e) => onChange(e)}
        onChanging={(e) => onChanging(e)}
      />
    </View>
  );
}

export default React.memo(ProgressBar);
