# 古诗词学习微信小程序
  
- 本项目为古诗词学习小程序的前端部分

- 项目使用的技术方案为：Taro + React Hook + TypeScript + Redux

- 古诗词数据源来自[chiness-poetry](https://github.com/chinese-poetry/chinese-poetry)开源仓库，以及对应的mysql格式数据[chinese-poetry-mysql](https://github.com/KomaBeyond/chinese-poetry-mysql)开源仓库。以上数据源的诗词均为繁体字，本项目基于数据源对数据进行简体化。

## 使用

```javascript
git clone https://github.com/delaprada/poem-game-mini-program-client.git
npm install
npm run dev:weapp
```

使用微信开发者工具，选择dist目录下的weapp文件夹。

本项目需要配合古诗词小程序服务端使用，github地址：[poem-game-mini-program-server](https://github.com/delaprada/poem-game-mini-program-server)

## 项目截图

|  首页   | 诗词详情  |  诗人详情   |
|  ----  | ----  | ----  |
| ![home](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/homepage.PNG)  | ![poem](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/poempage.PNG) |![home](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/poetpage.PNG)|
|  诗词列表   | 诗词试听  | 诗词朗诵 |
| ![poem](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/poemListpage.PNG)  | ![home](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/listenpage.PNG) |![poem](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/langsong.PNG)|
|  搜索   | 搜索结果  | 登录 |
| ![home](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/searchpage.PNG)  | ![poem](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/searchresultpage.PNG) | ![poem](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/login.PNG) |
|  个人中心   | 诗词游戏  | 关卡 |
| ![home](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/userpage.PNG)  | ![home](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/gamepage.PNG) |![poem](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/roundpage.PNG)|
|  选择题   | 填字游戏  | 识别游戏   |
| ![home](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/choicegamepage.PNG)  | ![poem](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/crosswordgamepage.PNG) |![home](https://github.com/delaprada/poem-game-mini-program-client/raw/dev/images/identifygamepage.PNG)  |

## 功能列表

- [x] 首页
  
- [x] 搜索功能

- [x] 登录
  
- [x] 诗词详情
  
- [x] 诗人详情

- [x] 喜爱、收藏、分享诗词

- [x] 试听、朗诵诗词

- [x] 诗词游戏（包括选择题、填字游戏、诗词识别游戏）

- [ ] 诗词游戏优化（闯关逻辑）

- [ ] 诗词试听优化（点击页面可以切换至诗词页） 
