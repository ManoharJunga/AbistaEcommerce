// ProductTableForm.tsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, IconButton, MenuItem, Select, Button, Paper, Box, Typography,
  Chip
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { Delete, Add } from "@mui/icons-material";

interface Option {
  _id: string;
  name: string;
}

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  subCategoryId: string;
  finishes: string[];
  materials: string[];
  textures: string[];
  specifications: { key: string; value: string }[];
  image: File | null;
}

interface Props {
  fetchProducts: () => void;
}

const ProductTableForm: React.FC<Props> = ({ fetchProducts }) => {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [subCategories, setSubCategories] = useState<{ [key: string]: Option[] }>({});
  const [finishes, setFinishes] = useState<Option[]>([]);
  const [materials, setMaterials] = useState<Option[]>([]);
  const [textures, setTextures] = useState<Option[]>([]);

  /** Fetch dropdowns */
  useEffect(() => {
    axios.get("http://localhost:8000/api/categories").then((res) => setCategories(res.data));
    axios.get("http://localhost:8000/api/finishes").then((res) => setFinishes(res.data));
    axios.get("http://localhost:8000/api/materials").then((res) => setMaterials(res.data));
    axios.get("http://localhost:8000/api/textures").then((res) => setTextures(res.data));
  }, []);

  /** Handle Drop Images → create rows */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newRows = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2),
      name: "",
      slug: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
      subCategoryId: "",
      finishes: [],
      materials: [],
      textures: [],
      specifications: [{ key: "", value: "" }],
      image: file,
    }));
    setRows((prev) => [...prev, ...newRows]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  /** Fetch subcategories when category changes */
  const handleCategoryChange = (rowId: string, categoryId: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, categoryId, subCategoryId: "" } : r))
    );
    if (!subCategories[categoryId]) {
      axios
        .get(`http://localhost:8000/api/subcategories?categoryId=${categoryId}`)
        .then((res) =>
          setSubCategories((prev) => ({ ...prev, [categoryId]: res.data }))
        );
    }
  };

  /** Handle Row Field Change */
  const updateRow = (rowId: string, field: keyof ProductRow, value: any) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, [field]: value } : r))
    );
  };

  /** Handle specifications */
  const addSpec = (rowId: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? { ...r, specifications: [...r.specifications, { key: "", value: "" }] }
          : r
      )
    );
  };

  const updateSpec = (rowId: string, index: number, key: string, value: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const newSpecs = [...r.specifications];
        newSpecs[index] = { key, value };
        return { ...r, specifications: newSpecs };
      })
    );
  };

  /** Remove Row */
  const removeRow = (rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  /** Submit All Products */
  const handleSubmitAll = async () => {
    for (const row of rows) {
      const specsObj: Record<string, string> = {};
      row.specifications.forEach((s) => {
        if (s.key.trim()) specsObj[s.key] = s.value;
      });

      const formData = new FormData();
      formData.append("name", row.name);
      formData.append("slug", row.slug);
      formData.append("description", row.description);
      formData.append("price", row.price);
      formData.append("stock", row.stock);
      formData.append("categoryId", row.categoryId);
      formData.append("subCategoryId", row.subCategoryId);
      formData.append(
        "attributes",
        JSON.stringify({
          textures: row.textures,
          finishes: row.finishes,
          materials: row.materials,
        })
      );
      formData.append("specifications", JSON.stringify(specsObj));
      if (row.image instanceof File) {
        formData.append("images", row.image);
      }

      try {
        await axios.post("http://localhost:8000/api/products/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (err) {
        console.error("❌ Upload error:", err);
      }
    }
    alert("✅ Products uploaded successfully");
    setRows([]);
    fetchProducts();
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        📦 Bulk Product Entry
      </Typography>

      {/* Dropzone */}
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed gray",
          p: 2,
          textAlign: "center",
          borderRadius: 2,
          bgcolor: "grey.50",
          mb: 2,
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop images here ...</Typography>
        ) : (
          <Typography>Drag & drop images or click to upload (1 row per image)</Typography>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
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
              <TableCell>Finishes</TableCell>
              <TableCell>Materials</TableCell>
              <TableCell>Textures</TableCell>
              <TableCell>Specifications</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {/* Image */}
                <TableCell>
                  {row.image && (
                    <img
                      src={URL.createObjectURL(row.image)}
                      alt="preview"
                      style={{ width: 40, height: 40, borderRadius: 4 }}
                    />
                  )}
                </TableCell>

                {/* Name */}
                <TableCell>
                  <TextField
                    size="small"
                    value={row.name}
                    onChange={(e) => updateRow(row.id, "name", e.target.value)}
                  />
                </TableCell>

                {/* Slug */}
                <TableCell>
                  <TextField
                    size="small"
                    value={row.slug}
                    onChange={(e) => updateRow(row.id, "slug", e.target.value)}
                  />
                </TableCell>

                {/* Description */}
                <TableCell>
                  <TextField
                    size="small"
                    value={row.description}
                    onChange={(e) => updateRow(row.id, "description", e.target.value)}
                  />
                </TableCell>

                {/* Price */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={row.price}
                    onChange={(e) => updateRow(row.id, "price", e.target.value)}
                  />
                </TableCell>

                {/* Stock */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={row.stock}
                    onChange={(e) => updateRow(row.id, "stock", e.target.value)}
                  />
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Select
                    size="small"
                    value={row.categoryId}
                    onChange={(e) => handleCategoryChange(row.id, e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Select</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>

                {/* SubCategory */}
                <TableCell>
                  <Select
                    size="small"
                    value={row.subCategoryId}
                    onChange={(e) => updateRow(row.id, "subCategoryId", e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Select</MenuItem>
                    {subCategories[row.categoryId]?.map((sub) => (
                      <MenuItem key={sub._id} value={sub._id}>
                        {sub.name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>

                {/* Finishes */}
                <TableCell>
                  <Select
                    multiple
                    size="small"
                    value={row.finishes}
                    onChange={(e) => updateRow(row.id, "finishes", e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as string[]).map((id) => {
                          const f = finishes.find((f) => f._id === id);
                          return <Chip key={id} label={f?.name || id} />;
                        })}
                      </Box>
                    )}
                  >
                    {finishes.map((f) => (
                      <MenuItem key={f._id} value={f._id}>
                        {f.name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>

                {/* Materials */}
                <TableCell>
                  <Select
                    multiple
                    size="small"
                    value={row.materials}
                    onChange={(e) => updateRow(row.id, "materials", e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as string[]).map((id) => {
                          const m = materials.find((m) => m._id === id);
                          return <Chip key={id} label={m?.name || id} />;
                        })}
                      </Box>
                    )}
                  >
                    {materials.map((m) => (
                      <MenuItem key={m._id} value={m._id}>
                        {m.name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>

                {/* Textures */}
                <TableCell>
                  <Select
                    multiple
                    size="small"
                    value={row.textures}
                    onChange={(e) => updateRow(row.id, "textures", e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as string[]).map((id) => {
                          const t = textures.find((t) => t._id === id);
                          return <Chip key={id} label={t?.name || id} />;
                        })}
                      </Box>
                    )}
                  >
                    {textures.map((t) => (
                      <MenuItem key={t._id} value={t._id}>
                        {t.name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>

                {/* Specifications */}
                <TableCell>
                  {row.specifications.map((spec, i) => (
                    <Box key={i} sx={{ display: "flex", mb: 0.5 }}>
                      <TextField
                        size="small"
                        placeholder="Key"
                        value={spec.key}
                        onChange={(e) => updateSpec(row.id, i, e.target.value, spec.value)}
                        sx={{ mr: 1 }}
                      />
                      <TextField
                        size="small"
                        placeholder="Value"
                        value={spec.value}
                        onChange={(e) => updateSpec(row.id, i, spec.key, e.target.value)}
                      />
                    </Box>
                  ))}
                  <IconButton size="small" onClick={() => addSpec(row.id)}>
                    <Add fontSize="small" />
                  </IconButton>
                </TableCell>

                {/* Delete */}
                <TableCell>
                  <IconButton onClick={() => removeRow(row.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={13} align="center">
                  No rows yet. Drop images or add manually.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {rows.length > 0 && (
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
          onClick={handleSubmitAll}
        >
          Save All Products
        </Button>
      )}
    </Paper>
  );
};

export default ProductTableForm;
