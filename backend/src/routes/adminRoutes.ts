import { Router } from 'express';
import { getStats, getPendingApprovals, updateApprovalStatus, uploadContent } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';
import { docUpload } from '../utils/multer.js';

const router = Router();

// Middleware to ensure the user is an Admin
const adminOnly = (req: any, res: any, next: any) => {
  console.log(`[AUTH-DEBUG] Checking Admin access for: ${req.user?.email || 'Unknown'} | Type: ${req.user?.type} | Role: ${req.user?.role}`);
  if (req.user?.type !== 'Admin' && req.user?.role !== 'admin') {
     console.warn(`[SECURITY] Unauthorized access attempt to ${req.url} by user ${req.user?.id}`);
     return res.status(403).json({ success: false, error: 'Acceso denegado: Se requieren permisos de administrador' });
  }
  next();
};

router.get('/stats', authMiddleware, adminOnly, getStats);
router.get('/pending-approvals', authMiddleware, adminOnly, getPendingApprovals);
router.post('/update-approval', authMiddleware, adminOnly, updateApprovalStatus);
router.post('/upload-content', authMiddleware, adminOnly, docUpload.single('file'), uploadContent);

export default router;
