import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../App"; // Ensure this is the correct import path
import { Button, TextField, Select, MenuItem, CircularProgress, Typography, InputLabel, FormControl, FormHelperText } from "@mui/material";

interface SubCategory {
  _id: string;
  name: string;
  image: string; // Assuming this is the URL from Cloudinary
  category: {
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

const Subcategories: React.FC = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    category: "",
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/categories`);
      console.log("Fetched Categories:", response.data); // Log categories
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Fetch all subcategories
  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/subcategories`);
      console.log("Fetched SubCategories:", response.data); // Log subcategories
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories", error);
    }
  };

  // Handle image file change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log("Selected Image File:", event.target.files[0]); // Log selected image file
      setNewSubCategory({ ...newSubCategory, image: event.target.files[0] });
    }
  };

  // Handle form submission for creating a new subcategory
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
    
    if (!newSubCategory.name || !newSubCategory.category || !newSubCategory.image) {
      console.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", newSubCategory.name);
    formData.append("category", newSubCategory.category);
    formData.append("image", newSubCategory.image);

    // Log form data before submission
    console.log("Form Data to Submit:");
    console.log("Name:", newSubCategory.name);
    console.log("Category:", newSubCategory.category);
    console.log("Image File:", newSubCategory.image);

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_API_URL}/subcategories`, // Ensure the URL matches your backend route for subcategories
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      console.log("Subcategory created successfully:", response.data); // Log response data from server
      setNewSubCategory({ name: "", category: "", image: null }); // Reset form fields
      fetchSubCategories(); // Refresh list
    } catch (error) {
      console.error("Error creating subcategory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching categories and subcategories...");
    fetchCategories();
    fetchSubCategories();
  }, []);

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <Typography variant="h4" className="text-center mb-6">SubCategories</Typography>

      <Typography variant="h5" className="mb-4">Create a New SubCategory</Typography>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <TextField
            label="SubCategory Name"
            value={newSubCategory.name}
            onChange={(e) =>
              setNewSubCategory({ ...newSubCategory, name: e.target.value })
            }
            fullWidth
            required
          />
        </div>

        <div className="flex flex-col">
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={newSubCategory.category}
              onChange={(e) =>
                setNewSubCategory({ ...newSubCategory, category: e.target.value })
              }
            >
              <MenuItem value="">Select Category</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Choose a category for the subcategory</FormHelperText>
          </FormControl>
        </div>

        <div className="flex flex-col">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="border p-2"
          />
        </div>

        <div className="text-center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className="w-full"
          >
            {loading ? <CircularProgress size={24} /> : "Create SubCategory"}
          </Button>
        </div>
      </form>

      <Typography variant="h5" className="mt-8 mb-4">All SubCategories</Typography>
      {subCategories.length > 0 ? (
        <ul className="space-y-4">
          {subCategories.map((subCategory) => (
            <li key={subCategory._id} className="border p-4 rounded-lg flex flex-col items-center">
              <Typography variant="h6">{subCategory.name}</Typography>
              <Typography variant="body1">Category: {subCategory.category.name}</Typography>
              <img
                src={subCategory.image} // Assuming the image URL is returned from backend
                alt={subCategory.name}
                className="mt-2 w-24 h-24 object-cover rounded-md"
              />
            </li>
          ))}
        </ul>
      ) : (
        <Typography>No subcategories found.</Typography>
      )}
    </div>
  );
};

export default Subcategories;
