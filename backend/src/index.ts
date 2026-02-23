import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Servidor Dr Goyo activo en http://0.0.0.0:${PORT}`);
});
