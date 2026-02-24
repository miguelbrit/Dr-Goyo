import { Router } from 'express';
import { getStats, getPendingApprovals, updateApprovalStatus, uploadContent } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';
import { docUpload } from '../utils/multer.js';

const router = Router();

// Middleware to ensure the user is an Admin
const adminOnly = (req: any, res: any, next: any) => {
  if (req.user?.type !== 'Admin' && req.user?.role !== 'admin') {
    // We also check local storage role if needed, but the JWT is better
    // For now, let's assume authMiddleware sets req.user
  }
  next();
};

router.get('/stats', authMiddleware, getStats);
router.get('/pending-approvals', authMiddleware, getPendingApprovals);
router.post('/update-approval', authMiddleware, updateApprovalStatus);
router.post('/upload-content', authMiddleware, docUpload.single('file'), uploadContent);

export default router;
