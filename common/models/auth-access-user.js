let tools = require('../../tools');
let loopback = require("loopback");

module.exports = function (AuthAccessUser) {

  AuthAccessUser.resolveRelatedModels = function () {
    if (!this.AuthAccessToken) {
      var reg = this.registry;
      this.AuthAccessToken = reg.getModel('AuthAccessToken');
      this.AccessToken = reg.getModel('AccessToken');
      this.AuthUser = reg.getModel('AuthUser');
    }
  };

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
          oauthId: user.id,
          provider: 'ith-oauth',
          authScheme: 'ith',
        }
      }, {
        provider: 'ith-oauth',
        authScheme: 'ith',
        oauthId: user.id,
        email: user.email,
        realm: user.realm
      }, function (err, inst, ic) {
        if (err) {
          return res.redirect("/");
        }
        AccessToken.create({
          id: token.id,
          ttl: token.ttl,
          created: token.created,
          userId: inst.userId
        }, function (err, insts) {
          if (err) {
            console.log(err);
            return res.redirect("/");
          }
          res.cookie('access_token', accessToken, {signed: true});
          res.redirect("/");
        })
      })
    });
  };

  AuthAccessUser.observe('before save', function (ctx, next) {
    AuthAccessUser.resolveRelatedModels();
    let AuthUser = AuthAccessUser.AuthUser;
    if (ctx.instance) {
      let email = ctx.instance.email;
      let realm = ctx.instance.realm;
      AuthUser.findOrCreate({
        where: {
          email: email
        }
      }, {
        email: email,
        username:email,
        realm: realm
      }, function (err, user) {
        if (err) {
          return next(err);
        }
        ctx.instance.userId = user.id;
        next();
      })
    } else {
      next();
    }
  });

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
