'use strict';
var mongoose = require('mongoose'),
    mdZone = mongoose.model('Zone'),
    mqtt = require('mqtt'),
    nodeManager = require('./NodeManager');

var clients = [], angularClients = [];
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
        
        mdZone.find({}, function (err, zones) {

            if (err) { console.log(err); }
            else {

                for (let i in zones) {
                    let sbReplace = "", sbZoneId = "";
                    sbReplace = JSON.stringify(zones[i]._id);
                    sbReplace = sbReplace.replace('"','');
                    sbZoneId  = sbReplace.replace('"','');
                    clients[i] = mqtt.connect('ws://smava:12345678@206.189.202.242:8083');
                    //clients[i] = mqtt.connect('mqtt://smava:12345678@206.189.202.242:1883')
                    //angularClients[i] = mqtt.connect('ws://smava:12345678@206.189.202.242:8083');
                    
                    clients[i].on('connect', function () {
                        clients[i].subscribe(sbZoneId);
                    });               

                    clients[i].on('message', function (topic, message) {
                        console.log('Entro: '+ topic);
                        var JsonNode = JSON.parse(message.toString());
                        JsonNode.data.timestamp = new Date();
                        nodeManager.SaveNodeData(JsonNode);
                        //angularClients[i].publish(sbZoneId), JSON.stringify(JsonNode));

                    });

                }
            }
        });
    }

    static DeActivateMqttByZone() {    
        for (let i in clients) {
            clients[i].end();
            //angularClients[i].end();
        }
    }

}  