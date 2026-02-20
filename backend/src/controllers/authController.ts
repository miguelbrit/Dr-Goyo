import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_goyo';

export const register = async (req: Request, res: Response) => {
  const { name, email, password, type, specialty, license, address, testTypes } = req.body;

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        type,
      },
    });

    // Create profile if necessary with specialized data
    if (type === 'Medico') {
      await prisma.doctor.create({ 
        data: { 
          userId: user.id,
          name: name,
          specialty,
          license
        } 
      });
    }
    if (type === 'Farmacia') {
      await prisma.pharmacy.create({ 
        data: { 
          userId: user.id,
          name: name,
          address
        } 
      });
    }
    if (type === 'Laboratorio') {
      await prisma.laboratory.create({ 
        data: { 
          userId: user.id,
          name: name,
          address,
          testTypes
        } 
      });
    }

    const token = jwt.sign({ id: user.id, type: user.type }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ 
      success: true, 
      message: 'Usuario registrado exitosamente', 
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        type: user.type,
        role: type === 'Medico' ? 'doctor' : type === 'Farmacia' ? 'pharmacy' : type === 'Laboratorio' ? 'lab' : 'patient'
      } 
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
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    
    if (!user) {
      console.log(`Login attempt failed: User not found for email ${normalizedEmail}`);
      return res.status(401).json({ 
        success: false, 
        error: 'Credenciales inválidas', 
        message: 'El correo electrónico no está registrado' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      console.log(`Login attempt failed: Password mismatch for ${normalizedEmail}`);
      return res.status(401).json({ 
        success: false, 
        error: 'Credenciales inválidas', 
        message: 'La contraseña es incorrecta' 
      });
    }

    const token = jwt.sign({ id: user.id, type: user.type }, JWT_SECRET, { expiresIn: '24h' });
    
    // Convert DB type to frontend role format
    const roleMapping: Record<string, string> = {
      'Paciente': 'patient',
      'Medico': 'doctor',
      'Farmacia': 'pharmacy',
      'Laboratorio': 'lab'
    };

    res.json({ 
      success: true, 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        type: user.type,
        role: roleMapping[user.type] || 'patient'
      } 
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
