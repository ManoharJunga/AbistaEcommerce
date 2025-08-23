import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../App";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string; // Cloudinary URL
  categoryId: {
    _id: string;
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
    slug: "",
    description: "",
    categoryId: "",
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/subcategories`);
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories", error);
    }
  };

  // Handle image change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewSubCategory({ ...newSubCategory, image: event.target.files[0] });
    }
  };

  // Auto-generate slug when name changes
  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    setNewSubCategory({ ...newSubCategory, name, slug });
  };

  // Submit form
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !newSubCategory.name ||
      !newSubCategory.slug ||
      !newSubCategory.description ||
      !newSubCategory.categoryId ||
      !newSubCategory.image
    ) {
      console.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", newSubCategory.name);
    formData.append("slug", newSubCategory.slug);
    formData.append("description", newSubCategory.description);
    formData.append("categoryId", newSubCategory.categoryId);
    formData.append("image", newSubCategory.image);

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_API_URL}/subcategories`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Subcategory created:", response.data);
      setNewSubCategory({
        name: "",
        slug: "",
        description: "",
        categoryId: "",
        image: null,
      });
      fetchSubCategories();
    } catch (error) {
      console.error("Error creating subcategory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <Typography variant="h4" className="text-center mb-6">
        SubCategories
      </Typography>

      <Typography variant="h5" className="mb-4">
        Create a New SubCategory
      </Typography>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <TextField
          label="SubCategory Name"
          value={newSubCategory.name}
          onChange={(e) => handleNameChange(e.target.value)}
          fullWidth
          required
        />

        {/* Slug (auto-generated but editable) */}
        <TextField
          label="Slug"
          value={newSubCategory.slug}
          onChange={(e) =>
            setNewSubCategory({ ...newSubCategory, slug: e.target.value })
          }
          fullWidth
          required
        />

        {/* Description */}
        <TextField
          label="Description"
          value={newSubCategory.description}
          onChange={(e) =>
            setNewSubCategory({ ...newSubCategory, description: e.target.value })
          }
          fullWidth
          required
          multiline
          rows={3}
        />

        {/* Category Select */}
        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            value={newSubCategory.categoryId}
            onChange={(e) =>
              setNewSubCategory({ ...newSubCategory, categoryId: e.target.value })
            }
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Choose a category</FormHelperText>
        </FormControl>

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="border p-2"
        />

        {/* Submit Button */}
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

      <Typography variant="h5" className="mt-8 mb-4">
        All SubCategories
      </Typography>
      {subCategories.length > 0 ? (
        <ul className="space-y-4">
          {subCategories.map((subCategory) => (
            <li
              key={subCategory._id}
              className="border p-4 rounded-lg flex flex-col items-center"
            >
              <Typography variant="h6">{subCategory.name}</Typography>
              <Typography variant="body2">
                Slug: {subCategory.slug}
              </Typography>
              <Typography variant="body2">
                Category: {subCategory.categoryId?.name}
              </Typography>
              <Typography variant="body2">
                {subCategory.description}
              </Typography>
              <img
                src={subCategory.image}
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
