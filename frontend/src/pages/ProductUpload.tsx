import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products/get');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
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

    files.forEach((file) => {
      data.append('images', file);
    });

    try {
      const response = await axios.post('http://localhost:8000/api/products/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product uploaded successfully:', response.data);

      // Refresh product list after upload
      const updatedProducts = await axios.get('http://localhost:8000/api/products/get');
      setProducts(updatedProducts.data);
    } catch (error) {
      console.error('Error during upload:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Product Name"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Price"
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleInputChange}
          placeholder="Stock"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
        >
          <option value="">Select Category</option>
          {categories.map((category: any) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit">Upload Product</button>
      </form>

      <h2>Products List</h2>
      <ul>
        {products.map((product: any) => (
          <li key={product._id}>
            {product.name} - {product.price} - {product.description} - {product.stock}
            {product.images && product.images.map((image: string, index: number) => (
              <img key={index} src={image} alt={product.name} style={{ width: '50px', height: '50px', marginLeft: '10px' }} />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductUpload;
