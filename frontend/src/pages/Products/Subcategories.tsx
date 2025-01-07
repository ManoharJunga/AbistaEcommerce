import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { BASE_API_URL } from "../../App"; // Base API URL

const Subcategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", image: null, category: "" });
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/subcategories`);
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleOpen = (id = "") => {
    if (id) {
      setEditMode(true);
      const subCategory = subCategories.find((sub) => sub._id === id);
      setFormData({
        name: subCategory.name,
        image: null,
        category: subCategory.category._id,
        imagePreview: subCategory.image,
      });
      setSelectedId(id);
    } else {
      setEditMode(false);
      setFormData({ name: "", image: null, category: "", imagePreview: null });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", image: null, category: "", imagePreview: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      if (formData.image) data.append("image", formData.image);
      data.append("category", formData.category);

      if (editMode) {
        await axios.put(`${BASE_API_URL}/subcategories/${selectedId}`, data);
      } else {
        await axios.post(`${BASE_API_URL}/subcategories`, data);
      }

      fetchSubCategories();
      handleClose();
    } catch (error) {
      console.error("Error saving subcategory", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_API_URL}/subcategories/${id}`);
      setSubCategories(subCategories.filter((sub) => sub._id !== id));
    } catch (error) {
      console.error("Error deleting subcategory", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Subcategories</h1>
      <p className="mb-6">Manage your product subcategories here.</p>

      <Button
        variant="contained"
        color="primary"
        className="mb-4"
        onClick={() => handleOpen()}
        startIcon={<Add />}
      >
        Add Subcategory
      </Button>

      {loading ? (
        <div className="flex justify-center mt-6">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subCategories.map((sub) => (
                <TableRow key={sub._id}>
                  <TableCell>{sub.name}</TableCell>
                  <TableCell>{sub.category ? sub.category.name : "No Category"}</TableCell>
                  <TableCell>
                    {sub.image && <img src={sub.image} alt={sub.name} width="50" />}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(sub._id)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(sub._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={open} onClose={handleClose}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{editMode ? "Edit Subcategory" : "Add Subcategory"}</h2>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mb-4"
              />
              <FormControl fullWidth className="mb-4">
                <InputLabel>Category</InputLabel>
                <Select name="category" value={formData.category} onChange={handleChange} required>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formData.imagePreview && (
                <img src={formData.imagePreview} alt="Preview" width="50" className="mb-4" />
              )}
              <input type="file" name="image" onChange={handleChange} className="mb-4" />
              <Button type="submit" variant="contained" color="primary" className="w-full">
                {loading ? <CircularProgress size={24} /> : editMode ? "Update" : "Add"}
              </Button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Subcategories;
