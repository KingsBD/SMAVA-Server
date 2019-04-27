var express = require('express'),
  router = express.Router(),
  mqttManager = require('../Class/MqttManager'); 

/* Se activa la escucha en mqtt */
mqttManager.ActiveMqttByZone();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Generator-Express MVC'
  });
});
