import { Router } from 'express';
import { createArticle, listArticlesByType, detailArticle } from '../controllers/articleController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', listArticlesByType);
router.get('/:id', detailArticle);
router.post('/', authMiddleware, createArticle);

export default router;
