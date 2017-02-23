const mongoose = require('mongoose');
const ttl = require('mongoose-ttl');

const Schema = mongoose.Schema;

const SmsSchema = new Schema({
  tel: String,
  system: String,
  code: String,
  usage: String,
  createAt: { type: Date, default: new Date() },
  updateAt: { type: Date, default: new Date() },
});

SmsSchema.plugin(ttl, { ttl: 1000 * 60 * 10 });


module.exports = mongoose.model('verify-code', SmsSchema);
