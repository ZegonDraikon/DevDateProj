// Import necessary modules
const express = require("express");
const connectDB = require('./config/database'); 
const User = require('./models/user');
const app = express();

app.use(express.json()); 

// Signup route
app.post('/signup', async (req, res) => {
    // Define the user object before usage
    const userObj = {
        firstName: "Niyam",
        lastName: "Parekh", 
        emailId: "niyamparekh@gmail.com",
        password: "123456", // Remember to hash passwords in real apps
    };
    
    const user = new User(userObj);
    try {
        await user.save();
        res.send("User added successfully!");
    } catch (error) {
        console.error('Error while creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Fetch user by email
app.get('/user', async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = await User.findOne({ emailId: userEmail });
        if (!user) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

// Placeholder route for 'feed'
app.get('/feed', (req, res) => {
    res.send("Feed placeholder");
});

// Delete user by ID
app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).send("User not found");
        } else {
            await user.remove();
            res.send("User deleted successfully");
        }
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

// Update user details
app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["userId", "photoUrl", "about", "gender", "age"];

        // Validate the incoming update fields
        const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            return res.status(400).send("Invalid updates");
        }

        const user = await User.findByIdAndUpdate(
            { _id: userId },
            data,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send(user);
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

// Connect to MongoDB and start server
connectDB()
    .then(() => {
        console.log('MongoDB Connected...');
        app.listen(7777, () => {
            console.log("Server is listening on port 7777"); 
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
