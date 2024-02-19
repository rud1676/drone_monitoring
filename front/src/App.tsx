import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 페이지 컴포넌트 임포트
import Home from '@/components/pages/Home';
import DroneSimul from '@/components/pages/DroneSimul';
import AppContainer from '@/components/AppContainer';

const App: React.FC = () => (
  <AppContainer>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dronesimul" element={<DroneSimul />} />
        {/* 추가적인 라우트 설정 */}
      </Routes>
    </Router>
  </AppContainer>
);

export default App;
