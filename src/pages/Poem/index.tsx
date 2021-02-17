import React, { useState, useEffect } from 'react';
import { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { getPoemDetail, getAuthorDetail } from '@servers/servers';
import { isEmptyObject, getDynasty, getIntro } from '@utils/index';
import { PoemType, AuthorType } from '@constants/commonType';

import './index.less';

function Poem() {
  const [category, setCategory] = useState<number>(0);
  const [poemInfo, setPoemInfo] = useState<PoemType | object>({});
  const [authorInfo, setAuthorInfo] = useState<AuthorType | object>({});

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
          const poemInfo = res[0];
          console.log(poemInfo);

          if (poem_category === 0) {
            poemInfo.dynasty = 'S';
          }

          setPoemInfo(poemInfo);
        })
        .catch((err) => {
          console.error(err);
        });
    }
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

  return (
    <View>
      {!isEmptyObject(poemInfo) && (
        <View className="poem-container">
          <View className="poem">
            <View className="title">{poemInfo.title}</View>
            <View className="author">
              <Text>{getDynasty(poemInfo.dynasty)}</Text>
              <Text>{poemInfo.author}</Text>
            </View>
            <View className="content">
              {poemInfo.content.split('|').map((item) => {
                return <View>{item}</View>;
              })}
            </View>
            <View className="operation">
              <View>
                <Text>喜爱</Text>
              </View>
              <View>
                <Text>收藏</Text>
              </View>
              <View>
                <Text>分享</Text>
              </View>
              <View>
                <Text>试听</Text>
              </View>
              <View>
                <Text>朗诵</Text>
              </View>
            </View>
          </View>
          {!isEmptyObject(authorInfo) && (
            <View className="author-detail">
              <View className="top">
                <View className="name">{authorInfo.name}</View>
                <View className="more">更多</View>
              </View>
              <View className="intro">{getIntro(authorInfo)}</View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default React.memo(Poem);
