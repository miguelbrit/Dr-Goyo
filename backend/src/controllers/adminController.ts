import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const getStats = async (req: Request, res: Response) => {
  try {
    const [patients, doctors, pharmacies, labs] = await Promise.all([
      (prisma.patient as any).count(),
      (prisma.doctor as any).count(),
      (prisma.pharmacy as any).count(),
      (prisma.laboratory as any).count(),
    ]);

    res.json({
      success: true,
      data: { patients, doctors, pharmacies, labs }
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, error: 'Error al obtener estadísticas' });
  }
};

export const getPendingApprovals = async (req: Request, res: Response) => {
  try {
    const [doctors, pharmacies, labs] = await Promise.all([
      (prisma.doctor as any).findMany({ where: { status: 'PENDING' }, include: { profile: true } }),
      (prisma.pharmacy as any).findMany({ where: { status: 'PENDING' }, include: { profile: true } }),
      (prisma.laboratory as any).findMany({ where: { status: 'PENDING' }, include: { profile: true } }),
    ]);

    const allPending = [
      ...doctors.map((d: any) => ({ ...d, entityType: 'Medico' })),
      ...pharmacies.map((p: any) => ({ ...p, entityType: 'Farmacia' })),
      ...labs.map((l: any) => ({ ...l, entityType: 'Laboratorio' })),
    ];

    res.json({
      success: true,
      data: allPending
    });
  } catch (error: any) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ success: false, error: 'Error al obtener aprobaciones pendientes' });
  }
};

export const updateApprovalStatus = async (req: Request, res: Response) => {
  const { entityId, entityType, status } = req.body;

  if (!['VERIFIED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Estado inválido' });
  }

  try {
    let result;
    if (entityType === 'Medico') {
      result = await (prisma.doctor as any).update({ where: { id: entityId }, data: { status } });
    } else if (entityType === 'Farmacia') {
      result = await (prisma.pharmacy as any).update({ where: { id: entityId }, data: { status } });
    } else if (entityType === 'Laboratorio') {
      result = await (prisma.laboratory as any).update({ where: { id: entityId }, data: { status } });
    } else {
      return res.status(400).json({ success: false, error: 'Tipo de entidad no válido' });
    }

    res.json({ success: true, message: `Estado actualizado a ${status}`, data: result });
  } catch (error: any) {
    console.error('Error updating approval status:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar estado' });
  }
};

import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

export const uploadContent = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No se subió ningún archivo' });
  }

  try {
    const filePath = req.file.path;
    let extractedText = "";

    if (req.file.mimetype === 'application/pdf' || req.file.originalname.endsWith('.pdf')) {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      extractedText = data.text;
    } else {
      extractedText = fs.readFileSync(filePath, 'utf-8');
    }

    // Create a suggested article from extracted text
    const article = await (prisma.article as any).create({
      data: {
        title: req.file.originalname.split('.')[0],
        content: extractedText,
        type: 'Admin' as any,
        authorId: (req as any).user?.id || 'admin-id'
      }
    });

    res.json({
      success: true,
      message: 'Archivo procesado exitosamente',
      data: article
    });
  } catch (error: any) {
    console.error('Error processing file:', error);
    res.status(500).json({ success: false, error: 'Error al procesar el archivo' });
  }
};
