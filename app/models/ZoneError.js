var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ZoneErrorSchema = new Schema({
  zoneId: String,
  date: Date,
  valuesOutOfRange:[
    {
      variable: String,
      value: Number
    }
  ]
});

mongoose.model('ZoneError', ZoneErrorSchema);