import React, { useEffect, useState } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import VirtualList from '@tarojs/components/virtual-list';
import { getCompositionList } from '@servers/servers';
import { getIntro } from '@utils/index';
import { AuthorType, CompoList } from '@constants/commonType';

import './index.less';

function Poet() {
  const [category, setCategory] = useState<number>(0);
  const [authorInfo, setAuthorInfo] = useState<AuthorType>({});
  const [compoList, setCompoList] = useState<CompoList>([]);

  useEffect(() => {
    const router = getCurrentInstance().router;
    if (router) {
      const { id, category, authorInfo } = router.params;

      setCategory(Number(category));

      if (authorInfo) {
        const info = JSON.parse(authorInfo);
        setAuthorInfo(info);
        Taro.setNavigationBarTitle({
          title: info.name,
        });
      }
      getCompositionList(id, category)
        .then((res) => {
          setCompoList(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const listItem = React.memo(({ id, index, style, data }) => {
    const item = data[index];
    let { title, content, author } = item;
    content = content.replace(/\|/g, '');

    const handleClick = (id) => {
      Taro.navigateTo({
        url: `/pages/Poem/index?id=${id}&category=${category}`,
      });
    };

    return (
      <View className="item-container">
        <View
          className="item-content"
          hoverClass="hover-style"
          onClick={() => handleClick(item.id)}>
          <Text className="title">{title}</Text>
          <View className="content">{content}</View>
        </View>
      </View>
    );
  });

  return (
    <View className="poet-container">
      <View className="intro">
        <View className="title">简介</View>
        <View className="content">{getIntro(authorInfo)}</View>
      </View>

      <View className="composition-list">
        <View className="title">
          作品
          <Text className="count">共收录{compoList.length}首</Text>
        </View>
        <View className="list">
          <VirtualList
            height={500} /* 列表的高度 */
            width="100%" /* 列表的宽度 */
            itemData={compoList} /* 渲染列表的数据 */
            itemCount={compoList.length} /*  渲染列表的长度 */
            itemSize={80} /* 列表单项的高度  */
          >
            {listItem}
          </VirtualList>
        </View>
      </View>
    </View>
  );
}

export default React.memo(Poet);
