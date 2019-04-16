var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var NodeSchema = new Schema({
  mac: String,
  variable: String,
  value: Number
});

mongoose.model('NodeError', NodeSchema);
