/**
 * Class Node
 * This class has all the methods that control the node data.
*/
'use strict'
var mongoose = require('mongoose'),
    mdZone = mongoose.model('Zone');

module.exports = class ZoneManager {

    constructor() { }

    CreateZone(
        sbUserId, sbZoneName, sbDescription, sbTopicNode, sbTopicAngular, nuRefreshWindow,
        nuMinTemperature, nuMaxTemperature, nuMinHumidity, nuMaxHumidity,
        nuMinSoilHumidity, nuMaxSoilHumidity, nuMinPressure, nuMaxPressure,
        nuMinUV, nuMaxUV, nuMinBrightness, nuMaxBrightness,
        nuMatrixMarginX, nuMatrixMarginY,
        res, next
    ) {

        mdZone.find({ userId: sbUserId, zonename: sbZoneName }, function (err, zones) {

            if (err) {
                return res.status(500).json({ err });
            } else {
                if (zones == "" || sbZoneName == zones[0].zonename) {

                    var rcNewZone = new mdZone(
                        {
                            userId: sbUserId,
                            zonename: sbZoneName,
                            description: sbDescription,
                            topicNode: sbTopicNode,
                            topicAngular: sbTopicAngular,
                            refreshWindow: nuRefreshWindow,
                            minTemperature: nuMinTemperature,
                            maxTemperature: nuMaxTemperature,
                            minHumidity: nuMinHumidity,
                            maxHumidity: nuMaxHumidity,
                            minSoilHumidity: nuMinSoilHumidity,
                            maxSoilHumidity: nuMaxSoilHumidity,
                            minPressure: nuMinPressure,
                            maxPressure: nuMaxPressure,
                            minUV: nuMinUV,
                            maxUV: nuMaxUV,
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

                    return res.status(401).json({
                        valor: "Ya existe una zona con este nombre",
                        zones: zones
                    });

                }
            }

        });

    }

    static UpdateZone(
        sbUserId, sbZoneName, sbDescription, sbTopicNode, sbTopicAngular, nuRefreshWindow,
        nuMinTemperature, nuMaxTemperature, nuMinHumidity, nuMaxHumidity,
        nuMinSoilHumidity, nuMaxSoilHumidity, nuMinPressure, nuMaxPressure,
        nuMinUV, nuMaxUV, nuMinBrightness, nuMaxBrightness,
        nuMatrixMarginX, nuMatrixMarginY,
        res, next
    ) {
        zone.find({ userId: sbUserId, zonename: sbZoneName }, function (err, zones) {

            if (err) {

                res.status(500).json({ err });
            }

            if (zones == "" || sbZoneId == zones[0]._id) {

                var myquery = { _id: sbZoneId },
                    rcNewZoneValues =
                    {
                        $set:
                        {
                            userId: sbUserId,
                            zonename: sbZoneName,
                            description: sbDescription,
                            topicNode: sbTopicNode,
                            topicAngular: sbTopicAngular,
                            refreshWindow: nuRefreshWindow,
                            minTemperature: nuMinTemperature,
                            maxTemperature: nuMaxTemperature,
                            minHumidity: nuMinHumidity,
                            maxHumidity: nuMaxHumidity,
                            minSoilHumidity: nuMinSoilHumidity,
                            maxSoilHumidity: nuMaxSoilHumidity,
                            minPressure: nuMinPressure,
                            maxPressure: nuMaxPressure,
                            minUV: nuMinUV,
                            maxUV: nuMaxUV,
                            minBrightness: nuMinBrightness,
                            maxBrightness: nuMaxBrightness,
                            matrixMarginX: nuMatrixMarginX,
                            matrixMarginY: nuMatrixMarginY
                        }
                    }

                mdZone.updateOne(myquery, rcNewZoneValues, function (err, res) {

                    if (err) {

                        return res.status(500).json({ err });

                    } else {

                        return res.status(200).json({
                            value: "Se ha modificado la zona."
                        });
                    }

                });

            } else {

                res.status(401).json({
                    valor: "Ya existe una zona con este nombre",
                    zones: zones
                });
            }

        });

    }

    static DeleteZone(sbZoneId, sbZoneName, res) {

        mdZone.deleteOne({ _id: sbZoneId }, function (err, obj) {
            if (err) {
                return res.status(500).json({ err });
            } else {

                return res.status(200).json({
                    value: "Se ha borrado la zona: " + sbZoneName
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

        mdZone.find({ userId: sbUserId, zonename: { $gt: sbZoneName } },
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