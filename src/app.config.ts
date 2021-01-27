export default {
  pages: [
    'pages/index/index',
    'pages/login/login',
    'pages/request/request',
    'pages/reLogin/reLogin',
  ],
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        pagePath: 'pages/login/login',
        text: '登录',
      },
      {
        pagePath: 'pages/request/request',
        text: '请求',
      },
      {
        pagePath: 'pages/reLogin/reLogin',
        text: '重新登录',
      }
    ],
    color: '#000',
    selectedColor: '#56abe4',
    backgroundColor: '#fff',
    borderStyle: 'white',
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
}
