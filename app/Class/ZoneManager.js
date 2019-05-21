/**
 * Class Node
 * This class has all the methods that control the node data.
*/
'use strict'
var mongoose = require('mongoose'),
    mdZone = mongoose.model('Zone'),
    mqttManager = require('../Class/MqttManager');

module.exports = class ZoneManager {

    constructor() { }

    static CreateZone(
        sbUserId = '',
        sbZoneName = '',
        sbDescription = '',
        nuRefreshWindow = 0,
        nuAffectationArea = 0,
        nuMinTemperature = 0,
        nuMaxTemperature = 0,
        nuMinSoilTemperature = 0,
        nuMaxSoilTemperature = 0,
        nuMinHumidity = 0,
        nuMaxHumidity = 0,
        nuMinSoilHumidity = 0,
        nuMaxSoilHumidity = 0,
        nuMinPressure = 0,
        nuMaxPressure = 0,
        nuMinUV = 0,
        nuMaxUV = 0,
        nuMinBrightness = 0,
        nuMaxBrightness = 0,
        nuMinVolatileGases = 0,
        nuMaxVolatileGases = 0,
        res,
        next
    ) {

        mdZone.find({ $and: [{ userId: sbUserId }, { zoneName: sbZoneName }] }, function (err, zones) {

            if (err) {
                console.log(err);

                return res.status(500).json({ err });
            } else {
                if (zones == "") {
                    var rcNewZone = new mdZone(
                        {
                            userId: sbUserId,
                            zoneName: sbZoneName,
                            description: sbDescription,
                            refreshWindow: nuRefreshWindow,
                            affectationArea: nuAffectationArea,
                            minTemperature: nuMinTemperature,
                            maxTemperature: nuMaxTemperature,
                            minHumidity: nuMinHumidity,
                            maxHumidity: nuMaxHumidity,
                            minSoilHumidity: nuMinSoilHumidity,
                            maxSoilHumidity: nuMaxSoilHumidity,
                            minPressure: nuMinPressure,
                            maxPressure: nuMaxPressure,
                            minSoilTemperature: nuMinSoilTemperature,
                            maxSoilTemperature: nuMaxSoilTemperature,
                            minUV: nuMinUV,
                            maxUV: nuMaxUV,
                            minVolatileGases: nuMinVolatileGases,
                            maxVolatileGases: nuMaxVolatileGases,
                            minBrightness: nuMinBrightness,
                            maxBrightness: nuMaxBrightness
                        }
                    );

                    rcNewZone.save();
                    
                    setTimeout(() => {
                        mqttManager.ActiveMqttByZone();
                    }, 1000);

                    return res.status(200).json({
                        valor: "Yes"
                    });

                } else {

                    return res.status(401).json({
                        valor: "Ya existe una zona con este nombre",
                        zones: zones
                    });

                }
            }

        });
    }

    static UpdateZone(
        sbZoneId = '',
        sbUserId = '',
        sbZoneName = '',
        sbDescription = '',
        nuRefreshWindow = 0,
        nuAffectationArea = 0,
        nuMinTemperature = 0,
        nuMaxTemperature = 0,
        nuMinSoilTemperature = 0,
        nuMaxSoilTemperature = 0,
        nuMinHumidity = 0,
        nuMaxHumidity = 0,
        nuMinSoilHumidity = 0,
        nuMaxSoilHumidity = 0,
        nuMinPressure = 0,
        nuMaxPressure = 0,
        nuMinUV = 0,
        nuMaxUV = 0,
        nuMinBrightness = 0,
        nuMaxBrightness = 0,
        nuMinVolatileGases = 0,
        nuMaxVolatileGases = 0,
        res,
        next
    ) {
        mdZone.find({ $and: [{ userId: sbUserId }, { zoneName: sbZoneName }] }, function (err, zones) {

            if (err) {

                res.status(500).json({ err });
            } else {

                if (zones == "" || sbZoneId == zones[0]._id) {

                    var myquery = { _id: sbZoneId },
                        rcNewZoneValues =
                        {
                            $set:
                            {
                                userId: sbUserId,
                                zoneName: sbZoneName,
                                description: sbDescription,
                                refreshWindow: nuRefreshWindow,
                                affectationArea: nuAffectationArea,
                                minTemperature: nuMinTemperature,
                                maxTemperature: nuMaxTemperature,
                                minHumidity: nuMinHumidity,
                                maxHumidity: nuMaxHumidity,
                                minSoilHumidity: nuMinSoilHumidity,
                                maxSoilHumidity: nuMaxSoilHumidity,
                                minPressure: nuMinPressure,
                                maxPressure: nuMaxPressure,
                                minSoilTemperature: nuMinSoilTemperature,
                                maxSoilTemperature: nuMaxSoilTemperature,
                                minUV: nuMinUV,
                                maxUV: nuMaxUV,
                                minVolatileGases: nuMinVolatileGases,
                                maxVolatileGases: nuMaxVolatileGases,
                                minBrightness: nuMinBrightness,
                                maxBrightness: nuMaxBrightness
                            }
                        }

                    mdZone.updateOne(myquery, rcNewZoneValues, function (error, ZoneUpdated) {

                        if (error) {

                            res.status(500).json({ error });

                        } else {
                            mqttManager.changeZoneInterval(sbZoneId,nuRefreshWindow,sbZoneName);
                            res.status(200).json({ZoneUpdated});
                        }

                    });

                } else {

                    res.status(401).json({
                        valor: "Ya existe una zona con este nombre",
                        zones: zones
                    });
                }

            }

        });

    }

    static DeleteZone(sbZoneId = '', res) {

        mdZone.deleteOne({ _id: sbZoneId }, function (err, obj) {
            if (err) {
                return res.status(500).json({ err });
            } else {                
                
                mqttManager.delSubscriptionElements(sbZoneId);

                return res.status(200).json({
                    value: "Se ha borrado la zona"
                });

            }
        });

    }

    static GetZonesByUserId(sbUserId, res, next) {

        mdZone.find({ userId: sbUserId }, function (err, zones) {

            if (err) {
                return res.status(500).json({ err });
            } else {
                return res.status(200).json({ zones });
            }

        });

    }

    static GetinitDataZonesByUserId(sbUserId, res, next) {

        mdZone.find({ userId: sbUserId }, { _id: 1, zoneName: 1, refreshWindow: 1 }, function (err, zones) {

            if (err) {
                return res.status(500).json({ err });
            } else {
                return res.status(200).json(
                    { zones }
                );
            }

        });

    }    

    static SearchZoneByName(sbUserId = '', sbZoneName = '', res, next) {

        mdZone.find({ userId: sbUserId, zonename: '/.*' + sbZoneName },
            function (err, zones) {

                if (err) {

                    res.status(500).json({ err });

                } else {

                    return res.status(200).json({ zones });

                }

            }
        );

    }

    static SearchZoneById(sbUserId = '', sbZoneId = '', res, next) {

        mdZone.find({ userId: sbUserId, _id: sbZoneId }, function (err, zones) {

            if (err) {
                return res.status(500).json({ err });
            } else {
                return res.status(200).json({ zones });
            }

        });

    }

}