import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { supabase } from '../utils/supabase.js';
import { AuthRequest } from '../middleware/auth.js';

export const register = async (req: Request, res: Response) => {
  const { 
    name, surname, email, password, type, 
    phone, birthDate, gender, weight, height,
    specialty, license, city, experienceYears, consultationPrice, insuranceAffiliations, 
    address, openingHours, closingHours, hasDelivery, testTypes 
  } = req.body;

  try {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Create user in Supabase Auth (admin bypasses email confirmation if configured)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password: password,
      email_confirm: true,
      user_metadata: { name, type }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Error al crear usuario en Auth');

    const authId = authData.user.id;

    // 2. Create Profile in public schema
    const profile = await prisma.profile.create({
      data: {
        id: authId,
        name,
        surname,
        type,
      },
    });

    // 3. Create Specific Entity Profile
    switch (type) {
      case 'Paciente':
        await prisma.patient.create({
          data: {
            profileId: authId,
            phone,
            birthDate: birthDate ? new Date(birthDate) : undefined,
            gender,
            weight: weight ? parseFloat(weight.toString()) : undefined,
            height: height ? parseFloat(height.toString()) : undefined,
            city,
          }
        });
        break;
      case 'Medico':
        await prisma.doctor.create({ 
          data: { 
            profileId: authId,
            name,
            specialty,
            license,
            city,
            experienceYears: experienceYears ? parseInt(experienceYears) : undefined,
            consultationPrice: consultationPrice ? parseFloat(consultationPrice) : undefined,
            insuranceAffiliations
          } 
        });
        break;
      case 'Farmacia':
        await prisma.pharmacy.create({ 
          data: { 
            profileId: authId,
            name,
            address,
            city,
            openingHours,
            closingHours,
            hasDelivery: hasDelivery === true || hasDelivery === 'true'
          } 
        });
        break;
      case 'Laboratorio':
        await prisma.laboratory.create({ 
          data: { 
            profileId: authId,
            name,
            address,
            city,
            testTypes,
            openingHours,
            closingHours
          } 
        });
        break;
    }

    res.status(201).json({ 
      success: true, 
      message: 'Usuario registrado exitosamente', 
      user: { 
        id: authId, 
        name: profile.name, 
        type: profile.type,
        role: type === 'Medico' ? 'doctor' : type === 'Farmacia' ? 'pharmacy' : type === 'Laboratorio' ? 'lab' : 'patient'
      } 
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(400).json({ 
      success: false, 
      error: 'Error al registrar usuario',
      message: error.message || 'Error desconocido'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: password
    });

    if (authError) {
      return res.status(401).json({ 
        success: false, 
        error: 'Credenciales inválidas', 
        message: authError.message 
      });
    }

    const authUser = authData.user;
    const token = authData.session?.access_token;

    // 2. Fetch extended profile from Prisma
    const profile = await prisma.profile.findUnique({ 
      where: { id: authUser.id } 
    });
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: 'Perfil no encontrado', 
        message: 'No existe un perfil vinculado a este usuario' 
      });
    }

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
        id: profile.id, 
        name: profile.name, 
        type: profile.type,
        role: roleMapping[profile.type] || 'patient'
      } 
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error en el servidor',
      message: error.message || 'Hubo un problema al procesar tu inicio de sesión'
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: req.user?.id },
      include: {
        patient: true,
        doctor: true,
        pharmacy: true,
        laboratory: true,
      },
    });
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener perfil' 
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { 
    name, surname, imageUrl, 
    birthDate, gender, weight, height, phone, address, city, country, bloodType, allergies, healthStatus
  } = req.body;

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'No autorizado' });
    }

    // 1. Update Profile table
    const updatedProfile = await prisma.profile.update({
      where: { id: userId },
      data: {
        name,
        surname,
        imageUrl,
        weight: weight ? parseFloat(weight.toString()) : undefined,
        height: height ? parseFloat(height.toString()) : undefined,
        healthStatus,
      }
    });

    // 2. Update specific entity profile if needed
    if (updatedProfile.type === 'Paciente') {
      await prisma.patient.upsert({
        where: { profileId: userId },
        update: {
          birthDate: birthDate ? new Date(birthDate) : undefined,
          gender,
          weight: weight ? parseFloat(weight.toString()) : undefined,
          height: height ? parseFloat(height.toString()) : undefined,
          phone,
          address,
          city,
          country,
          bloodType,
          allergies,
        },
        create: {
          profileId: userId,
          birthDate: birthDate ? new Date(birthDate) : undefined,
          gender,
          weight: weight ? parseFloat(weight.toString()) : undefined,
          height: height ? parseFloat(height.toString()) : undefined,
          phone,
          address,
          city,
          country,
          bloodType,
          allergies,
        }
      });
    }

    const fullProfile = await prisma.profile.findUnique({
      where: { id: userId },
      include: {
        patient: true,
        doctor: true,
        pharmacy: true,
        laboratory: true,
      }
    });

    res.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      data: fullProfile
    });
  } catch (error: any) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar perfil',
      message: error.message || 'Error desconocido'
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log('Solicitud de recuperación para:', email);

  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Send reset password email via Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: 'http://localhost:3000/reset-password', 
    });

    if (error) throw error;

    res.json({
      success: true,
      message: 'Correo de recuperación enviado exitosamente'
    });
  } catch (error: any) {
    console.error('Forgot Password Error:', error);
    res.status(400).json({
      success: false,
      error: 'Error al enviar correo',
      message: error.message || 'Error desconocido'
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  // Note: For this to work with the service role, we need the user's ID.
  // In a real flow, the recovery link signs the user in, and we'd get the ID from the JWT.
  // Since this is a restricted test environment, we'll try to get it from the session if provided
  // or use a middleware if we were authenticated.
  
  // For now, let's assume we use the authMiddleware to get the userId
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, error: 'No autorizado / Sesión de recuperación expirada' });
  }

  try {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: password
    });

    if (error) throw error;

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error: any) {
    console.error('Reset Password Error:', error);
    res.status(400).json({
      success: false,
      error: 'Error al actualizar contraseña',
      message: error.message || 'Error desconocido'
    });
  }
};
