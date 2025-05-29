const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController.js');
const { allow } = require('../middlewares/index.js');
const verifyToken = require('../middlewares/verifyToken.js');

// Public Route: Book appointment (unauthenticated patients allowed)
router.post('/', appointmentController.createAppointment);

// Protected Routes (Admin/Receptionist access only)
router.get('/', ...allow(['admin', 'receptionist']), appointmentController.getAllAppointments);
router.get('/mine', verifyToken, appointmentController.getMyAppointments);
router.get('/:id', ...allow(['admin', 'receptionist']), appointmentController.getAppointmentById);
router.patch('/:id', ...allow(['admin', 'receptionist']), appointmentController.updateAppointmentStatus);
router.put('/:id', ...allow(['admin', 'receptionist']), appointmentController.updateAppointment);
router.delete('/:id', ...allow(['admin', 'receptionist']), appointmentController.deleteAppointment);

module.exports = router;
