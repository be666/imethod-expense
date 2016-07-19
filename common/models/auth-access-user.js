let tools = require('../../tools');
let loopback = require("loopback");

module.exports = function (AuthAccessUser) {

  AuthAccessUser.resolveRelatedModels = function () {
    if (!this.AuthAccessToken) {
      var reg = this.registry;
      this.AuthAccessToken = reg.getModel('AuthAccessToken');
      this.AccessToken = reg.getModel('AccessToken');
    }
  };

  AuthAccessUser.me = function (next) {
    var ctx = loopback.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    next(null, currentUser);
  };

  AuthAccessUser.remoteMethod("me", {
    returns: {type: 'Object', root: true},
    http: {path: "/me", verb: "post"}
  });

  AuthAccessUser.oauth = function (accessToken, res) {
    AuthAccessUser.resolveRelatedModels();
    let AuthAccessToken = AuthAccessUser.AuthAccessToken;
    let AccessToken = AuthAccessUser.AccessToken;
    AuthAccessToken.findById(accessToken, {include: "user"}, function (err, token) {
      if (err) {
        return res.redirect("/");
      }
      let user = token.user;
      AuthAccessUser.findOrCreate({
        where: {
          id: user.id,
          username: user.username,
          email: user.email,
          realm: user.realm
        }
      }, {
        id: user.id,
        username: user.username,
        email: user.email,
        realm: user.realm
      }, function (err, inst, ic) {
        if (err) {
          return res.redirect("/");
        }
        AccessToken.create(token, function (err,insts) {
          if (err) {
            return res.redirect("/");
          }
          res.cookie('access_token', accessToken, {signed: true});
          res.redirect("/");
        })
      })
    });
  };

  AuthAccessUser.remoteMethod("oauth", {
    accepts: [
      {arg: 'access_token', type: 'string'},
      {arg: 'res', type: 'object', 'http': {source: 'res'}}
    ],
    http: {path: "/oauth", verb: "get"}
  });

  AuthAccessUser.config = function (next) {
    let authConfig = AuthAccessUser.app.get('auth');
    next(null, authConfig.appId)
  };

  AuthAccessUser.remoteMethod("config", {
    returns: {type: 'Object', root: true},
    http: {path: "/config", verb: "get"}
  });
};
