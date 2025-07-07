const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const GeneratorSchema = new Schema({
  voltage: Number,
  current: Number,
  power: Number,
  energy:Number,
  frequency:Number,
  powerfactor:Number,
  temperature: Number,
  humidity: Number,
  timestamp: { type: Date, default: Date.now } // Capture current date and time
});

const Generator = mongoose.model('Generator', GeneratorSchema);
module.exports = Generator;