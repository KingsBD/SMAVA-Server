/**
 * Class Node
 * This class has all the methods that control the node data.
*/
'use strict'
var mongoose = require('mongoose'),
  nodo = mongoose.model('Node'),
  notificationManager = require('../Class/NotificationManager');

module.exports = class NodeManager {

  constructor() {}

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

            notificationManager.NotificationAlert(
              nodes[0].nuAvgTemperature,
              nodes[0].nuAvgSoilTemperature,
              nodes[0].nuAvgHumidity,
              nodes[0].nuAvgBrightness,
              nodes[0].nuAvgSoilHumidity,
              nodes[0].nuAvgUv,
              nodes[0].nuAvgVolatileGases,
              sbZoneId
            );

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

        return res.status(500).json({err});

      } else {

        return res.status(200).json({nodes});
      }

    });
  }

  static ToDayAvgNodes(sbZoneId, res, next) {

    var dtToday = new Date();
    dtToday.setHours(0, 0, 0, 0);

    nodo.aggregate(
      [
        {
          $match:
          {
            date: { $gte: dtToday },
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

  static GetMinMaxValues(sbZoneId, dtInitialDate, dtFinalDate, res, next) {

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
            nuMinTemperature: { $min: '$temperature' },
            nuMaxTemperature: { $max: '$temperature' },
            nuMinSoilTemperature: { $min: '$soilTemperature' },
            nuMaxSoilTemperature: { $max: '$soilTemperature' },
            nuMinHumidity: { $min: '$humidity' },
            nuMaxHumidity: { $max: '$humidity' },
            nuMinBrightness: { $min: '$brightness' },
            nuMaxBrightness: { $max: '$brightness' },
            nuMinSoilHumidity: { $min: '$soilHumidity' },
            nuMaxSoilHumidity: { $max: '$soilHumidity' },
            nuMinUv: { $min: '$uv' },
            nuMaxUv: { $max: '$uv' },
            nuMinVolatileGases: { $min: '$volatileGases' },
            nuMaxVolatileGases: { $max: '$volatileGases' }
          }
        }
      ],
      function (err, nodes) {

        if (err) {

          return res.status(500).json({ err });

        } else {

          return res.status(200).json({ nodes });

        }

      }

    );

  }  

}