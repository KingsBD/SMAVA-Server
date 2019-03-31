var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String,
  role: String,
  name: String,
  lastname: String,
  email: String,
  token: String
});

mongoose.model('User', UserSchema);
