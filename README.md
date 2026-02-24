<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ff980b36-a64e-4dd9-a057-d7835381fdb6

## Despliegue en Vercel

Este proyecto está configurado para desplegarse fácilmente en Vercel.

1. Conecta tu repositorio de GitHub a Vercel.
2. Configura las siguientes variables de entorno en el panel de Vercel:
   - `DATABASE_URL`: URL de conexión (Transaction Mode) de Supabase.
   - `DIRECT_URL`: URL de conexión (Direct Mode) de Supabase.
   - `JWT_SECRET`: Una clave secreta para los tokens JWT.
   - `SUPABASE_URL`: Tu URL de proyecto de Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY`: Tu clave de rol de servicio de Supabase.
   - `FRONTEND_URL`: URL de tu app en Vercel (ej: `https://tu-app.vercel.app`).

## Base de Datos (Prisma + Supabase)

El proyecto utiliza Prisma para la gestión de la base de datos.
Para sincronizar la base de datos localmente:

1. Asegúrate de tener las variables en tu `.env`.
2. Ejecuta: `npx prisma db push --schema=backend/prisma/schema.prisma`
