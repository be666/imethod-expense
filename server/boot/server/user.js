'use strict';

module.exports = function (app) {
  var user = app.models.user;
  user.create({email: 'bcaring@163.com', password: '123456'}, function (err, userInstance) {
    console.log(userInstance);
  });
};
