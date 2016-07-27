let {resolveUrl,setUserInfo,getUserInfo}= require('./tools');
let valid = (app, success, error) => {
  if (!getUserInfo()) {
    app.$http.post(resolveUrl("/AuthUsers/me"), function (data, status, request) {
      if (data) {
        setUserInfo(data);
        success()
      } else {
        setUserInfo(null);
        error();
      }
    }).error(function () {
      error();
    });
  } else {
    success();
  }
};

let login = (userInfo) => {
  setUserInfo(userInfo);
};
let loginOut = () => {
  setUserInfo(null);
};

export {valid,login,loginOut};
