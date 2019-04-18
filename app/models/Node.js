var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var NodeSchema = new Schema({
  mac: String,
  lat: Number,
  lng: Number,
  temperature: Number,
  soilTemperature: Number,
  humidity: Number,
  brightness: Number,
  soilHumidity: Number,
  altitude: Number,
  pressure: Number,
  uv: Number,
  volatileGases: Number,
  battery: Number,
  zoneId: String,
  date: Date
});

mongoose.model('Node', NodeSchema);