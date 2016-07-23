let loopback = require("loopback");
module.exports = function(AuthUser) {

  AuthUser.me = function (next) {
    var ctx = loopback.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    next(null, currentUser);
  };

  AuthUser.remoteMethod("me", {
    returns: {type: 'Object', root: true},
    http: {path: "/me", verb: "post"}
  });
};
