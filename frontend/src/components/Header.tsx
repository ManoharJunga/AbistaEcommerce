// src/components/Header.tsx
import React from "react";

const Header = () => {
  return (
    <header className="bg-gray-100 p-4 shadow-md flex items-center justify-between">
      <h1 className="text-xl font-bold">Ecommerce Dashboard</h1>
      <div className="text-gray-600">Welcome, User!</div>
    </header>
  );
};

export default Header;
