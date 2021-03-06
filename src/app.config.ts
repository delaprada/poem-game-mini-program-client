export default {
  pages: [
    'pages/Home/index', // 首页
    'pages/User/index', // 个人中心页
    // 'pages/UserDynamicList/index', // 用户动态列表页（喜欢列表、收藏列表、作品列表）
    // 'pages/Search/index', // 搜索页
    // 'pages/PoemList/index', // 诗词列表
    // 'pages/Poem/index', // 诗词详情
    // 'pages/Poet/index', // 诗人详情
    // 'pages/Player/index', // 诗词试听
    // 'pages/Record/index', // 诗词朗诵录制
    'pages/GameCenter/index', // 诗词游戏
  ],
  subpackages: [
    {
      root: 'pages/UserDynamicList/',
      pages: ['index'],
    },
    {
      root: 'pages/Search/',
      pages: ['index'],
    },
    {
      root: 'pages/PoemList/',
      pages: ['index'],
    },
    {
      root: 'pages/Poem',
      pages: ['index'],
    },
    {
      root: 'pages/Poet',
      pages: ['index'],
    },
    {
      root: 'pages/Player',
      pages: ['index'],
    },
    {
      root: 'pages/Record',
      pages: ['index'],
    },
  ],
  tabBar: {
    list: [
      {
        iconPath: 'assets/images/home.png',
        selectedIconPath: 'assets/images/home_on.png',
        pagePath: 'pages/Home/index',
        text: '首页',
      },
      {
        iconPath: 'assets/images/game.png',
        selectedIconPath: 'assets/images/game_on.png',
        pagePath: 'pages/GameCenter/index',
        text: '游戏',
      },
      {
        iconPath: 'assets/images/user.png',
        selectedIconPath: 'assets/images/user_on.png',
        pagePath: 'pages/User/index',
        text: '我',
      },
    ],
    color: '#707070',
    selectedColor: '#597ef7',
    backgroundColor: '#fff',
    borderStyle: 'white',
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#839ef9',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  requiredBackgroundModes: ['audio'],
};
