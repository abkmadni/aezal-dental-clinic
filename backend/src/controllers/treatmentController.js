const Treatment = require('../models/Treatment.js');

// @route   POST /api/treatments
const createTreatment = async (req, res) => {
    const { name, description, price, priceRange, discountAvailable, image } = req.body;

    try {
        const newTreatment = new Treatment({
            name,
            description,
            price,
            priceRange,
            discountAvailable,
            image,
        });

        await newTreatment.save();
        res.status(201).json({ message: 'Treatment created successfully', treatment: newTreatment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/treatments
const getAllTreatments = async (req, res) => {
    try {
        const treatments = await Treatment.find();
        res.status(200).json(treatments);
        // const sendWhatsApp = require('../utils/sendWhatsApp');

        // const message = `Hello, your appointment is booked for. Your login password is:`;
        // const phone = "+923322628241";
        // await sendWhatsApp(phone, message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/treatments/:id
const getTreatmentById = async (req, res) => {
    try {
        const treatment = await Treatment.findById(req.params.id);

        if (!treatment) {
            return res.status(404).json({ message: 'Treatment not found' });
        }

        res.status(200).json(treatment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   PUT /api/treatments/:id
const updateTreatment = async (req, res) => {
    try {
        const updatedTreatment = await Treatment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedTreatment) {
            return res.status(404).json({ message: 'Treatment not found' });
        }

        res.status(200).json({ message: 'Treatment updated successfully', treatment: updatedTreatment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   DELETE /api/treatments/:id
const deleteTreatment = async (req, res) => {
    try {
        const treatment = await Treatment.findByIdAndDelete(req.params.id);

        if (!treatment) {
            return res.status(404).json({ message: 'Treatment not found' });
        }

        res.status(200).json({ message: 'Treatment deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createTreatment,
    getAllTreatments,
    getTreatmentById,
    updateTreatment,
    deleteTreatment
};
