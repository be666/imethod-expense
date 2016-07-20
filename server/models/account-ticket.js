'use strict';
module.exports = function (AccountTicket) {


  AccountTicket.resolveRelatedModels = function () {
    let registry = AccountTicket.registry;
    if (!AccountTicket.Account) {
      AccountTicket.Account = registry.getModel('Account');
    }
  };

  AccountTicket.observe('before save', function (ctx, next) {
    AccountTicket.resolveRelatedModels();
    let currentDate = new Date();
    if (ctx.instance) {
      if (!ctx.instance.inner) {
        ctx.instance.inner = 0;
      }
      if (!ctx.instance.outer) {
        ctx.instance.outer = 0;
      }
      if (!ctx.instance.year) {
        ctx.instance.year = currentDate.getFullYear();
      }
      if (!ctx.instance.month) {
        ctx.instance.month = currentDate.getMonth() + 1;
      }
      if (!ctx.instance.day) {
        ctx.instance.day = currentDate.getDate();
      }
    }
    next();
  });

  AccountTicket.observe('after save', function (ctx, next) {
    AccountTicket.resolveRelatedModels();
    let Account = AccountTicket.Account;
    if (ctx.isNewInstance) {
      let inner = ctx.instance.inner;
      let outer = ctx.instance.outer;
      let accountId = ctx.instance.accountId;
      if (inner - outer) {
        Account.findById(accountId, function (err, account) {
          account.money = account.money + (inner - outer);
          account.save(function (err, _acc) {
            next();
          })
        })
      } else {
        next();
      }
    } else {
      next();
    }
  })

};
