import app from './app';
import webSocket from './socket';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4211;

const handleListening = () => console.log(`✅ Server listenting on ${PORT} 🚀`);

const server = app.listen(PORT, handleListening);

webSocket(server, app);
