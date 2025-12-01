// ProductForm.tsx (Final Fixed Version)
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

/* ------------------ SAFE MULTISELECT ------------------ */

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
      label={label}
      onChange={(e) =>
        setValue((e.target.value as any[]).map((v) => (typeof v === "string" ? v : v._id)))
      }
      renderValue={(selected) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {(selected as string[]).map((id) => {
            const item = options.find((o) => o._id === id);
            return <Chip key={id} label={item?.name || "Unknown"} />;
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

  /* ---------------- FETCH DROPDOWNS ---------------- */

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
    }
  }, [categoryId]);

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

    setSelectedFinishes(editingProduct.attributes?.finishes?.map((f: any) => f._id) || []);
    setSelectedMaterials(editingProduct.attributes?.materials?.map((m: any) => m._id) || []);
    setSelectedTextures(editingProduct.attributes?.textures?.map((t: any) => t._id) || []);

    setUploadedFiles(
      editingProduct.images.map(
        (img) =>
        ({
          name: img,
          size: 0,
          type: "image/jpeg",
        } as File)
      )
    );

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
    setUploadedFiles((prev) => [...prev, ...files]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  /* ---------------- SPEC HANDLERS ---------------- */

  const handleSpecChange = (i: number, field: "key" | "value", val: string) => {
    setSpecifications((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  };

  const addSpecification = () => setSpecifications((prev) => [...prev, { key: "", value: "" }]);
  const removeSpecification = (i: number) =>
    setSpecifications((prev) => prev.filter((_, idx) => idx !== i));

  const handleRemoveImage = (i: number) =>
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i));

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const specObj: Record<string, string> = {};
    specifications.forEach((s) => {
      if (s.key.trim()) specObj[s.key] = s.value;
    });

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("categoryId", categoryId);
    formData.append("subCategoryId", subCategoryId);
    formData.append(
      "attributes",
      JSON.stringify({
        textures: selectedTextures,
        finishes: selectedFinishes,
        materials: selectedMaterials,
      })
    );
    formData.append("specifications", JSON.stringify(specObj));

    // ✅ IMPORTANT — APPEND ALL FILES CORRECTLY
    uploadedFiles.forEach((file) => {
      if (file instanceof File) {
        formData.append("images", file);   // multiple allowed
      }
    });

    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:8000/api/products/${editingProduct._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("✅ Product Updated");
      } else {
        await axios.post(
          "http://localhost:8000/api/products/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("✅ Product Created");
      }

      setEditingProduct(null);
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error(err);
      alert("❌ Image upload or save failed");
    }
  };


  const resetForm = () => {
    setName(""); setSlug(""); setDescription("");
    setPrice(""); setStock(""); setCategoryId("");
    setSubCategoryId(""); setUploadedFiles([]);
    setSelectedTextures([]); setSelectedFinishes([]);
    setSelectedMaterials([]); setSpecifications([]);
  };

  /* ---------------- RENDER ---------------- */

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5">{editingProduct ? "✏️ Edit Product" : "➕ Add Product"}</Typography>
      <Divider sx={{ my: 2 }} />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>

          <Grid item xs={3}><TextField fullWidth label="Name" size="small" value={name} onChange={(e) => setName(e.target.value)} /></Grid>
          <Grid item xs={3}><TextField fullWidth label="Slug" size="small" value={slug} onChange={(e) => setSlug(e.target.value)} /></Grid>
          <Grid item xs={3}><TextField fullWidth label="Price" size="small" type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></Grid>
          <Grid item xs={3}><TextField fullWidth label="Stock" size="small" type="number" value={stock} onChange={(e) => setStock(e.target.value)} /></Grid>

          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} size="small" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </Grid>

          <Grid item xs={6}>
            <TextField select size="small" label="Category" fullWidth value={categoryId || ""} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField select size="small" label="Sub Category" fullWidth value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)}>
              {subCategories.map((s) => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={4}><MultiSelect label="Textures" options={textures} value={selectedTextures} setValue={setSelectedTextures} /></Grid>
          <Grid item xs={4}><MultiSelect label="Finishes" options={finishes} value={selectedFinishes} setValue={setSelectedFinishes} /></Grid>
          <Grid item xs={4}><MultiSelect label="Materials" options={materials} value={selectedMaterials} setValue={setSelectedMaterials} /></Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Specifications</Typography>
            {specifications.map((s, i) => (
              <Grid container spacing={1} key={`${s.key}-${i}`}>
                <Grid item xs={5}><TextField value={s.key} size="small" onChange={(e) => handleSpecChange(i, "key", e.target.value)} label="Key" fullWidth /></Grid>
                <Grid item xs={5}><TextField value={s.value} size="small" onChange={(e) => handleSpecChange(i, "value", e.target.value)} label="Value" fullWidth /></Grid>
                <Grid item xs={2}><Button color="error" onClick={() => removeSpecification(i)}>Remove</Button></Grid>
              </Grid>
            ))}
            <Button onClick={addSpecification}>+ Add</Button>
          </Grid>

          <Grid item xs={12}>
            <Box {...getRootProps()} sx={{ border: "1px dashed #aaa", p: 2, textAlign: "center" }}>
              <input {...getInputProps()} />
              <Typography>{isDragActive ? "Drop images" : "Upload images"}</Typography>
            </Box>

            {uploadedFiles.map((f, i) => (
              <Box key={`${f.name}-${i}`} display="flex" alignItems="center">
                <Avatar
                  src={f instanceof File ? URL.createObjectURL(f) : (f as any).name}
                  sx={{ mr: 1 }}
                />
                <Typography>{f.name}</Typography>
                <Button color="error" onClick={() => handleRemoveImage(i)}>Remove</Button>
              </Box>
            ))}

          </Grid>

          <Grid item xs={12}>
            <Button fullWidth type="submit" variant="contained">
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
            {editingProduct && (
              <Button color="error" fullWidth sx={{ mt: 1 }} onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </Grid>

        </Grid>
      </form>
    </Paper>
  );
};

export default ProductForm;
