let config = {
  siteUrl: "http://bcaring.cn",
  apiUrl: "/api",
  loginUrl: "/login",
  uploadUrl: "/fileUpload",
  auth: {
    ignoreAll: false,
    ignore: [
      "/login",
      "/sign"
    ]
  }
};

module.exports = config;
