/**
 * Class Node
 * This class has all the methods that control the node data.
*/
'use strict'
var mongoose = require('mongoose'),
User = mongoose.model('User'),
jwt = require('jsonwebtoken');

module.exports = class ControlSession {  

    constructor () {}

    static login (sbUserName,SbPassword, res, next) {
        User.findOne({'username':sbUserName, 'password': SbPassword}, 
        function (err, data) {
            if(err){
                return res.status(500).json({
                 valor: "Hubo un error en la busqueda"
                });
            }

            if(data == null){                
                return res.status(401).json({
                    valor: "No hay concidencia"
                });
            }

            var token = jwt.sign({data: data}, 'SMAVA', { expiresIn: '1h' });
            
            return res.status(200).json({
                token: token,
                username: data.username,
                role: data.role,
                _id:  data._id
            });
        })
    }
    

}    