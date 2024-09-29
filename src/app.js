// Import necessary modules
const express = require("express");
const connectDB = require('./config/database'); // Ensure correct file path
const User = require('./models/user');
const app = express();

// Middleware to parse incoming JSON data
app.use(express.json()); // To handle JSON data in the request body

// Define the signup route
app.post('/signup', async (req, res) => {
    try {
        // Create a new instance of the User model using req.body
        const userObj = {
            firstName: "Niyam",
            lastName: "Parekh",  // corrected the typo: LastName to lastName
            emailId: "niyamparekh@gmail.com",
            password: "123456",  // Note: You should encrypt this password in a real-world scenario
        };
        
        const user = new User(userObj);
        
        // Save the new user to the database
        await user.save();
        
        // Send a success response
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error('Error while creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Call connectDB function to connect to MongoDB
connectDB()
    .then(() => {
        console.log('MongoDB Connected...');
        // Start the server after successful DB connection
        app.listen(7777, () => {
            console.log("Server is listening on port 7777"); // Correct port log
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
