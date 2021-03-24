import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { getPersonalList } from '@servers/servers';
import { changeAudioInfo } from '@pages/Poem/store/actionCreators';
import { RecordingListType } from '@constants/commonType';
import './index.less';

function RecordList(props) {
  const [list, setList] = useState<RecordingListType>([]);

  const { changeAudio } = props;

  useEffect(() => {
    getPersonalList(2)
      .then((res) => {
        console.log(res);
        setList(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const listItem = (item) => {
    const { record_name, record_url, dt } = item;
    const userInfo = Taro.getStorageSync('userInfo');
    const { nickName } = userInfo;

    const handleClick = () => {
      changeAudio({
        audio_name: record_name,
        audio_url: record_url,
        singer: nickName,
        al_pic_url:
          'https://mini-program-1301716802.cos.ap-guangzhou.myqcloud.com/audiobg.jpg',
        audio_dt: dt,
      });

      Taro.navigateTo({
        url: '/pages/Player/index',
      });
    };

    return (
      <View className="item" onClick={handleClick}>
        <View className="record-name">{record_name}</View>
      </View>
    );
  };

  return (
    <View className="record-list-container">
      <View className="top">
        <Text className="title">朗诵作品</Text>
        <Text className="count">共{list.length}个</Text>
      </View>
      {list.length > 0 ? (
        <View>
          {list.map((item, index) => {
            return listItem(item);
          })}
        </View>
      ) : null}
    </View>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeAudio(audio) {
      console.log('audio为');
      console.log(audio);
      dispatch(changeAudioInfo(audio));
    },
  };
};

export default connect(null, mapDispatchToProps)(React.memo(RecordList));
