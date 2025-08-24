// ProductList.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Typography, Chip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ProductForm from './ProductForm';

interface Size {
    height: number;
    width: number;
    weight?: number;
}

interface Variant {
    name?: string;
    color?: string;
    images?: string[];
    stock?: number;
}

interface Product {
    _id: string;
    name: string;
    slug: string;  // ✅ NEW
    description: string;
    price: number;
    stock: number;
    category: { _id: string; name: string };
    subCategory: { _id: string; name: string };
    sizes: Size[];
    attributes?: {
        textures?: { _id: string; name: string }[];
        finishes?: { _id: string; name: string }[];
        materials?: { _id: string; name: string }[];
    };
    images: string[];
    variants?: Variant[];
    averageRating: number;
    totalReviews: number;
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
                setProducts(response.data.products || []); // ✅ safe
            })
            .catch(err => console.error('Error fetching products', err));
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
    };

    const handleDelete = (id: string) => {
        axios.delete(`http://localhost:8000/api/products/${id}`)
            .then(() => {
                alert('Product deleted successfully');
                fetchProducts();
            })
            .catch(err => {
                console.error('Error deleting product', err);
                alert('Error deleting product');
            });
    };

    return (
        <Container maxWidth="lg">
            {/* ✅ Pass editingProduct + setEditingProduct to form */}
            <ProductForm
                fetchProducts={fetchProducts}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
            />

            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Slug</TableCell> {/* ✅ New column */}
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>SubCategory</TableCell>
                            <TableCell>Sizes</TableCell>
                            <TableCell>Finishes</TableCell>
                            <TableCell>Materials</TableCell>
                            <TableCell>Textures</TableCell>
                            <TableCell>Variants</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Reviews</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <TableRow key={product._id}>
                                    {/* First Image */}
                                    <TableCell>
                                        {product.images?.length > 0 ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                style={{ width: 50, height: 100, objectFit: 'cover', borderRadius: 5 }}
                                            />
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">No Image</Typography>
                                        )}
                                    </TableCell>

                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.slug}</TableCell> {/* ✅ New */}
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>{product.category?.name || "-"}</TableCell>
                                    <TableCell>{product.subCategory?.name || "-"}</TableCell>

                                    {/* Sizes */}
                                    <TableCell>
                                        {product.sizes && product.sizes.length > 0 ? (
                                            product.sizes.map((s, idx) => (
                                                <Typography key={idx} variant="body2">
                                                    {s.height}x{s.width} ({s.weight || 0}kg)
                                                </Typography>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">-</Typography>
                                        )}
                                    </TableCell>

                                    {/* Finishes */}
                                    <TableCell>
                                        {product.attributes?.finishes?.length ? (
                                            product.attributes.finishes.map(f => (
                                                <Chip key={f._id} label={f.name} size="small" style={{ margin: 2 }} />
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">-</Typography>
                                        )}
                                    </TableCell>

                                    {/* Materials */}
                                    <TableCell>
                                        {product.attributes?.materials?.length ? (
                                            product.attributes.materials.map(m => (
                                                <Chip key={m._id} label={m.name} size="small" style={{ margin: 2 }} />
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">-</Typography>
                                        )}
                                    </TableCell>

                                    {/* Textures */}
                                    <TableCell>
                                        {product.attributes?.textures?.length ? (
                                            product.attributes.textures.map(t => (
                                                <Chip key={t._id} label={t.name} size="small" style={{ margin: 2 }} />
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">-</Typography>
                                        )}
                                    </TableCell>

                                    {/* Variants */}
                                    <TableCell>
                                        {product.variants && product.variants.length > 0 ? (
                                            product.variants.map((v, idx) => (
                                                <Typography key={idx} variant="body2">
                                                    {v.name} - {v.color} ({v.stock || 0})
                                                </Typography>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">-</Typography>
                                        )}
                                    </TableCell>

                                    <TableCell>{product.averageRating}</TableCell>
                                    <TableCell>{product.totalReviews}</TableCell>

                                    {/* Actions */}
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(product)}><Edit /></IconButton>
                                        <IconButton onClick={() => handleDelete(product._id)}><Delete /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={16} align="center">No Products Available</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ProductList;
