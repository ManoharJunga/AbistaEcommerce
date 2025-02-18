// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Products from "./pages/Products/Products";
import Categories from "./pages/Products/Categories";
import Subcategories from "./pages/Products/Subcategories";
import ProductRating from "./pages/Products/ProductRating";
import Settings from "./pages/Settings";
import ProjectsPage from "./pages/Projects/ProjectsPage";
import AddProjectPage from "./pages/Projects/AddProjectPage";
import SlideshowPage from "./pages/SlideShow/SlideshowPage";
import AddSlideshowPage from "./pages/SlideShow/AddSlideshowPage";
import CardManagementPage from "./pages/CardManagementPage";

export const BASE_API_URL = 'http://localhost:8000/api';
const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-100 p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/categories" element={<Categories />} />
            <Route path="/products/subcategories" element={<Subcategories />} />
            <Route path="/products/ratings" element={<ProductRating />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/add" element={<AddProjectPage />} />
            <Route path="/slideshow" element={<SlideshowPage />} />
            <Route path="/slideshow/add" element={<AddSlideshowPage />} />
            <Route path="/card-management" element={<CardManagementPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
