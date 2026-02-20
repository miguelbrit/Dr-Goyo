import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor Dr Goyo corriendo en http://localhost:${PORT}`);
});
