import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductUpload from './pages/ProductUpload';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductUpload />} />
      </Routes>
    </Router>
  );
};

export default App;
