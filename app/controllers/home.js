var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  mdZone = mongoose.model('Zone'),
  mqtt = require('mqtt'),
  nodeManager = require('../Class/NodeManager');

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
  var nodeMessage = '{"data": {"temperature": 25,"humidity": 90,"soilHumidity": 50,"altitude": 10.5,"pressure": 90,"uv": 200,"brightness": 2000,"timestamp": "2019-04-17T16:24:37.295915988Z","gps": {"latitude": 52.3740364,"longitude": 4.9144401},"Battery": 60},"zoneId": "5ac012583e194204e0afef6b","firmwareVersion": "V1.0","config": {"mac": "24-EC-64-A1-A7-C4","rssi": -57,"channel": 13}}';
  nodeMessage = JSON.parse(nodeMessage.toString());
  nodeManager.SaveNodeData(nodeMessage);

  let zones = await mdZone.find({}, function (err, zone) {
    if (err) {
      console.log(err);
      return;
    }
    return zone
  });

  for (let i in zones) {
    
    clients[i] = mqtt.connect('ws://smava:12345678@206.189.202.242:8083');
    //clients[i] = mqtt.connect('mqtt://smava:12345678@206.189.202.242:1883')
    angularClients[i] = mqtt.connect('ws://smava:12345678@206.189.202.242:8083');

    clients[i].on('connect', function () {
      clients[i].subscribe(zones[i].topicAngular)
    })

    clients[i].on('message', function (topic, message) {

      var JsonNode = JSON.parse(message.toString());

      JsonNode.data.timestamp = new Date();

      nodeManager.SaveNodeData(JsonNode);

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
