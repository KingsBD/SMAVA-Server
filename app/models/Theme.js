var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ThemeSchema = new Schema({
  userId: String,
  themename: String,
  description: String,
  TopicNode: String,
  TopicAngular: String,
  Frequency: Number,
  MinTemperature: Number,
  MaxTemperature: Number,
  MinHumidity: Number,
  MaxHumidity: Number,
  MinSoilHumidity: Number,
  MaxSoilHumidity: Number,
  MinPressure: Number,
  MaxPressure: Number,
  MinUV: Number,
  MaxUV: Number,
  MinBrightness: Number,
  MaxBrightness: Number,
  MatrixMarginX: Number,
  MatrixMarginY: Number
});

mongoose.model('Theme', ThemeSchema);
