const express = require("express");
const connectDB = require("./config/database"); 
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use ('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);


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