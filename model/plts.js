const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PLTSSchema = new Schema({
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

  const PLTS = mongoose.model('PLTS', PLTSSchema);
  module.exports = PLTS;