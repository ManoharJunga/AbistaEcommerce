// ProductList.tsx
import { useState, useEffect } from "react";
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
} from "@mui/material";
import { Edit, Delete, ExpandMore, ExpandLess } from "@mui/icons-material";
import ProductForm from "./ProductForm";

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
interface Specification {
  key: string;
  value: string;
}
interface Product {
  _id: string;
  name: string;
  slug: string;
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
  specifications?: Specification[];
  images: string[];
  variants?: Variant[];
  averageRating: number;
  totalReviews: number;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get("http://localhost:8000/api/products/get")
      .then((response) => {
        setProducts(response.data.products || []);
      })
      .catch((err) => console.error("Error fetching products", err));
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:8000/api/products/${id}`)
      .then(() => {
        alert("Product deleted successfully");
        fetchProducts();
      })
      .catch((err) => {
        console.error("Error deleting product", err);
        alert("Error deleting product");
      });
  };

  return (
    <Container maxWidth="lg">
      {/* Form at top */}
      <ProductForm
        fetchProducts={fetchProducts}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
      />
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>SubCategory</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Reviews</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>More</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <>
                  {/* Main row */}
                  <TableRow
                    key={product._id}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <TableCell>
                      {product.images?.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No Image
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{product.name}</Typography>
                    </TableCell>
                    <TableCell>{product.slug}</TableCell>
                    <TableCell>
                      <Tooltip title={product.description} arrow>
                        <Typography
                          noWrap
                          sx={{ maxWidth: 150 }}
                          variant="body2"
                          color="textSecondary"
                        >
                          {product.description}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.category?.name || "-"}</TableCell>
                    <TableCell>{product.subCategory?.name || "-"}</TableCell>
                    <TableCell>{product.averageRating}</TableCell>
                    <TableCell>{product.totalReviews}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(product)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(product._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          setExpandedRow(
                            expandedRow === product._id ? null : product._id
                          )
                        }
                      >
                        {expandedRow === product._id ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Expandable row for details */}
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      sx={{ p: 0, borderBottom: "none" }}
                    >
                      <Collapse
                        in={expandedRow === product._id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ p: 2, backgroundColor: "#f9f9f9" }}>
                          <Typography variant="subtitle1">
                            Specifications
                          </Typography>
                          {product.specifications?.length ? (
                            product.specifications.map((spec, idx) => (
                              <Typography key={idx} variant="body2">
                                <strong>{spec.key}:</strong> {spec.value}
                              </Typography>
                            ))
                          ) : (
                            <Typography
                              variant="body2"
                              color="textSecondary"
                            >
                              None
                            </Typography>
                          )}

                          <Typography variant="subtitle1" sx={{ mt: 2 }}>
                            Variants
                          </Typography>
                          {product.variants?.length ? (
                            product.variants.map((v, idx) => (
                              <Chip
                                key={idx}
                                label={`${v.name || ""} ${v.color || ""} (${v.stock || 0})`}
                                size="small"
                                sx={{ mr: 1, mb: 1 }}
                              />
                            ))
                          ) : (
                            <Typography
                              variant="body2"
                              color="textSecondary"
                            >
                              None
                            </Typography>
                          )}

                          <Typography variant="subtitle1" sx={{ mt: 2 }}>
                            Attributes
                          </Typography>
                          <Box>
                            {product.attributes?.finishes?.map((f) => (
                              <Chip
                                key={f._id}
                                label={f.name}
                                size="small"
                                color="primary"
                                sx={{ mr: 1, mb: 1 }}
                              />
                            ))}
                            {product.attributes?.materials?.map((m) => (
                              <Chip
                                key={m._id}
                                label={m.name}
                                size="small"
                                color="secondary"
                                sx={{ mr: 1, mb: 1 }}
                              />
                            ))}
                            {product.attributes?.textures?.map((t) => (
                              <Chip
                                key={t._id}
                                label={t.name}
                                size="small"
                                color="success"
                                sx={{ mr: 1, mb: 1 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  No Products Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ProductList;
