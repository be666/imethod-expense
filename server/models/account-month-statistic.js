let tools = require('../../tools');
let async = require('async');
let loopback = require("loopback");
module.exports = function (AccountMonthStatistic) {

  AccountMonthStatistic.resolveRelatedModels = function () {
    let registry = AccountMonthStatistic.registry;
    if (!AccountMonthStatistic.AccountTicket) {
      AccountMonthStatistic.Account = registry.getModel('Account');
      AccountMonthStatistic.AccountTicket = registry.getModel('AccountTicket');
    }
  };

  AccountMonthStatistic.refresh = function (userId, year, month, next) {
    var ctx = loopback.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    if (userId != currentUser.id) {
      next(tools.getError('无效的用户!'))
    }
    AccountMonthStatistic.resolveRelatedModels();
    let Account = AccountMonthStatistic.Account;
    AccountMonthStatistic.destroyAll({
      userId: userId,
      year: year,
      month: month
    }, function (err) {
      if (err) {
        return next(err)
      }
      Account.find({
        where: {
          userId: userId,
        },
        include: {
          relation: 'accountTicket',
          scope: {
            where: {
              year: year,
              month: month
            }
          }
        }
      }, function (err, account) {
        let accountList = JSON.parse(JSON.stringify(account));
        async.eachSeries(accountList, function (account, nextE) {
          if (err) {
            return next(err)
          }
          let inner = 0;
          let outer = 0;
          for (let ticket of account.accountTicket) {
            inner = inner + ticket.inner;
            outer = outer + ticket.outer;
          }
          AccountMonthStatistic.create({
            userId: userId,
            accountId: account.id,
            year: year,
            month: month,
            inner: inner,
            outer: outer
          }, function (err) {
            nextE(err)
          })
        }, function (err) {
          if (err) {
            return next(err)
          }
          next(null, 'success');
        })
      });
    });
  };

  AccountMonthStatistic.remoteMethod("refresh", {
    accepts: [
      {arg: 'userId', type: 'number', required: true},
      {arg: 'year', type: 'number', required: true},
      {arg: 'month', type: 'number', required: true}
    ],
    returns: {type: 'Object', root: true},
    http: {path: "/refresh", verb: "post"}
  });
};
