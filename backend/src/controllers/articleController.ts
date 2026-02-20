import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { UserType } from '@prisma/client';

export const createArticle = async (req: AuthRequest, res: Response) => {
  const { title, content, type } = req.body;

  try {
    const article = await prisma.article.create({
      data: {
        title,
        content,
        type: type as UserType,
        authorId: req.user?.id!,
      },
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear artículo' });
  }
};

export const listArticlesByType = async (req: Request, res: Response) => {
  const { type } = req.query;
  try {
    const articles = await prisma.article.findMany({
      where: type ? { type: type as UserType } : {},
      include: { author: { select: { name: true } } },
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar artículos' });
  }
};

export const detailArticle = async (req: Request, res: Response) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: req.params.id as string },
      include: { author: { select: { name: true } } },
    });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener detalle del artículo' });
  }
};
