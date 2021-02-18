import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { AtIcon, AtModal } from 'taro-ui';
import {
  getPoemDetail,
  getAuthorDetail,
  getDynamic,
  postLike,
  postCollect,
} from '@servers/servers';
import { checkLogin, isEmptyObject, getDynasty, getIntro } from '@utils/index';
import { PoemType, AuthorType } from '@constants/commonType';

import './index.less';

function Poem() {
  const [category, setCategory] = useState<number>(0);
  const [poemInfo, setPoemInfo] = useState<PoemType | object>({});
  const [authorInfo, setAuthorInfo] = useState<AuthorType | object>({});
  const [like, setLike] = useState<boolean>(false);
  const [collect, setCollect] = useState<boolean>(false);
  const [showModel, setShowModel] = useState<boolean>(false);

  // 获取诗词详情
  useEffect(() => {
    const router = getCurrentInstance().router;
    if (router) {
      const { id, category } = router.params;

      const poem_id = Number(id);
      const poem_category = Number(category);

      if (poem_category) {
        setCategory(poem_category);
      }

      getPoemDetail(poem_id, poem_category)
        .then((res) => {
          const curPoem = res[0];

          if (poem_category === 0) {
            curPoem.dynasty = 'S';
          } else if (poem_category === 1) {
            curPoem.dynasty = 'T';
          }

          setPoemInfo(curPoem);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  useEffect(() => {
    // 设置页面分享
    Taro.showShareMenu({
      withShareTicket: true,
    });
  }, []);

  // 获取诗人详细信息
  useEffect(() => {
    const id = poemInfo.author_id;

    if (id !== undefined && (category === 0 || category === 1)) {
      getAuthorDetail(id, category)
        .then((res) => {
          setAuthorInfo(res[0]);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [category, poemInfo]);

  // 获取用户对当前诗词的动态状况
  useEffect(() => {
    const login = checkLogin();

    if (login) {
      const id = poemInfo.id;

      if (id !== undefined) {
        getDynamic(id, category)
          .then((res) => {
            const { like, collect } = res;

            setLike(like);
            setCollect(collect);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [category, poemInfo]);

  const handleLike = () => {
    const login = checkLogin();

    if (!login) {
      setShowModel(true);
    } else {
      const curLike = !like;
      setLike(curLike);

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
      setCollect(curCollect);

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

  const handleMore = () => {
    Taro.navigateTo({
      url: `/pages/Poet/index?id=${
        authorInfo.id
      }&category=${category}&authorInfo=${JSON.stringify(authorInfo)}`,
    });
  };

  return (
    <View>
      {!isEmptyObject(poemInfo) && (
        <View className="poem-container">
          <View className="poem">
            <View className="title">{poemInfo.title}</View>
            <View className="author">
              <Text className="dynasty">{getDynasty(poemInfo.dynasty)}</Text>
              <Text className="name">{poemInfo.author}</Text>
            </View>
            <View className="content">
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
                <Text className="name">喜爱</Text>
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
              <View className="action">
                <View className="at-icon at-icon-sound"></View>
                <Text className="name">试听</Text>
              </View>
              <View className="action">
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
        </View>
      )}
    </View>
  );
}

export default React.memo(Poem);
