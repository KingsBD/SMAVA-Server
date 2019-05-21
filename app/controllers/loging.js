var express = require('express'),
  router = express.Router(),
  ControlSession = require('../Class/SessionManager');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/loging', function (req, res, next) {

  var SbUserName = req.body.username,
    sbPassword = req.body.password;
  ControlSession.loging(SbUserName, sbPassword, res, next);

});

router.post('/loginAndGetZones', function (req, res, next) {

  var SbUserName = req.body.username,
    sbPassword = req.body.password;
  ControlSession.loginAndGetZones(SbUserName, sbPassword, res, next);

});