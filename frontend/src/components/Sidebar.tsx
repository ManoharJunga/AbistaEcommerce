import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Layers,
  Settings,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Blocks,
  Folder,
  PlayCircle,
  LetterText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define Menu Items
const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    label: "Customers",
    icon: Users,
    path: "/customers",
  },
  {
    label: "Products",
    icon: ShoppingBag,
    children: [
      { label: "Product", path: "/products" },
      { label: "Bulk Entry", path: "/bulkproducts" },
      { label: "Categories", path: "/products/categories" },
      { label: "Subcategories", path: "/products/subcategories" },
      { label: "Product Ratings", path: "/products/ratings" },
      { label: "Deal of the day", path: "dealoftheday" }
    ],
  },
  {
    label: "Attributes",
    icon: Layers, // Parent icon for the group
    children: [
      { label: "Textures", path: "/textures" },
      { label: "Material", path: "/material" },
      { label: "Finishes", path: "/finishes" },
    ],
  }, {
    label: "Features",
    icon: Blocks, // Parent icon for the group
    children: [
      { label: "Category Features", path: "/featurescategories" },
      { label: "SubCategory Features", path: "/featuresSubcategories" },
    ],
  }, {
    label: "Company Desc",
    icon: LetterText, // Parent icon for the group
    children: [
      { label: "About Us Page", path: "/about" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "FAQ Entry", path: "/faqpage" },
      { label: "Terms of Service", path: "/terms" },
    ],
  },
  {
    label: "Projects",
    icon: Folder,
    children: [
      { label: "All Projects", path: "/projects" },
      { label: "Add Project", path: "/projects/add" },
    ],
  },
  {
    label: "Slideshow",
    icon: PlayCircle,
    children: [
      { label: "Manage Slideshow", path: "/slideshow" },
      { label: "Add Slideshow", path: "/slideshow/add" },
    ],
  },
  {
    label: "Card Management",
    icon: CreditCard,
    path: "/card-management",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <div
      className={`bg-gray-900 text-gray-100 h-screen flex flex-col transition-all duration-300 ${isOpen ? "w-64" : "w-20"
        }`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-3">
        <button
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "❮" : "❯"}
        </button>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            // If it has children => Dropdown
            if (item.children) {
              const isDropdownOpen = openDropdown === item.label;
              return (
                <li key={item.label}>
                  <button
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-800 transition"
                    onClick={() => toggleDropdown(item.label)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />
                      {isOpen && <span>{item.label}</span>}
                    </div>
                    {isOpen &&
                      (isDropdownOpen ? <ChevronUp /> : <ChevronDown />)}
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && isOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-8 mt-1 space-y-1"
                      >
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              to={child.path}
                              className="block hover:text-gray-300"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              );
            }

            // Normal Link
            return (
              <li key={item.label}>
                <Link
                  to={item.path!}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition"
                >
                  <Icon size={20} />
                  {isOpen && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
