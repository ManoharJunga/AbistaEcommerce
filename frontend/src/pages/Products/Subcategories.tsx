import React, { useState, useEffect } from "react";
import { Button, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { BASE_API_URL } from "../../App"; // Import the base API URL

const Subcategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", image: "", category: "" });
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  // Fetch subcategories from backend
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/subcategories`);
        setSubCategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories", error);
      }
    };

    fetchSubCategories();
  }, []);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open modal for creating or editing subcategory
  const handleOpen = (id: string = "") => {
    if (id) {
      setEditMode(true);
      const subCategory = subCategories.find((sub: any) => sub._id === id);
      setFormData({ name: subCategory.name, image: subCategory.image, category: subCategory.category._id });
      setSelectedId(id);
    } else {
      setEditMode(false);
      setFormData({ name: "", image: "", category: "" });
    }
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
  };

  // Create or update subcategory
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${BASE_API_URL}/subcategories/${selectedId}`, formData);
      } else {
        await axios.post(`${BASE_API_URL}/subcategories`, formData);
      }
      // Refresh subcategories list
      const response = await axios.get(`${BASE_API_URL}/subcategories`);
      setSubCategories(response.data);
      handleClose();
    } catch (error) {
      console.error("Error saving subcategory", error);
    }
  };

  // Delete subcategory
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_API_URL}/subcategories/${id}`);
      setSubCategories(subCategories.filter((sub: any) => sub._id !== id));
    } catch (error) {
      console.error("Error deleting subcategory", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Subcategories</h1>
      <p className="mb-6">View and manage product subcategories.</p>
      <Button
        variant="contained"
        color="primary"
        className="mb-4"
        onClick={() => handleOpen()}
        startIcon={<Add />}
      >
        Add Subcategory
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subcategory Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subCategories.map((sub: any) => (
              <TableRow key={sub._id}>
                <TableCell>{sub.name}</TableCell>
                <TableCell>{sub.category ? sub.category.name : "No Category"}</TableCell> {/* Check if category exists */}
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

      <Modal open={open} onClose={handleClose}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{editMode ? "Edit Subcategory" : "Add Subcategory"}</h2>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Subcategory Name"
                variant="outlined"
                fullWidth
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mb-4"
              />
              <TextField
                label="Image URL"
                variant="outlined"
                fullWidth
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="mb-4"
              />
              <TextField
                label="Category ID"
                variant="outlined"
                fullWidth
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mb-4"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-full"
              >
                {editMode ? "Update Subcategory" : "Add Subcategory"}
              </Button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Subcategories;
