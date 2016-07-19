let config = {
  "siteUrl": (function () {
    return window.location.origin;
  }()),
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
