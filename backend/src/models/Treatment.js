const mongoose = require('mongoose');

const TreatmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: Number,
    priceRange: String,
    discountAvailable: Boolean,
    image: String
}, { timestamps: true });

module.exports = mongoose.model('Treatment', TreatmentSchema);