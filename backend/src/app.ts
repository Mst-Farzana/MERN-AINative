import express, { Application, Request, Response } from 'express';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '🚀 Server is running successfully!',
  });
});

export default app;
