let tools = require('../../tools');
let async = require('async');
let loopback = require("loopback");
module.exports = function (AccountYearStatistic) {

  AccountYearStatistic.resolveRelatedModels = function () {
    let registry = AccountYearStatistic.registry;
    if (!AccountYearStatistic.Account) {
      AccountYearStatistic.Account = registry.getModel('Account');
    }
  };

  AccountYearStatistic.refresh = function (userId, year, next) {
    var ctx = loopback.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    if (userId != currentUser.id) {
      next(tools.getError('无效的用户!'))
    }
    AccountYearStatistic.resolveRelatedModels();
    let Account = AccountYearStatistic.Account;
    AccountYearStatistic.destroyAll({
      userId: userId,
      year: year
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
              year: year
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
            console.log(ticket.year)
            inner = inner + ticket.inner;
            outer = outer + ticket.outer;
          }
          AccountYearStatistic.create({
            userId: userId,
            accountId: account.id,
            year: year,
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

  AccountYearStatistic.remoteMethod("refresh", {
    accepts: [
      {arg: 'userId', type: 'number', required: true},
      {arg: 'year', type: 'number', required: true}
    ],
    returns: {type: 'Object', root: true},
    http: {path: "/refresh", verb: "post"}
  });

};
