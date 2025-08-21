import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Folder as FolderIcon,
  Slideshow as SlideshowIcon,
  Settings as SettingsIcon,
  CreditCard as CreditCardIcon,
  ExpandLess,
  ExpandMore,
  
} from "@mui/icons-material";
import TextureIcon from '@mui/icons-material/Texture';
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [productsOpen, setProductsOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [slideshowOpen, setSlideshowOpen] = useState(false);

  return (
    <div
      className={`bg-dark text-white vh-100 p-3 ${isOpen ? "w-25" : "w-10"} transition-all duration-300`}
      style={{ width: isOpen ? "250px" : "70px" }}
    >
      <button
        className="btn btn-light mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "❮" : "❯"}
      </button>
      <nav className="mt-4">
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/" className="nav-link text-white d-flex align-items-center">
              <DashboardIcon />
              {isOpen && <span className="ms-3">Dashboard</span>}
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/customers" className="nav-link text-white d-flex align-items-center">
              <PeopleIcon />
              {isOpen && <span className="ms-3">Customers</span>}
            </Link>
          </li>

          {/* Products Dropdown */}
          <li className="nav-item mb-2">
            <button
              className="nav-link text-white d-flex justify-content-between align-items-center"
              onClick={() => setProductsOpen(!productsOpen)}
            >
              <div className="d-flex align-items-center">
                <ShoppingCartIcon />
                {isOpen && <span className="ms-3">Products</span>}
              </div>
              {isOpen && (productsOpen ? <ExpandLess /> : <ExpandMore />)}
            </button>
            {productsOpen && isOpen && (
              <ul className="ms-3 list-unstyled">
                <li>
                  <Link to="/products" className="nav-link text-white">Product</Link>
                </li>
                <li>
                  <Link to="/products/categories" className="nav-link text-white">Categories</Link>
                </li>
                <li>
                  <Link to="/products/subcategories" className="nav-link text-white">Subcategories</Link>
                </li>
                <li>
                  <Link to="/products/ratings" className="nav-link text-white">Product Ratings</Link>
                </li>
              </ul>
            )}
          </li>
           <li className="nav-item mb-2">
            <Link to="/textures" className="nav-link text-white d-flex align-items-center">
              <TextureIcon />
              {isOpen && <span className="ms-3">Textures</span>}
            </Link>
          </li>
           <li className="nav-item mb-2">
            <Link to="/material" className="nav-link text-white d-flex align-items-center">
              <TextureIcon />
              {isOpen && <span className="ms-3">Material</span>}
            </Link>
          </li>
           <li className="nav-item mb-2">
            <Link to="/finishes" className="nav-link text-white d-flex align-items-center">
              <TextureIcon />
              {isOpen && <span className="ms-3">Finishes</span>}
            </Link>
          </li>

          {/* Projects Dropdown */}
          <li className="nav-item mb-2">
            <button
              className="nav-link text-white d-flex justify-content-between align-items-center"
              onClick={() => setProjectsOpen(!projectsOpen)}
            >
              <div className="d-flex align-items-center">
                <FolderIcon />
                {isOpen && <span className="ms-3">Projects</span>}
              </div>
              {isOpen && (projectsOpen ? <ExpandLess /> : <ExpandMore />)}
            </button>
            {projectsOpen && isOpen && (
              <ul className="ms-3 list-unstyled">
                <li>
                  <Link to="/projects" className="nav-link text-white">All Projects</Link>
                </li>
                <li>
                  <Link to="/projects/add" className="nav-link text-white">Add Project</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Slideshow Dropdown */}
          <li className="nav-item mb-2">
            <button
              className="nav-link text-white d-flex justify-content-between align-items-center"
              onClick={() => setSlideshowOpen(!slideshowOpen)}
            >
              <div className="d-flex align-items-center">
                <SlideshowIcon />
                {isOpen && <span className="ms-3">Slideshow</span>}
              </div>
              {isOpen && (slideshowOpen ? <ExpandLess /> : <ExpandMore />)}
            </button>
            {slideshowOpen && isOpen && (
              <ul className="ms-3 list-unstyled">
                <li>
                  <Link to="/slideshow" className="nav-link text-white">Manage Slideshow</Link>
                </li>
                <li>
                  <Link to="/slideshow/add" className="nav-link text-white">Add Slideshow</Link>
                </li>
              </ul>
            )}
          </li>
          <li className="nav-item mb-2">
            <Link to="/card-management" className="nav-link text-white d-flex align-items-center">
              <CreditCardIcon />
              {isOpen && <span className="ms-3">Card Management</span>}
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link to="/settings" className="nav-link text-white d-flex align-items-center">
              <SettingsIcon />
              {isOpen && <span className="ms-3">Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
