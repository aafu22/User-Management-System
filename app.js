const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

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
    const users = await User.find();
    res.render("home", { data: users });
});

// Add User
app.post("/", async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.redirect("/");
});

// Update User
app.post("/update", async (req, res) => {
    await User.updateOne({ userUniqueId: req.body.userUniqueId }, req.body);
    res.redirect("/");
});

// Delete User
app.post("/delete", async (req, res) => {
    await User.deleteOne({ userUniqueId: req.body.userUniqueId });
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("App running on http://localhost:3000");
});
