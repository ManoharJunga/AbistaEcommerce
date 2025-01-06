import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../App';

const ProductUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // State for subcategories
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    subcategory: '',
  });

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/products/get`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  // Fetch subcategories based on selected category
  const fetchSubcategories = async (categoryId: string) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    try {
      const response = await axios.get(`${BASE_API_URL}/subcategories?category=${categoryId}`);
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Fetch subcategories when a category is selected
    if (name === 'category') {
      await fetchSubcategories(value);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Prepare form data for submission
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('category', formData.category);
    data.append('subcategory', formData.subcategory);

    files.forEach((file) => {
      data.append('images', file);
    });

    try {
      const response = await axios.post(`${BASE_API_URL}/products/upload`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product uploaded successfully:', response.data);

      // Refresh product list after upload
      const updatedProducts = await axios.get(`${BASE_API_URL}/products/get`);
      setProducts(updatedProducts.data);
    } catch (error) {
      console.error('Error during upload:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 bg-white p-6 shadow-md rounded-lg">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Product Name"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Price"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleInputChange}
          placeholder="Stock"
          className="border p-2 rounded"
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((category: any) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Subcategory Dropdown */}
        <select
          name="subcategory"
          value={formData.subcategory}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((subcategory: any) => (
            <option key={subcategory._id} value={subcategory._id}>
              {subcategory.name}
            </option>
          ))}
        </select>

        <input type="file" multiple onChange={handleFileChange} className="border p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Upload Product</button>
      </form>

      <h2 className="text-xl font-bold mt-6">Products List</h2>
      <ul className="list-disc ml-6">
        {products.map((product: any) => (
          <li key={product._id} className="mb-4">
            <div className="flex items-center space-x-4">
              <span>{product.name}</span>
              <span>${product.price}</span>
              <span>{product.description}</span>
              <span>{product.stock} in stock</span>
              {product.images &&
                product.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={product.name}
                    className="w-12 h-12 rounded border ml-2"
                  />
                ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductUpload;
