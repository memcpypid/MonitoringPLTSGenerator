const mongoose = require("mongoose");
const PLTS = require("./model/generator"); // Ganti jika nama file model berbeda

const mongoURI =
  "mongodb://Smartsolar:SmartSolar123@ac-fj2dlex-shard-00-00.xzpck0p.mongodb.net:27017,ac-fj2dlex-shard-00-01.xzpck0p.mongodb.net:27017,ac-fj2dlex-shard-00-02.xzpck0p.mongodb.net:27017/Monitoring?replicaSet=atlas-9xu2vu-shard-0&ssl=true&authSource=admin";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", async () => {
  console.log("Terhubung ke MongoDB...");

  const startDate = new Date("2025-06-01T00:00:00");
  const endDate = new Date("2025-07-31T23:59:00");

  let bulkOps = [];
  let counter = 0;

  let current = new Date(startDate);
  while (current <= endDate) {
    const timestamp = new Date(current);
    timestamp.setSeconds(Math.floor(Math.random() * 60)); // detik random

    const voltage = parseFloat((Math.random() * (7 - 4) + 4).toFixed(2)); // 4.00 - 7.00 V
    const currentAmp = parseFloat((Math.random() * (3 - 0.5) + 0.5).toFixed(2)); // 0.50 - 3.00 A
    const power = parseFloat((voltage * currentAmp).toFixed(2)); // watt
    const energy = parseFloat((power / 60 / 1000).toFixed(4)); // kWh tiap menit
    const frequency = parseFloat((Math.random() * 1 + 49.5).toFixed(2)); // 49.5 - 50.5 Hz
    const temperature = parseFloat((Math.random() * 15 + 25).toFixed(2)); // 25 - 40 C
    const humidity = parseFloat((Math.random() * 40 + 30).toFixed(2)); // 30 - 70 %
    const powerFactor = parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)); // 0.8 - 1

    bulkOps.push({
      insertOne: {
        document: {
          voltage,
          current: currentAmp,
          power,
          energy,
          frequency,
          powerfactor: powerFactor,
          temperature,
          humidity,
          timestamp,
        },
      },
    });

    counter++;
    current.setMinutes(current.getMinutes() + 1); // tambah 1 menit

    if (bulkOps.length === 5000) {
      await PLTS.bulkWrite(bulkOps);
      console.log(`Inserted ${counter} records so far...`);
      bulkOps = [];
    }
  }

  if (bulkOps.length > 0) {
    await PLTS.bulkWrite(bulkOps);
    console.log(`Inserted total ${counter} records`);
  }

  mongoose.connection.close();
});
