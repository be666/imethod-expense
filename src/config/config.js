let config = {
  "siteUrl": "",
  "apiUrl": "/api",
  "authUrl": "http://auth.bcaring.cn/login?appId=",
  "siteName": "expense",
  "loginUrl": "/login",
  "uploadUrl": "/fileUpload",
  "auth": {
    "ignoreAll": false,
    "ignore": [
      "/login",
      "/sign"
    ]
  }
};

module.exports = config;
