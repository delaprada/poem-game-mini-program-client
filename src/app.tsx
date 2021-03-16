// 自定义主题颜色，因taro样式是sass所以需要引入scss文件
import './custom-theme.scss';
import './icon.scss';
import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { Provider } from 'react-redux';
import configStore from './store';

import './app.less';

const store = configStore();

class App extends Component {
  componentDidMount() {
    Taro.loadFontFace({
      global: true,
      family: 'FZquanfuti',
      source:
        'url(https://mini-program-1301716802.cos.ap-guangzhou.myqcloud.com/FZquanfuti1.TTF)',
    });
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
