import app from './app';
import webSocket from './socket';

const PORT = process.env.PORT || 4211;

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

const server = app.listen(PORT, handleListening);

webSocket(server, app);
