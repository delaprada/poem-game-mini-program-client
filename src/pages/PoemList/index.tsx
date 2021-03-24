import React, { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import VirtualList from '@tarojs/components/virtual-list';
import { getPoemList } from '@servers/servers';
import { CompoList } from '@constants/commonType';

import './index.less';

function PoemList() {
  const [category, setCategory] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [list, setList] = useState<CompoList>([]);
  const [offset, setOffset] = useState<number>(0); // 设置请求分片

  useEffect(() => {
    const router = getCurrentInstance().router;
    if (router) {
      const { category, title, desc } = router.params;

      if (category) {
        setCategory(Number(category));
      }

      if (title) {
        setTitle(title);

        Taro.setNavigationBarTitle({
          title: title,
        });
      }

      if (desc) {
        setDesc(desc);
      }

      getPoemList(category, offset)
        .then((res: any) => {
          setList(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const handleScrollToLower = () => {
    console.log('scroll to lower!!');
    const curOffset = offset + 1;
    setOffset(curOffset);
    getPoemList(category, curOffset)
      .then((res: any) => {
        setList(list.concat(res));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const listItem = React.memo(({ id, index, style, data }) => {
    const item = data[index];
    let { title, content, author, chapter } = item;
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
          <View className="profile">
            <Text className="title">{title ? title : chapter}</Text>
            <Text className="author">{author}</Text>
          </View>
          <View className="content">{content}</View>
        </View>
      </View>
    );
  });

  return (
    <View className="poemList-container">
      <View className="top">
        <View className="title">{title}</View>
        <View className="desc">{desc}</View>
      </View>

      {list.length > 0 && (
        <VirtualList
          height={800} /* 列表的高度 */
          width="100%" /* 列表的宽度 */
          itemData={list} /* 渲染列表的数据 */
          itemCount={list.length} /*  渲染列表的长度 */
          itemSize={80} /* 列表单项的高度  */
          onScrollToLower={handleScrollToLower} /* 可传入scroll-view的方法 */
        > 
          {listItem}
        </VirtualList>
      )}
    </View>
  );
}

export default React.memo(PoemList);
