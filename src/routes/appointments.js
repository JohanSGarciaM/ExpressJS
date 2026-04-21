const { Router } = require('express');
const router = Router();
const appointmentController = require('../controllers/appointmentController');
const authenticateToken = require('../middlewares/auth');

router.get('/:id/appointments', authenticateToken, appointmentController.getUserAppointments);

module.exports = router;
