import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Dynamic import of auth.mjs
const initRoutes = async () => {
  const authRoutes = await import('./auth.mjs');
  app.use('/api/auth', authRoutes.default); // Use the default export from auth.mjs
};

// Initialize routes and start server
initRoutes().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
