const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' },
    appointmentDate: { type: Date, required: true },
    treatments: [
        {
            treatmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' }
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);