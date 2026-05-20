"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Chip,
  Collapse,
  Box,
  Tooltip,
  Avatar,
  AvatarGroup,
  Stack,
  TextField,
  InputAdornment,
  Divider,
  Alert,
  CircularProgress,
  Button
} from "@mui/material";
import {
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  Search,
  Inventory,
  Star,
  Refresh,
  Collections
} from "@mui/icons-material";
import ProductForm from "./ProductForm";

interface Size { height: number; width: number; weight?: number; }
interface Variant { name?: string; color?: string; stock?: number; }
interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: { _id: string; name: string };
  subCategory: { _id: string; name: string };
  attributes?: {
    textures?: { _id: string; name: string }[];
    finishes?: { _id: string; name: string }[];
    materials?: { _id: string; name: string }[];
  };
  specifications?: Record<string, string>;
  images: string[]; // Supports multiple strings
  variants?: Variant[];
  averageRating: number;
  totalReviews: number;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/products/get?limit=1000");
      setProducts(response.data.products || []);
      setTotalCount(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 1. FORM SECTION */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {editingProduct ? "Edit Product" : "Create New Product"}
        </Typography>
        <ProductForm
          fetchProducts={fetchProducts}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
        />
      </Paper>

      {/* 2. TABLE SECTION */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Stack direction="row" p={3} justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h6" fontWeight={700}>Inventory List</Typography>
            <Typography variant="caption" color="text.secondary">
              Showing {filteredProducts.length} of {totalCount} total products
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <TextField
              placeholder="Search..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'gray' }} /> }}
            />
            <Button startIcon={<Refresh />} onClick={fetchProducts} variant="outlined" size="small">
              Refresh
            </Button>
          </Stack>
        </Stack>

        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell width={40} />
                <TableCell>Images</TableCell>
                <TableCell>Product Info</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : filteredProducts.map((product) => (
                <React.Fragment key={product._id}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton size="small" onClick={() => setExpandedRow(expandedRow === product._id ? null : product._id)}>
                        {expandedRow === product._id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                    
                    {/* Multiple Image Preview Thumbnails */}
                    <TableCell>
                      <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 40, height: 40, fontSize: 14 } }}>
                        {product.images?.map((img, index) => (
                          <Avatar key={index} src={img} variant="rounded" />
                        )) || <Avatar variant="rounded"><Inventory /></Avatar>}
                      </AvatarGroup>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{product.name}</Typography>
                        <Typography variant="caption" color="textSecondary" display="block">{product.slug}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{product.category?.name || "N/A"}</Typography>
                      <Typography variant="caption" color="textSecondary">{product.subCategory?.name}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>₹{product.price.toLocaleString()}</Typography>
                    </TableCell>

                    <TableCell>
                      <Chip 
                        label={product.stock > 0 ? `Qty: ${product.stock}` : "Out of Stock"} 
                        size="small" 
                        color={product.stock > 0 ? "success" : "error"} 
                        variant="outlined" 
                      />
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Star sx={{ fontSize: 14, color: "#faaf00" }} />
                        <Typography variant="caption" fontWeight={600}>{product.averageRating.toFixed(1)}</Typography>
                      </Stack>
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" justifyContent="center">
                        <IconButton size="small" onClick={() => handleEdit(product)} color="primary"><Edit fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleDelete(product._id)} color="error"><Delete fontSize="small" /></IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>

                  {/* Expandable Details */}
                  <TableRow>
                    <TableCell colSpan={8} sx={{ py: 0, bgcolor: "#f9f9f9" }}>
                      <Collapse in={expandedRow === product._id} unmountOnExit>
                        <Box p={3}>
                           {/* Multi-Image Gallery Row */}
                           <Typography variant="subtitle2" color="primary" gutterBottom display="flex" alignItems="center">
                             <Collections sx={{ fontSize: 18, mr: 1 }} /> Product Gallery
                           </Typography>
                           <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, mb: 2 }}>
                             {product.images?.map((img, index) => (
                               <Box 
                                 key={index} 
                                 component="img" 
                                 src={img} 
                                 sx={{ 
                                   width: 120, 
                                   height: 120, 
                                   objectFit: 'cover', 
                                   borderRadius: 2, 
                                   border: '1px solid #ddd',
                                   boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                 }} 
                               />
                             ))}
                           </Box>

                           <Typography variant="subtitle2" color="primary" gutterBottom>Description</Typography>
                           <Typography variant="body2" mb={2}>{product.description}</Typography>
                           
                           <Divider sx={{ my: 2 }} />
                           
                           <Stack direction="row" spacing={4} flexWrap="wrap">
                             <Box flex={1} minWidth={250}>
                               <Typography variant="subtitle2">Specifications</Typography>
                               {product.specifications ? Object.entries(product.specifications).map(([k, v]) => (
                                 <Typography key={k} variant="caption" display="block"><strong>{k}:</strong> {v}</Typography>
                               )) : "None"}
                             </Box>
                             <Box flex={1} minWidth={250}>
                               <Typography variant="subtitle2">Attributes</Typography>
                               <Box mb={1}>
                                 <Typography variant="caption" color="text.secondary">Materials:</Typography>
                                 {product.attributes?.materials?.map(m => <Chip key={m._id} label={m.name} size="small" sx={{ ml: 0.5, mb: 0.5 }} />)}
                               </Box>
                               <Box>
                                 <Typography variant="caption" color="text.secondary">Finishes:</Typography>
                                 {product.attributes?.finishes?.map(f => <Chip key={f._id} label={f.name} size="small" variant="outlined" sx={{ ml: 0.5, mb: 0.5 }} />)}
                               </Box>
                             </Box>
                           </Stack>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default ProductList;