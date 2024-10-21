const { Router } = require("express");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { SECRET, MAX_AGE } = require("../consts")
const Generator = require('../model/generator');
const PLTS = require('../model/plts');
const { requireLogin } = require("../middleware/authentication");
const bcrypt = require("bcryptjs");
const router = Router();

const createJwt = (payload) => {
  return jwt.sign({ payload }, SECRET, { expiresIn: MAX_AGE });
}

// API endpoints
router.get('/generator', async (req, res) => {
  try {
    const data = await Generator.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

router.get('/plts', async (req, res) => {
  try {
    const data = await PLTS.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// History API endpoint
router.get('/history/:type', async (req, res) => {
  const { type } = req.params;
  const { date } = req.query;

  try {
    let data;
    if (type === 'PLTS') {
      data = await PLTS.find({ timestamp: { $gte: new Date(date) } });
    } else if (type === 'Generator') {
      data = await Generator.find({ timestamp: { $gte: new Date(date) } });
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    if (!data.length) {
      return res.status(404).json({ message: 'No data found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history data' });
  }
});


router.post('/generator', async (req, res) => {
  const { voltage, current, frequency, temperature, humidity } = req.body;
  //console.log(req.body)
  const calculatedPower = current !== 0 ? (voltage * current).toFixed(3) : 0;
  const energy = calculatedPower !== 0 ? (calculatedPower / 1000).toFixed(3) : 0;
  const calculatedPowerFactor = calculatedPower !== 0 ? (calculatedPower / calculatedPower).toFixed(3) : 0;
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
    res.status(400).json({ message: 'Error saving data', error });
    console.log(req.body)

  }
});

// POST API endpoint to receive data from ESP32 for PLTS
router.post('/plts', async (req, res) => {
  const { voltage, current, frequency, temperature, humidity } = req.body;
  const calculatedPower = current !== 0 ? (voltage * current).toFixed(3) : 0;
  const energy = calculatedPower !== 0 ? (calculatedPower / 1000).toFixed(3) : 0;
  const calculatedPowerFactor = calculatedPower !== 0 ? (calculatedPower / calculatedPower).toFixed(3) : 0;
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
    res.status(400).json({ message: 'Error saving data', error });
  }
});



// // POST API endpoint to receive data from ESP32
// router.post('/generator', async (req, res) => {
//   const { voltage, current, power, energy, frequency, powerfactor, temperature, humidity } = req.body;
//   const apparentPower = voltage * current;
//   const calculatedPowerFactor = apparentPower !== 0 ? (power / apparentPower) : 0;
//   const newGeneratorData = new Generator({
//     voltage,
//     current,
//     power,
//     energy,
//     frequency,
//     powerfactor: calculatedPowerFactor, // Gunakan power factor yang dihitung
//     temperature,
//     humidity,
//   });

//   try {
//     const savedData = await newGeneratorData.save();
//     res.status(201).json(savedData);
//   } catch (error) {
//     res.status(400).json({ message: 'Error saving data', error });
//   }
// });

// router.post('/plts', async (req, res) => {
//   const { voltage, current, power, energy, frequency, powerfactor, temperature, humidity } = req.body;
//   const apparentPower = voltage * current;
//   const calculatedPowerFactor = apparentPower !== 0 ? (power / apparentPower) : 0;
//  const newPLTSData = new PLTS({
//     voltage,
//     current,
//     power,
//     energy,
//     frequency,
//     powerfactor: calculatedPowerFactor,
//     temperature,
//     humidity,
//   });

//   try {
//    const savedData = await newPLTSData.save();
//     res.status(201).json(savedData);
//   } catch (error) {
//     res.status(400).json({ message: 'Error saving data', error });
//   }
// });
/**
 * @route POST api/users/register
 * @desc Register new user
 * @access Private
 */
router.post("/users/register", (req, res) => {
  const { username, email, password } = req.body;
  User.create({ username, email, password })
    .then(() => {
      return res.status(200).json({ message: "success" })
    })
    .catch(error => {
      console.log(error);
      return res.status(400).json({ message: "failed", error })
    });
});

/**
 * @route POST api/users/login
 * @desc Login user
 * @access Public
 */
// router.post("/users/login", (req, res) => {
//     const {email, password} = req.body;
//     User.findOne({email: email, password: password})
//         .then(user => {
//             if (!user) {
//                 return res.status(401).json({message: "failed", error: "wrong-credentials"});
//             }
//             const maxAge = 3 * 24 * 60 * 60
//             const token = createJwt(user._id, maxAge);
//             res.cookie("auth", token, {httpOnly: true, maxAge: maxAge * 10});
//             return res.status(200).json({message: "success", data: user})
//         })
//         .catch(err => {
//             return res.status(400).json({message: "failed", err})
//         });
// });


router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email Atau Password Salah!", error: "Email Atau Password Salah!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email Atau Password Salah!", error: "Email Atau Password Salah!" });
    }

    if (!user.verified) {
      return res
        .status(401)
        .json({ message: "Akun Belum Di Verfikasi!", error: "Akun Belum Di Verfikasi!" });
    }
    const maxAge = 3 * 24 * 60 * 60;
    const token = createJwt(user._id, maxAge);
    res.cookie("auth", token, { httpOnly: true, maxAge: maxAge * 10 });
    return res.status(200).json({ message: "success", data: user });
  } catch (err) {
    return res.status(400).json({ message: "failed", error: 'Error' });
  }
});

/**
 * @route POST api/users/logout
 * @desc Log user out
 * @access Public
 */
router.post("/users/logout", (req, res) => {
  res.clearCookie("auth");
  return res.status(200).json({ message: "success" })
});

/**
 * @route GET api/users
 * @desc Get authenticated user
 * @access Private
 */
router.get("/users", requireLogin, (req, res) => {
  const token = req.cookies.auth;
  const _id = jwt.verify(token, SECRET).payload;
  User.findOne({ _id }, { username: 1, email: 1, registrationDate: 1 })
    .then(user => {
      return res.status(200).json({ message: "success", data: user })
    })
    .catch((err) => {
      // console.log(err);
      return res.status(401).json({ message: "error", code: "unauthenticated-access" });
    })
});

/**
 * @route GET api/dragons
 * @desc Get dragons
 * @access Private
 */
router.get("/dragons", requireLogin, (req, res) => {
  Dragon.find()
    .then(dragons => {
      return res.status(200).json({ message: "success", data: dragons })
    })
    .catch(error => {
      console.log(error);
      return res.status(400).json({ message: "error", error })
    })
});

module.exports = router;