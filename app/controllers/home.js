var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  mdZone = mongoose.model('Zone'),
  mqtt = require('mqtt'),
  ControlNode = require('../Class/NodeManager');
/*Variables globa les*/
var clients = [], angularClients = [];

/*
  Servidor de entrega.
  hostname: '206.189.202.242',
  port: 8083,
  username: 'smava',
  password: '12345678',
  protocol: 'ws',
  Pruebas
  hostname: 'm15.cloudmqtt.com',
  port: 38025,
  username: 'wejhvkqd',
  password: 'kzPt9khkXUDk',
  protocol: 'wss',
  rejectUnauthorized: false
*/

(async function () {

  let zones = await mdZone.find({}, function (err, zone) {
    if (err) {
      console.log(err);
      return;
    }
    return zone
  });

  for (let i in zones) {
    clients[i] = mqtt.connect('mqtt://smava:12345678@206.189.202.242:1883')
    angularClients[i] = mqtt.connect('ws://smava:12345678@206.189.202.242:8083')

    clients[i].on('connect', function () {
      clients[i].subscribe(zones[i].topicAngular)
    })

    clients[i].on('message', function (topic, message) {

      var JsonNode = JSON.parse(message.toString());

      JsonNode.data.timestamp = new Date();

      ControlNode.SaveNodeData(JsonNode);

      angularClients[i].on('connect', function () {
        angularClients[i].subscribe(zones[i].topicAngular)
        angularClients[i].publish(zones[i].topicAngular, JSON.stringify(JsonNode));
        console.log(JsonNode);
        angularClients[i].end()
      })

      clients[i].end()

    })

  }

})();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Generator-Express MVC'
  });
});
