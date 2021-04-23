import Taro from '@tarojs/taro';
import { getToken } from '@servers/servers';

const login = () => {
  Taro.login({})
    .then((res) => {
      if (res.code) {
        // 将code发送到后台，以获取token
        console.log(res.code);
        getToken(res.code)
          .then((res: any) => {
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

  if (!userInfo) {
    return false;
  }

  return true;
};

const fileUpload = (filePath, id, category, record_name, dt) => {
  let url = '';

  Taro.uploadFile({
    url: 'https://www.miniprogram.ltd/record',
    // url: 'http://127.0.0.1:7001/record',
    filePath: filePath,
    name: 'file',
    header: {
      'content-type': 'multipart/form-data',
      Authorization: Taro.getStorageSync('token'),
    },
    formData: {
      record_name: record_name,
      poem_id: id,
      category: category,
      dt: dt,
    },
    success: (res) => {
      console.log(res);
      url = res.data;
      // playAudio(url);
    },
    fail: (error) => {
      console.log('failed!');
      console.error(error);
    },
  });

  return url;
};

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

function formatPlayerTime(mss) {
  const minutes = Math.floor(mss / (1000 * 60));
  const seconds = Math.floor((mss % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

const getTitle = (item) => {
  let { dynamic_type, category, record_id, exec_time } = item;

  const userInfo = Taro.getStorageSync('userInfo');
  const nickName = userInfo.nickName;

  let resStr;

  const setType = {
    0: () => dynamic_type = '喜欢',
    1: () => dynamic_type = '收藏',
    2: () => dynamic_type = '朗诵',
    3: dynamic_type = '喜欢',
    'default': () => dynamic_type = '喜欢',
  };

  (setType[dynamic_type] || setType['default'])();

  const setCategory = {
    0: () => category = '宋词',
    1: () => category = '诗词',
    2: () => category = '论语',
    3: () => category = '诗经',
    'default': () => category = '诗词',
  };

  (setCategory[category] || setCategory['default'])();

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

const formatDateToMb: () => Array<string | number> = () => {
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
  let m = date.getMonth() + 1;
  const M = mb_str[m] + '月';
  const d = date.getDate();
  const yearArr = y.split('');

  const Y = yearArr.reduce((acc, cur) => {
    acc = acc + mb_str[cur];
    return acc;
  }, '');

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

const getAuthorCategory = (dynasty) => {
  if (dynasty === 'S') {
    return 0;
  } else if (dynasty === 'T') {
    return 1;
  }
};

const getIntro = (authorInfo) => {
  if (authorInfo.intro) {
    return authorInfo.intro;
  } else {
    return authorInfo.intro_s;
  }
};

const getDynamicType = (type) => {
  if (type === '0') {
    return '我的喜欢';
  } else if (type === '1') {
    return '我的收藏';
  } else if (type === '2') {
    return '我的作品';
  } else if (type === '3') {
    return '';
  }
};

const isSamePoem = (a, b) => a.id === b.id && a.category === b.category;

const uniqueElementBy = (arr) => {
  const res = arr.reduce((acc, v) => {
    if(!acc.some(x => isSamePoem(v, x))) {
      acc.push(v);
    }
    return acc;
  }, []);

  return res.slice(0, 15);
}

const changeColor = (text, searchText) => {
  const replaceStr = '<span>' + searchText + '</span>';
  const resText = text.replace(searchText, replaceStr);

  return resText;
};

export {
  login,
  check,
  checkLogin,
  fileUpload,
  getTitle,
  formatDateToMb,
  formatPlayerTime,
  isEmptyObject,
  getDynasty,
  getIntro,
  getDynamicType,
  getAuthorCategory,
  uniqueElementBy,
  changeColor,
};
