var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ZoneSchema = new Schema({
  userId: String,
  zoneName: String,
  description: String,
  refreshWindow: Number,
  affectationArea: Number,
  minTemperature: Number,
  maxTemperature: Number,
  minSoilTemperature: Number,
  maxSoilTemperature: Number,  
  minHumidity: Number,
  maxHumidity: Number,
  minBrightness: Number,
  maxBrightness: Number,
  minSoilHumidity: Number,
  maxSoilHumidity: Number,
  minUV: Number,
  maxUV: Number,
  minVolatileGases: Number,
  maxVolatileGases: Number, 
  minPressure: Number,
  maxPressure: Number
});

mongoose.model('Zone', ZoneSchema);
