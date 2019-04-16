var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ZoneSchema = new Schema({
  userId: String,
  zoneName: String,
  description: String,
  topicNode: String,
  topicAngular: String,
  refreshWindow: Number,
  minTemperature: Number,
  maxTemperature: Number,
  minHumidity: Number,
  maxHumidity: Number,
  minSoilHumidity: Number,
  maxSoilHumidity: Number,
  minPressure: Number,
  maxPressure: Number,
  minUV: Number,
  maxUV: Number,
  minBrightness: Number,
  maxBrightness: Number,
  matrixMarginX: Number,
  matrixMarginY: Number
});

mongoose.model('Zone', ZoneSchema);
