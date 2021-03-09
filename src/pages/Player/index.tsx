import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import ProgressBar from '@baseUI/progress-bar';
import { formatPlayerTime } from '@utils/index';

const backgroundAudioManager = Taro.getBackgroundAudioManager();

import './index.less';

function Player(props) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playPercent, setPlayPercent] = useState<number>(0);
  const [curTime, setCurTime] = useState<number>(0);

  const { audioInfo: immutableAudioInfo } = props;
  const audioInfo = immutableAudioInfo.toJS();

  useEffect(() => {
    try {
      setSongInfo(audioInfo);
    } catch (err) {
      console.log(err);
    }
    setIsPlaying(true);

    backgroundAudioManager.onTimeUpdate(() => {
      Taro.getBackgroundAudioPlayerState({
        success(res) {
          if (res.status !== 2) {
            updateProgress(res.currentPosition);
          }
        },
      });
    });
    backgroundAudioManager.onPause(() => {
      setIsPlaying(false);
    });
    backgroundAudioManager.onPlay(() => {
      setIsPlaying(true);
    });
    backgroundAudioManager.onError((err) => {
      console.error(err);
    });
    backgroundAudioManager.onEnded(() => {
      // 当前音频播放完毕后从头再播放该音频
      setSongInfo(audioInfo);
    });

    return () => {
      backgroundAudioManager.stop();
    };
  }, []);

  const setSongInfo = (songInfo) => {
    const { audio_name, singer, al_pic_url, audio_url } = songInfo;

    backgroundAudioManager.title = audio_name;
    backgroundAudioManager.epname = audio_name;
    backgroundAudioManager.singer = singer;
    backgroundAudioManager.coverImgUrl = al_pic_url;
    backgroundAudioManager.src = audio_url;
  };

  const pauseMusic = () => {
    backgroundAudioManager.pause();
    setIsPlaying(false);
  };

  const playMusic = () => {
    backgroundAudioManager.play();
    setIsPlaying(true);
  };

  const updateProgress = (currentPosition) => {
    let { audio_dt } = audioInfo;
    if (!audio_dt) {
      audio_dt = backgroundAudioManager.duration;
    }
    const percent = Math.floor((currentPosition * 1000 * 100) / audio_dt);
    setPlayPercent(percent);
    setCurTime((percent * audio_dt) / 100);
  };

  const percentChange = (e) => {
    const { value } = e.detail;
    let { audio_dt } = audioInfo;

    if (!audio_dt) {
      audio_dt = backgroundAudioManager.duration;
    }

    let currentPosition = Math.floor(((audio_dt / 1000) * value) / 100);
    backgroundAudioManager.seek(currentPosition);
    backgroundAudioManager.play();
  };

  const percentChanging = () => {
    backgroundAudioManager.pause();
  };

  return (
    <View className="player-container">
      <View className="background">
        <Image
          src={audioInfo.al_pic_url}
          style="width: 100%; height: 100%"
          mode="scaleToFill"
        />
      </View>
      <View className="background layer"></View>
      <View className="middle">
        <View className="cd-wrapper">
          <View className={`needle ${isPlaying ? '' : 'pause'}`}></View>
          <View className="cd">
            <Image
              className={`image play ${isPlaying ? '' : 'pause'}`}
              src={audioInfo.al_pic_url}
            />
          </View>
        </View>
      </View>
      <View className="bottom">
        <View className="progress">
          <Text className="time time-l">{formatPlayerTime(curTime)}</Text>
          <View className="progress-wrapper">
            <ProgressBar
              percent={playPercent}
              onChange={percentChange}
              onChanging={percentChanging}
            />
          </View>
          <Text className="time time-r">
            {audioInfo.audio_dt
              ? formatPlayerTime(audioInfo.audio_dt)
              : formatPlayerTime(backgroundAudioManager.duration)}
          </Text>
        </View>
        <View className="operators">
          {isPlaying ? (
            <AtIcon
              value="pause"
              size="30"
              color="#fff"
              onClick={pauseMusic}></AtIcon>
          ) : (
            <AtIcon
              value="play"
              size="30"
              color="#fff"
              onClick={playMusic}></AtIcon>
          )}
        </View>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => ({
  audioInfo: state.getIn(['poem', 'audioInfo']),
});

// 将 ui 组件包装成容器组件
export default connect(mapStateToProps, null)(React.memo(Player));
