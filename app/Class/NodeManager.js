/**
 * Class Node
 * This class has all the methods that control the node data.
*/
'use strict'
var mongoose = require('mongoose'),
  nodo = mongoose.model('Node'),
  zone = mongoose.model('Zone'),
  User = mongoose.model('User'),
  csbTemperature = 'Temperatura',
  csbSoilTemperature = 'Temperatura de Suelo',
  csbHumidity = 'Humedad',
  csbBrightness = 'Luminosidad',
  csbSoilHumidity = 'Humedad de Suelo',
  csbUv = 'Rayos UV',
  csbVolatileGases = 'Gases Volátiles';

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

  static GetRangeNodesAvgNotify(sbZoneId, dtInitialDate, dtFinalDate) {

    nodo.aggregate(
      [
        {
          $match:
          {
            date: { $lte: dtFinalDate, $gte: dtInitialDate }
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
      function (err, nodes) {

        if (err) {
          console.log(err);

        } else {

          if (nodes.hasOwnProperty('0')) {

            let nuAvgTemperature = nodes[0].nuAvgTemperature,
              nuAvgSoilTemperature = nodes[0].nuAvgSoilTemperature,
              nuAvgHumidity = nodes[0].nuAvgHumidity,
              nuAvgBrightness = nodes[0].nuAvgBrightness,
              nuAvgSoilHumidity = nodes[0].nuAvgSoilHumidity,
              nuAvgUv = nodes[0].nuAvgUv,
              nuAvgVolatileGases = nodes[0].nuAvgVolatileGases;

            zone.findOne({ _id: sbZoneId }, function (err, searchZone) {
              if (err) {
                console.log("Not found Zone");
                return;
              }

              User.findOne({ _id: searchZone.userId }, function (err, searchUser) {

                if (err) {
                  console.log("Not found user");
                  return;
                }

                if (nuAvgTemperature <= searchZone.MinTemperature || nuAvgTemperature >= searchZone.MaxTemperature) {

                  var message = {
                    notification: {
                      title: 'Estado de la' + csbTemperature,
                      body: 'La variable: ' + csbTemperature + ' esta por debajo o por encima del promedio establecido.'
                    },
                    token: searchUser.token
                  };

                  admin.messaging().send(message).then((response) => {
                    console.log('Successfully sent message:', response);
                  }).catch((error) => {
                    console.log('Error sending message:', error);
                  });
                }
                if (nuAvgSoilTemperature <= searchZone.MinSoilTemperature || nuAvgSoilTemperature >= searchZone.MaxSoilTemperature) {

                  var message = {
                    notification: {
                      title: 'Estado de la' + csbSoilTemperature,
                      body: 'La variable: ' + csbSoilTemperature + ' esta por debajo o por encima del promedio establecido.'
                    },
                    token: searchUser.token
                  };

                  admin.messaging().send(message).then((response) => {
                    console.log('Successfully sent message:', response);
                  }).catch((error) => {
                    console.log('Error sending message:', error);
                  });
                }
                if (nuAvgHumidity <= searchZone.MinHumidity || nuAvgHumidity >= searchZone.MaxHumidity) {

                  var message = {
                    notification: {
                      title: 'Estado de la' + csbHumidity,
                      body: 'La variable: ' + csbHumidity + ' esta por debajo o por encima del promedio establecido.'
                    },
                    token: searchUser.token
                  };

                  admin.messaging().send(message).then((response) => {
                    console.log('Successfully sent message:', response);
                  }).catch((error) => {
                    console.log('Error sending message:', error);
                  });
                }
                if (nuAvgBrightness <= searchZone.MinBrightness || nuAvgBrightness >= searchZone.MaxBrightness) {

                  var message = {
                    notification: {
                      title: 'Estado de la' + csbBrightness,
                      body: 'La variable: ' + csbBrightness + ' esta por debajo o por encima del promedio establecido.'
                    },
                    token: searchUser.token
                  };

                  admin.messaging().send(message).then((response) => {
                    console.log('Successfully sent message:', response);
                  }).catch((error) => {
                    console.log('Error sending message:', error);
                  });
                }
                if (nuAvgSoilHumidity <= searchZone.MinTemperature || nuAvgSoilHumidity >= searchZone.MaxTemperature) {

                  var message = {
                    notification: {
                      title: 'Estado de la' + csbSoilHumidity,
                      body: 'La variable: ' + csbSoilHumidity + ' esta por debajo o por encima del promedio establecido.'
                    },
                    token: searchUser.token
                  };

                  admin.messaging().send(message).then((response) => {
                    console.log('Successfully sent message:', response);
                  }).catch((error) => {
                    console.log('Error sending message:', error);
                  });
                }
                if (nuAvgUv <= searchZone.MinTemperature || nuAvgUv >= searchZone.MaxTemperature) {

                  var message = {
                    notification: {
                      title: 'Estado de la' + csbUv,
                      body: 'La variable: ' + csbUv + ' esta por debajo o por encima del promedio establecido.'
                    },
                    token: searchUser.token
                  };

                  admin.messaging().send(message).then((response) => {
                    console.log('Successfully sent message:', response);
                  }).catch((error) => {
                    console.log('Error sending message:', error);
                  });
                }
                if (nuAvgVolatileGases <= searchZone.MinTemperature || nuAvgVolatileGases >= searchZone.MaxTemperature) {

                  var message = {
                    notification: {
                      title: 'Estado de la' + csbVolatileGases,
                      body: 'La variable: ' + csbVolatileGases + ' esta por debajo o por encima del promedio establecido.'
                    },
                    token: searchUser.token
                  };

                  admin.messaging().send(message).then((response) => {
                    console.log('Successfully sent message:', response);
                  }).catch((error) => {
                    console.log('Error sending message:', error);
                  });
                }

              });

            });

          }

        }

      }

    );

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
        
        console.log(err);
        
      } else {
        return res.status(200).json({
          nodes
        });
      }
    });
  }

  static ToDayAvgNodes(sbZoneId, res, next) {

    var myDate = new Date();
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

          console.log(err);

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
    var LastDay = new Date(date.getFullYear(), date.getMonth(), 31);

    nodo.aggregate(
      [
        {
          $match:
          {
            date: { $gte: FirstDay, $lte: LastDay },
            zoneId: sbZoneId
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

          console.log(err);

        } else {
          return res.status(200).json({
            nodes: nodos
          });
        }
      }
    )
  }

  static LastWeekAvgNodes(sbZoneId, res, next) {
    var FirstDay = new Date();
    FirstDay.setDate(FirstDay.getDate() - 6);
    var LastDay = new Date();
    LastDay.setDate(LastDay.getDate() - 1);

    nodo.aggregate(
      [
        {
          $match:
          {
            date: { $gte: FirstDay, $lte: LastDay },
            zoneId: sbZoneId
          }
        },
        {
          $group:
          {
            _id: {
              zoneId: sbZoneId,
              day: { $dayOfWeek: '$date' },
              monthDay: { $dayOfMonth: '$date' }
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
          console.log(err);
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

          console.log(err);

        } else {
          return res.status(200).json({
            nodes: nodes
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
            date: { $lt: dtFinalDate, $gte: dtInitialDate },
            zoneId: sbZoneId
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

          console.log(err);

        } else {

          return res.status(200).json({
            nodes
          });

        }

      }

    );

  }

}