const Appointment = require('../models/Appointment.js');
const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// @route   POST /api/appointments
const createAppointment = async (req, res) => {
    const { patientName, phone, age, gender, appointmentDate, email } = req.body;

    try {
        // Check if user already exists by email
        let user = await User.findOne({ email });

        if (!user) {
            // Generate random password
            const generatedPassword = crypto.randomBytes(4).toString('hex');
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);

            user = new User({
                name: patientName,
                age: Number(age),         // convert age to number
                gender,
                phone,
                email,
                password: hashedPassword,
                role: 'patient'
            });

            await user.save();

            // Send password via WhatsApp
            //const sendWhatsApp = require('../utils/sendWhatsApp');

            //const message = `Hello ${patientName}, your appointment is booked for ${appointmentDate}. Your login password is: ${generatedPassword}`;
            //await sendWhatsApp(phone, message);
        }

        // Create appointment linked to user (existing or new)
        const appointment = new Appointment({
            patientName,
            phone,
            age: Number(age),            // ensure age is number
            gender,
            patientId: user._id,
            appointmentDate
        });

        await appointment.save();

        res.status(201).json({
            message: 'Appointment created successfully',
            appointment
        });
        console.log('Received appointment request:', req.body);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/appointments/mine
const getMyAppointments = async (req, res) => {
  try {
    const appts = await Appointment
      .find({ patientId: req.user.id })
      .populate("patientId", "name email phone");
    res.status(200).json(appts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/appointments
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('patientId', 'name email phone');
        res.status(200).json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/appointments/:id
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate('patientId', 'name email phone');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },           // <- apply any fields you send
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Appointment updated successfully',
      appointment: updated
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/appointments/:id
const updateAppointmentStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({ message: 'Appointment status updated', appointment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   DELETE /api/appointments/:id
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    deleteAppointment,
    updateAppointment,
    getMyAppointments
};
