const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");

// ================== SIGNUP ==================
router.post("/signup", async (req, res) => {

    console.log("BODY RECEIVED:");
    console.log(req.body);

    try {
        const { fullname, email, password, phone } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            fullname,
            email,
            password: hashedPassword,
            phone
        });
        console.log("USER OBJECT:", user);
        const savedUser = await user.save();
        console.log("USER SAVED SUCCESSFULLY");
console.log("USER SAVED:");
console.log(savedUser);

        res.json({
            success: true,
            message: "User created successfully"
        });

    } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res.json({
        success: false,
        message: err.message
    });
}
});


// ================== LOGIN ==================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid password"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            userId: user._id,
            fullname: user.fullname
        });

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
});


// ================== GET USER PROFILE (NEW) ==================
router.get("/profile/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;