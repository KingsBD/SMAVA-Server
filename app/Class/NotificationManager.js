/**
 * Class Node
 * This class has all the methods that control the node data.
*/
'use strict'
var mongoose = require('mongoose'),
    zone = mongoose.model('Zone'),
    user = mongoose.model('User'),
    admin = require('firebase-admin'),
    errorManager = require('../Class/ErrorManager');

const csbTemperature = 'Temperatura',
    csbSoilTemperature = 'Temperatura de Suelo',
    csbHumidity = 'Humedad',
    csbBrightness = 'Luminosidad',
    csbSoilHumidity = 'Humedad de Suelo',
    csbUv = 'Rayos UV',
    csbVolatileGases = 'Gases Volátiles';

admin.initializeApp({
    credential: admin.credential.cert('public\\components\\smava-194123-firebase-adminsdk-dr03y-e8ec460d82.json'),
    databaseURL: 'https://smava-194123.firebaseio.com'
});

module.exports = class NotificationManager {

    constructor() { }

    static NotificationAlert(
        nuAvgTemperature,
        nuAvgSoilTemperature,
        nuAvgHumidity,
        nuAvgBrightness,
        nuAvgSoilHumidity,
        nuAvgUv,
        nuAvgVolatileGases,
        sbZoneId
    ) {
        zone.findOne({ _id: sbZoneId }, function (err, searchZone) {
            if (err) {
                console.log("Not found Zone");
                return;
            }

            user.findOne({ _id: searchZone.userId }, function (err, searchUser) {

                if (err) {
                    console.log("Not found user");
                    return;
                }

                var arLimitRange = [
                    { variable: csbTemperature, value: nuAvgTemperature, min: searchZone.minTemperature, max: searchZone.maxTemperature },
                    { variable: csbSoilTemperature, value: nuAvgSoilTemperature, min: searchZone.minSoilTemperature, max: searchZone.maxSoilTemperature },
                    { variable: csbHumidity, value: nuAvgHumidity, min: searchZone.minHumidity, max: searchZone.maxHumidity },
                    { variable: csbBrightness, value: nuAvgBrightness, min: searchZone.minBrightness, max: searchZone.maxBrightness },
                    { variable: csbSoilHumidity, value: nuAvgSoilHumidity, min: searchZone.minSoilHumidity, max: searchZone.maxSoilHumidity },
                    { variable: csbUv, value: nuAvgUv, min: searchZone.minUV, max: searchZone.maxUV },
                    { variable: csbVolatileGases, value: nuAvgVolatileGases, min: searchZone.minVolatileGases, max: searchZone.maxVolatileGases }
                ];

                var arrZoneErrors = [], dtToday = new Date();

                arLimitRange.forEach(variableStatus => {

                    if (variableStatus.value <= variableStatus.min || variableStatus.value >= variableStatus.max) {
                        var message = {
                            notification: {
                                title: 'Estado de la' + variableStatus.variable,
                                body: 'La ' + veariablStatus.variable + ' esta por debajo o por encima del promedio establecido.'
                            },
                            token: searchUser.token
                        };
                        
                        // Save the errors zone 
                        arrZoneErrors.push({variable: veariablStatus.variable,value: variableStatus.value });
                        errorManager.SaveZoneErrorData(sbZoneId,dtToday,arrZoneErrors);

                        admin.messaging().send(message).then((response) => {
                            console.log('Successfully sent message:', response);
                        }).catch((error) => {
                            console.log('Error sending message:', error);
                        });

                    }

                });

            });

        });

    }
}

