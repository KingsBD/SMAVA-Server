/**
 * Class Node
 * This class has all the methods that control the node data.
*/
'use strict'
var mongoose = require('mongoose'),
  nodo = mongoose.model('Nodo'),
  theme = mongoose.model('Theme'),
  User = mongoose.model('User');

var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert('public\\components\\smava-194123-firebase-adminsdk-dr03y-e8ec460d82.json'),
  databaseURL: 'https://smava-194123.firebaseio.com'
});

module.exports = class ControlNode {

  constructor() {
    this.nuId = 0;
    this.mac = '';
    this.lat = 0;
    this.lng = 0;
    this.temperature = 0;
    this.humidity = 0;
    this.brightness = 0;
    this.soilHumidity = 0;
    this.altitude = 0;
    this.pressure = 0;
    this.uv = uv;
    this.battery = '';
    this.zoneId = '';
    this.date = Date.now;
  }

  /**
   * SetDataNode
   * Use the variable to set params
   * @param {String} nuId 
   * @param {String} mac 
   * @param {Number} lat 
   * @param {Number} lng 
   * @param {Number} temperature 
   * @param {Number} humidity 
   * @param {Number} brightness 
   * @param {Number} soilHumidity 
   * @param {Number} altitude 
   * @param {Number} pressure 
   * @param {Number} uv 
   * @param {Number} battery 
   * @param {String} zoneId 
   * @param {Date} date 
  */
  static SetDataNode
    (
      nuId, mac, lat, lng, temperature, humidity, brightness, soilHumidity,
      altitude, pressure, uv, battery, zoneId, date
    ) {
    this.nuId = nuId;
    this.mac = mac;
    this.lat = lat;
    this.lng = lng;
    this.temperature = temperature;
    this.humidity = humidity;
    this.brightness = brightness;
    this.soilHumidity = soilHumidity;
    this.altitude = altitude;
    this.pressure = pressure;
    this.uv = uv;
    this.battery = battery;
    this.zoneId = zoneId;
    this.date = date;
  }

  /**
   * SaveNodeData
   * Recive a Json to save the node in the DB.
   * @param {Json} JsonNode 
   */
  static SaveNodeData(JsonNode) {
    let newNode = new nodo(
      {
        mac: JsonNode.config.mac,
        lat: JsonNode.data.gps.latitude,
        lng: JsonNode.data.gps.longitude,
        temperature: JsonNode.data.temperature,
        soilTemperature: JsonNode.data.floorTemperature,
        humidity: JsonNode.data.humidity,
        brightness: JsonNode.data.brightness,
        soilHumidity: JsonNode.data.soilHumidity,
        altitude: JsonNode.data.altitude,
        pressure: JsonNode.data.pressure,
        volatileGases: JsonNode.data.volatileGases,
        uv: JsonNode.data.uv,
        Battery: JsonNode.data.Battery,
        zoneId: JsonNode.zoneId,
        date: JsonNode.data.timestamp
      }
    );
    newNode.save();

  }

  /**
   * SaveNodeData
   * Use the actual instance of node for save data in DB
   */
  SaveNodeData() {
    let newNode = new nodo(
      {
        mac: this.mac,
        lat: this.lat,
        lng: this.lng,
        temperature: this.temperature,
        humidity: this.humidity,
        brightness: this.brightness,
        soilHumidity: this.soilHumidity,
        altitude: this.altitude,
        pressure: this.pressure,
        uv: this.uv,
        Battery: this.battery,
        zoneId: this.zoneId,
        date: this.date
      }
    );
    newNode.save();

  }

  static SendAlert(zoneid, Atemperature, Ahumidity, Abrightness) {

    theme.findOne({ _id: zoneid }, function (err, searchZone) {
      if (err) {
        console.log("Not found Zone");
      }

      User.findOne({ _id: searchZone.userId }, function (err, searchUser) {
        if (err) {
          console.log("Not found user");
        }

        if (Atemperature <= searchZone.MinTemperature || Atemperature >= searchZone.MaxTemperature) {

          var message = {
            notification: {
              title: 'State of temperature',
              body: 'The actual temperature is above or under the normal state'
            },
            token: searchUser.token
          };

          // Send a message to the device corresponding to the provided
          // registration token.
          admin.messaging().send(message).then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
          }).catch((error) => {
            console.log('Error sending message:', error);
          });
        }

        if (Ahumidity <= searchZone.MinHumidity || Ahumidity >= searchZone.MaxHumidity) {

          var message = {
            notification: {
              title: 'State of humidity',
              body: 'The actual humidity is above or under the normal state'
            },
            token: searchUser.token
          };
          // Send a message to the device corresponding to the provided
          // registration token.
          admin.messaging().send(message).then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
          }).catch((error) => {
            console.log('Error sending message:', error);
          });
        }

        if (Abrightness <= searchZone.MinBrightness || Abrightness >= searchZone.MaxBrightness) {

          var message = {
            notification: {
              title: 'State of brightness',
              body: 'The actual brightness is above or under the normal state'
            },
            token: searchUser.token
          };
          // Send a message to the device corresponding to the provided
          // registration token.
          admin.messaging().send(message).then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
          }).catch((error) => {
            console.log('Error sending message:', error);
          });
        }

      });

    });

  }

  /**
   * 
   * @param {String} sbZoneId Identificador de la zona
   * @param {Date} dtInitialDate Fecha inicial
   * @param {Date} dtFinalDate Fecha final
   */
  static GetRangeNodes(sbZoneId, dtInitialDate, dtFinalDate, res) {
    
    nodo.find({ zoneId: sbZoneId, date: { $lte: dtFinalDate, $gt: dtInitialDate } }, function (err, nodes) {
      if (err) {
        res.status(500).json({
          valor: "error en la recuperacion de los nodos " + err
        });
      }
      if (nodes == null) {
        res.status(401).json({
          valor: "No hay concidencia"
        });
      }
      return res.status(200).json({
        nodes
      });
    });
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   * @param {*} sbZoneId 
   */
  static GetCurrentNodes(sbZoneId, res, next) {
    var myDate = new Date();  /* Reemplazar por logica que traiga los rangos de la zona */
    var myDate2 = new Date(myDate);
    myDate.setMinutes(myDate.getMinutes() + 5);
    myDate2.setMinutes(myDate2.getMinutes() - 5);

    nodo.find({ zoneId: sbZoneId, date: { $lt: myDate, $gte: myDate2 } }, function (err, nodos) {

      if (err) {
        res.status(500).json({
          valor: "error en la recuperacion de los nodos " + err
        });
      }

      if (nodos == null) {
        res.status(401).json({
          valor: "No hay concidencia"
        });
      }

      return res.status(200).json({

        nodos: nodos,
        date1: myDate,
        date2: myDate2

      });

    });

  };

  static LastAvgNodes(sbZoneId, res, next) {
    var myDate = new Date();
    var myDate2 = new Date();

    myDate.setMinutes(myDate.getMinutes() + 5);
    myDate2.setMinutes(myDate2.getMinutes() - 5);

    nodo.aggregate(
      [
        {
          $match:
          {
            date: { $lt: myDate, $gte: myDate2 }
          }
        },
        {
          $group:
          {
            _id: {
              zoneId: sbZoneId
            },
            Atemperature: { $avg: '$temperature' },
            Ahumidity: { $avg: '$humidity' },
            Abrightness: { $avg: '$brightness' },
            AsoilHumidity: { $avg: '$soilHumidity' },
            Aaltitude: { $avg: '$altitude' },
            Apressure: { $avg: '$pressure' },
            Auv: { $avg: '$uv' }
          }
        }
      ],
      function (err, nodes) {

        if (err) {
          res.status(500).json({
            valor: "error en la recuperacion de los nodos " + err
          });
        }

        if (nodes == "") {
          res.status(401).json({
            valor: "No hay concidencia"
          });

        } else {

          SendAlert(
            sbZoneId,
            nodes[0].Atemperature,
            nodes[0].Ahumidity,
            nodes[0].Abrightness
          );

          return res.status(200).json({
            nodes
          });

        }
      }
    );
  }

  static ToDayAvgNodes(sbZoneId, res, next) {

    var myDate = new Date();

    myDate.setHours(0, 0, 0, 0);

    nodo.aggregate(
      [
        {
          $match:
          {
            date: { $gte: myDate }
          }
        },
        {
          $group:
          {
            _id: {
              zoneId: sbZoneId
            },
            nuAvgTemperature: { $avg: '$temperature' },
            nuAvgSoilTemperature: { $avg: '$soilTemperature' },
            nuAvgHumidity: { $avg: '$humidity' },
            nuAvgBrightness: { $avg: '$brightness' },
            nuAvgSoilHumidity: { $avg: '$soilHumidity' },
            nuAvgUv: { $avg: '$uv' },
            nuAvgVolatileGases: { $avg: '$volatileGases' }
          }
        }
      ],
      function (err, nodos) {

        if (err) {
          res.status(500).json({
            valor: "error en la recuperacion de los nodos " + err
          });
        }

        if (nodos == "") {
          res.status(401).json({
            valor: "No hay concidencia"
          });
        } else {
          return res.status(200).json({
            nodes: nodos
          });
        }


      }
    )
  }

  static MonthAvgNodes(sbZoneId, res, next) {
    var date = new Date();
    var FirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var LastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    nodo.aggregate(
      [
        {
          $match:
          {
            date: { $gte: FirstDay , $lt: LastDay }
          }
        },
        {
          $group:
          {
            _id: {
              zoneId: sbZoneId
            },
            nuAvgTemperature: { $avg: '$temperature' },
            nuAvgSoilTemperature: { $avg: '$soilTemperature' },
            nuAvgHumidity: { $avg: '$humidity' },
            nuAvgBrightness: { $avg: '$brightness' },
            nuAvgSoilHumidity: { $avg: '$soilHumidity' },
            nuAvgUv: { $avg: '$uv' },
            nuAvgVolatileGases: { $avg: '$volatileGases' }
          }
        }
      ],
      function (err, nodos) {

        if (err) {
          res.status(500).json({
            valor: "error en la recuperacion de los nodos " + err
          });
        }

        if (nodos == "") {
          res.status(401).json({
            valor: "No hay concidencia"
          });
        } else {
          return res.status(200).json({
            nodes: nodos
          });
        }


      }
    )
  }  

  static LastWeekAvgNodes(sbZoneId, res, next) {
    var date = new Date();
    var FirstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()-6);
    var LastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()-1);

    nodo.aggregate(
      [
        {
          $match:
          {
            date: { $gte: FirstDay , $lt: LastDay }
          }
        },
        {
          $group:
          {
            _id: {
              zoneId: sbZoneId,
              day: { $dayOfWeek: '$date' },
              monthDay: { $dayOfMonth: '$date'}
            },
            nuAvgTemperature: { $avg: '$temperature' },
            nuAvgSoilTemperature: { $avg: '$soilTemperature' },
            nuAvgHumidity: { $avg: '$humidity' },
            nuAvgBrightness: { $avg: '$brightness' },
            nuAvgSoilHumidity: { $avg: '$soilHumidity' },
            nuAvgUv: { $avg: '$uv' },
            nuAvgVolatileGases: { $avg: '$volatileGases' }
          }
        }
      ],
      function (err, jsWeekData) {

        if (err) {
          res.status(500).json({
            valor: "error en la recuperacion de los nodos " + err
          });
        }

        if (jsWeekData == "") {
          res.status(401).json({
            valor: "No hay concidencia"
          });
        } else {
          return res.status(200).json({
            jsWeekData
          });
        }


      }
    )
  }    

  static LastDaysAvgNodes(sbZoneId, res, next) {
    var myDate = new Date();
    myDate.setDate(1);
    myDate.setHours(0, 0, 0, 0);

    nodo.aggregate(
      [
        {
          $match:
          {
            date: { $gte: myDate },
            zoneId: sbZoneId
          }
        },
        {
          $group:
          {
            _id:
            {
              zoneId: sbZoneId,
              day: { $dayOfMonth: '$date' }
            },
            Atemperature: { $avg: '$temperature' },
            Ahumidity: { $avg: '$humidity' },
            Abrightness: { $avg: '$brightness' },
            AsoilHumidity: { $avg: '$soilHumidity' },
            Aaltitude: { $avg: '$altitude' },
            Apressure: { $avg: '$pressure' },
            Auv: { $avg: '$uv' }
          }
        },
        {
          $sort: {
            '_id': 1
          }
        }
      ],
      function (err, nodes) {

        if (err) {
          res.status(500).json({
            valor: "error en la recuperacion de los nodos " + err
          });
        }

        if (nodes == "") {
          res.status(401).json({
            valor: "No hay concidencia"
          });
        } else {
          return res.status(200).json({
            nodes: nodes
          });

        }
      }
    );
  }

  static LastHourAvgNodes(sbZoneId, res, next) {
    var myDate = new Date();
    var myDate2 = new Date();

    myDate2.setMinutes(0);

    nodo.aggregate(
      [
        {
          $match:
          {
            date: { $lt: myDate, $gte: myDate2 },
            zoneId: sbZoneId
          }
        },
        {
          $group:
          {
            _id:
            {
              zoneId: sbZoneId,
              hora: { $hour: '$date' }
            },
            Atemperature: { $avg: '$temperature' },
            Ahumidity: { $avg: '$humidity' },
            Abrightness: { $avg: '$brightness' },
            AsoilHumidity: { $avg: '$soilHumidity' },
            Aaltitude: { $avg: '$altitude' },
            Apressure: { $avg: '$pressure' },
            Auv: { $avg: '$uv' }
          }
        }
      ],
      function (err, nodos) {

        if (err) {
          res.status(500).json({
            valor: "error en la recuperacion de los nodos " + err
          });
        }

        if (nodos == "") {
          res.status(401).json({
            valor: "No hay concidencia"
          });
        } else {
          return res.status(200).json({
            nodos: nodos
          });
        }

      }
    );
  }

  static GetRangeNodesAvg(sbZoneId, dtInitialDate, dtFinalDate, res, next) {

    nodo.aggregate(
      [
        {
          $match:
          {
            date: { $lt: dtFinalDate, $gte: dtInitialDate }
          }
        },
        {
          $group:
          {
            _id: {
              zoneId: sbZoneId
            },
            Atemperature: { $avg: '$temperature' },
            Ahumidity: { $avg: '$humidity' },
            Abrightness: { $avg: '$brightness' },
            AsoilHumidity: { $avg: '$soilHumidity' },
            Aaltitude: { $avg: '$altitude' },
            Apressure: { $avg: '$pressure' },
            Auv: { $avg: '$uv' }
          }
        }
      ],
      function (err, nodes) {

        if (err) {
          res.status(500).json({
            valor: "error en la recuperacion de los nodos " + err
          });
        } else {

          if (nodes == "") {

            res.status(401).json({
              valor: "No hay concidencia"
            });

          } else {

            return res.status(200).json({
              nodes
            });

          }

        }

      }

    );

  }

}