'use strict'
var mongoose = require('mongoose'),
    User = mongoose.model('User');
const csbUserRole = 'ROLE_USER';

module.exports = class UserManager {

    constructor() { }


    static CreateUser(
        sbUsername = '',
        sbPassword = '',
        sbName = '',
        sbLastname = '',
        sbEmail = '',
        res
    ) {

        User.find({ role: csbUserRole, username: sbUsername }, function (err, users) {

            if (err) {

                res.status(500).json({
                    err
                });

            } else {

                if (users == "" || sbUsername != users[0].username) {

                    var rcNewUser = new User(
                        {
                            username: sbUsername,
                            password: sbPassword,
                            name: sbName,
                            lastname: sbLastname,
                            email: sbEmail,
                            role: csbUserRole,
                            token: ""
                        }
                    );

                    rcNewUser.save();

                    return res.status(200).json({
                        valor: "Yes"
                    });

                } else {
                    res.status(401).json({
                        valor: "Ya existe un registro con este nombre",
                        users: users
                    });
                }
            }

        });
    }

    static GetUsers(res, next) {

        User.find({ role: csbUserRole }, function (err, users) {

            if (err) {

                res.status(500).json({
                    err
                });

            } else {

                return res.status(200).json({
                    users: users
                });

            }

        }).sort( { name: 1 } );
    }

    static SearchUserbyName(sbUsername, res, next) {

        User.find({ role: csbUserRole, username: {'$regex': sbUsername}   }, function (err, users) {

            if (err) {

                res.status(500).json({
                    err
                });

            } else {

                return res.status(200).json({
                    users: users
                });

            }

        });
    }

    static GetUserById(SbUserId = '', res, next) {

        User.find({ _id: SbUserId }, function (err, users) {

            if (err) {
                res.status(500).json({
                    err
                });
            } else {

                return res.status(200).json({
                    users: users
                });

            }

        });
    }

    static DeleteUser(sbUserId, sbUsername, res) {        
        
        User.deleteOne({ _id: sbUserId }, function (err, obj) {

            if (err) {
                
                res.status(500).json({
                    err
                });

            } else {
                
                return res.status(200).json({
                    value: "Se ha borrado el usuario: " + sbUsername
                });
            }

        });
    }

    static UpdateUser(
        SbUserId = '',
        sbUsername = '',
        sbPassword = '',
        sbName = '',
        sbLastname = '',
        sbEmail = '',
        res
    ) {

        User.find({ username: sbUsername }, function (err, users) {

            if (err) {

                res.status(500).json({
                    err
                });

            } else {
                if (users == "" || sbUsername == users[0].username) {

                    var myquery = { _id: SbUserId };

                    var newvalues =
                    {
                        $set:
                        {
                            username: sbUsername,
                            password: sbPassword,
                            name: sbName,
                            lastname: sbLastname,
                            email: sbEmail
                        }
                    };

                    User.updateOne(myquery, newvalues, function (errp, resp) {

                        if (errp) {
                            res.status(500).json({
                                valor: "error en la recuperacion de los usuarios: " + err
                            });
                        }

                        return res.status(200).json({
                            value: "Se ha modificado el usuario"
                        });

                    });

                } else {

                    res.status(401).json({
                        valor: "Ya existe un registro con este nombre",
                        users: users
                    });
                }

            }

        });

    }

    static UpdateUserToken(SbUserId, sbToken, res) {

        var myquery = { _id: SbUserId };
        var newvalues = { $set: { token: sbToken } };

        User.updateOne(myquery, newvalues, function (err, resp) {

            if (err) {

                res.status(500).json({
                    err
                });

            } else {

                return res.status(200).json({
                    value: "Se ha modificado el usuario"
                });

            }

        });

    }


}