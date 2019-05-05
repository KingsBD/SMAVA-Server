'use strict'
var mongoose = require('mongoose'),
    zoneError = mongoose.model('ZoneError');

module.exports = class ErrorManager {

    constructor() { }

    static SaveZoneErrorData(sbZoneId, dtDate, arrValuesOutOfRange) {
        let newZoneError = new zoneError(
            {
                zoneId: sbZoneId,
                date: dtDate,
                valuesOutOfRange: arrValuesOutOfRange
            }
        );
        newZoneError.save();
    }

    static GetErrorsByDate(sbZoneId = '', dtInitialDate = new Date(), dtFinalDate = new Date(), res, next) {

        zoneError.aggregate(
            [
                {
                    $match: {
                        date: { $lt: dtFinalDate, $gte: dtInitialDate },
                        zoneId: sbZoneId
                    }
                },
                {
                    $sort: { date: -1 }
                }
            ],
            function (err, ZoneErrors) {

                if (err) {
                    return res.status(500).json({ err });
                } else {
                    return res.status(200).json({ ZoneErrors });
                }
            }
        )
    }
}    