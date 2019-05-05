var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var NodeSchema = new Schema({
  lat: Number,
  lng: Number,
  temperature: Number,
  soilTemperature: Number,
  humidity: Number,
  brightness: Number,
  soilHumidity: Number,
  uv: Number,
  volatileGases: Number,
  zoneId: String, 
  date: Date
});

mongoose.model('Node', NodeSchema);