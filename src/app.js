const express = require("express");
const connectDB = require("./config/database"); // Import connection function
const User = require("./models/user"); // Import User model
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("./utils/validation");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Signup API for registering a user
app.post("/signup", async (req, res) => {
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

// Login API
app.post('/login', async (req, res) => {
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

// Profile API (protected route)
app.get('/profile', async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.status(401).send("Unauthorized");

        const decoded = jwt.verify(token, "DEVTINDER1234");
        const user = await User.findById(decoded._id);
        if (!user) return res.status(404).send("User not found");

        res.send(user);
    } catch (err) {
        res.status(400).send("Error fetching profile: " + err.message);
    }
});

// Get user by email
app.get("/user", async (req, res) => {
    try {
        const { emailId } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) return res.status(404).send("User not found");
        res.send(user);
    } catch (err) {
        res.status(500).send("Something went wrong: " + err.message);
    }
});

// Get all users (Feed API)
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(500).send("Something went wrong: " + err.message);
    }
});

// Delete user by ID
app.delete("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).send("User not found");
        res.send("User deleted successfully");
    } catch (err) {
        res.status(500).send("Something went wrong: " + err.message);
    }
});

// Update user by ID
app.patch("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;
        const allowedUpdates = ["photoUrl", "about", "gender", "age"];
        const isValidUpdate = Object.keys(updates).every((key) => allowedUpdates.includes(key));

        if (!isValidUpdate) return res.status(400).send("Invalid update fields");

        const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
        if (!user) return res.status(404).send("User not found");

        res.send("User updated successfully");
    } catch (err) {
        res.status(500).send("Something went wrong: " + err.message);
    }
});

// Connect to database and start server
connectDB()
    .then(() => {
        console.log("Database connection established!!");
        app.listen(7777, () => {
            console.log("Server is running on port 7777");
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected!!", err);
    });
