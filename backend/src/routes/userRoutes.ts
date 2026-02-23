import { Router } from 'express';
import { register, login, getProfile, updateProfile, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../utils/multer.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', authMiddleware, resetPassword);
router.get('/profile', authMiddleware, getProfile);
router.put('/update-profile', authMiddleware, updateProfile);

router.post('/upload-image', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No se subió ningún archivo' });
  }
  
  const host = req.get('host');
  const imageUrl = `${req.protocol}://${host}/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl });
});

export default router;
