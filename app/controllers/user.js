var express = require('express'),
  router = express.Router(),
  jwt = require('jsonwebtoken'),
  ControlUser = require('../Class/UserManager');;


module.exports = function (app) {
  app.use('/', router);
};

router.use('/', function (req, res, next) {
  jwt.verify(req.query.token, 'SMAVA', function(err, decoded){
    if(err){
      return res.status(401).json({
          valor: "No esta autenticado: " + err
      });
    }
    next();
  })
});

router.post('/CreateUser', function (req, res) {

  var sbUsername = req.body.username.toLowerCase(),
  sbPassword = req.body.password,
  sbName = req.body.name,
  sbLastname =  req.body.lastname,
  sbEmail = req.body.email;

  ControlUser.CreateUser 
  (
    sbUsername,
    sbPassword,
    sbName,
    sbLastname,
    sbEmail,
    res
  );

});

router.post('/Users', function (req, res, next) {

  ControlUser.GetUsers(res,next);

});

router.post('/SearchUser', function (req, res, next) {
  
  var sbUsername = req.body.username.toLowerCase();

  ControlUser.SearchUserbyName(sbUsername,res,next);

});

router.post('/findUser', function (req, res, next) {
  
  var SbUserId = req.body._id;

  ControlUser.GetUserById(SbUserId,res,next);

});

router.post('/DeleteUser', function (req, res) {

  var SbUserId = req.body._id;

  ControlUser.DeleteUser(SbUserId,res,next);

});

router.post('/UpdateUser', function (req, res) {

  var SbUserId = req.body._id, 
  sbUsername = req.body.username.toLowerCase(),
  sbPassword = req.body.password,
  sbName = req.body.name,
  sbLastname =  req.body.lastname,
  sbEmail = req.body.email;

  ControlUser.UpdateUser 
  (
    SbUserId,
    sbUsername,
    sbPassword,
    sbName,
    sbLastname,
    sbEmail,
    res
  );

});

router.post('/UpdateUserToken', function (req, res) {

  var SbUserId = req.body._id, 
  sbToken = req.body.tokenkey;
  
  ControlUser.UpdateUserToken(SbUserId,sbToken,res);

});