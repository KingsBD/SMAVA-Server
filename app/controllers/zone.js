var express = require('express'),
  router = express.Router(),
  jwt = require('jsonwebtoken'),
  ControlZone = require('../Class/ZoneManager');

  module.exports = function (app) {
    app.use('/', router);
  };

  router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'SMAVA', function(err, decoded){
      if(err){
        return res.status(401).json({
            valor: "No esta autenticado " + err
        });
      }
      next();
    })
  });

  /* CRUD */
  router.post('/CreateZone', function (req, res) {

    var sbUserId = req.body.userId,
    sbtZoneName = req.body.themename.toLowerCase(),
    sbDescription = req.body.description,
    sbTopicNode = req.body.TopicNode,
    sbTopicAngular = req.body.TopicAngular,
    nuRefreshWindow = req.body.refreshWindow,
    nuMinTemperature = req.body.MinTemperature,
    nuMaxTemperature = req.body.MaxTemperature,
    nuMinHumidity = req.body.MinHumidity,
    nuMaxHumidity = req.body.MaxHumidity,
    nuMinSoilHumidity = req.body.MinSoilHumidity,
    nuMaxSoilHumidity = req.body.MaxSoilHumidity,
    nuMinPressure = req.body.MinPressure,
    nuMaxPressure = req.body.MaxPressure,
    nuMinUV = req.body.MinUV,
    nuMaxUV = req.body.MaxUV,
    nuMinBrightness = req.body.MinBrightness,
    nuMaxBrightness = req.body.MaxBrightness,
    nuMatrixMarginX = req.body.MatrixMarginX,
    nuMatrixMarginY = req.body.MatrixMarginY;
  
    ControlZone.CreateZone
    (
      sbUserId,
      sbtZoneName,
      sbDescription,
      sbTopicNode,
      sbTopicAngular,
      nuRefreshWindow,
      nuMinTemperature,
      nuMaxTemperature,
      nuMinHumidity,
      nuMaxHumidity,
      nuMinSoilHumidity,
      nuMaxSoilHumidity,
      nuMinPressure,
      nuMaxPressure,
      nuMinUV,
      nuMaxUV,
      nuMinBrightness,
      nuMaxBrightness,
      nuMatrixMarginX,
      nuMatrixMarginY,        
      res,
      next
    );
  
  });
  
  router.post('/UpdateZone', function (req, res) {
  
    var sbZoneId = req.body._id,
    sbUserId = req.body.userId,
    sbtZoneName = req.body.themename.toLowerCase(),
    sbDescription = req.body.description,
    sbTopicNode = req.body.topicNode,
    sbTopicAngular = req.body.topicAngular,
    nuRefreshWindow = req.body.refreshWindow,
    nuMinTemperature = req.body.minTemperature,
    nuMaxTemperature = req.body.maxTemperature,
    nuMinHumidity = req.body.minHumidity,
    nuMaxHumidity = req.body.maxHumidity,
    nuMinSoilHumidity = req.body.minSoilHumidity,
    nuMaxSoilHumidity = req.body.maxSoilHumidity,
    nuMinPressure = req.body.minPressure,
    nuMaxPressure = req.body.maxPressure,
    nuMinUV = req.body.minUV,
    nuMaxUV = req.body.maxUV,
    nuMinBrightness = req.body.minBrightness,
    nuMaxBrightness = req.body.maxBrightness,
    nuMatrixMarginX = req.body.matrixMarginX,
    nuMatrixMarginY = req.body.matrixMarginY;
  
    ControlZone.UpdateZone
    (
      sbZoneId,
      sbUserId,
      sbtZoneName,
      sbDescription,
      sbTopicNode,
      sbTopicAngular,
      nuRefreshWindow,
      nuMinTemperature,
      nuMaxTemperature,
      nuMinHumidity,
      nuMaxHumidity,
      nuMinSoilHumidity,
      nuMaxSoilHumidity,
      nuMinPressure,
      nuMaxPressure,
      nuMinUV,
      nuMaxUV,
      nuMinBrightness,
      nuMaxBrightness,
      nuMatrixMarginX,
      nuMatrixMarginY,        
      res,
      next
    );
  
  });
  
  router.post('/DeleteZone', function (req, res) {
    
    var sbZoneName = req.body.themename
    var sbZoneId = req.body._id;
  
    ControlZone.DeleteZone(sbZoneId,sbZoneName);
  
  });  
  
  router.post('/getZones', function (req, res, next) {

    var sbUserId = req.body.userId;
    
    ControlZone.GetZonesByUserId(sbUserId, res, next);

  });

  router.post('/SearchZoneByName', function (req, res, next) {

    var sbUserId   = req.body.userId;
        sbZoneName = req.body.zonename.toLowerCase();

    ControlZone.SearchZoneByName(sbUserId,sbZoneName, res, next);
  });

  router.post('/SearchZoneById', function (req, res, next) {

  var sbUserId  = req.body.userId;
      sbZoneId  = req.body.zoneId;

    ControlZone.SearchZoneById(sbUserId,sbZoneId, res, next);

  });