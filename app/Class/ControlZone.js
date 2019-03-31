/**
 * Class Node
 * This class has all the methods that control the node data.
*/
'use strict'
var mongoose = require('mongoose'),
theme = mongoose.model('Theme');

module.exports = class ControlZone {  

    constructor () {}

    static CreateZone
    (
        sbUserId,
        sbZonename,
        sbDescription,
        sbTopicNode,
        sbTopicAngular,
        nuFrequency,
        nuMinTemperature,
        nuMaxTemperature,
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
        nuMatrixMarginX,
        nuMatrixMarginY
    ){

        var rcNewZone = new theme(
            {
                userId: sbUserId,
                themename: sbZonename,
                description: sbDescription,
                TopicNode: sbTopicNode,
                TopicAngular: sbTopicAngular,
                Frequency: nuFrequency,
                MinTemperature: nuMinTemperature,
                MaxTemperature: nuMaxTemperature,
                MinHumidity: nuMinHumidity,
                MaxHumidity: nuMaxHumidity,
                MinSoilHumidity: nuMinSoilHumidity,
                MaxSoilHumidity: nuMaxSoilHumidity,
                MinPressure: nuMinPressure,
                MaxPressure: nuMaxPressure,
                MinUV: nuMinUV,
                MaxUV: nuMaxUV,
                MinBrightness: nuMinBrightness,
                MaxBrightness: nuMaxBrightness,
                MatrixMarginX: nuMatrixMarginX,
                MatrixMarginY: nuMatrixMarginY
            }
        );

        rcNewZone.save();
    }
    
    CreateZone 
    (
        sbUserId,
        sbtZoneName,
        sbDescription,
        sbTopicNode,
        sbTopicAngular,
        nuFrequency,
        nuMinTemperature,
        nuMaxTemperature,
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
        nuMatrixMarginX,
        nuMatrixMarginY,        
        res,
        next
    )   
    {

        theme.find({userId:sbUserId, themename:sbtZoneName},function(err, zones){
      
            if(err){
                res.status(500).json({
                    valor:"error en la recuperacion de los zonas: "+ err
                });
            }
      
            if(zones == "" || sbtZoneName == zones[0].themename ){

                CreateZone
                (
                    sbUserId,
                    sbtZoneName,
                    sbDescription,
                    sbTopicNode,
                    sbTopicAngular,
                    nuFrequency,
                    nuMinTemperature,
                    nuMaxTemperature,
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
                    nuMatrixMarginX,
                    nuMatrixMarginY
                )
      
                return res.status(200).json({
                    valor: "Yes"
                });

            }else{

                res.status(401).json({
                    valor: "Ya existe una zona con este nombre",
                    zones: zones
                });

            }

        });
      
    }    

    UpdateZone
    (
        sbZoneId,        
        sbUserId,
        sbZonename,
        sbDescription,
        sbTopicNode,
        sbTopicAngular,
        nuFrequency,
        nuMinTemperature,
        nuMaxTemperature,
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
        nuMatrixMarginX,
        nuMatrixMarginY
    ){

        var myquery = {_id:sbZoneId},
        rcNewZoneValues = 
            { $set:
                {
                    userId: sbUserId,
                    themename: sbZonename,
                    description: sbDescription,
                    TopicNode: sbTopicNode,
                    TopicAngular: sbTopicAngular,
                    Frequency: nuFrequency,
                    MinTemperature: nuMinTemperature,
                    MaxTemperature: nuMaxTemperature,
                    MinHumidity: nuMinHumidity,
                    MaxHumidity: nuMaxHumidity,
                    MinSoilHumidity: nuMinSoilHumidity,
                    MaxSoilHumidity: nuMaxSoilHumidity,
                    MinPressure: nuMinPressure,
                    MaxPressure: nuMaxPressure,
                    MinUV: nuMinUV,
                    MaxUV: nuMaxUV,
                    MinBrightness: nuMinBrightness,
                    MaxBrightness: nuMaxBrightness,
                    MatrixMarginX: nuMatrixMarginX,
                    MatrixMarginY: nuMatrixMarginY
                }
            }
        
        theme.updateOne(myquery, rcNewZoneValues, function(err, res) {

            if(err){
                res.status(500).json({
                    valor:"error en la recuperacion de las zonas: "+ err
                });
            }
    
            return res.status(200).json({
                value: "Se ha modificado la zona."
            });
    
        });        
    }   

    static UpdateZone
    (
        sbZoneId,
        sbUserId,
        sbZoneName,
        sbDescription,
        sbTopicNode,
        sbTopicAngular,
        nuFrequency,
        nuMinTemperature,
        nuMaxTemperature,
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
        nuMatrixMarginX,
        nuMatrixMarginY,        
        res,
        next
    )   
    {
        theme.find({userId:sbZoneId, themename:sbZoneName.toLowerCase()},function(err, zones){

            if(err){
                res.status(500).json({
                  valor:"error en la recuperacion de las zonas: "+ err
                });
            }

            if(zones == ""|| sbZoneId == zones[0]._id ){

                UpdateZone
                
                (    
                    sbZoneId,    
                    sbUserId,
                    sbZonename,
                    sbDescription,
                    sbTopicNode,
                    sbTopicAngular,
                    nuFrequency,
                    nuMinTemperature,
                    nuMaxTemperature,
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
                    nuMatrixMarginX,
                    nuMatrixMarginY
                )
      
            }else{

                res.status(401).json({
                    valor: "Ya existe una zona con este nombre",
                    zones: zones
                });
            }

        });        

    }    

    static DeleteZone(sbZoneId,sbZoneName, res) {
      
        theme.deleteOne({_id:sbZoneId}, function(err, obj) {
            if(err){
                res.status(500).json({
                    valor:"error en la recuperacion de las zonas: "+ err
                });
            }
      
            return res.status(200).json({
                value: "Se ha borrado la zona: "+ sbZoneName
            });
      
        });
        
    }      

    static GetZonesByUserId (sbUserId, res, next) {

        theme.find({userId:sbUserId},function(err, zones){

          if(err){
            res.status(500).json({
                valor:"error en la recuperacion de los temas "+ err
            });
          }

          if(zones == null){
             res.status(401).json({
              valor: "No hay concidencia"
            });
          }

          return res.status(200).json({
            themes: zones
          });

        });
      
    }

    static SearchZoneByName(sbUserId,sbZoneName, res, next) {

        theme.find(
            {   
                userId:sbUserId, 
                themename:{ $gt:sbZoneName}
            },
            function(err, themes){

            if(err){
                res.status(500).json({
                    valor:"error en la recuperacion de los temas "+ err
                });
            }
            if(themes == null){
                res.status(401).json({
                    valor: "No hay concidencia"
                });
            }
            return res.status(200).json({
                themes: themes
            });

        });
      
    }
    
    static SearchZoneById (sbUserId, sbZoneId,res, next) {

        theme.find({userId:sbUserId, _id:sbZoneId },function(err, themes){

        if(err){
            res.status(500).json({
                valor:"error en la recuperacion de los temas "+ err
            });
        }
        
        if(themes == null){
            res.status(401).json({
                valor: "No hay concidencia"
            });
        }
        
        return res.status(200).json({themes});
        
        });
        
    }

}