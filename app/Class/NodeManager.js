/**
 * Class Node
 * This class has all the methods that control the node data.
*/
'use strict'
var mongoose = require('mongoose'),
  nodo = mongoose.model('Node'),
  notificationManager = require('../Class/NotificationManager');

module.exports = class NodeManager {

  constructor() { }

  /**
   * SaveNodeData
   * Recive a Json to save the node in the DB.
   * @param {Json} JsonNode 
   */
  static SaveNodeData(JsonNode, sbZoneId) {
    let newNode = new nodo(
      {
        lat: JsonNode.la,
        lng: JsonNode.lo,
        temperature: JsonNode.t,
        soilTemperature: JsonNode.sT,
        humidity: JsonNode.h,
        brightness: JsonNode.b,
        soilHumidity: JsonNode.sH,
        volatileGases: JsonNode.v,
        uv: JsonNode.u,
        zoneId: sbZoneId,
        date: new Date(JsonNode.ti * 1000)
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
            date: { $lte: dtFinalDate, $gte: dtInitialDate },
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
  static GetRangeNodes(sbZoneId = '', dtInitialDate = new Date(), dtFinalDate = new Date(), res) {

    nodo.find({ zoneId: sbZoneId, date: { $lte: dtFinalDate, $gt: dtInitialDate } }, function (err, nodes) {
      if (err) {

        return res.status(500).json({ err });

      } else {

        return res.status(200).json({ nodes });
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

  static MonthDataNodes(sbZoneId = '', res, next) {
    var date = new Date();
    var FirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    FirstDay.setHours(0, 0, 0, 0);
    var LastDay = new Date(date.getFullYear(), date.getMonth(), 31);
    LastDay.setHours(23, 59, 59);

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
            nuAvgVolatileGases: { $avg: '$volatileGases' },
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

  static LastWeekDataNodes(sbZoneId = '', res, next) {
    var FirstDay = new Date();
    FirstDay.setDate(FirstDay.getDate() - 6);
    FirstDay.setHours(0, 0, 0, 0);
    var LastDay = new Date();
    LastDay.setDate(LastDay.getDate() - 1);
    LastDay.setHours(23, 59, 59);
    console.log('LastDay: ' + LastDay);
    console.log('FirstDay: ' + FirstDay);

    nodo.aggregate(
      [
        {
          $match:
          {
            zoneId: sbZoneId,
            date: { $gte: FirstDay, $lte: LastDay }
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
            nuAvgVolatileGases: { $avg: '$volatileGases' },
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
        },
        {
          $sort: { _id: 1 }
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

  static GetMinMaxValues(sbZoneId = '', dtInitialDate = new Date(), dtFinalDate = new Date(), res, next) {

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