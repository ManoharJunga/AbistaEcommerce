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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);


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

  // Submit form (Create or Update)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !newSubCategory.name ||
      !newSubCategory.slug ||
      !newSubCategory.description ||
      !newSubCategory.categoryId
    ) {
      console.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", newSubCategory.name);
    formData.append("slug", newSubCategory.slug);
    formData.append("description", newSubCategory.description);
    formData.append("categoryId", newSubCategory.categoryId);
    if (newSubCategory.image) {
      formData.append("image", newSubCategory.image);
    }

    try {
      setLoading(true);

      if (editingId) {
        // Update subcategory
        const response = await axios.put(
          `${BASE_API_URL}/subcategories/${editingId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Subcategory updated:", response.data);
      } else {
        // Create new subcategory
        const response = await axios.post(
          `${BASE_API_URL}/subcategories`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Subcategory created:", response.data);
      }

      // Reset form
      setNewSubCategory({
        name: "",
        slug: "",
        description: "",
        categoryId: "",
        image: null,
      });
      setEditingId(null);
      fetchSubCategories();
    } catch (error) {
      console.error("Error saving subcategory:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (subcategory: SubCategory) => {
    setEditingId(subcategory._id);

    setNewSubCategory({
      name: subcategory.name || "",
      slug: subcategory.slug || "",
      description: subcategory.description || "",
      categoryId:
        typeof subcategory.categoryId === "string"
          ? subcategory.categoryId
          : subcategory.categoryId?._id || "",
      image: null, // reset so user can choose new file
    });

    // keep the existing image for preview
    setPreviewImage(subcategory.image || null);
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
        {editingId ? "Edit SubCategory" : "Create a New SubCategory"}
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

        {/* Slug */}
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
          onChange={(e) => {
            handleImageChange(e);
            if (e.target.files && e.target.files[0]) {
              setPreviewImage(URL.createObjectURL(e.target.files[0])); // preview new file
            }
          }}
          className="border p-2"
        />

        {/* Show preview image */}
        {previewImage && (
          <div className="mt-2">
            <Typography variant="body2">Current Image:</Typography>
            <img
              src={previewImage}
              alt="Subcategory preview"
              className="mt-1 w-32 h-32 object-cover rounded-md border"
            />
          </div>
        )}


        {/* Submit Button */}
        <div className="text-center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : editingId ? (
              "Update SubCategory"
            ) : (
              "Create SubCategory"
            )}
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
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleEdit(subCategory)}
                className="mt-2"
              >
                Edit
              </Button>
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
