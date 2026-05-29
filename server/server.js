const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("./models/User");
const Password = require("./models/Password");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- HOME ROUTE ---------------- */
app.get("/", (req, res) => {
  res.send("PasswordVault Backend Running");
});

/* ---------------- REGISTER ---------------- */
app.post("/register", async (req, res) => {
  try {

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});

/* ---------------- LOGIN ---------------- */
app.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // 🔐 CREATE JWT TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});

/* ---------------- VERIFY TOKEN ---------------- */
const verifyToken = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  try {

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Invalid token"
    });

  }
};

/* ---------------- PROTECTED ROUTE ---------------- */
app.get("/profile", verifyToken, (req, res) => {

  res.json({
    message: "Protected route accessed successfully",
    user: req.user
  });

});

/* ---------------- ADD PASSWORD ---------------- */
app.post("/add-password", verifyToken, async (req, res) => {
  try {

    const {
      title,
      website,
      username,
      password
    } = req.body;

    const newPassword = new Password({
      title,
      website,
      username,
      password,
      userId: req.user.id
    });

    await newPassword.save();

    res.status(201).json({
      message: "Password saved successfully"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});

/* ---------------- GET PASSWORDS ---------------- */
app.get("/get-passwords", verifyToken, async (req, res) => {
  try {

    const passwords = await Password.find({
      userId: req.user.id
    });

    res.json(passwords);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});

/* ---------------- DELETE PASSWORD ---------------- */
app.delete("/delete-password/:id", verifyToken, async (req, res) => {
  try {

    const password = await Password.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!password) {
      return res.status(404).json({
        message: "Password not found"
      });
    }

    await Password.findByIdAndDelete(req.params.id);

    res.json({
      message: "Password deleted successfully"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});

/* ---------------- START SERVER ---------------- */
const startServer = async () => {
  try {

    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });

  } catch (err) {

    console.log("MongoDB Connection Error:");
    console.log(err.message);

  }
};

startServer();