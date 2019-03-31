var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  jwt = require('jsonwebtoken'),
  ControlSession = require('../Class/ControlSession');;

module.exports = function (app) {
  app.use('/', router);
};

router.post('/login', function (req, res, next) {

  var SbUserName = req.body.username,
    sbPassword = req.body.password;

  ControlSession.login(SbUserName, sbPassword, res, next);

});
