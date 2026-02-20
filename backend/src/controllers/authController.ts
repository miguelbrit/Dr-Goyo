import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_goyo';

export const register = async (req: Request, res: Response) => {
  const { name, email, password, type } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        type,
      },
    });

    // Create profile if necessary
    if (type === 'Medico') await prisma.doctor.create({ data: { userId: user.id } });
    if (type === 'Farmacia') await prisma.pharmacy.create({ data: { userId: user.id } });
    if (type === 'Laboratorio') await prisma.laboratory.create({ data: { userId: user.id } });

    res.status(201).json({ 
      success: true, 
      message: 'Usuario registrado exitosamente', 
      data: { userId: user.id } 
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(400).json({ 
      success: false, 
      error: 'Error al registrar usuario',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, type: user.type }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ 
      success: true, 
      token, 
      user: { id: user.id, name: user.name, type: user.type } 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error en el servidor',
      message: 'Hubo un problema al procesar tu inicio de sesión'
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: {
        doctor: true,
        pharmacy: true,
        laboratory: true,
      },
    });
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener perfil' 
    });
  }
};
