import { Router } from 'express';
import { getDoctorAvailability, createAppointment } from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/doctor/:doctorId', getDoctorAvailability);
router.post('/book', authMiddleware, createAppointment);

export default router;
