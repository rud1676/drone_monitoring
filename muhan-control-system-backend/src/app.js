import express from 'express';
import cors from 'cors';
import apiRouter from './routers/api';

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:4051',
      'https://muhan-control-system.vercel.app',
      'https://main.d3gdj7l0zvv4fe.amplifyapp.com'
    ],
    credentials: true,
    webSocket: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter);

export default app;
