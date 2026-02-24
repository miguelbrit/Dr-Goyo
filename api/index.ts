import app from '../backend/src/app.js';

export default async (req: any, res: any) => {
  try {
    return app(req, res);
  } catch (error: any) {
    console.error('CRITICAL SERVERLESS CRASH:', error);
    res.status(500).json({
      success: false,
      error: 'Critical Serverless Crash',
      message: error.message || 'Error desconocido en el punto de entrada API'
    });
  }
};
