import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton, AtIcon, AtInput } from 'taro-ui';
import { fileUpload } from '@utils/index';

import './index.less';

const innerAudioText = Taro.createInnerAudioContext();

function Audition(props) {
  const [id, setId] = useState<String>('');
  const [category, setCategory] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [dt, setDt] = useState<number>(0);

  const { url, poemInfo: poem } = props;
  const poemInfo = poem ? poem.toJS() : {};

  // 获取诗词id和category
  useEffect(() => {
    const router = getCurrentInstance().router;
    if (router) {
      const { id, category } = router.params;

      if (id) {
        setId(id);
      }

      if (category) {
        setCategory(category);
      }
    }
  }, []);

  useEffect(() => {
    innerAudioText.onPlay(() => {
      console.log('开始播放');
    });

    innerAudioText.onCanplay(function getDuration() {
      let intervalID = setInterval(() => {
        console.log('onCanplay', innerAudioText.duration);

        if (innerAudioText.duration !== 0) {
          setDt(Math.ceil(innerAudioText.duration) * 1000);

          clearInterval(intervalID);
        }
      }, 500);
    });

    innerAudioText.onPause(() => {
      console.log('暂停播放');
    });

    innerAudioText.onError((e) => {
      console.log('播放异常');
      console.log(e);
    });

    setAudioInfo(url);
  }, []);

  const setAudioInfo = (url) => {
    innerAudioText.autoplay = false;
    innerAudioText.src = url;
  };

  const handleListen = () => {
    if (isPlaying) {
      innerAudioText.pause();
      setIsPlaying(false);
    } else {
      innerAudioText.play();
      setIsPlaying(true);
    }
  };

  const handleCancel = () => {
    Taro.navigateBack({
      delta: 2,
    });
  };

  const handleSave = () => {
    fileUpload(url, id, category, inputValue, dt);

    // 无用，可能是太快跳转的原因
    Taro.showToast({
      title: '保存成功',
      icon: 'none',
      duration: 1000,
    });

    Taro.navigateBack({
      delta: 2,
    });
  };

  const handleChange = (value) => {
    setInputValue(value);
  };

  return (
    <View className="audition-container">
      <View className="audition">
        <View className="title">音频试听</View>
        <View className="mini-player">
          <View className="cd">
            <View className="icon" onClick={handleListen}>
              {isPlaying ? (
                <AtIcon value="pause" size="30" color="#fff"></AtIcon>
              ) : (
                <AtIcon value="play" size="30" color="#fff"></AtIcon>
              )}
            </View>
          </View>
          <View className="poem-info">
            <View className="poem-title">{poemInfo.title}</View>
            <View className="poem-author">{poemInfo.author}</View>
          </View>
        </View>
      </View>
      <View className="desc">
        <View className="topic">
          <AtInput
            name="value1"
            title="标题"
            type="text"
            placeholder="请输入朗诵作品标题"
            value={inputValue}
            onChange={handleChange}
          />
        </View>
      </View>
      <View className="bottom">
        <AtButton className="button" type="secondary" onClick={handleCancel}>
          取消
        </AtButton>
        <AtButton className="button" type="primary" onClick={handleSave}>
          保存
        </AtButton>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => ({
  url: state.getIn(['record', 'url']),
  poemInfo: state.getIn(['poem', 'poemInfo']),
});

export default connect(mapStateToProps, null)(React.memo(Audition));
