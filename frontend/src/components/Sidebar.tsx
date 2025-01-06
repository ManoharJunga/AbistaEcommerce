// src/components/Sidebar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <div className={`bg-gray-800 text-white h-screen ${isOpen ? "w-64" : "w-16"} transition-all duration-300`}>
      <button
        className="text-white p-3 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "❮" : "❯"}
      </button>
      <nav className="mt-4">
        <ul>
          <li className="hover:bg-gray-700">
            <Link to="/" className="flex items-center px-4 py-2">
              <DashboardIcon />
              {isOpen && <span className="ml-3">Dashboard</span>}
            </Link>
          </li>
          <li className="hover:bg-gray-700">
            <Link to="/customers" className="flex items-center px-4 py-2">
              <PeopleIcon />
              {isOpen && <span className="ml-3">Customers</span>}
            </Link>
          </li>
          <li className="hover:bg-gray-700">
            <button
              className="flex items-center justify-between px-4 py-2 w-full"
              onClick={() => setProductsOpen(!productsOpen)}
            >
              <div className="flex items-center">
                <ShoppingCartIcon />
                {isOpen && <span className="ml-3">Products</span>}
              </div>
              {isOpen && (productsOpen ? <ExpandLess /> : <ExpandMore />)}
            </button>
            {productsOpen && isOpen && (
              <ul className="ml-8">
                <li className="hover:bg-gray-700">
                  <Link to="/products/categories">Categories</Link>
                </li>
                <li className="hover:bg-gray-700">
                  <Link to="/products/subcategories">Subcategories</Link>
                </li>
                <li className="hover:bg-gray-700">
                  <Link to="/products/ratings">Product Ratings</Link>
                </li>
              </ul>
            )}
          </li>
          <li className="hover:bg-gray-700">
            <Link to="/settings" className="flex items-center px-4 py-2">
              <SettingsIcon />
              {isOpen && <span className="ml-3">Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
