import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import entityRoutes from './routes/entityRoutes.js';
import articleRoutes from './routes/articleRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.send('API de Dr Goyo activa y funcionando');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/entities', entityRoutes);
app.use('/api/articles', articleRoutes);

export default app;
