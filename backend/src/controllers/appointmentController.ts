import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    type: string;
  };
}

export const getDoctorAvailability = async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const { start, end } = req.query;

  try {
    const doctor = await (prisma.doctor as any).findUnique({
      where: { id: doctorId },
      include: { 
        availability: true,
        profile: true
      }
    });

    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Médico no encontrado' });
    }

    // Fetch existing appointments in range to avoid double booking
    const appointments = await (prisma as any).appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: start ? new Date(start as string) : undefined,
          lte: end ? new Date(end as string) : undefined
        },
        status: { not: 'cancelled' }
      }
    });

    res.json({
      success: true,
      data: {
        doctor,
        appointments
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createAppointment = async (req: AuthRequest, res: Response) => {
  const { doctorId, date, type, price, notes } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ success: false, error: 'No autorizado' });

  try {
    // 1. Get Patient ID from Profile
    const patient = await (prisma as any).patient.findUnique({
      where: { profileId: userId }
    });

    if (!patient) return res.status(400).json({ success: false, error: 'Perfil de paciente no encontrado' });

    // 2. Check for conflict (double booking)
    const existing = await (prisma as any).appointment.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        status: { not: 'cancelled' }
      }
    });

    if (existing) {
      return res.status(400).json({ success: false, error: 'Este horario ya no está disponible' });
    }

    // 3. Create appointment
    const appointment = await (prisma as any).appointment.create({
      data: {
        doctorId,
        patientId: patient.id,
        date: new Date(date),
        type: type || 'Consulta General',
        price: price || 0,
        notes,
        status: 'upcoming'
      }
    });

    res.json({ success: true, data: appointment });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
