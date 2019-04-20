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
  router.post('/CreateZone', function (req, res,next) {   
    
      var sbUserId = req.body.userId,                     
      sbZoneName = req.body.zoneName.toLowerCase(),                      
      sbDescription = req.body.description,                     
      sbTopicNode = req.body.topicNode,                     
      sbTopicAngular = req.body.topicAngular,                     
      nuRefreshWindow = req.body.refreshWindow,                     
      nuAffectationArea = req.body.affectationArea,                     
      nuMinTemperature = req.body.minTemperature,                     
      nuMaxTemperature = req.body.maxTemperature,                     
      nuMinSoilTemperature = req.body.minSoilTemperature,
      nuMaxSoilTemperature = req.body.maxSoilTemperature,
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
      nuMinVolatileGases = req.body.minVolatileGases,                     
      nuMaxVolatileGases = req.body.maxVolatileGases,                     
      nuMatrixMarginX = req.body.matrixMarginX,                     
      nuMatrixMarginY = req.body.matrixMarginY;      
    
    ControlZone.CreateZone(
      sbUserId,
      sbZoneName,
      sbDescription,
      sbTopicNode,
      sbTopicAngular,
      nuRefreshWindow,
      nuAffectationArea,
      nuMinTemperature,
      nuMaxTemperature,
      nuMinSoilTemperature,
      nuMaxSoilTemperature,
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
      nuMinVolatileGases,
      nuMaxVolatileGases,
      nuMatrixMarginX,
      nuMatrixMarginY, 
      res,
      next
    );

  });
  
  router.post('/UpdateZone', function (req, res, next) {
  
    var sbZoneId = req.body._id,
    sbUserId = req.body.userId,                     
    sbZoneName = req.body.zoneName.toLowerCase(),                      
    sbDescription = req.body.description,                     
    sbTopicNode = req.body.topicNode,                     
    sbTopicAngular = req.body.topicAngular,                     
    nuRefreshWindow = req.body.refreshWindow,                     
    nuAffectationArea = req.body.affectationArea,                     
    nuMinTemperature = req.body.minTemperature,                     
    nuMaxTemperature = req.body.maxTemperature,                     
    nuMinSoilTemperature = req.body.minSoilTemperature,
    nuMaxSoilTemperature = req.body.maxSoilTemperature,
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
    nuMinVolatileGases = req.body.minVolatileGases,                     
    nuMaxVolatileGases = req.body.maxVolatileGases,                     
    nuMatrixMarginX = req.body.matrixMarginX,                     
    nuMatrixMarginY = req.body.matrixMarginY;      

    ControlZone.UpdateZone(
      sbZoneId,
      sbUserId,
      sbZoneName,
      sbDescription,
      sbTopicNode,
      sbTopicAngular,
      nuRefreshWindow,
      nuAffectationArea,
      nuMinTemperature,
      nuMaxTemperature,
      nuMinSoilTemperature,
      nuMaxSoilTemperature,
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
      nuMinVolatileGases,
      nuMaxVolatileGases,
      nuMatrixMarginX,
      nuMatrixMarginY,              
      res,
      next
    );
  
  });
  
  router.post('/DeleteZone', function (req, res, next) {
    
    var sbZoneId = req.body._id;
  
    ControlZone.DeleteZone(sbZoneId,res);
  
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