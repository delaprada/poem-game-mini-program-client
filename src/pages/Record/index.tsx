import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { getDynasty } from '@utils/index';
import { changeRecordUrl } from './store/actionCreators';

import './index.less';

const recorderManager = Taro.getRecorderManager();
const innerAudioText = Taro.createInnerAudioContext();

function Record(props) {
  const [firstRecord, setfirstRecord] = useState<boolean>(true);
  const [pause, setPause] = useState<boolean>(false);

  const { poemInfo: poem } = props;
  const poemInfo = poem ? poem.toJS() : {};

  const { changeUrl } = props;

  useEffect(() => {
    recorderManager.onStart(() => {
      console.log('开始录音');
    });

    recorderManager.onPause(() => {
      console.log('暂停录音');
    });

    recorderManager.onResume(() => {
      console.log('继续录音');
    });

    recorderManager.onStop((res) => {
      if (res.duration < 1000) {
        Taro.showToast({
          title: '录音时间太短',
          duration: 1000,
          icon: 'none',
        });
      } else {
        console.log('停止录音');

        changeUrl(res.tempFilePath);

        Taro.navigateTo({
          url: `/pages/Audition/index?id=${poemInfo.id}&category=${poemInfo.category}`,
        });
      }
    });

    recorderManager.onError(() => {
      Taro.showToast({
        title: '录音失败！',
        duration: 1000,
        icon: 'none',
      });
    });
  }, []);

  useEffect(() => {
    innerAudioText.onPlay(() => {
      console.log('开始播放');
    });

    innerAudioText.onError((e) => {
      console.log('播放异常');
      console.log(e);
    });
  }, []);

  const handleClick = () => {
    const curPause = pause;
    setPause(!curPause);

    if (firstRecord) {
      setfirstRecord(false);

      recorderManager.start({
        duration: 60000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'mp3',
        frameSize: 50,
      });

      Taro.showToast({
        title: '开始录音',
        duration: 1000,
        icon: 'none',
      });
    } else {
      if (curPause) {
        recorderManager.pause();
      } else {
        recorderManager.resume();
      }
    }
  };

  const handleComplete = () => {
    recorderManager.stop();
  };

  return (
    <View className="record-container">
      <ScrollView
        className="scroll-view"
        scrollY
        scrollWithAnimation
        scrollTop={0}>
        <View className="title">
          {poemInfo.title ? poemInfo.title : poemInfo.chapter}
        </View>
        {poemInfo.author ? (
          <View className="author">
            <Text className="dynasty">{getDynasty(poemInfo.dynasty)}</Text>
            <Text className="name">{poemInfo.author}</Text>
          </View>
        ) : null}
        <View className="content">
          {poemInfo.content.split('|').map((item) => {
            return <Text>{item}</Text>;
          })}
        </View>
      </ScrollView>
      <View className="bottom">
        <View className="icon-center">
          <View className="operator" onClick={handleClick}>
            {firstRecord ? (
              <AtIcon
                prefixClass="fa"
                value="microphone"
                size="30"
                color="#fff"></AtIcon>
            ) : (
              <View>
                {pause ? (
                  <AtIcon value="pause" size="30" color="#fff"></AtIcon>
                ) : (
                  <AtIcon value="play" size="30" color="#fff"></AtIcon>
                )}
              </View>
            )}
          </View>
          <Text className="text">
            {firstRecord ? (
              <Text>开始录音</Text>
            ) : (
              <Text>{pause ? '暂停' : '继续'}</Text>
            )}
          </Text>
        </View>
        {!pause && !firstRecord ? (
          <View className="icon-right" onClick={handleComplete}>
            <View className="complete">
              <AtIcon value="check" size="25" color="#fff"></AtIcon>
            </View>
            <Text className="text">完成</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const mapStateToProps = (state) => ({
  poemInfo: state.getIn(['poem', 'poemInfo']),
});

const mapDispatchToProps = (dispatch) => {
  return {
    changeUrl(url) {
      dispatch(changeRecordUrl(url));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Record));
