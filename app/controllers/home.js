var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  theme = mongoose.model('Theme'),
  nodo = mongoose.model('Nodo'),
  mqtt = require('mqtt'),
  ControlNode = require('../Class/ControlNode');
/*Variables globa les*/
var clients = [], topic = [], observableT;

var nodeMessage = '{"data": {"temperature": 25,"humidity": 90,"soilHumidity": 50,"altitude": 10.5,"pressure": 90,"uv": 200,"brightness": 2000,"timestamp": "2016-11-25T16:24:37.295915988Z","gps": {"latitude": 52.3740364,"longitude": 4.9144401},"Battery": 60},"zoneId": "5ac012583e194204e0afef6b","firmwareVersion": "V1.0","config": {"mac": "24-EC-64-A1-A7-C4","rssi": -57,"channel": 13}}';

/*
  hostname: '206.189.202.242',
  port: 8083,
  username: 'smava',
  password: '12345678',
  protocol: 'ws',
  hostname: 'm15.cloudmqtt.com',
  port: 38025,
  username: 'wejhvkqd',
  password: 'kzPt9khkXUDk',
  protocol: 'wss',
  rejectUnauthorized: false
*/
(async function () {
  let zones = await theme.find({}, function (err, zone) {
    if (err) {
      console.log(err);
      return;
    }
    return zone
  });

  for (let i in zones) {
    clients[i] = mqtt.connect('ws://smava:12345678@206.189.202.242:8083')

    topic[i] = zones[i]

    clients[i].on('connect', function () {
      clients[i].subscribe(topic[i].TopicNode)
    })

    clients[i].on('message', function (topic, message) {
      // message is Buffer
      var JsonNode = JSON.parse(message.toString());

      ControlNode.SaveNodeData(JsonNode);

      clients[i].end()

    })

  }
  
  setTimeout(() => {
    currentData()    
  }, 1000 * 10);

 //var temporizador = setInterval(function () { currentData() }, 1000 * 60); // 10000ms = 10s

})();



function currentData() {
  console.log(1);
  var myDate = new Date();
  var nuRandown = myDate.getMinutes();

  if (nuRandown < 50) {
    nuRandown = -1 * (nuRandown / 100);
  } else {
    nuRandown = 1 * (nuRandown / 100);
  }

  /*
  var JsonNode =
  {
      zoneId: "5ac012583e194204e0afef6b",
      firmwareVersion: "V1.0",
      data:
            {
             temperature: Math.floor((Math.random() * 40) + 1),
             soilTemperature: Math.floor((Math.random() * 40) + 1),
             humidity: Math.floor((Math.random() * 120) + 1),
             soilHumidity: Math.floor((Math.random() * 120) + 1),
             altitude: Math.floor((Math.random() * 200) + 1),
             pressure: Math.floor((Math.random() * 30) + 1),
             volatileGases: Math.floor((Math.random() * 30) + 1),
             uv: Math.floor((Math.random() * 100) + 1),
             brightness: 20+ nuRandown,
             timestamp: myDate,
             battery: Math.floor((Math.random() * 100) + 1),
             gps:
                  {
                    latitude: 37.775 + nuRandown,
                    longitude: -122.434 + nuRandown
                  }
            },
      config: {

                  mac: "24-EC-64-A1-A7-C4",
                  rssi: -57,
                  channel: 13
                }
  }*/

  var JsonNode =
    [
      {
        "data": {
          "temperature": 30,
          "humidity": 80,
          "soilHumidity": 45,
          "pressure": 1027,
          "uv": 3,
          "brightness": 623,
          "floorTemperature": 27,
          "volatileGases": 628,
          "panelvoltaje": 7,
          "timestamp": myDate,
          "gps": {
            "latitude": "10.399080",
            "longitude": "-75.504142"
          },
          "batteryVoltaje": "4.01",
          "batteryTmeperature": 32
        },
        "zoneId": "5ac012583e194204e0afef6b",
        "firmwareVersion": "V1.0",
        "config": {
          "mac": "24-EC-64-A1-A7-C4",
          "rssi": "-67",
          "channel": 13
        }
      },
      {
        "data": {
          "temperature": 28.7,
          "humidity": 83,
          "soilHumidity": 57,
          "pressure": 1010,
          "uv": 2,
          "brightness": 626,
          "floorTemperature": 27,
          "volatileGases": 602,
          "panelvoltaje": 10,
          "timestamp": myDate,
          "gps": {
            "latitude": "10.399062",
            "longitude": "-75.504142"
          },
          "batteryVoltaje": "4.13",
          "batteryTmeperature": 30
        },
        "zoneId": "5ac012583e194204e0afef6b",
        "firmwareVersion": "V1.0",
        "config": {
          "mac": "24-EC-64-A1-A7-C4",
          "rssi": "-67",
          "channel": 13
        }
      },
      {
        "data": {
          "temperature": 29,
          "humidity": 80,
          "soilHumidity": 49,
          "pressure": 1000,
          "uv": 2,
          "brightness": 618,
          "floorTemperature": 25,
          "volatileGases": 641,
          "panelvoltaje": 4,
          "timestamp": myDate,
          "gps": {
            "latitude": "10.399048",
            "longitude": "-75.504090"
          },
          "batteryVoltaje": "4.16",
          "batteryTmeperature": 31
        },
        "zoneId": "5ac012583e194204e0afef6b",
        "firmwareVersion": "V1.0",
        "config": {
          "mac": "24-EC-64-A1-A7-C4",
          "rssi": "-67",
          "channel": 13
        }
      },
      {
        "data": {
          "temperature": 28.1,
          "humidity": 83,
          "soilHumidity": 56,
          "pressure": 1009,
          "uv": 2,
          "brightness": 606,
          "floorTemperature": 28,
          "volatileGases": 634,
          "panelvoltaje": 6,
          "timestamp": myDate,
          "gps": {
            "latitude": "10.399043",
            "longitude": "-75.504156"
          },
          "batteryVoltaje": "4.1",
          "batteryTmeperature": 30
        },
        "zoneId": "5ac012583e194204e0afef6b",
        "firmwareVersion": "V1.0",
        "config": {
          "mac": "24-EC-64-A1-A7-C4",
          "rssi": "-67",
          "channel": 13
        }
      },
      {
        "data": {
          "temperature": 29.3,
          "humidity": 85,
          "soilHumidity": 60,
          "pressure": 1019,
          "uv": 3,
          "brightness": 611,
          "floorTemperature": 25,
          "volatileGases": 616,
          "panelvoltaje": 5,
          "timestamp": myDate,
          "gps": {
            "latitude": "10.399024",
            "longitude": "-75.504099"
          },
          "batteryVoltaje": "4.07",
          "batteryTmeperature": 32
        },
        "zoneId": "5ac012583e194204e0afef6b",
        "firmwareVersion": "V1.0",
        "config": {
          "mac": "24-EC-64-A1-A7-C4",
          "rssi": "-67",
          "channel": 13
        }
      }
    ];

  /*var message = JSON.stringify(JsonNode);*/
  var message = [];

  for (let index = 0; index < JsonNode.length; index++) {
    message.push(JSON.stringify(JsonNode[index]));
  }

  angularClients = mqtt.connect('ws://smava:12345678@206.189.202.242:8083')
  angularClients.on('connect', function () {
    angularClients.subscribe("A1")
    for (let index = 0; index < message.length; index++) {
      angularClients.publish("A1", message[index]);
    }
    angularClients.end()
  })

  for (let i in topic) {
    /*mqtt://wejhvkqd:kzPt9khkXUDk@m15.cloudmqtt.com:18025 */
    clients[i] = mqtt.connect('ws://smava:12345678@206.189.202.242:8083')
    clients[i].on('connect', function () {
      for (let index = 0; index < message.length; index++) {
        clients[i].publish(topic[i].TopicNode, message[index]);
      }
    })

  }
}

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Generator-Express MVC'
  });
});
