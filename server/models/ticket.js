'use strict';
let async = require('async');
let loopback = require('loopback');
module.exports = function (Ticket) {

  Ticket.resolveRelatedModels = function () {
    let registry = Ticket.registry;
    if (!Ticket.Element) {
      Ticket.Element = registry.getModel('Element');
      Ticket.AccountTicket = registry.getModel('AccountTicket');
    }
  };

  Ticket.observe('before save', function (ctx, next) {
    Ticket.resolveRelatedModels();
    let userId = null;
    let loopbackCTX = loopback.getCurrentContext();
    if (loopbackCTX) {
      let currentUser = loopbackCTX.get('currentUser');
      if (currentUser) {
        userId = currentUser.id;
      }
    }
    let Element = Ticket.Element;
    let currentDate = new Date();
    if (ctx.instance) {
      if (!ctx.instance.userId) {
        ctx.instance.userId = userId;
      }
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
      if (ctx.instance.elementName && !ctx.instance.elementId) {
        Element.findOrCreate({
          where: {
            name: ctx.instance.elementName
          }
        }, {
          name: ctx.instance.elementName
        }, function (err, ins, isc) {
          ctx.instance.elementId = ins.id;
          next(err);
        })
      } else {
        next();
      }
    }
  });

  Ticket.observe('after save', function (ctx, next) {
    Ticket.resolveRelatedModels();
    let AccountTicket = Ticket.AccountTicket;
    if (ctx.isNewInstance) {
      let ticketId = ctx.instance.id;
      let inner = ctx.instance.inner;
      let innerAccountId = ctx.instance.innerAccountId;
      let outer = ctx.instance.outer;
      let outerAccountId = ctx.instance.outerAccountId;
      let year = ctx.instance.year;
      let month = ctx.instance.month;
      let day = ctx.instance.day;
      async.parallel([
          function (callback) {
            if (!innerAccountId || !inner) {
              return callback();
            }
            AccountTicket.create({
              accountId: innerAccountId,
              ticketId: ticketId,
              inner: inner,
              year: year,
              month: month,
              day: day
            }, function (err, ins, inc) {
              callback(err)
            })
          },
          function (callback) {
            if (!outerAccountId || !outer) {
              return callback();
            }
            AccountTicket.create({
              accountId: outerAccountId,
              ticketId: ticketId,
              outer: outer,
              year: year,
              month: month,
              day: day
            }, function (err, ins, inc) {
              callback(err)
            })
          }
        ],
        function (err, results) {
          next(err);
        }
      )
      ;
    }
  })


};
