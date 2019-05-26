var express = require('express'),
  router = express.Router(),
  userManager = require('../Class/UserManager'),  
  mqttManager = require('../Class/MqttManager');   

/* Se activa la escucha en mqtt */
mqttManager.ActiveMqttByZone();

/* En caso de no haber un usuario administrador se crea */
userManager.CreateAdmin();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Generator-Express MVC'
  });
});
