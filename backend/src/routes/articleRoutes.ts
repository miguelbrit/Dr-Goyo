import { Router } from 'express';
import { createArticle, listArticlesByType, detailArticle } from '../controllers/articleController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', listArticlesByType);
router.get('/:id', detailArticle);
router.post('/', authMiddleware, createArticle);

export default router;
