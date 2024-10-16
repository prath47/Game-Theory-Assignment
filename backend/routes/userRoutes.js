const { Router } = require("express");
const { userModel } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = Router();

//get the user
router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json("Unauthorized");
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel
      .findOne({ userId })
      .select("-password -__v -_id -createdAt -updatedAt");
    if (!user)
      return res.status(401).json({
        message: "Unauthorized",
      });
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//create the user
router.post("/signup", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) return res.status(400).json("Already Logged In");
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please enter all fields",
      });
    }

    //check if the user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const newToken = await jwt.sign(
      { userId: user.userId, name: user.name },
      process.env.JWT_SECRET
    );
    return res.cookie("token", newToken).status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//login the user
router.post("/login", async (req, res) => {
  try {
    const tempToken = req.cookies.token;
    if (tempToken) return res.status(400).json("Already Logged In");

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter all fields",
      });
    }

    const user = await userModel
      .findOne({ email })
      .select("-__v -_id -createdAt -updatedAt");

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = await jwt.sign(
      { userId: user.userId, name: user.name },
      process.env.JWT_SECRET
    );

    return res.cookie("token", token).status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//logout the user
router.post("/logout", async (req, res) => {
  try {
    const tempToken = req.cookies.token;
    if (!tempToken) return res.status(400).json("Already Logged Out");

    res.clearCookie("token");
    return res.status(200).json({
      message: "Logged out",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
