const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController.js');
const { allow } = require('../middlewares/index.js');

// Public route: Get all treatments (for patients to browse)
router.get('/', treatmentController.getAllTreatments);

// Protected routes (Admin or Receptionist only)
router.post(
    '/',
    ...allow(['admin', 'receptionist']),
    treatmentController.createTreatment
);

router.get(
    '/:id',
    ...allow(['admin', 'receptionist']),
    treatmentController.getTreatmentById
);

router.put(
    '/:id',
    ...allow(['admin', 'receptionist']),
    treatmentController.updateTreatment
);

router.delete(
    '/:id',
    ...allow(['admin', 'receptionist']),
    treatmentController.deleteTreatment
);

module.exports = router;
