'use strict';
let loopback = require('loopback');
module.exports = function (Account) {

  Account.observe('before save', function (ctx, next) {

    let loopbackCTX = loopback.getCurrentContext();
    let userId = null;
    if (loopbackCTX) {
      let currentUser = loopbackCTX.get('currentUser');
      if (currentUser) {
        userId = currentUser.id;
      }
    }
    if (ctx.instance) {
      if (!ctx.instance.money) {
        ctx.instance.money = 0;
      }
      if (!ctx.instance.userId) {
        ctx.instance.userId = userId;
      }
      //可透支
      if (!ctx.instance.signed) {
        ctx.instance.signed = 0;
      }
      //固定资产
      if (!ctx.instance.assets) {
        ctx.instance.assets = 0;
      }
    }
    next();
  })

  Account.setup = function () {
    Account.base.setup.call(this);
    var AccountModel = this;
    AccountModel.validatesUniquenessOf('name', {message: 'Account already exists'});
  };

  Account.setup();
};
