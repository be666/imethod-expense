/**
 * Created by bqxu on 15/12/14.
 */
let {apiUrl} = require('IConf');
String.prototype.startsWith = String.prototype.startsWith || function(str) {
    return !(str == null || str == "" || this.length == 0 || str.length > this.length) &&
           (this.substr(0, str.length) == str);
  };
String.prototype.endsWith = String.prototype.endsWith || function(str) {
    return !(str == null || str == "" || this.length == 0 || str.length > this.length) &&
           (this.substring(this.length - str.length) == str);
  };
let isNotEmptyStr = function(str) {
  return (typeof str == 'string' && str.length > 0);
};
Array.prototype.find = Array.prototype.find || function(fn, thisArg) {
    if (typeof  fn != "function") {
      throw new TypeError("fn不是一个有效的函数");
    }
    var arr = this;
    for (var i = 0, length = arr.length; i < length; i++) {
      if (fn.call(thisArg, arr[i], i, arr)) {
        return arr[i];
      }
    }
  };
Array.prototype.findIndex = Array.prototype.findIndex || function(fn, thisArg) {
    if (typeof  fn != "function") {
      throw new TypeError("fn不是一个有效的函数");
    }
    var arr = this;
    for (var i = 0, length = arr.length; i < length; i++) {
      if (fn.call(thisArg, arr[i], i, arr)) {
        return i;
      }
    }
    return -1;
  };
let isNotObj = function(obj) {
  return (typeof obj == "undefined" || obj == null);
};
let getDateTimeStr = function(currentDate) {
  currentDate = new Date(currentDate);
  let fmt = "yyyy-MM-dd hh:mm:ss";
  let o = {
    "M+": currentDate.getMonth() + 1, //月份
    "d+": currentDate.getDate(), //日
    "h+": currentDate.getHours(), //小时
    "m+": currentDate.getMinutes(), //分
    "s+": currentDate.getSeconds(), //秒
    "q+": Math.floor((currentDate.getMonth() + 3) / 3), //季度
    "S": currentDate.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (currentDate.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1,
      (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  }
  return fmt;
};
let getCurrentDateTimeStr = function() {
  return getDateTimeStr(new Date());
};
let getDateStr = function(currentDate) {
  currentDate = new Date(currentDate);
  let fmt = "yyyy-MM-dd";
  let o = {
    "M+": currentDate.getMonth() + 1, //月份
    "d+": currentDate.getDate(), //日
    "h+": currentDate.getHours(), //小时
    "m+": currentDate.getMinutes(), //分
    "s+": currentDate.getSeconds(), //秒
    "q+": Math.floor((currentDate.getMonth() + 3) / 3), //季度
    "S": currentDate.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (currentDate.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1,
      (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  }
  return fmt;
};
let getUUid = function(len, radix) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var uuid = [], i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
};
let getEUID = function(len, radix) {
  var chars = 'abcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
};
let CurrentContext = {};
let checkCurrentContext = function() {
  if (!CurrentContext.id) {
    CurrentContext.id = getUUid();
  }
  return CurrentContext;
};
let putCurrentContext = function(name, obj) {
  var context = checkCurrentContext();
  context[name] = obj;
};
let getCurrentContext = function(name) {
  var context = checkCurrentContext();
  return context[name];
};
let getUserInfo = function() {
  return getCurrentContext("userInfo");
};
let setUserInfo = function(obj) {
  if (obj != null) {
    obj.userRule = obj.userRule || [];
  }
  putCurrentContext("userInfo", obj);
};
let getUserRule = function() {
  return getCurrentContext("userRule");
};
let setUserRule = function(obj) {
  putCurrentContext("userRule", obj);
};
let getUserModule = function() {
  return getCurrentContext("userModule");
};
let setUserModule = function(obj) {
  putCurrentContext("userModule", obj);
};
let inArray = function(arr, el, comp) {
  arr = arr || [];
  for (var i = 0, k = arr.length; i < k; i++) {
    if (typeof comp == "function") {
      if (comp(arr[i], el)) {
        return true;
      }
    }
    else if (el == arr[i]) {
      return true;
    }
  }
};
let resolveUrl = function(url) {
  while (url.indexOf("/") == 0) {
    url = url.substring(1, url.length);
  }
  return apiUrl + "/" + url
};
let loadCode = function($http, codeType, cb) {
  $http.get(this.resolveUrl("/Codes"), {
    filter: {
      where: {
        codeType: codeType
      }
    }
  }, function(data, status, request) {
    cb(data)
  }).error(function(data, status, request) {
  })
};
let buildMap = function(list, code, codeName) {
  var map = {};
  list = list || [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    map[item[code]] = item[codeName];
  }
  return map;
};
let widthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let heightList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
/**
 * @return {number}
 */
let WH2Index = function(h, w) {
  return (h.charCodeAt() - 65 ) * widthList.length + parseInt(w) - 1;
};
let selectArg = function(id, name, unSelectedCode, unSelectedName, selected, selectedName) {
  var arg = {};
  arg["id"] = id;
  arg["text"] = name;
  arg["selected"] = {};
  arg["selected"][id] = selected;
  arg["selected"][name] = selectedName;
  arg["unSelected"] = {};
  arg["unSelected"][id] = unSelectedCode;
  arg["unSelected"][name] = unSelectedName;
  return arg;
};
let getDefArr = function() {
  return {
    type: 'Array',
    default: []
  }
};
let resolveHost = function(host) {
  if (!host || host == '') {
    host = window.location.host;
  }
  if (host.indexOf("://") == -1) {
    host = "http://" + host;
  }
  while (host.endsWith("/")) {
    host = host.substring(0, host.length - 1);
  }
  return host;
};
//snsapi_base
//snsapi_userinfo
let wxAuth = function(appId, redirectUri, state) {
  redirectUri = encodeURIComponent(redirectUri);
  state = state || '';
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`
};
let browser = {
  versions: function() {
    var u = navigator.userAgent, app = navigator.appVersion;
    return {         //移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    };
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
let getUrlParams = function(app, path_next) {
  let searchStr = window.location.search || '';
  if (searchStr.length == 0) {
    let href = window.location.href;
    if (href.indexOf("?") > -1) {
      searchStr = href.substring(href.indexOf("?"), href.length);
    }
  }
  if (path_next) {
    if (path_next.indexOf("?") > -1) {
      path_next = path_next.substring(0, path_next.indexOf("?"));
    }
  }
  let search = searchStr;
  while (search.startsWith("?")) {
    search = search.substring(1, search.length)
  }
  let searchArr = search.split("&");
  let searchObj = {};
  for (let sObj of searchArr) {
    let sArr = sObj.split("=");
    searchObj[sArr[0]] = sArr[1];
  }
  return {
    searchStr: searchStr,
    searchObj: searchObj,
    path_next: path_next
  }
};
let getTimeList = function() {
  return [
    {
      id: 9,
      text: '上午9:00-10:00'
    }, {
      id: 10,
      text: '上午10:00-11:00'
    }, {
      id: 11,
      text: '上午11:00-12:00'
    }, {
      id: 12,
      text: '中午12:00-1:00'
    }, {
      id: 13,
      text: '下午1:00-2:00'
    }, {
      id: 14,
      text: '下午2:00-3:00'
    }, {
      id: 15,
      text: '下午3:00-4:00'
    }, {
      id: 16,
      text: '下午4:00-5:00'
    }
  ];
};
let getTotalPage = function(totalRow, pageSize) {
  if (totalRow == 0) {
    return 0;
  }
  let totalPage;
  if (totalRow % pageSize == 0) {
    totalPage = totalRow / pageSize;
  } else {
    totalPage = (totalRow - totalRow % pageSize) / pageSize + 1;
  }
  return totalPage;
};
let getPages = function(totalPage, pageIndex) {
  if (!totalPage) {
    return [];
  }
  let arr = [];
  if (pageIndex - 2 > 0) {
    arr.push(pageIndex - 2);
  }
  if (pageIndex - 1 > 0) {
    arr.push(pageIndex - 1);
  }
  arr.push(pageIndex);
  if (pageIndex + 1 <= totalPage) {
    arr.push(pageIndex + 1);
  }
  if (pageIndex + 2 <= totalPage) {
    arr.push(pageIndex + 2);
  }
  return arr;
};
let buildScope = function(menuList, action) {
  let navList = [];
  let module = menuList.find(function(x) {
    return x.type == 'module' && x.action == action;
  });
  for (let subMenu of menuList) {
    if (subMenu.type == 'nav') {
      if (subMenu.parentId == module.id) {
        navList.push(subMenu);
      }
    }
  }
  return navList;
};
let buildRole = function(infoStr, action) {
  let infoList = infoStr.split('||');
  let _arr = {};
  let noFlag = true;
  for (var info of infoList) {
    let _info = info.split('|');
    while (_info.length < 3) {
      _info.push('normal');
    }
    if (_info[0] == action) {
      noFlag = false;
      if (_arr[_info[1]] && _arr[_info[1]].length > 0) {
        continue;
      }
      _arr[_info[1]] = _info[2];
    }
  }
  if (noFlag) {
    _arr['invalid'] = 'invalid';
  }
  return _arr;
};
let buildUserModule = function(infoStr) {
  let infoList = infoStr.split('||');
  let _arr = [];
  for (var info of infoList) {
    let _info = info.split('|');
    let index = _arr.find(function(x) {
      return x == _info[0];
    });
    if (!index) {
      _arr.push(_info[0])
    }
  }
  return _arr;
};
export {
  isNotEmptyStr,isNotObj,
  getDateTimeStr,getCurrentDateTimeStr,getDateStr,
  getUUid,getEUID,
  checkCurrentContext,putCurrentContext,getCurrentContext,
  getUserInfo,setUserInfo,
  getUserRule,setUserRule,
  getUserModule,setUserModule,buildUserModule,
  inArray,
  resolveUrl,loadCode,
  resolveHost,
  widthList,heightList,WH2Index,
  selectArg, getDefArr,
  buildScope,buildRole,
  wxAuth,browser,
  getUrlParams,
  getTimeList,
  getTotalPage,
  getPages
}
