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
  var sbZoneId = req.body.theme;
  
  ControlNode.ToDayAvgNodes(sbZoneId, res, next)

});

router.post('/MonthAvgNodes', function (req, res, next) {
  var sbZoneId = req.body.theme;

  ControlNode.MonthAvgNodes(sbZoneId, res, next)

});

router.post('/LastWeekAvgNodes', function (req, res, next) {
  var sbZoneId = req.body.theme;

  ControlNode.LastWeekAvgNodes(sbZoneId, res, next)

});

router.post('/LastDaysAvgNodes', function (req, res, next) {

  var sbZoneId = req.body.theme;

  ControlNode.LastDaysAvgNodes(sbZoneId, res, next)

});

router.post('/GetRangeNodesAvg', function (req, res, next) {

  var dtInitDate = new Date(req.body.myDate),
    dtFinalDate = new Date(req.body.myDate2)
  sbZoneId = req.body.zoneId;

  ControlNode.GetRangeNodesAvg(sbZoneId, dtInitDate, dtFinalDate, res)

});
