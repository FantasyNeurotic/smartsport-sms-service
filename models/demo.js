const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DemoSchema = new Schema({
  name: { type: String, unique: true, sparse: true },
  number: Number,
});
module.exports = mongoose.model('demo', DemoSchema);