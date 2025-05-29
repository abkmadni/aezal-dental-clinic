const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    email: { type: String, unique: true , default: ''},
    phone: { type: String , required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'receptionist', 'admin'], default: 'patient' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);