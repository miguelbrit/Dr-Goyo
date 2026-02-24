import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const getStats = async (req: Request, res: Response) => {
  try {
    console.log('[ADMIN] Fetching global stats via Raw SQL...');
    
    // Using raw SQL to ensure we bypass any potential Prisma client-side filtering or type issues
    const stats: any = await prisma.$queryRaw`
      SELECT 
        (SELECT COUNT(*) FROM "Patient") as patients_count,
        (SELECT COUNT(*) FROM "Doctor") as doctors_total,
        (SELECT COUNT(*) FROM "Doctor" WHERE status::text = 'VERIFIED') as doctors_verified,
        (SELECT COUNT(*) FROM "Pharmacy") as pharmacies_total,
        (SELECT COUNT(*) FROM "Pharmacy" WHERE status::text = 'VERIFIED') as pharmacies_verified,
        (SELECT COUNT(*) FROM "Laboratory") as labs_total,
        (SELECT COUNT(*) FROM "Laboratory" WHERE status::text = 'VERIFIED') as labs_verified
    `;

    const data = stats[0];

    res.json({
      success: true,
      data: {
        patients: Number(data.patients_count),
        doctors: {
          total: Number(data.doctors_total),
          verified: Number(data.doctors_verified),
          pending: Number(data.doctors_total) - Number(data.doctors_verified)
        },
        pharmacies: {
          total: Number(data.pharmacies_total),
          verified: Number(data.pharmacies_verified),
          pending: Number(data.pharmacies_total) - Number(data.pharmacies_verified)
        },
        labs: {
          total: Number(data.labs_total),
          verified: Number(data.labs_verified),
          pending: Number(data.labs_total) - Number(data.labs_verified)
        }
      }
    });
  } catch (error: any) {
    console.error('CRITICAL STATS ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener estadísticas',
      message: error.message 
    });
  }
};

export const getPendingApprovals = async (req: Request, res: Response) => {
  try {
    const adminUser = (req as any).user;
    console.log(`[ADMIN] Fetching PENDING registrations. Requested by: ${adminUser?.email || 'Unknown'}`);

    // Use raw SQL to bypass the enum vs text operator error
    console.log('[DATABASE] Querying pending records via raw SQL...');
    
    // Fetching from Doctor table
    const doctors: any[] = await prisma.$queryRaw`
      SELECT d.*, 
             p."image_url" as "imageUrl",
             json_build_object('name', p.name, 'surname', p.surname, 'email', p.email, 'imageUrl', p."image_url") as profile
      FROM "Doctor" d
      JOIN "Profile" p ON d.profile_id = p.id
      WHERE d.status::text = 'PENDING'
    `;

    // Fetching from Pharmacy table
    const pharmacies: any[] = await prisma.$queryRaw`
      SELECT ph.id, ph.profile_id as "profileId", ph.business_name as "businessName", ph.address, ph.city,
             json_build_object('name', p.name, 'surname', p.surname, 'email', p.email, 'imageUrl', p."image_url") as profile
      FROM "Pharmacy" ph
      JOIN "Profile" p ON ph.profile_id = p.id
      WHERE ph.status::text = 'PENDING'
    `;

    // Fetching from Laboratory table
    const labs: any[] = await prisma.$queryRaw`
      SELECT lb.id, lb.profile_id as "profileId", lb.business_name as "businessName", lb.address, lb.city,
             json_build_object('name', p.name, 'surname', p.surname, 'email', p.email, 'imageUrl', p."image_url") as profile
      FROM "Laboratory" lb
      JOIN "Profile" p ON lb.profile_id = p.id
      WHERE lb.status::text = 'PENDING'
    `;

    console.log(`[DATABASE] Success! -> Doctors: ${doctors.length}, Pharmacies: ${pharmacies.length}, Labs: ${labs.length}`);

    // Flatten results with entityType
    const allPending = [
      ...doctors.map(d => ({ ...d, entityType: 'Medico' })),
      ...pharmacies.map(p => ({ ...p, entityType: 'Farmacia' })),
      ...labs.map(l => ({ ...l, entityType: 'Laboratorio' })),
    ];

    res.json({
      success: true,
      data: allPending
    });
  } catch (error: any) {
    console.error('CRITICAL DATABASE ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener aprobaciones',
      message: error.message 
    });
  }
};

export const updateApprovalStatus = async (req: Request, res: Response) => {
  const { entityId, entityType, status } = req.body; 

  if (!['VERIFIED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Estado inválido' });
  }

  try {
    const table = entityType === 'Medico' ? 'Doctor' : 
                  entityType === 'Farmacia' ? 'Pharmacy' : 
                  'Laboratory';

    console.log(`[ADMIN] Updating ${table} ID: ${entityId} to status: ${status}`);

    // Using executeRawUnsafe to handle the Enum type casting correctly in Postgres
    await prisma.$executeRawUnsafe(
      `UPDATE "${table}" SET status = $1::"VerificationStatus" WHERE id = $2`,
      status, 
      entityId
    );

    console.log(`[DATABASE] Successfully updated ${entityType} to ${status}`);

    res.json({ 
      success: true, 
      message: `Estado actualizado a ${status} exitosamente.`
    });
  } catch (error: any) {
    console.error('CRITICAL UPDATE ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar estado',
      message: error.message
    });
  }
};

import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const uploadContent = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No se subió ningún archivo' });
  }

  try {
    const pdf = require('pdf-parse');
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
