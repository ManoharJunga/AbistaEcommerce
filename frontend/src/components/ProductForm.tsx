import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
  Paper,
  Box,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { 
  CloudUpload, 
  DeleteForever, 
  AddCircleOutline, 
  Inventory, 
  SettingsSuggest,
  Close
} from "@mui/icons-material";

/* ------------------ TYPES ------------------ */

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  subCategoryId: string;
  images: string[];
  attributes?: {
    textures?: any[];
    finishes?: any[];
    materials?: any[];
  };
  specifications?: Record<string, string>;
}

interface Option {
  _id: string;
  name: string;
}

interface ProductFormProps {
  fetchProducts: () => void;
  editingProduct: Product | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

/* ------------------ REUSABLE MULTISELECT ------------------ */

const ModernMultiSelect: React.FC<{
  label: string;
  options: Option[];
  value: string[];
  setValue: (val: string[]) => void;
}> = ({ label, options, value, setValue }) => (
  <FormControl fullWidth size="small" variant="outlined">
    <InputLabel>{label}</InputLabel>
    <Select
      multiple
      value={value}
      label={label}
      onChange={(e) => setValue(e.target.value as string[])}
      renderValue={(selected) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {selected.map((id) => {
            const item = options.find((o) => o._id === id);
            return (
              <Chip 
                key={id} 
                label={item?.name || "Unknown"} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            );
          })}
        </Box>
      )}
    >
      {options.map((opt) => (
        <MenuItem key={opt._id} value={opt._id}>
          {opt.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

/* ------------------ MAIN FORM ------------------ */

const ProductForm: React.FC<ProductFormProps> = ({
  fetchProducts,
  editingProduct,
  setEditingProduct,
}) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const [categories, setCategories] = useState<Option[]>([]);
  const [subCategories, setSubCategories] = useState<Option[]>([]);
  const [textures, setTextures] = useState<Option[]>([]);
  const [finishes, setFinishes] = useState<Option[]>([]);
  const [materials, setMaterials] = useState<Option[]>([]);

  const [selectedTextures, setSelectedTextures] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);

  /* ---------------- FETCH DROPDOWNS ---------------- */

  useEffect(() => {
    const api = "http://localhost:8000/api";
    axios.get(`${api}/categories`).then((res) => setCategories(res.data));
    axios.get(`${api}/finishes`).then((res) => setFinishes(res.data));
    axios.get(`${api}/materials`).then((res) => setMaterials(res.data));
    axios.get(`${api}/textures`).then((res) => setTextures(res.data));
  }, []);

  useEffect(() => {
    if (categoryId) {
      axios
        .get(`http://localhost:8000/api/subcategories?categoryId=${categoryId}`)
        .then((res) => setSubCategories(res.data));
    }
  }, [categoryId]);

  /* ---------------- AUTO SLUG ---------------- */

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingProduct) {
      setSlug(val.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""));
    }
  };

  /* ---------------- PREFILL EDIT DATA ---------------- */

  useEffect(() => {
    if (!editingProduct) return;

    setName(editingProduct.name);
    setSlug(editingProduct.slug);
    setDescription(editingProduct.description);
    setPrice(String(editingProduct.price));
    setStock(String(editingProduct.stock));
    setCategoryId(editingProduct.categoryId);
    setSubCategoryId(editingProduct.subCategoryId);

    setSelectedFinishes(editingProduct.attributes?.finishes?.map((f: any) => f._id || f) || []);
    setSelectedMaterials(editingProduct.attributes?.materials?.map((m: any) => m._id || m) || []);
    setSelectedTextures(editingProduct.attributes?.textures?.map((t: any) => t._id || t) || []);

    // Treat existing image URLs as special objects
    setUploadedFiles(editingProduct.images.map(img => ({ preview: img, existing: true })));

    const specs = editingProduct.specifications
      ? Object.entries(editingProduct.specifications).map(([k, v]) => ({
        key: k,
        value: String(v),
      }))
      : [];
    setSpecifications(specs);
  }, [editingProduct]);

  /* ---------------- DROPZONE ---------------- */

  const onDrop = useCallback((files: File[]) => {
    const newFiles = files.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': [] } 
  });

  /* ---------------- HANDLERS ---------------- */

  const handleSpecChange = (i: number, field: "key" | "value", val: string) => {
    setSpecifications((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const specObj: Record<string, string> = {};
    specifications.forEach((s) => { if (s.key.trim()) specObj[s.key] = s.value; });

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("categoryId", categoryId);
    formData.append("subCategoryId", subCategoryId);
    formData.append("attributes", JSON.stringify({
      textures: selectedTextures,
      finishes: selectedFinishes,
      materials: selectedMaterials,
    }));
    formData.append("specifications", JSON.stringify(specObj));

    uploadedFiles.forEach((file) => {
      if (file instanceof File) formData.append("images", file);
    });

    try {
      const url = editingProduct 
        ? `http://localhost:8000/api/products/${editingProduct._id}`
        : "http://localhost:8000/api/products/upload";
      
      await axios({
        method: editingProduct ? 'put' : 'post',
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert(editingProduct ? "✅ Product Updated" : "✅ Product Created");
      resetForm();
      fetchProducts();
    } catch (err) {
      alert("❌ Save failed. Ensure all required fields are filled.");
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setName(""); setSlug(""); setDescription("");
    setPrice(""); setStock(""); setCategoryId("");
    setSubCategoryId(""); setUploadedFiles([]);
    setSelectedTextures([]); setSelectedFinishes([]);
    setSelectedMaterials([]); setSpecifications([]);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 3, borderRadius: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          {editingProduct ? "Edit Product Details" : "Create New Product"}
        </Typography>
        {editingProduct && (
          <Button startIcon={<Close />} color="error" onClick={resetForm}>
            Exit Edit Mode
          </Button>
        )}
      </Box>
      <Divider sx={{ mb: 4 }} />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          
          {/* Basic Info Section */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Inventory color="primary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight="bold">General Information</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Product Name" size="small" value={name} onChange={(e) => handleNameChange(e.target.value)} required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Slug (URL)" size="small" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Price ($)" size="small" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Stock Quantity" size="small" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} size="small" label="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </Grid>

          {/* Classification Section */}
          <Grid item xs={12} md={6}>
            <TextField select size="small" label="Primary Category" fullWidth value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField select size="small" label="Sub Category" fullWidth value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)} disabled={!categoryId}>
              {subCategories.map((s) => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
            </TextField>
          </Grid>

          {/* Attributes Section */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <SettingsSuggest color="primary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight="bold">Product Attributes</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}><ModernMultiSelect label="Materials" options={materials} value={selectedMaterials} setValue={setSelectedMaterials} /></Grid>
          <Grid item xs={12} md={4}><ModernMultiSelect label="Finishes" options={finishes} value={selectedFinishes} setValue={setSelectedFinishes} /></Grid>
          <Grid item xs={12} md={4}><ModernMultiSelect label="Textures" options={textures} value={selectedTextures} setValue={setSelectedTextures} /></Grid>

          {/* Specifications Section */}
          <Grid item xs={12}>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Technical Specifications</Typography>
              {specifications.map((s, i) => (
                <Grid container spacing={2} key={i} sx={{ mb: 1 }}>
                  <Grid item xs={5}><TextField value={s.key} size="small" onChange={(e) => handleSpecChange(i, "key", e.target.value)} label="Key" placeholder="e.g. Weight" fullWidth /></Grid>
                  <Grid item xs={5}><TextField value={s.value} size="small" onChange={(e) => handleSpecChange(i, "value", e.target.value)} label="Value" placeholder="e.g. 5kg" fullWidth /></Grid>
                  <Grid item xs={2}><IconButton color="error" onClick={() => setSpecifications(prev => prev.filter((_, idx) => idx !== i))}><DeleteForever /></IconButton></Grid>
                </Grid>
              ))}
              <Button startIcon={<AddCircleOutline />} size="small" onClick={() => setSpecifications(prev => [...prev, { key: "", value: "" }])}>Add Specification</Button>
            </Box>
          </Grid>

          {/* Media Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Product Images</Typography>
            <Box {...getRootProps()} sx={{ 
              border: "2px dashed", 
              borderColor: isDragActive ? "primary.main" : "grey.300", 
              p: 4, borderRadius: 2, textAlign: "center", cursor: "pointer",
              bgcolor: isDragActive ? "action.hover" : "transparent",
              transition: "0.3s"
            }}>
              <input {...getInputProps()} />
              <CloudUpload sx={{ fontSize: 40, color: "grey.400", mb: 1 }} />
              <Typography color="textSecondary">Drag & drop product images here, or click to select files</Typography>
            </Box>

            <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
              {uploadedFiles.map((file, i) => (
                <Box key={i} sx={{ position: 'relative', width: 100, height: 100 }}>
                  <Avatar variant="rounded" src={file.preview} sx={{ width: '100%', height: '100%', border: "1px solid", borderColor: "grey.200" }} />
                  <IconButton 
                    size="small" 
                    sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                    onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button fullWidth type="submit" variant="contained" size="large" sx={{ py: 1.5, fontWeight: 'bold', borderRadius: 2 }}>
              {editingProduct ? "Save Changes" : "Publish Product"}
            </Button>
          </Grid>

        </Grid>
      </form>
    </Paper>
  );
};

export default ProductForm;