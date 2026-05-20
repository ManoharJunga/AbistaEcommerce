import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../App";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Image as ImageIcon, 
  X, 
  Loader2,
  AlertCircle 
} from "lucide-react";

const Categories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [newCategory, setNewCategory] = useState({
        name: "",
        slug: "",
        description: "",
        image: null as File | null,
        preview: "" as string, 
    });
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_API_URL}/categories`);
            setCategories(response.data);
        } catch (err) {
            setError("Failed to fetch categories. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewCategory({
                ...newCategory,
                image: file,
                preview: URL.createObjectURL(file),
            });
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData();
        formData.append("name", newCategory.name);
        formData.append("slug", newCategory.slug);
        formData.append("description", newCategory.description);
        if (newCategory.image) {
            formData.append("image", newCategory.image);
        }

        try {
            if (editingCategory) {
                await axios.put(
                    `${BASE_API_URL}/categories/${editingCategory._id}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                setEditingCategory(null);
            } else {
                await axios.post(`${BASE_API_URL}/categories`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            fetchCategories();
            setNewCategory({ name: "", slug: "", description: "", image: null, preview: "" });
        } catch (err) {
            setError("Failed to save category. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        
        try {
            await axios.delete(`${BASE_API_URL}/categories/${id}`);
            fetchCategories();
        } catch (err) {
            setError("Failed to delete category.");
        }
    };

    const handleEditCategory = (category: any) => {
        setEditingCategory(category);
        setNewCategory({
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: null,
            preview: category.image || "",
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredCategories = useMemo(() => {
        return categories.filter(cat => 
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500">Manage your product organization and taxonomy</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search categories..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {error && (
                <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800">
                                {editingCategory ? "Edit Category" : "Create New"}
                            </h2>
                            {editingCategory && (
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setEditingCategory(null);
                                        setNewCategory({ name: "", slug: "", description: "", image: null, preview: "" });
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newCategory.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Living Room"
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={newCategory.slug}
                                    onChange={handleInputChange}
                                    placeholder="living-room"
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={newCategory.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe this category..."
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors cursor-pointer relative">
                                    <div className="space-y-1 text-center">
                                        {newCategory.preview ? (
                                            <div className="relative group">
                                                <img src={newCategory.preview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-md" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                    <p className="text-white text-xs">Change Image</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <span className="text-blue-600 font-medium">Upload a file</span>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                            </>
                                        )}
                                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingCategory ? "Update Category" : "Create Category")}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Slug</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading && categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                                                Loading categories...
                                            </td>
                                        </tr>
                                    ) : filteredCategories.length > 0 ? (
                                        filteredCategories.map((category) => (
                                            <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                                            {category.image ? (
                                                                <img src={category.image} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <ImageIcon className="text-gray-300 w-6 h-6" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{category.name}</div>
                                                            <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{category.description}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono lowercase">
                                                        {category.slug}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditCategory(category)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCategory(category._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                                                        <Plus className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                    <p className="text-gray-500 font-medium">No categories found</p>
                                                    <p className="text-gray-400 text-sm">Try adjusting your search or add a new category.</p>
                                                </div>
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

export default Categories;