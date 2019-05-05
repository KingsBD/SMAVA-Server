'use strict';
var mongoose = require('mongoose'),
    mdZone = mongoose.model('Zone'),
    mqtt = require('mqtt'),
    nodeManager = require('./NodeManager');

var arrConfiguration = [];
module.exports = class MqttManager {

    constructor() { }
    /*
        Servidor de entrega.
        hostname: '206.189.202.242',
        port: 8083,
        username: 'smava',
        password: '12345678',
        protocol: 'ws',
        Pruebas
        hostname: 'm15.cloudmqtt.com',
        port: 38025,
        username: 'wejhvkqd',
        password: 'kzPt9khkXUDk',
        protocol: 'wss',
        rejectUnauthorized: false
    */

    static ActiveMqttByZone() {
        var blExistZoneId = true;
        mdZone.find({}, function (err, zones) {

            if (err) { console.log(err); }
            else {

                for (let i in zones) {
                    blExistZoneId = true;

                    for (let j in arrConfiguration) {

                        if (zones[i]._id == arrConfiguration[j]._id) {
                            blExistZoneId = false;
                        }

                    }

                    if (blExistZoneId) {
                        console.log('Se crean las subscripciones...');

                        let sbReplace = "", sbZoneId = "";
                        sbReplace = JSON.stringify(zones[i]._id);
                        sbReplace = sbReplace.replace('"', '');
                        sbZoneId = sbReplace.replace('"', '');

                        var nuLength = arrConfiguration.push(
                            {
                                _id: sbZoneId,
                                refreshWindow: zones[i].refreshWindow,
                                servermqtt:mqtt.connect('ws://smava:12345678@206.189.202.242:8083'),
                                //mqtt.connect('mqtt://smava:12345678@206.189.202.242:1883')
                                //angularmqtt: mqtt.connect('ws://smava:12345678@206.189.202.242:8083'),
                                notification: setInterval(
                                    function () {
                                        var dtDate = new Date(), dtInitDate = new Date(), dtFinalDate = new Date();
                                        dtInitDate.setMinutes(dtDate.getMinutes() - zones[i].refreshWindow);
                                        console.log('Se estan buscando datos cada:' + zones[i].refreshWindow
                                            + ' en la zona: ' + zones[i].zoneName + ' hora: ' + dtFinalDate);
                                        nodeManager.GetRangeNodesAvgNotify(sbZoneId, dtInitDate, dtFinalDate);
                                    },
                                    zones[i].refreshWindow * 1000 * 60
                                )
                            }
                        );

                        nuLength = nuLength - 1;
                        arrConfiguration[nuLength].servermqtt.on('connect', function () {
                            arrConfiguration[nuLength].servermqtt.subscribe(sbZoneId);
                        });

                        arrConfiguration[nuLength].servermqtt.on('message', function (topic, message) {
                            console.log('Entro: ' + topic);
                            var JsonNode = JSON.parse(message.toString());
                            nodeManager.SaveNodeData(JsonNode, topic);
                            //arrConfiguration[nuLength].angularmqtt.publish(sbZoneId), JSON.stringify(JsonNode));
                        });
                    }

                }
            }
        });
    }

    static delSubscriptionElements(sbZoneId) {
        for (let i in arrConfiguration) {

            if (sbZoneId == arrConfiguration[i]._id) {
                clearInterval(arrConfiguration[i].notification);
                arrConfiguration[i].servermqtt.end();
                //arrConfiguration[i].angularmqtt.end(); 
                console.log(arrConfiguration.splice(i, 1));
                return;
            }
        }

    }

    static changeZoneInterval(sbZoneId, nuNewinterval, sbZoneName) {

        for (let i in arrConfiguration) {            
            
            if ((sbZoneId == arrConfiguration[i]._id) && (nuNewinterval != arrConfiguration[i].refreshWindow)) {
                clearInterval(arrConfiguration[i].notification);
                arrConfiguration[i].notification = null;
                arrConfiguration[i].refreshWindow = nuNewinterval;                
                arrConfiguration[i].notification = setInterval(
                    function () {
                        var dtDate = new Date(), dtInitDate = new Date(), dtFinalDate = new Date();
                        dtInitDate.setMinutes(dtDate.getMinutes() - nuNewinterval);
                        console.log('Se estan buscando datos cada:' + nuNewinterval
                        + ' en la zona: ' + sbZoneName + ' hora: ' + dtFinalDate);
                        nodeManager.GetRangeNodesAvgNotify(sbZoneId, dtInitDate, dtFinalDate);
                    },
                    nuNewinterval * 1000 * 60
                );
            }
        }

    }

}  