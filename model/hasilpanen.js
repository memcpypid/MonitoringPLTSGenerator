const mongoose = require("mongoose");

const hasilpanenSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true, // 0 = Januari, 11 = Desember
    },
    week: {
      type: Number,
      required: true,
    },
    ton: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

hasilpanenSchema.index({ year: 1, month: 1, week: 1 }, { unique: true }); // pastikan tidak duplikat

module.exports = mongoose.model("HasilPanen", hasilpanenSchema);
