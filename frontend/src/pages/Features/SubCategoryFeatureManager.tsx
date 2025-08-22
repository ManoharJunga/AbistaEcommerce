import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  IconButton,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface FeatureSubCategory {
  _id: string;
  subCategory: { _id: string; name: string };
  features: Feature[];
}

interface SubCategory {
  _id: string;
  name: string;
}

const SubCategoryFeatureManager: React.FC = () => {
  const [featureSubCategories, setFeatureSubCategories] = useState<FeatureSubCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [features, setFeatures] = useState<Feature[]>([]);
  const [icons, setIcons] = useState<(File | null)[]>([]);

  const [editId, setEditId] = useState<string | null>(null);

  // Fetch all FeatureSubCategories and SubCategories
  useEffect(() => {
    fetchFeatureSubCategories();
    fetchSubCategories();
  }, []);

  const fetchFeatureSubCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/subcategory-features");
      setFeatureSubCategories(res.data);
    } catch (err) {
      console.error("Error fetching feature subcategories:", err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/subcategories");
      setSubCategories(res.data);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  // Add new feature block
  const addFeatureBlock = () => {
    setFeatures([...features, { title: "", description: "", icon: "" }]);
    setIcons([...icons, null]);
  };

  // Handle text input change
  const handleFeatureChange = (index: number, field: keyof Feature, value: string) => {
    const updated = [...features];
    updated[index][field] = value;
    setFeatures(updated);
  };

  // Handle icon file upload
  const handleIconChange = (index: number, file: File | null) => {
    const updatedIcons = [...icons];
    updatedIcons[index] = file;
    setIcons(updatedIcons);
  };

  // Submit (create or update)
  const handleSubmit = async () => {
    if (!selectedSubCategory || features.length === 0) {
      alert("Please select a subcategory and add at least one feature.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("subCategory", selectedSubCategory);
    formData.append("features", JSON.stringify(features));

    icons.forEach((file) => {
      if (file) formData.append("icons", file);
    });

    try {
      if (editId) {
        await axios.put(`http://localhost:8000/subcategory-features/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:8000/api/subcategory-features", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setSelectedSubCategory("");
      setFeatures([]);
      setIcons([]);
      setEditId(null);
      fetchFeatureSubCategories();
    } catch (err) {
      console.error("Error saving features:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit existing FeatureSubCategory
  const handleEdit = (fsc: FeatureSubCategory) => {
    setSelectedSubCategory(fsc.subCategory._id);
    setFeatures(fsc.features.map((f) => ({ title: f.title, description: f.description, icon: f.icon })));
    setIcons(fsc.features.map(() => null)); // reset icons (new upload optional)
    setEditId(fsc._id);
  };

  // Delete FeatureSubCategory
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this FeatureSubCategory?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/subcategory-features/${id}`);
      fetchFeatureSubCategories();
    } catch (err) {
      console.error("Error deleting FeatureSubCategory:", err);
    }
  };

  return (
    <Paper style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Manage SubCategory Features
      </Typography>

      <Grid container spacing={2}>
        {/* Select SubCategory */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Select SubCategory</InputLabel>
            <Select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
            >
              {subCategories.map((sub) => (
                <MenuItem key={sub._id} value={sub._id}>
                  {sub.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Features input blocks */}
      {features.map((feature, index) => (
        <Paper key={index} style={{ padding: "15px", marginTop: "15px" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                label="Feature Title"
                value={feature.title}
                onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Description"
                value={feature.description}
                onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                fullWidth
                multiline
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon size={18} />}
              >
                {icons[index] ? icons[index]?.name : "Upload Icon"}
                <input
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg"
                  hidden
                  onChange={(e) => handleIconChange(index, e.target.files?.[0] || null)}
                />
              </Button>
              {feature.icon && !icons[index] && (
                <img
                  src={feature.icon}
                  alt="feature icon"
                  style={{ width: 40, height: 40, marginTop: "5px" }}
                />
              )}
            </Grid>
          </Grid>
        </Paper>
      ))}

      {/* Add Feature Button */}
      <Button
        variant="outlined"
        color="secondary"
        onClick={addFeatureBlock}
        style={{ marginTop: "15px" }}
      >
        + Add Feature
      </Button>

      {/* Save Button */}
      <div style={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          startIcon={editId ? <Pencil size={18} /> : <Plus size={18} />}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : editId ? "Update" : "Save"}
        </Button>
      </div>

      {/* List of FeatureSubCategories */}
      <Typography variant="h6" style={{ marginTop: "30px" }}>
        Existing Feature SubCategories
      </Typography>
      <Grid container spacing={2} style={{ marginTop: "10px" }}>
        {featureSubCategories.map((fsc) => (
          <Grid item xs={12} sm={6} md={4} key={fsc._id}>
            <Paper style={{ padding: "10px" }}>
              <Typography variant="subtitle1">
                SubCategory: {fsc.subCategory.name}
              </Typography>
              {fsc.features.map((feat, i) => (
                <div key={i} style={{ marginTop: "10px" }}>
                  {feat.icon && (
                    <img
                      src={feat.icon}
                      alt="icon"
                      style={{ width: 30, height: 30, marginRight: "10px" }}
                    />
                  )}
                  <strong>{feat.title}</strong>
                  <p>{feat.description}</p>
                </div>
              ))}
              <div style={{ marginTop: "10px" }}>
                <IconButton onClick={() => handleEdit(fsc)}>
                  <Pencil size={18} />
                </IconButton>
                <IconButton onClick={() => handleDelete(fsc._id)}>
                  <Trash2 size={18} color="red" />
                </IconButton>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SubCategoryFeatureManager;
