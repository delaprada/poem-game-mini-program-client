import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { AtIcon, AtModal, AtToast } from 'taro-ui';
import {
  changeLike,
  changeCollect,
  getPoemInfo,
  getAuthorInfo,
  getAudioInfo,
  getDynamicInfo,
} from './store/actionCreators';
import { postLike, postCollect } from '@servers/servers';
import { checkLogin, isEmptyObject, getDynasty, getIntro } from '@utils/index';

import './index.less';

function Poem(props) {
  const [id, setId] = useState<string>('0');
  const [category, setCategory] = useState<string>('0');
  const [showModel, setShowModel] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  // 解决上一个poemInfo会短暂显示直到当前poemInfo请求完毕的问题
  const [show, setShow] = useState<boolean>(false);

  const { poemInfo: poem, authorInfo: author, like, collect } = props;
  const {
    getPoem,
    getAuthor,
    getAudio,
    getDynamic,
    changeLikeStatus,
    changeCollectStatus,
  } = props;

  let poemInfo = poem ? poem.toJS() : {};
  let authorInfo = author ? author.toJS() : {};

  // 获取诗词详情
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

      // 获取诗词信息
      getPoem(id, category).then(() => {
        setShow(true);
      });

      // 获取用户对当前诗词的动态状况
      const login = checkLogin();
      if (login) {
        getDynamic(id, category);
      }
    }
  }, []);

  // 设置页面分享
  useEffect(() => {
    Taro.showShareMenu({
      withShareTicket: true,
    });
  }, []);

  // 获取诗人详细信息（取部分）
  useEffect(() => {
    const author_id = poemInfo.author_id;

    // 获取到当前诗词信息后再请求当前诗人信息
    if (poemInfo.id === Number(id)) {
      getAuthor(author_id, category);

      // 设置导航栏标题
      Taro.setNavigationBarTitle({
        title: poemInfo.title || poemInfo.chapter,
      });
    }
  }, [category, poemInfo.id]);

  const handleLike = () => {
    const login = checkLogin();

    if (!login) {
      setShowModel(true);
    } else {
      const curLike = !like;
      changeLikeStatus(curLike);

      postLike(poemInfo.id, category, curLike)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleCollect = () => {
    const login = checkLogin();

    if (!login) {
      setShowModel(true);
    } else {
      const curCollect = !collect;
      changeCollectStatus(curCollect);

      postCollect(poemInfo.id, category, curCollect)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleClose = () => {
    setShowModel(false);
  };

  const handleCancel = () => {
    setShowModel(false);
  };

  const handleConfirm = () => {
    Taro.switchTab({
      url: '/pages/User/index',
    });
  };

  const handleToastClose = () => {
    setShowToast(false);
  };

  const handleListen = () => {
    getAudio(id, category).then((status) => {
      if (status) {
        Taro.navigateTo({
          url: '/pages/Player/index',
        });
      } else {
        setShowToast(true);
      }
    });
  };

  const handleRecord = () => {
    const login = checkLogin();

    if (!login) {
      setShowModel(true);
    } else {
      Taro.navigateTo({
        url: '/pages/Record/index',
      });
    }
  };

  const handleMore = () => {
    Taro.navigateTo({
      url: `/pages/Poet/index?id=${authorInfo.id}&category=${category}`,
    });
  };

  return (
    <View>
      {!isEmptyObject(poemInfo) && show ? (
        <View className="poem-container">
          <View className="poem">
            <View>
              <View className="title">
                {poemInfo.title ? poemInfo.title : poemInfo.chapter}
              </View>
              {poemInfo.author ? (
                <View className="author">
                  <Text className="dynasty">
                    {getDynasty(poemInfo.dynasty)}
                  </Text>
                  <Text className="name">{poemInfo.author}</Text>
                </View>
              ) : null}
            </View>
            <View className={`content ${category !== '2' ? 'center': ''} `}>
              {poemInfo.content.split('|').map((item) => {
                return <Text>{item}</Text>;
              })}
            </View>
            <View className="action-list">
              <View className="action" onClick={handleLike}>
                {like ? (
                  <View className="at-icon at-icon-heart-2"></View>
                ) : (
                  <View className="at-icon at-icon-heart"></View>
                )}
                <Text className="name">喜欢</Text>
              </View>
              <View className="action" onClick={handleCollect}>
                {collect ? (
                  <View className="at-icon at-icon-star-2"></View>
                ) : (
                  <View className="at-icon at-icon-star"></View>
                )}
                <Text className="name">收藏</Text>
              </View>
              <View className="action">
                <Button className="button" openType="share">
                  <View className="at-icon at-icon-share"></View>
                  分享
                </Button>
              </View>
              <View className="action" onClick={handleListen}>
                <View className="at-icon at-icon-sound"></View>
                <Text className="name">试听</Text>
              </View>
              <View className="action" onClick={handleRecord}>
                <AtIcon prefixClass="fa" value="microphone" size="14"></AtIcon>
                <Text className="name">朗诵</Text>
              </View>
            </View>
          </View>
          {!isEmptyObject(authorInfo) && getIntro(authorInfo).length > 0 && (
            <View className="author-detail">
              <View className="top">
                <View className="name">作者</View>
                <View className="more" onClick={handleMore}>
                  更多
                </View>
              </View>
              <View className="intro">{getIntro(authorInfo)}</View>
            </View>
          )}
          <AtModal
            isOpened={showModel}
            title=""
            cancelText="一会再说"
            confirmText="马上登陆"
            onClose={handleClose}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            content="你尚未登陆，请先登录再进行该操作"
          />
          <AtToast
            isOpened={showToast}
            text="该诗词暂时无音频 ╮(╯▽╰)╭"
            onClose={handleToastClose}></AtToast>
        </View>
      ) : null}
    </View>
  );
}

const mapStateToProps = (state) => ({
  poemInfo: state.getIn(['poem', 'poemInfo']),
  authorInfo: state.getIn(['poem', 'authorInfo']),
  like: state.getIn(['poem', 'like']),
  collect: state.getIn(['poem', 'collect']),
});

const mapDispatchToProps = (dispatch) => {
  return {
    getPoem(poem_id, category) {
      return dispatch(getPoemInfo(poem_id, category));
    },
    getAuthor(author_id, category) {
      dispatch(getAuthorInfo(author_id, category));
    },
    getAudio(poem_id, category) {
      return dispatch(getAudioInfo(poem_id, category));
    },
    getDynamic(poem_id, category) {
      dispatch(getDynamicInfo(poem_id, category));
    },
    changeLikeStatus(status) {
      dispatch(changeLike(status));
    },
    changeCollectStatus(status) {
      dispatch(changeCollect(status));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Poem));
