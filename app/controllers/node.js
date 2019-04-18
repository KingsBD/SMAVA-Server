/*Declaraciones*/
var express = require('express'),
  router = express.Router(),
  jwt = require('jsonwebtoken'),
  ControlNode = require('../Class/NodeManager');

module.exports = function (app) {
  app.use('/', router);
};

router.use('/', function (req, res, next) {
  jwt.verify(req.query.token, 'SMAVA', function (err, decoded) {
    if (err) {
      return res.status(401).json({
        valor: "No esta autenticado " + err
      });
    }
    next();
  })
});

router.post('/GetRangeNodes', function (req, res, next) {

  try {
    var dtInitDate = new Date(req.body.dtInitDate),
      dtFinalDate = new Date(req.body.dtFinalDate)
    sbZoneId = req.body.zoneId;

    ControlNode.GetRangeNodes(sbZoneId, dtInitDate, dtFinalDate, res);
    ControlNode.GetRangeNodesAvgNotify(sbZoneId, dtInitDate, dtFinalDate);

  } catch (error) {
    console.log(err);
  }

});

router.post('/ToDayAvgNodes', function (req, res, next) {
  var sbZoneId = req.body.zoneId;

  ControlNode.ToDayAvgNodes(sbZoneId, res, next)

});

router.post('/MonthAvgNodes', function (req, res, next) {
  var sbZoneId = req.body.zoneId;

  ControlNode.MonthAvgNodes(sbZoneId, res, next)

});

router.post('/LastWeekAvgNodes', function (req, res, next) {
  var sbZoneId = req.body.zoneId;

  ControlNode.LastWeekAvgNodes(sbZoneId, res, next)

});

router.post('/GetMinMaxValues', function (req, res, next) {

  var dtInitDate = new Date(req.body.dtInitDate),
    dtFinalDate = new Date(req.body.dtFinalDate),
    sbZoneId = req.body.zoneId;

  ControlNode.GetMinMaxValues(sbZoneId, dtInitDate, dtFinalDate, res, next)

});
