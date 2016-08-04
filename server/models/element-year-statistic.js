let tools = require('../../tools');
let async = require('async');
let loopback = require("loopback");
module.exports = function (ElementYearStatistic) {

  ElementYearStatistic.resolveRelatedModels = function () {
    let registry = ElementYearStatistic.registry;
    if (!ElementYearStatistic.Ticket) {
      ElementYearStatistic.Ticket = registry.getModel('Ticket');
    }
  };

  ElementYearStatistic.refresh = function (userId, year, next) {
    var ctx = loopback.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    if (userId != currentUser.id) {
      return next(tools.getError('无效的用户!'))
    }
    ElementYearStatistic.resolveRelatedModels();
    let Ticket = ElementYearStatistic.Ticket;
    ElementYearStatistic.destroyAll({
      userId: userId,
      year: year
    }, function (err) {
      if (err) {
        return next(err)
      }
      Ticket.find({
        where: {
          userId: userId,
          year: year
        }
      }, function (err, ticketList) {
        if (err) {
          return next(err)
        }
        let elementList = [];
        for (let ticket of ticketList) {
          let element = elementList.find(function (x) {
            return x.userId == ticket.userId && x.year == ticket.year && x.elementId == ticket.elementId;
          });
          if (!element) {
            element = {
              userId: userId,
              elementId: ticket.elementId,
              year: year,
              inner: 0,
              outer: 0
            };
            elementList.push(element);
          }
          element.inner = element.inner + ticket.inner;
          element.outer = element.outer + ticket.outer;
        }
        async.eachSeries(elementList, function (element, nextE) {
          ElementYearStatistic.create({
            userId: userId,
            elementId: element.elementId,
            year: year,
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

  ElementYearStatistic.remoteMethod("refresh", {
    accepts: [
      {arg: 'userId', type: 'number', required: true},
      {arg: 'year', type: 'number', required: true}
    ],
    returns: {type: 'Object', root: true},
    http: {path: "/refresh", verb: "post"}
  });

};
