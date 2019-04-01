/*Declaraciones*/
var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  nodo = mongoose.model('Nodo'),
  theme = mongoose.model('Theme'),
  User = mongoose.model('User'),
  jwt = require('jsonwebtoken'),
  ControlNode = require('../Class/ControlNode');

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

/*Servicios*/

router.post('/GetCurrentNodes', function (req, res, next) {

  var sbZoneId = req.body.theme;

  try {
    ControlNode.GetCurrentNodes(sbZoneId, res, next);
  } catch (err) {
    console.log("You got a " + err);
  }

});

router.post('/GetRangeNodes', function (req, res, next) {
   
  try {
    var dtInitDate = new Date(req.body.dtInitDate),
    dtFinalDate = new Date(req.body.dtFinalDate)
    sbZoneId = req.body.zoneId;  

    ControlNode.GetRangeNodes(sbZoneId, dtInitDate, dtFinalDate, res)
    ControlNode.GetRangeNodesAvgNotify(sbZoneId, dtInitDate, dtFinalDate)    
  } catch (error) {
    console.log(err);    
  }

});

router.post('/LastAvgNodes', function (req, res, next) {

  var sbZoneId = req.body.theme;

  ControlNode.LastAvgNodes(sbZoneId, res, next)

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

router.post('/LastHourAvgNodes', function (req, res, next) {
  var sbZoneId = req.body.theme;

  ControlNode.LastHourAvgNodes(sbZoneId, res, next)

});

// Falta
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

//falta
router.post('/LastHourAvgNodes2', function (req, res, next) {
  var myDate = new Date();
  var myDate2 = new Date(myDate);

  myDate2.setMinutes(0);
  myDate.setMinutes(15);


  nodo.aggregate(
    [
      {
        $match:
        {
          date: { $lt: myDate, $gte: myDate2 },
          zoneId: req.body.theme
        }
      },
      {
        $group:
        {
          _id:
          {
            zoneId: req.body.theme,
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

      myDate2.setMinutes(15);
      myDate.setMinutes(30);

      nodo.aggregate(
        [
          {
            $match:
            {
              date: { $lt: myDate, $gte: myDate2 },
              zoneId: req.body.theme
            }
          },
          {
            $group:
            {
              _id:
              {
                zoneId: req.body.theme
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
        function (err2, nodos2) {

          if (err2) {
            res.status(500).json({
              valor: "error en la recuperacion de los nodos " + err
            });
          }

          myDate2.setMinutes(30);
          myDate.setMinutes(45);

          nodo.aggregate(
            [
              {
                $match:
                {
                  date: { $lt: myDate, $gte: myDate2 },
                  zoneId: req.body.theme
                }
              },
              {
                $group:
                {
                  _id:
                  {
                    zoneId: req.body.theme,
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
            function (err3, nodos3) {

              if (err3) {
                res.status(500).json({
                  valor: "error en la recuperacion de los nodos " + err
                });
              }

              myDate2.setMinutes(45);
              myDate.setMinutes(59);

              nodo.aggregate(
                [
                  {
                    $match:
                    {
                      date: { $lt: myDate, $gte: myDate2 },
                      zoneId: req.body.theme
                    }
                  },
                  {
                    $group:
                    {
                      _id:
                      {
                        zoneId: req.body.theme,
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
                function (err4, nodos4) {

                  if (err4) {
                    res.status(500).json({
                      valor: "error en la recuperacion de los nodos " + err
                    });
                  }

                  return res.status(200).json({
                    nodos: nodos,
                    nodos2: nodos2,
                    nodos3: nodos3,
                    nodos4: nodos4
                  });


                });


            });


        });

    });
});
