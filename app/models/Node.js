var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var NodeSchema = new Schema({
  mac: String, // morir
  lat: Number,
  lng: Number,
  temperature: Number,
  soilTemperature: Number,
  humidity: Number,
  brightness: Number,
  soilHumidity: Number,
  altitude: Number, // morir
  pressure: Number, // morir
  uv: Number,
  volatileGases: Number,
  battery: Number ,// morir
  zoneId: String, 
  date: Date
});

mongoose.model('Node', NodeSchema);