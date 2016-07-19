let loopback = require('loopback');
module.exports = function (Model, options) {
  // Model is the model class
  // options is an object containing the config properties from model definition
  Model.defineProperty('createdAt', {type: Date, default: '$now'})
  Model.defineProperty('createdId', {type: Date, default: '$now'})
  Model.defineProperty('updatedAt', {type: Date, default: '$now'})
  Model.defineProperty('updatedId', {type: Date, default: '$now'})

  // Observe any insert/update event on Model
  Model.observe('before save', function event(ctx, next) {
    let loopbackCTX = loopback.getCurrentContext();
    let userId = null;
    if (loopbackCTX) {
      let currentUser = loopbackCTX.get('currentUser');
      if (currentUser) {
        userId = currentUser.id;
      }
    }
    if (ctx.instance) {
      ctx.instance.createdAt = new Date()
      if (userId) {
        ctx.instance.createdId = userId;
      }
    } else {
      ctx.data.updatedAt = new Date();
      if (userId) {
        ctx.instance.updatedId = userId;
      }
    }

    next()
  })
};
