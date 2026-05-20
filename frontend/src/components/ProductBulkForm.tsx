import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, IconButton, MenuItem, Select, Button, Paper, Box, Typography,
  Chip, Alert, Stack, CircularProgress
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { 
  Delete, Add, CloudUpload, Bolt, 
  CleaningServices, ContentCopy 
} from "@mui/icons-material";

interface Option { _id: string; name: string; }

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

interface Props { fetchProducts: () => void; }

const ProductTableForm: React.FC<Props> = ({ fetchProducts }) => {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [subCategories, setSubCategories] = useState<{ [key: string]: Option[] }>({});
  const [finishes, setFinishes] = useState<Option[]>([]);
  const [materials, setMaterials] = useState<Option[]>([]);
  const [textures, setTextures] = useState<Option[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    const api = "http://localhost:8000/api";
    axios.get(`${api}/categories`).then((res) => setCategories(res.data));
    axios.get(`${api}/finishes`).then((res) => setFinishes(res.data));
    axios.get(`${api}/materials`).then((res) => setMaterials(res.data));
    axios.get(`${api}/textures`).then((res) => setTextures(res.data));
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newRows = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2),
      name: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
      slug: file.name.toLowerCase().replace(/\.[^/.]+$/, "").replace(/\s+/g, "-"),
      description: "",
      price: "0",
      stock: "10",
      categoryId: "",
      subCategoryId: "",
      finishes: [],
      materials: [],
      textures: [],
      specifications: [{ key: "Material", value: "" }],
      image: file,
    }));
    setRows((prev) => [...prev, ...newRows]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const updateRow = (rowId: string, field: keyof ProductRow, value: any) => {
    setRows((prev) => prev.map((r) => {
      if (r.id === rowId) {
        if (field === "name") {
          return { ...r, name: value, slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "") };
        }
        return { ...r, [field]: value };
      }
      return r;
    }));
  };

  const handleCategoryChange = async (rowId: string, categoryId: string) => {
    updateRow(rowId, "categoryId", categoryId);
    updateRow(rowId, "subCategoryId", "");
    if (categoryId && !subCategories[categoryId]) {
      try {
        const res = await axios.get(`http://localhost:8000/api/subcategories?categoryId=${categoryId}`);
        setSubCategories((prev) => ({ ...prev, [categoryId]: res.data }));
      } catch (err) { console.error("Error fetching subcategories", err); }
    }
  };

  const applyFirstToAll = async (field: keyof ProductRow) => {
    if (rows.length < 2) return;
    const firstRow = rows[0];
    const sourceValue = firstRow[field];

    // Special logic for Category & SubCategory synchronization
    if (field === "categoryId") {
      const catId = sourceValue as string;
      const subId = firstRow.subCategoryId;

      if (catId) {
        // 1. Ensure subcategory options are loaded for this category
        if (!subCategories[catId]) {
          const res = await axios.get(`http://localhost:8000/api/subcategories?categoryId=${catId}`);
          setSubCategories((prev) => ({ ...prev, [catId]: res.data }));
        }
        // 2. Apply both Category and SubCategory to all rows
        setRows(prev => prev.map(r => ({ 
          ...r, 
          categoryId: catId, 
          subCategoryId: subId 
        })));
      }
    } else {
      // Standard apply for other fields (Price, Stock, Description, etc.)
      setRows(prev => prev.map(r => ({ ...r, [field]: sourceValue })));
    }
  };

  const handleSubmitAll = async () => {
    if (rows.length === 0) return;
    setIsUploading(true);
    try {
      for (const row of rows) {
        const specsObj: Record<string, string> = {};
        row.specifications.forEach((s) => { if (s.key.trim()) specsObj[s.key] = s.value; });

        const formData = new FormData();
        formData.append("name", row.name);
        formData.append("description", row.description || "Bulk uploaded product");
        formData.append("price", row.price);
        formData.append("stock", row.stock);
        formData.append("category", row.categoryId);
        formData.append("subCategory", row.subCategoryId);

        formData.append("attributes", JSON.stringify({
          selectedTextures: row.textures,
          selectedFinishes: row.finishes,
          selectedMaterials: row.materials
        }));

        formData.append("specifications", JSON.stringify(specsObj));
        if (row.image) formData.append("images", row.image);

        await axios.post("http://localhost:8000/api/products/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      alert("All products uploaded successfully!");
      setRows([]);
      fetchProducts();
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert(`Upload failed: ${err.response?.data?.message || "Internal Server Error"}`);
    } finally { setIsUploading(false); }
  };

  return (
    <Paper sx={{ p: 3, mt: 3, borderRadius: 3, boxShadow: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="700">Bulk Inventory Uploader</Typography>
          <Typography variant="caption" color="text.secondary">Fill the first row and use the icons to sync all rows.</Typography>
        </Box>
        {rows.length > 0 && (
          <Stack direction="row" spacing={1}>
            <Button startIcon={<CleaningServices />} color="inherit" onClick={() => setRows([])}>Clear</Button>
            <Button 
                variant="contained" 
                startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />} 
                onClick={handleSubmitAll} 
                disabled={isUploading}
            >
              {isUploading ? "Uploading..." : `Upload ${rows.length} Items`}
            </Button>
          </Stack>
        )}
      </Stack>

      <Box {...getRootProps()} sx={{ 
        border: "2px dashed", 
        borderColor: isDragActive ? "primary.main" : "#ccc", 
        p: 4, textAlign: "center", mb: 4, cursor: "pointer",
        bgcolor: isDragActive ? "#f0f7ff" : "transparent",
        borderRadius: 2
      }}>
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 40, color: "gray", mb: 1 }} />
        <Typography>Drag & Drop Product Images or Click to Select</Typography>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ "& th": { bgcolor: "grey.100", fontWeight: "bold" } }}>
              <TableCell width={50}>Img</TableCell>
              <TableCell>
                Details 
                <IconButton size="small" onClick={() => applyFirstToAll("description")} title="Copy Desc to All"><ContentCopy fontSize="inherit"/></IconButton>
              </TableCell>
              <TableCell>
                Category/Sub
                <IconButton size="small" onClick={() => applyFirstToAll("categoryId")} title="Copy Cat/Sub to All"><ContentCopy fontSize="inherit"/></IconButton>
              </TableCell>
              <TableCell>
                Price/Stock
                <IconButton size="small" onClick={() => applyFirstToAll("price")} title="Copy Price to All"><ContentCopy fontSize="inherit"/></IconButton>
              </TableCell>
              <TableCell>
                Attributes
                <IconButton size="small" onClick={() => applyFirstToAll("finishes")} title="Copy Attributes to All"><ContentCopy fontSize="inherit"/></IconButton>
              </TableCell>
              <TableCell>Specs</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                    {row.image && <img src={URL.createObjectURL(row.image)} width={45} height={45} style={{ objectFit: 'cover', borderRadius: 4 }} alt="p" />}
                </TableCell>
                <TableCell>
                  <Stack spacing={1} sx={{ minWidth: 150 }}>
                    <TextField label="Name" size="small" fullWidth value={row.name} onChange={(e) => updateRow(row.id, "name", e.target.value)} />
                    <TextField label="Description" size="small" fullWidth multiline rows={1} value={row.description} onChange={(e) => updateRow(row.id, "description", e.target.value)} />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={1} sx={{ minWidth: 140 }}>
                    <Select size="small" fullWidth value={row.categoryId} onChange={(e) => handleCategoryChange(row.id, e.target.value)} displayEmpty>
                      <MenuItem value="">Select Category</MenuItem>
                      {categories.map((cat) => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
                    </Select>
                    <Select size="small" fullWidth value={row.subCategoryId} onChange={(e) => updateRow(row.id, "subCategoryId", e.target.value)} displayEmpty disabled={!row.categoryId}>
                      <MenuItem value="">Select SubCategory</MenuItem>
                      {subCategories[row.categoryId]?.map((sub) => <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>)}
                    </Select>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={1} sx={{ width: 100 }}>
                    <TextField size="small" type="number" label="Price" value={row.price} onChange={(e) => updateRow(row.id, "price", e.target.value)} />
                    <TextField size="small" type="number" label="Stock" value={row.stock} onChange={(e) => updateRow(row.id, "stock", e.target.value)} />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={1} sx={{ minWidth: 130 }}>
                    <Select multiple size="small" fullWidth value={row.finishes} onChange={(e) => updateRow(row.id, "finishes", e.target.value)} displayEmpty renderValue={(s) => s.length === 0 ? "Finishes" : `${s.length} Fin.`}>
                      {finishes.map((f) => <MenuItem key={f._id} value={f._id}>{f.name}</MenuItem>)}
                    </Select>
                    <Select multiple size="small" fullWidth value={row.materials} onChange={(e) => updateRow(row.id, "materials", e.target.value)} displayEmpty renderValue={(s) => s.length === 0 ? "Materials" : `${s.length} Mat.`}>
                      {materials.map((m) => <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>)}
                    </Select>
                  </Stack>
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary" onClick={() => updateRow(row.id, "specifications", [...row.specifications, { key: "", value: "" }])}>
                    <Add fontSize="small" />
                  </IconButton>
                  <Typography variant="caption">{row.specifications.length} set</Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => setRows(prev => prev.filter(r => r.id !== row.id))}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ProductTableForm;