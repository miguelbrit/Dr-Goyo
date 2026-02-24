import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const listDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await (prisma.doctor as any).findMany({ 
      where: { status: 'VERIFIED' },
      include: { 
        profile: true,
        availability: true
      } 
    });
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al listar médicos' });
  }
};

export const detailDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await (prisma.doctor as any).findUnique({
      where: { id: req.params.id as string },
      include: { 
        profile: true,
        availability: true
      },
    });
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener detalle del médico' });
  }
};

// Similar for Pharmacy and Laboratory
export const listPharmacies = async (req: Request, res: Response) => {
  try {
    const pharmacies = await (prisma.pharmacy as any).findMany({ 
      where: { status: 'VERIFIED' },
      include: { profile: true } 
    });
    res.json({ success: true, data: pharmacies });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al listar farmacias' });
  }
};

export const detailPharmacy = async (req: Request, res: Response) => {
  try {
    const pharmacy = await (prisma.pharmacy as any).findUnique({
      where: { id: req.params.id as string },
      include: { profile: true },
    });
    res.json({ success: true, data: pharmacy });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener detalle de la farmacia' });
  }
};

export const listLaboratories = async (req: Request, res: Response) => {
  try {
    const labs = await (prisma.laboratory as any).findMany({ 
      where: { status: 'VERIFIED' },
      include: { profile: true } 
    });
    res.json({ success: true, data: labs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al listar laboratorios' });
  }
};

export const detailLaboratory = async (req: Request, res: Response) => {
  try {
    const lab = await (prisma.laboratory as any).findUnique({
      where: { id: req.params.id as string },
      include: { profile: true },
    });
    res.json({ success: true, data: lab });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener detalle del laboratorio' });
  }
};
