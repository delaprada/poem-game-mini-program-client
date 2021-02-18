import Taro from '@tarojs/taro';
import { getToken } from '@servers/servers';

const login = () => {
  Taro.login({})
    .then((res) => {
      if (res.code) {
        // 将code发送到后台，以获取token
        console.log(res.code);
        getToken(res.code)
          .then((res) => {
            const { token } = res;

            console.log('获取token');
            console.log(token);

            // 将token存储到Storage中
            Taro.setStorageSync('token', token);

            // 如果是老用户，获取用户信息
            // if (userExist) {
            //   const { userInfo } = res;
            //   Taro.setStorageSync('userInfo', userInfo);
            // }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        console.log('登录失败! ' + res.errMsg);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

function check() {
  // 检查session是否过期
  Taro.checkSession({})
    .then((res) => {
      console.log(res);
      console.log('session没过期，不用重新登录');
    })
    .catch(async (err) => {
      console.log(err);
      console.log('session已过期，要重新登录');

      // 重新登录
      await login();
    });
}

const checkLogin = () => {
  const userInfo = Taro.getStorageSync('userInfo');

  if(!userInfo) {
    return false;
  }

  return true;
}

const add0 = (m) => {
  return m < 10 ? '0' + m : m;
};

const format = (shijianchuo) => {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  // var h = time.getHours();
  // var mm = time.getMinutes();
  // var s = time.getSeconds();
  return (
    y + '-' + add0(m) + '-' + add0(d)
    // ' ' +
    // add0(h) +
    // ':' +
    // add0(mm) +
    // ':' +
    // add0(s)
  );
};

const getTitle = (item) => {
  let { dynamic_type, category, record_id, exec_time } = item;

  const userInfo = Taro.getStorageSync('userInfo');
  const nickName = userInfo.nickName;

  let resStr;

  switch (dynamic_type) {
    case 0: {
      dynamic_type = '喜欢';
      break;
    }
    case 1: {
      dynamic_type = '收藏';
      break;
    }
    case 2: {
      dynamic_type = '朗诵';
      break;
    }
    default:
      dynamic_type = '喜欢';
      break;
  }

  switch (category) {
    case 0: {
      category = '宋词';
    }
    case 1: {
      category = '诗词';
    }
    case 2: {
      category = '论语';
    }
    case 2: {
      category = '诗经';
    }
    default:
      category = '诗词';
  }

  exec_time = format(exec_time);

  if (!record_id) {
    resStr = `${nickName} ${dynamic_type}了这篇${category}`;
  } else {
    resStr = `${nickName} 朗诵了这篇${category}`;
  }

  return {
    resStr,
    exec_time,
  };
};

const formatDateToMb = () => {
  let date = new Date();
  let mb_str = [
    '零',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
    '十一',
    '十二',
  ];
  let y = date.getFullYear().toString();
  let Y = '';
  let m = date.getMonth() + 1;
  let M = mb_str[m] + '月';
  let d = date.getDate();
  for (let i = 0; i < y.split('').length; i++) {
    Y = Y + mb_str[y.split('')[i]];
  }
  return [Y, M, d];
};

const isEmptyObject = (obj) => {
  if (Object.keys(obj).length === 0) {
    return true;
  }
  return false;
};

const getDynasty = (dynasty) => {
  if (!dynasty) {
    return '';
  } else if (dynasty === 'S') {
    return '[宋]';
  } else if (dynasty === 'T') {
    return '[唐]';
  }
};

const getIntro = (authorInfo) => {
  if (authorInfo.intro) {
    return authorInfo.intro;
  } else {
    return authorInfo.intro_s;
  }
};

export {
  login,
  check,
  checkLogin,
  getTitle,
  formatDateToMb,
  isEmptyObject,
  getDynasty,
  getIntro,
};