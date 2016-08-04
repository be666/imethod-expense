let tools = require('../../tools');
let async = require('async');
let loopback = require("loopback");
module.exports = function (ElementMonthStatistic) {

  ElementMonthStatistic.resolveRelatedModels = function () {
    let registry = ElementMonthStatistic.registry;
    if (!ElementMonthStatistic.Ticket) {
      ElementMonthStatistic.Ticket = registry.getModel('Ticket');
    }
  };

  ElementMonthStatistic.refresh = function (userId, year, month, next) {
    var ctx = loopback.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    if (userId != currentUser.id) {
      next(tools.getError('无效的用户!'))
    }
    ElementMonthStatistic.resolveRelatedModels();
    let Ticket = ElementMonthStatistic.Ticket;
    ElementMonthStatistic.destroyAll({
      userId: userId,
      year: year,
      month: month
    }, function (err) {
      if (err) {
        return next(err)
      }
      Ticket.find({
        where: {
          userId: userId,
          year: year,
          month: month
        }
      }, function (err, ticketList) {
        if (err) {
          return next(err)
        }
        let elementList = [];
        for (let ticket of ticketList) {
          let element = elementList.find(function (x) {
            return x.userId == ticket.userId && x.year == ticket.year && x.month == ticket.month && x.elementId == ticket.elementId;
          });
          if (!element) {
            element = {
              userId: userId,
              elementId: ticket.elementId,
              year: year,
              month: month,
              inner: 0,
              outer: 0
            };
            elementList.push(element);
          }
          element.inner = element.inner + ticket.inner;
          element.outer = element.outer + ticket.outer;
        }
        async.eachSeries(elementList, function (element, nextE) {
          ElementMonthStatistic.create({
            userId: userId,
            elementId: element.elementId,
            year: year,
            month: month,
            inner: element.inner,
            outer: element.outer
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

  ElementMonthStatistic.remoteMethod("refresh", {
    accepts: [
      {arg: 'userId', type: 'number', required: true},
      {arg: 'year', type: 'number', required: true},
      {arg: 'month', type: 'number', required: true}
    ],
    returns: {type: 'Object', root: true},
    http: {path: "/refresh", verb: "post"}
  });
};
