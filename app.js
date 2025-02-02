

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mydb', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});


// Define User Schema
const userSchema = new mongoose.Schema({
    userUniqueId: String,
    userName: String,
    userEmail: String,
    userAge: String
});

const User = mongoose.model('User', userSchema);

// Display Users
app.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.render("home", { data: users });
    } catch (err) {
        res.status(500).send("Error fetching users");
    }
});

// Add User
app.post("/", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error adding user");
    }
});

// Update User
app.post("/update", async (req, res) => {
    try {
        await User.updateOne({ userUniqueId: req.body.userUniqueId }, req.body);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error updating user");
    }
});

// Delete User
app.post("/delete", async (req, res) => {
    try {
        await User.deleteOne({ userUniqueId: req.body.userUniqueId });
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error deleting user");
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
});
