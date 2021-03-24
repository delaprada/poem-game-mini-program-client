import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import './index.less';

function Round() {
  const [type, setType] = useState<string>('0');
  const [round, setRound] = useState<number>(1);

  const roundList = ['第一关', '第二关', '第三关'];

  useEffect(() => {
    const game = Taro.getStorageSync('game');

    const router = getCurrentInstance().router;
    let type;
    if (router) {
      type = router.params.type;

      if (type) {
        setType(type);
      }
    }

    if (!game) {
      Taro.setStorageSync('game', {
        choice: 1,
        crossword: 1,
        identify: 1,
      });
    } else {
      switch (type) {
        case '0':
          setRound(game.choice);
          break;
        case '1':
          setRound(game.crossword);
          break;
        case '2':
          setRound(game.identify);
          break;
        default:
          console.log('default');
      }
    }
  }, []);

  const handleBack = () => {
    Taro.switchTab({
      url: '/pages/GameCenter/index',
    });
  };

  const handleClick = (index) => {
    // 通关了的关卡才能玩
    if (round > index) {
      switch (type) {
        case '0': {
          Taro.navigateTo({
            url: `/pages/ChoiceGame/index?round=${index + 1}`,
          });
          break;
        }
        case '1': {
          Taro.navigateTo({
            url: `/pages/CrossWordGame/index?round=${index + 1}`,
          });
          break;
        }
        case '2': {
          Taro.navigateTo({
            url: `/pages/IdentifyGame/index?round=${index + 1}`,
          });
          break;
        }
        default: {
          console.log('default');
        }
      }
    }
  };

  return (
    <View className="round-container">
      <View className="back" onClick={handleBack}>
        返回游戏中心
      </View>
      {roundList.map((item, index) => {
        return (
          <View className="round" onClick={() => handleClick(index)}>
            <Text className={round > index ? 'normal pass' : 'normal'}>
              {item}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default React.memo(Round);
