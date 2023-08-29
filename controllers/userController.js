// Load env variables
if (process.env.NODE_ENV != "production") {
    require("dotenv").config()
}

const User = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

async function signUp(req, res) {
    try {
        // Get email and pw
        const { email, password } = req.body;

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 8)

        // Create a user with the data 
        await User.create({ email, password: hashedPassword });
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        // Response
        res.sendStatus(400)
    }
}

async function login(req, res) {

    try {

        // Get the email and password off req body 
        const { email, password } = req.body;
        // Find the user with the requested email 
        const user = await User.findOne({ email });
        if (!user) return res.sendStatus('failed getting user', 401);

        // Compare sent in password with found user password hash
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) return res.sendStatus('failed on match pw', 401);

        // Create a jwt token
        const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
        const token = jwt.sign({ sub: user._id, exp }, process.env.SECRET);

        // Set cookie
        res.cookie("Authorization", token, {
            expires: new Date(exp),
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === "production"
        })

        // Sent it 
        res.json({ token })
    } catch (error) {
        console.log(error);
    }
}

function logout(req, res) {
    try {

        res.clearCookie("Authorization")
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
    }
}

function checkAuth(req, res) {
    try {
        console.log(req.user);
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    signUp,
    login,
    logout,
    checkAuth
}