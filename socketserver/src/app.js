import express from 'express';
import cors from 'cors';
import apiRouter from './routers/api';

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:4051',
      'http://localhost:3001',
      'https://dronesocket.onrender.com'
    ],
    credentials: true,
    webSocket: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter);

export default app;
