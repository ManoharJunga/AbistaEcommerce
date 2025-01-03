import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductUpload from './pages/ProductUpload';
import CalculateCost from './pages/CalculateProductdoors';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductUpload />} />
        <Route path='/cal' element={<CalculateCost />} />
      </Routes>
    </Router>
  );
};

export default App;
