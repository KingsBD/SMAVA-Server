/**
 * Class Node
 * This class has all the methods that control the node data.
*/
'use strict'
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    ControlZone = require('../Class/ZoneManager'),
    jwt = require('jsonwebtoken');

module.exports = class SessionManager {

    constructor() { }

    static loging(sbUserName = '', SbPassword = '', res, next) {

        User.findOne({ username: sbUserName, password: SbPassword }, function (err, data) {
            if (err) {

                return res.status(500).json({ err });

            } else {

                var token = jwt.sign({ data: data }, 'SMAVA', { expiresIn: '10h' });

                return res.status(200).json({
                    token: token,
                    username: data.username,
                    role: data.role,
                    _id: data._id,
                    info: data
                });

            }
        });
    }

    static loginAndGetZones(sbUserName = '', SbPassword = '', res, next) {

        User.findOne({ username: sbUserName, password: SbPassword }, function (err, data) {
            if (err) {

                return res.status(500).json({ err });

            } else {

                ControlZone.GetinitDataZonesByUserId(data._id, res, next);

            }
        });
    }
}    