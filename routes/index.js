const { Router } = require("express");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const Generator = require("../model/generator");
const PLTS = require("../model/plts");
const HasilPanen = require("../model/hasilpanen");
const { requireLogin } = require("../middleware/authentication");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const router = Router();

const createJwt = (payload) => {
  return jwt.sign({ payload }, process.env.SECRET, {
    expiresIn: parseInt(process.env.MAX_AGE),
  });
};
// Get semua data berdasarkan tahun dan bulan
router.get("/hasilpanen", async (req, res) => {
  const { year, month } = req.query;
  const data = await HasilPanen.find({ year, month }).sort({ week: 1 });
  res.json(data);
});

// Tambah data baru
router.post("/hasilpanen", async (req, res) => {
  try {
    const entry = new HasilPanen(req.body);
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update data
router.put("/hasilpanen/:id", async (req, res) => {
  try {
    const updated = await HasilPanen.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Hapus data
router.delete("/hasilpanen/:id", async (req, res) => {
  await HasilPanen.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

router.get("/status", (req, res) => {
  const filePath = path.join(__dirname, "../status.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Gagal membaca file status.json:", err);
      return res.status(500).json({ message: "Gagal membaca status" });
    }

    try {
      const status = JSON.parse(data);
      res.json(status);
    } catch (parseErr) {
      console.error("Gagal parse JSON:", parseErr);
      res.status(500).json({ message: "Format JSON tidak valid" });
    }
  });
});
router.post("/status", (req, res) => {
  const filePath = path.join(__dirname, "../status.json");
  const { PLTS, Generator } = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err)
      return res.status(500).json({ message: "Gagal membaca file status" });

    try {
      let status = JSON.parse(data);

      if (PLTS) {
        status.PLTS.status = PLTS.status || status.PLTS.status;
        status.PLTS.last_updated = new Date().toISOString();
      }

      if (Generator) {
        status.Generator.status = Generator.status || status.Generator.status;
        status.Generator.last_updated = new Date().toISOString();
      }

      fs.writeFile(filePath, JSON.stringify(status, null, 2), (err) => {
        if (err)
          return res.status(500).json({ message: "Gagal menyimpan status" });

        res.json({ message: "Status berhasil diperbarui", status });
      });
    } catch (parseErr) {
      console.error("Gagal parse JSON:", parseErr);
      res.status(500).json({ message: "Format JSON tidak valid" });
    }
  });
});

router.get("/generator", requireLogin, async (req, res) => {
  try {
    const data = await Generator.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

router.get("/plts", requireLogin, async (req, res) => {
  try {
    const data = await PLTS.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});
router.get("/generator/last", requireLogin, async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const data = await Generator.find({
      timestamp: { $gte: startOfDay, $lte: now },
    })
      .sort({ timestamp: -1 }) // Ambil 100 terbaru
      .limit(100)
      .lean();

    // Urutkan dari lama ke baru agar lebih natural ditampilkan
    const sortedData = data.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    res.json(sortedData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's data" });
  }
});

router.get("/plts/last", requireLogin, async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const data = await PLTS.find({
      timestamp: { $gte: startOfDay, $lte: now },
    })
      .sort({ timestamp: -1 }) // Ambil 100 terbaru
      .limit(100)
      .lean();

    const sortedData = data.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    res.json(sortedData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's data" });
  }
});

router.get("/history/:type", requireLogin, async (req, res) => {
  const { type } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Tanggal tidak boleh kosong" });
  }

  try {
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1); // batas atas: hari berikutnya

    let data;

    if (type === "PLTS") {
      data = await PLTS.find({
        timestamp: {
          $gte: startDate,
          $lt: endDate,
        },
      });
    } else if (type === "Generator") {
      data = await Generator.find({
        timestamp: {
          $gte: startDate,
          $lt: endDate,
        },
      });
    } else {
      return res.status(400).json({ message: "Tipe tidak valid" });
    }

    if (!data.length) {
      return res.status(404).json({ message: "Data Kosong!" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching history data:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data" });
  }
});

router.post("/generator", async (req, res) => {
  const { voltage, current, frequency, temperature, humidity } = req.body;
  //console.log(req.body)
  const calculatedPower = current !== 0 ? (voltage * current).toFixed(3) : 0;
  const energy =
    calculatedPower !== 0 ? (calculatedPower / 1000).toFixed(3) : 0;
  const calculatedPowerFactor =
    calculatedPower !== 0 ? (calculatedPower / calculatedPower).toFixed(3) : 0;
  const newGeneratorData = new Generator({
    voltage: parseFloat(voltage.toFixed(3)),
    current: parseFloat(current.toFixed(3)),
    power: parseFloat(calculatedPower),
    energy: parseFloat(energy),
    frequency: parseFloat(frequency),
    powerfactor: parseFloat(calculatedPowerFactor),
    temperature: parseFloat(temperature.toFixed(3)),
    humidity: parseFloat(humidity.toFixed(3)),
  });

  try {
    const savedData = await newGeneratorData.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: "Error saving data", error });
    console.log(req.body);
  }
});

router.post("/plts", async (req, res) => {
  const { voltage, current, frequency, temperature, humidity } = req.body;
  const calculatedPower = current !== 0 ? (voltage * current).toFixed(3) : 0;
  const energy =
    calculatedPower !== 0 ? (calculatedPower / 1000).toFixed(3) : 0;
  const calculatedPowerFactor =
    calculatedPower !== 0 ? (calculatedPower / calculatedPower).toFixed(3) : 0;
  const newPLTSData = new PLTS({
    voltage: parseFloat(voltage.toFixed(3)),
    current: parseFloat(current.toFixed(3)),
    power: parseFloat(calculatedPower),
    energy: parseFloat(energy),
    frequency: parseFloat(frequency),
    powerfactor: parseFloat(calculatedPowerFactor),
    temperature: parseFloat(temperature.toFixed(3)),
    humidity: parseFloat(humidity.toFixed(3)),
  });

  try {
    const savedData = await newPLTSData.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: "Error saving data", error });
  }
});

router.post("/users/register", (req, res) => {
  const { username, email, password } = req.body;
  User.create({ username, email, password })
    .then(() => {
      return res.status(200).json({ message: "success" });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ message: "failed", error });
    });
});

router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Email Atau Password Salah!",
        error: "Email Atau Password Salah!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Email Atau Password Salah!",
        error: "Email Atau Password Salah!",
      });
    }

    if (!user.verified) {
      return res.status(401).json({
        message: "Akun Belum Di Verifikasi!",
        error: "Akun Belum Di Verifikasi!",
      });
    }

    const maxAgeSeconds = parseInt(process.env.MAX_AGE); // 7200 detik (2 jam)
    const token = createJwt(user._id, maxAgeSeconds);
    const maxAgeMs = maxAgeSeconds * 1000;

    res.cookie("auth", token, {
      httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
      secure: process.env.COOKIE_SECURE === "true",
      maxAge: maxAgeMs,
      sameSite: "lax", // Bisa "strict" atau "none" tergantung domain
      // domain: TIDAK PERLU kecuali kamu tahu apa yang kamu lakukan
    });

    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(400).json({ message: "failed", error: err.message });
  }
});

router.post("/users/logout", (req, res) => {
  res.clearCookie("auth");
  return res.status(200).json({ message: "success" });
});
router.get("/users", requireLogin, (req, res) => {
  const token = req.cookies.auth;
  const _id = jwt.verify(token, process.env.SECRET).payload;
  User.findOne({ _id }, { username: 1, email: 1, registrationDate: 1, role: 1 })
    .then((user) => {
      return res.status(200).json({ message: "success", data: user });
    })
    .catch((err) => {
      // console.log(err);
      return res
        .status(401)
        .json({ message: "error", code: "unauthenticated-access" });
    });
});
module.exports = router;
