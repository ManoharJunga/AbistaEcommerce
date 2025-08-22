import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
  Box,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

// Types
type Category = {
  _id: string;
  name: string;
  image: string;
};

type Feature = {
  title: string;
  description: string;
  icon?: File | string; // File when uploading, string when fetching
};

type FeatureCategory = {
  _id: string;
  category: Category;
  features: Feature[];
};

const API_URL = "http://localhost:8000/api"; // change to your backend

const FeatureCategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featureCategories, setFeatureCategories] = useState<FeatureCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [features, setFeatures] = useState<Feature[]>([{ title: "", description: "", icon: "" }]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch categories and featureCategories
  useEffect(() => {
    const fetchData = async () => {
      const catRes = await axios.get(`${API_URL}/categories`);
      setCategories(catRes.data);

      const featRes = await axios.get(`${API_URL}/feature-categories`);
      setFeatureCategories(featRes.data);
    };
    fetchData();
  }, []);

  // Handle feature field change
  const handleFeatureChange = (index: number, field: keyof Feature, value: any) => {
    const updatedFeatures = [...features];
    (updatedFeatures[index] as any)[field] = value;
    setFeatures(updatedFeatures);
  };

  // Add new feature row
  const addFeatureRow = () => {
    setFeatures([...features, { title: "", description: "", icon: "" }]);
  };

  // Remove feature row
  const removeFeatureRow = (index: number) => {
    const updated = features.filter((_, i) => i !== index);
    setFeatures(updated);
  };

  // Submit (Create / Update)
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("category", selectedCategory);
    formData.append("features", JSON.stringify(features.map(({ title, description }) => ({ title, description }))));

    features.forEach((f) => {
      if (f.icon instanceof File) {
        formData.append("icons", f.icon); // multiple files
      }
    });

    if (editingId) {
      await axios.put(`${API_URL}/feature-categories/${editingId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await axios.post(`${API_URL}/feature-categories`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    // Refresh
    const featRes = await axios.get(`${API_URL}/feature-categories`);
    setFeatureCategories(featRes.data);
    setEditingId(null);
    setSelectedCategory("");
    setFeatures([{ title: "", description: "", icon: "" }]);
  };

  // Edit
  const handleEdit = (fc: FeatureCategory) => {
    setEditingId(fc._id);
    setSelectedCategory(fc.category._id);
    setFeatures(fc.features.map((f) => ({ ...f, icon: f.icon || "" })));
  };

  // Delete
  const handleDelete = async (id: string) => {
    await axios.delete(`${API_URL}/feature-categories/${id}`);
    setFeatureCategories(featureCategories.filter((fc) => fc._id !== id));
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Manage Feature Categories
      </Typography>

      {/* Create / Edit Form */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {features.map((feature, index) => (
          <Grid container spacing={2} alignItems="center" key={index} sx={{ mb: 2 }}>
            <Grid item xs={3}>
              <TextField
                label="Feature Title"
                fullWidth
                value={feature.title}
                onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Description"
                fullWidth
                multiline
                value={feature.description}
                onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFeatureChange(index, "icon", e.target.files ? e.target.files[0] : "")
                }
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton color="error" onClick={() => removeFeatureRow(index)}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button startIcon={<Add />} onClick={addFeatureRow} sx={{ mt: 1 }}>
          Add Feature
        </Button>

        <Divider sx={{ my: 2 }} />

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {editingId ? "Update Feature Category" : "Create Feature Category"}
        </Button>
      </Paper>

      {/* Existing Feature Categories List */}
      <Typography variant="h6" gutterBottom>
        Existing Feature Categories
      </Typography>
      {featureCategories.map((fc) => (
        <Paper key={fc._id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">
            Category: {fc.category?.name}
          </Typography>
          <ul>
            {fc.features.map((f, idx) => (
              <li key={idx}>
                <strong>{f.title}:</strong> {f.description}{" "}
                {typeof f.icon === "string" && (
                  <img src={f.icon} alt={f.title} style={{ width: 40, marginLeft: 8 }} />
                )}
              </li>
            ))}
          </ul>
          <Box>
            <Button
              startIcon={<Edit />}
              size="small"
              sx={{ mr: 1 }}
              onClick={() => handleEdit(fc)}
            >
              Edit
            </Button>
            <Button
              startIcon={<Delete />}
              size="small"
              color="error"
              onClick={() => handleDelete(fc._id)}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default FeatureCategoryManager;
