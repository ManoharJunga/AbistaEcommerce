import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../App';

const ProductUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]); 
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    subcategory: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/products/get`);
        if (Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          console.error('Products data is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };    

    fetchCategories();
    fetchProducts();
  }, []);

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

    if (name === 'category') {
      await fetchSubcategories(value);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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

      const updatedProducts = await axios.get(`${BASE_API_URL}/products/get`);
      if (Array.isArray(updatedProducts.data)) {
        setProducts(updatedProducts.data);
      } else {
        console.error('Updated products data is not an array:', updatedProducts.data);
      }
    } catch (error) {
      console.error('Error during upload:', error);
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit} className="bg-white p-3 shadow-sm rounded">
        <div className="mb-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="form-control form-control-sm"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="form-control form-control-sm"
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="form-control form-control-sm"
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="Stock"
            className="form-control form-control-sm"
          />
        </div>

        <div className="mb-3">
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="form-select form-select-sm"
          >
            <option value="">Select Category</option>
            {categories.map((category: any) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleInputChange}
            className="form-select form-select-sm"
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory: any) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <input type="file" multiple onChange={handleFileChange} className="form-control form-control-sm" />
        </div>
        
        <button type="submit" className="btn btn-primary btn-sm w-100">Upload Product</button>
      </form>

      <h2 className="mt-4">Products List</h2>
      <ul className="list-group">
        {products.length > 0 ? (
          products.map((product: any) => (
            <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
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
                    className="img-thumbnail"
                    style={{ width: '50px', height: '50px' }}
                  />
                ))}
            </li>
          ))
        ) : (
          <p className="list-group-item">No products available.</p>
        )}
      </ul>
    </div>
  );
};

export default ProductUpload;
