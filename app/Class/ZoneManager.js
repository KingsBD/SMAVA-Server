/**
 * Class Node
 * This class has all the methods that control the node data.
*/
'use strict'
var mongoose = require('mongoose'),
    mdZone = mongoose.model('Zone');

module.exports = class ZoneManager {

    constructor() { }

    static CreateZone(
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
    ) {
        
        mdZone.find({ userId: sbUserId, zoneName: sbZoneName }, function (err, zones) {

            if (err) {              
                console.log(err);
                
                return res.status(500).json({ err });
            } else {
                if (zones == "" || sbZoneName === zones[0].zoneName) {
                    
                    var rcNewZone = new mdZone(
                        {
                            userId: sbUserId,
                            zoneName: sbZoneName,
                            description: sbDescription,
                            topicNode: sbTopicNode,
                            topicAngular: sbTopicAngular,
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
                            maxBrightness: nuMaxBrightness,
                            matrixMarginX: nuMatrixMarginX,
                            matrixMarginY: nuMatrixMarginY
                        }
                    );

                    rcNewZone.save();
                    
                    return res.status(200).json({
                        valor: "Yes"
                    });

                } else {
                    console.log(err);
                    return res.status(401).json({
                        valor: "Ya existe una zona con este nombre",
                        zones: zones
                    });

                }
            }

        });
    }

    static UpdateZone(
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
    ) {
        mdZone.find({ userId: sbUserId, zoneName: sbZoneName }, function (err, zones) {

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
                                topicNode: sbTopicNode,
                                topicAngular: sbTopicAngular,
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
                                maxBrightness: nuMaxBrightness,
                                matrixMarginX: nuMatrixMarginX,
                                matrixMarginY: nuMatrixMarginY
                            }
                        }
    
                    mdZone.updateOne(myquery, rcNewZoneValues, function (error, ZoneUpdated) {
    
                        if (error) {
    
                            return res.status(500).json({ error });
    
                        } else {
    
                            return res.status(200).json({
                                ZoneUpdated
                            });
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

    static DeleteZone(sbZoneId, res) {

        mdZone.deleteOne({ _id: sbZoneId }, function (err, obj) {
            if (err) {
                return res.status(500).json({ err });
            } else {

                return res.status(200).json({
                    value: "Se ha borrado la zona: "
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

    static SearchZoneByName(sbUserId, sbZoneName, res, next) {

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

    static SearchZoneById(sbUserId, sbZoneId, res, next) {

        mdZone.find({ userId: sbUserId, _id: sbZoneId }, function (err, zones) {

            if (err) {
                return res.status(500).json({ err });
            } else {
                return res.status(200).json({ zones });
            }

        });

    }

}