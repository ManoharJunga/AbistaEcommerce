// ProductForm.tsx (Redesigned)
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
} from "@mui/material";
import { useDropzone } from "react-dropzone";

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
    textures?: string[];
    finishes?: string[];
    materials?: string[];
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

/** 🔹 Reusable MultiSelect Component */
const MultiSelect: React.FC<{
  label: string;
  options: Option[];
  value: string[];
  setValue: (val: string[]) => void;
}> = ({ label, options, value, setValue }) => (
  <FormControl fullWidth size="small">
    <InputLabel>{label}</InputLabel>
    <Select
      multiple
      value={value}
      onChange={(e) => setValue(e.target.value as string[])}
      renderValue={(selected) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {(selected as string[]).map((val) => {
            const opt = options.find((o) => o._id === val);
            return <Chip key={val} label={opt?.name || val} />;
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [categories, setCategories] = useState<Option[]>([]);
  const [subCategories, setSubCategories] = useState<Option[]>([]);
  const [textures, setTextures] = useState<Option[]>([]);
  const [finishes, setFinishes] = useState<Option[]>([]);
  const [materials, setMaterials] = useState<Option[]>([]);

  const [selectedTextures, setSelectedTextures] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);

  /** 🔹 Fetch dropdown data */
  useEffect(() => {
    axios.get("http://localhost:8000/api/categories").then((res) => setCategories(res.data));
    axios.get("http://localhost:8000/api/finishes").then((res) => setFinishes(res.data));
    axios.get("http://localhost:8000/api/materials").then((res) => setMaterials(res.data));
    axios.get("http://localhost:8000/api/textures").then((res) => setTextures(res.data));
  }, []);

  useEffect(() => {
    if (categoryId) {
      axios
        .get(`http://localhost:8000/api/subcategories?categoryId=${categoryId}`)
        .then((res) => setSubCategories(res.data));
    } else {
      setSubCategories([]);
    }
  }, [categoryId]);

  /** 🔹 Pre-fill form when editing */
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || "");
      setSlug(editingProduct.slug || "");
      setDescription(editingProduct.description || "");
      setPrice(editingProduct.price?.toString() || "");
      setStock(editingProduct.stock?.toString() || "");
      setCategoryId(editingProduct.categoryId || "");
      setSubCategoryId(editingProduct.subCategoryId || "");

      setSelectedFinishes(editingProduct.attributes?.finishes || []);
      setSelectedMaterials(editingProduct.attributes?.materials || []);
      setSelectedTextures(editingProduct.attributes?.textures || []);

      const existingFiles =
        editingProduct.images?.map(
          (img) =>
            ({
              name: img,
              size: 0,
              type: "image/jpeg",
            } as File)
        ) || [];
      setUploadedFiles(existingFiles);

      const specsArray = editingProduct.specifications
        ? Object.entries(editingProduct.specifications).map(([key, value]) => ({
            key,
            value: String(value),
          }))
        : [];
      setSpecifications(specsArray);
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategoryId("");
      setSubCategoryId("");
      setSelectedFinishes([]);
      setSelectedMaterials([]);
      setSelectedTextures([]);
      setUploadedFiles([]);
      setSpecifications([]);
    }
  }, [editingProduct]);

  /** 🔹 Image Dropzone */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  /** 🔹 Handle Specification Changes */
  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    setSpecifications((prev) =>
      prev.map((spec, i) => (i === index ? { ...spec, [field]: val } : spec))
    );
  };

  const addSpecification = () => setSpecifications((prev) => [...prev, { key: "", value: "" }]);
  const removeSpecification = (index: number) =>
    setSpecifications((prev) => prev.filter((_, i) => i !== index));

  /** 🔹 Submit handler */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specsObj: Record<string, string> = {};
    specifications.forEach((s) => {
      if (s.key.trim()) specsObj[s.key] = s.value;
    });

    // update product
    if (editingProduct) {
      const productData = {
        name,
        slug,
        description,
        price: Number(price),
        stock: Number(stock),
        categoryId,
        subCategoryId,
        attributes: {
          textures: selectedTextures,
          finishes: selectedFinishes,
          materials: selectedMaterials,
        },
        specifications: specsObj,
        images: uploadedFiles.map((file) =>
          file instanceof File ? URL.createObjectURL(file) : (file as any).name
        ),
      };

      axios
        .put(`http://localhost:8000/api/products/${editingProduct._id}`, productData, {
          headers: { "Content-Type": "application/json" },
        })
        .then(() => {
          alert("Product updated successfully");
          setEditingProduct(null);
          fetchProducts();
        })
        .catch((error) => console.error("❌ Error:", error));
      return;
    }

    // create new product
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("stock", stock.toString());
    formData.append("categoryId", categoryId);
    formData.append("subCategoryId", subCategoryId);
    formData.append(
      "attributes",
      JSON.stringify({ textures: selectedTextures, finishes: selectedFinishes, materials: selectedMaterials })
    );
    formData.append("specifications", JSON.stringify(specsObj));

    uploadedFiles.forEach((file) => {
      if (file instanceof File) {
        formData.append("images", file);
      }
    });

    axios
      .post("http://localhost:8000/api/products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        alert("Product uploaded successfully");
        fetchProducts();
      })
      .catch((error) => console.error("❌ Error:", error));
  };

  const handleRemoveImage = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Paper elevation={4} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        {editingProduct ? "✏️ Edit Product" : "➕ Create New Product"}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Product Info */}
          <Grid item xs={12}>
            <Typography variant="h6">📦 Product Info</Typography>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField label="Name" size="small" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField label="Slug" size="small" fullWidth required value={slug} onChange={(e) => setSlug(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField label="Price" size="small" type="number" fullWidth required value={price} onChange={(e) => setPrice(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField label="Stock" size="small" type="number" fullWidth required value={stock} onChange={(e) => setStock(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" size="small" fullWidth multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Grid>

          {/* Categories */}
          <Grid item xs={12}>
            <Typography variant="h6">📂 Category</Typography>
            <Divider sx={{ my: 1 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select size="small" label="Category" fullWidth required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select size="small" label="SubCategory" fullWidth required value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)}>
              {subCategories.map((sub) => (
                <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Attributes */}
          <Grid item xs={12}>
            <Typography variant="h6">🎨 Attributes</Typography>
            <Divider sx={{ my: 1 }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MultiSelect label="Textures" options={textures} value={selectedTextures} setValue={setSelectedTextures} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MultiSelect label="Finishes" options={finishes} value={selectedFinishes} setValue={setSelectedFinishes} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MultiSelect label="Materials" options={materials} value={selectedMaterials} setValue={setSelectedMaterials} />
          </Grid>

          {/* Specifications */}
          <Grid item xs={12}>
            <Typography variant="h6">⚙️ Specifications</Typography>
            <Divider sx={{ my: 1 }} />
            {specifications.map((spec, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                <Grid item xs={5}>
                  <TextField label="Key" size="small" fullWidth value={spec.key} onChange={(e) => handleSpecChange(index, "key", e.target.value)} />
                </Grid>
                <Grid item xs={5}>
                  <TextField label="Value" size="small" fullWidth value={spec.value} onChange={(e) => handleSpecChange(index, "value", e.target.value)} />
                </Grid>
                <Grid item xs={2}>
                  <Button color="error" onClick={() => removeSpecification(index)}>Remove</Button>
                </Grid>
              </Grid>
            ))}
            <Button onClick={addSpecification} variant="outlined" sx={{ mt: 1 }}>
              + Add Specification
            </Button>
          </Grid>

          {/* Images */}
          <Grid item xs={12}>
            <Typography variant="h6">🖼️ Images</Typography>
            <Divider sx={{ my: 1 }} />
            <Box {...getRootProps()} sx={{ border: "1px dashed gray", p: 2, textAlign: "center", borderRadius: 2, bgcolor: "grey.50" }}>
              <input {...getInputProps()} />
              {isDragActive ? <Typography>Drop files here ...</Typography> : <Typography>Drag & drop or click to upload</Typography>}
            </Box>
            {uploadedFiles.length > 0 && (
              <Box mt={2}>
                {uploadedFiles.map((file, index) => (
                  <Box key={file.name} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Avatar src={file instanceof File ? URL.createObjectURL(file) : file.name} alt={file.name} sx={{ width: 40, height: 40, mr: 1 }} />
                    <Typography variant="body2">{file.name}</Typography>
                    <Button onClick={() => handleRemoveImage(index)} color="error" size="small">Remove</Button>
                  </Box>
                ))}
              </Box>
            )}
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {editingProduct ? "Update Product" : "Upload Product"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProductForm;
