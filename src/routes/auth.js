const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

authRouter.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;
        validateSignUpData(req.body);

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, emailId, password: passwordHash });
        
        await user.save();
        res.status(201).send("User added successfully");
    } catch (err) {
        res.status(400).send("Error in saving the user: " + err.message);
    }
});

authRouter.post('/login', async (req, res) => {
  try {
      const { emailId, password } = req.body;
      const user = await User.findOne({ emailId });

      if (!user) return res.status(400).send("User not found");

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(400).send("Invalid credentials");

      const token = jwt.sign({ _id: user._id }, "DEVTINDER1234", { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true });
      res.send("Login successful");
  } catch (err) {
      res.status(400).send("Error in login: " + err.message);
  }
});

authRouter.post('/logout', async (req,res) => {
    res.cookie("token",null , {
        expires: new Date(Date.now()),
    });
    res.send("Logout successfully!!");
});



module.exports = authRouter;