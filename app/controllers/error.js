var express = require('express'),
  router = express.Router(),
  errorManager = require('../Class/ErrorManager');

module.exports = function (app) {
  app.use('/', router);
};



router.post('/GetZoneErrorsByDate', function (req, res, next) {

  var dtInitDate = new Date(req.body.dtInitDate),
  dtFinalDate = new Date(req.body.dtFinalDate)
  sbZoneId = req.body.zoneId;     
  errorManager.GetErrorsByDate(sbZoneId, dtInitDate, dtFinalDate, res);
  
});