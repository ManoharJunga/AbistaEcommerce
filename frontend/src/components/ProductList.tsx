// ProductList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Avatar } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ProductForm from './ProductForm';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    subCategory: string;
    images: string[]; // Array of image URLs
}

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('http://localhost:8000/api/products/get')
            .then(response => {
                setProducts(response.data.products);
            })
            .catch(err => console.error('Error fetching products', err));
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
    };

    const handleDelete = (id: string) => {
        console.log('Deleting product with ID:', id); // Add this line for debugging
        axios.delete(`http://localhost:8000/api/products/${id}`)
            .then(() => {
                alert('Product deleted successfully');
                fetchProducts();
            })
            .catch(err => {
                console.error('Error deleting product', err);
                alert('Error deleting product'); // Show an error alert if the delete fails
            });
    };
    

    return (
        <Container maxWidth="md">
            <ProductForm fetchProducts={fetchProducts} editingProduct={editingProduct} setEditingProduct={setEditingProduct} />

            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell> {/* New column for image */}
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>
                                        {product.images && product.images.length > 0 ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                style={{ width: 50, height: 100, objectFit: 'cover', borderRadius: 5 }}
                                            />
                                        ) : (
                                            <span>No Image</span> // Placeholder text if no image
                                        )}
                                    </TableCell>

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
                                <TableCell colSpan={5} align="center">No Products Available</TableCell> {/* Updated colSpan */}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ProductList;