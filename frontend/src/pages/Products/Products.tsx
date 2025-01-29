import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, MenuItem, Typography, Grid, Paper } from '@mui/material';

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

  useEffect(() => {
    axios.get('http://localhost:8000/api/categories')
      .then(response => setCategories(response.data))
      .catch(err => console.error('Error fetching categories', err));
  }, []);

  useEffect(() => {
    if (category) {
      axios.get(`http://localhost:8000/api/subcategories?categoryId=${category}`)
        .then(response => setSubCategories(response.data))
        .catch(err => console.error('Error fetching subcategories', err));
    }
  }, [category]);

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

    axios.post('http://localhost:8000/api/products/upload', formData)
      .then(response => {
        alert('Product uploaded successfully');
        setName(''); setDescription(''); setPrice(''); setStock(''); setCategory(''); setSubCategory(''); setImages([]);
      })
      .catch(error => console.error('Error during upload:', error));
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>Create a New Product</Typography>
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
              <Button type="submit" variant="contained" color="primary" fullWidth>Upload Product</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ProductForm;
