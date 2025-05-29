const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper: Create JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// @route   GET /api/users
const getAllUsers = async (req, res) => {
    try {
        // fetch all users, omit their password
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, age, gender, email, phone, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            age,
            gender,
            email,
            phone,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            token: generateToken(newUser._id),
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   PUT /api/auth/users/:id
const updateUser = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');  // omit password field
        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   DELETE /api/auth/users/:id
const deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { emailPhone, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email: emailPhone }) || await User.findOne({ phone: emailPhone });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email/phone or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email/phone or password' });
        }


        // Set cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // send only over HTTPS in production
            sameSite: 'Strict', // or 'Lax', depending on your frontend/backend setup
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        };

        // Send token in cookie during login
        res.cookie('token', generateToken(user._id), cookieOptions).status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    updateUser,
    deleteUser,
};
