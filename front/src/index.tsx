import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // App 컴포넌트의 경로를 정확히 지정하세요.

const container = document.getElementById('root');
if (container !== null) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
