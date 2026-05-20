import React, { useState, useEffect, useMemo } from "react";
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
  Paper,
} from "@mui/material";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Image as ImageIcon, 
  X, 
  AlertCircle,
  Layers
} from "lucide-react";

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
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
  const [searchTerm, setSearchTerm] = useState("");
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
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      setError("Failed to load categories.");
    }
  };

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_API_URL}/subcategories`);
      setSubCategories(response.data);
    } catch (error) {
      setError("Failed to fetch subcategories.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setNewSubCategory({ ...newSubCategory, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
    setNewSubCategory({ ...newSubCategory, name, slug });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

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
        await axios.put(`${BASE_API_URL}/subcategories/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${BASE_API_URL}/subcategories`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setNewSubCategory({ name: "", slug: "", description: "", categoryId: "", image: null });
      setPreviewImage(null);
      setEditingId(null);
      fetchSubCategories();
    } catch (error) {
      setError("Error saving subcategory. Check all fields.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      await axios.delete(`${BASE_API_URL}/subcategories/${id}`);
      fetchSubCategories();
    } catch (error) {
      setError("Failed to delete subcategory.");
    }
  };

  const handleEdit = (subcategory: SubCategory) => {
    setEditingId(subcategory._id);
    setNewSubCategory({
      name: subcategory.name || "",
      slug: subcategory.slug || "",
      description: subcategory.description || "",
      categoryId: typeof subcategory.categoryId === "string" 
        ? subcategory.categoryId 
        : subcategory.categoryId?._id || "",
      image: null,
    });
    setPreviewImage(subcategory.image || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.categoryId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subCategories, searchTerm]);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="text-blue-600 w-6 h-6" />
            <h1 className="text-3xl font-bold text-gray-900">Subcategories</h1>
          </div>
          <p className="text-gray-500">Organize products within your primary categories</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <input 
            type="text" 
            placeholder="Search subcategories..."
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full md:w-72 bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {error && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl animate-in fade-in">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-4">
          <Paper elevation={0} className="p-6 rounded-2xl border border-gray-100 sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h6" className="font-bold">
                {editingId ? "Edit Subcategory" : "Create New"}
              </Typography>
              {editingId && (
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setNewSubCategory({ name: "", slug: "", description: "", categoryId: "", image: null });
                    setPreviewImage(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <TextField
                label="Name"
                value={newSubCategory.name}
                onChange={(e) => handleNameChange(e.target.value)}
                fullWidth
                required
                size="small"
              />

              <TextField
                label="Slug"
                value={newSubCategory.slug}
                onChange={(e) => setNewSubCategory({ ...newSubCategory, slug: e.target.value })}
                fullWidth
                required
                size="small"
                disabled // Usually slug is auto-generated
              />

              <FormControl fullWidth size="small" required>
                <InputLabel>Parent Category</InputLabel>
                <Select
                  value={newSubCategory.categoryId}
                  label="Parent Category"
                  onChange={(e) => setNewSubCategory({ ...newSubCategory, categoryId: e.target.value })}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Description"
                value={newSubCategory.description}
                onChange={(e) => setNewSubCategory({ ...newSubCategory, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
                size="small"
              />

              <div className="space-y-2">
                <Typography variant="caption" className="text-gray-500 font-medium ml-1">Cover Image</Typography>
                <div className="relative group border-2 border-dashed border-gray-200 rounded-xl p-4 transition-colors hover:border-blue-400">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  {previewImage ? (
                    <div className="relative h-32 w-full">
                      <img src={previewImage} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <ImageIcon className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <Plus className="text-gray-300 mb-2" />
                      <span className="text-xs text-gray-400">Click to upload image</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                className="py-3 rounded-xl bg-blue-600 hover:bg-blue-700 normal-case font-bold shadow-none"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : editingId ? "Save Changes" : "Add Subcategory"}
              </Button>
            </form>
          </Paper>
        </div>

        {/* List Column */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Subcategory</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Parent Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && subCategories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center">
                        <CircularProgress size={30} />
                      </td>
                    </tr>
                  ) : filteredSubCategories.length > 0 ? (
                    filteredSubCategories.map((sub) => (
                      <tr key={sub._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img src={sub.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                            <div>
                              <div className="font-bold text-gray-900">{sub.name}</div>
                              <div className="text-xs text-gray-400 font-mono">/{sub.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                            {sub.categoryId?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(sub)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(sub._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-20 text-center text-gray-400">
                        No subcategories found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subcategories;