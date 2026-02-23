import express from 'express';
import dotenv from 'dotenv'; // Reset
import cors from 'cors';
import path from 'path';
import userRoutes from './routes/userRoutes.js';
import entityRoutes from './routes/entityRoutes.js';
import articleRoutes from './routes/articleRoutes.js';

// 1. Load root .env (for shared vars like PORT, DB)
const rootEnvPath = path.resolve(process.cwd(), '../.env');
dotenv.config({ path: rootEnvPath });

// 2. Load local .env (for backend specific vars like SUPABASE_URL)
dotenv.config(); 

console.log('Entorno cargado. Supabase URL:', process.env.SUPABASE_URL ? 'OK' : 'MISSING');

console.log('Puerto detectado:', process.env.PORT);

const app = express();

// 1. Basic Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Logging (Moved to top)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().split('T')[1].split('.')[0]}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body));
  }
  next();
});

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 3. API Routes (PRIORITY)
app.use('/api/users', userRoutes);
app.use('/api/entities', entityRoutes);
app.use('/api/articles', articleRoutes);

app.get('/api/health', (req, res) => {
  console.log('--- REQUERIMIENTO RECIBIDO EN /api/health ---');
  res.json({ status: 'ok', via: 'api' });
});

// 4. Static & Health
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('API de Dr Goyo activa y funcionando');
});

// 5. Catch-all 404 for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta API no encontrada',
    message: `La ruta ${req.method} ${req.url} no existe`
  });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: 'Error interno del servidor',
    message: err.message || 'Ocurrió un error inesperado'
  });
});

export default app;
