import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, MenuItem, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

// Define a Product Type
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  subCategory: string;
  images: string[];
}

const ProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState<Product[]>([]); // Use the Product type
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/categories')
      .then(response => setCategories(response.data))
      .catch(err => console.error('Error fetching categories', err));
    fetchProducts();
  }, []);

  useEffect(() => {
    if (category) {
      axios.get(`http://localhost:8000/api/subcategories?categoryId=${category}`)
        .then(response => setSubCategories(response.data))
        .catch(err => console.error('Error fetching subcategories', err));
    }
  }, [category]);

  const fetchProducts = () => {
    axios.get('http://localhost:8000/api/products/get')
      .then(response => {
        console.log(response.data); // Log to check the structure of the response
        // Access the products array from the response
        setProducts(response.data.products); // Correctly accessing the products array
      })
      .catch(err => console.error('Error fetching products', err));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    images.forEach((image) => formData.append('images', image));

    const apiEndpoint = editingProduct ? `http://localhost:8000/api/products/${editingProduct._id}` : 'http://localhost:8000/api/products/upload';
    const axiosMethod = editingProduct ? axios.put : axios.post;

    axiosMethod(apiEndpoint, formData)
      .then(() => {
        alert(editingProduct ? 'Product updated successfully' : 'Product uploaded successfully');
        setName(''); setDescription(''); setPrice(''); setStock(''); setCategory(''); setSubCategory(''); setImages([]);
        setEditingProduct(null);
        fetchProducts();
      })
      .catch(error => console.error('Error:', error));
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
    setCategory(product.category);
    setSubCategory(product.subCategory);
  };

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:8000/api/products/${id}`)
      .then(() => {
        alert('Product deleted successfully');
        fetchProducts();
      })
      .catch(err => console.error('Error deleting product', err));
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>{editingProduct ? 'Edit Product' : 'Create a New Product'}</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Description" fullWidth required value={description} onChange={(e) => setDescription(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Price" type="number" fullWidth required value={price} onChange={(e) => setPrice(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Stock" type="number" fullWidth required value={stock} onChange={(e) => setStock(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="Category" fullWidth required value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="SubCategory" fullWidth required value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                {subCategories.map((subCat) => (
                  <MenuItem key={subCat._id} value={subCat._id}>{subCat.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>{editingProduct ? 'Update Product' : 'Upload Product'}</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(product)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(product._id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">No Products Available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ProductForm;
