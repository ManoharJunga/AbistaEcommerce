import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../App";

const Categories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState({
        name: "",
        slug: "",
        description: "",
        image: null as File | null,
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
            setError("Failed to fetch categories.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewCategory({ ...newCategory, image: e.target.files[0] });
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("name", newCategory.name);
    formData.append("slug", newCategory.slug);
    formData.append("description", newCategory.description);
    if (newCategory.image) {
        formData.append("image", newCategory.image);
    }

    try {
        if (editingCategory) {
            console.log("➡️ Sending PUT request to update:", editingCategory._id);
            await axios.put(`${BASE_API_URL}/categories/${editingCategory._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("✅ Update request successful");
            setEditingCategory(null);
        } else {
            console.log("➡️ Sending POST request to add new category");
            await axios.post(`${BASE_API_URL}/categories`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("✅ New category added");
        }
        fetchCategories();
        setNewCategory({ name: "", slug: "", description: "", image: null });
    } catch (err) {
        console.error("🔥 Error saving category:", err);
        setError("Failed to save category.");
    }
};

const handleDeleteCategory = async (id: string) => {
    try {
        console.log("➡️ Sending DELETE request for ID:", id);
        await axios.delete(`${BASE_API_URL}/categories/${id}`);
        console.log("✅ Delete request successful");
        fetchCategories();
    } catch (err) {
        console.error("🔥 Error deleting category:", err);
        setError("Failed to delete category.");
    }
};

const handleEditCategory = (category: any) => {
    console.log("✏️ Editing category:", category);
    setEditingCategory(category);
    setNewCategory({
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: null,
    });
};


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Product Categories</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Add or Edit Category Form */}
            <form onSubmit={handleAddCategory} className="bg-white p-4 shadow-md rounded mb-6">
                <h2 className="text-xl font-semibold mb-2">
                    {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>

                <input
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleInputChange}
                    placeholder="Category Name"
                    className="border p-2 rounded mb-4 w-full"
                    required
                />

                <input
                    type="text"
                    name="slug"
                    value={newCategory.slug}
                    onChange={handleInputChange}
                    placeholder="Category Slug (e.g. wooden-doors)"
                    className="border p-2 rounded mb-4 w-full"
                    required
                />

                <textarea
                    name="description"
                    value={newCategory.description}
                    onChange={handleInputChange}
                    placeholder="Category Description"
                    className="border p-2 rounded mb-4 w-full"
                    rows={3}
                />

                <input
                    type="file"
                    onChange={handleFileChange}
                    className="border p-2 rounded mb-4 w-full"
                    accept="image/*"
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
                >
                    {editingCategory ? "Save Changes" : "Add Category"}
                </button>
            </form>

            {/* Categories List */}
            <h2 className="text-xl font-semibold mb-4">Categories List</h2>
            {loading ? (
                <p>Loading categories...</p>
            ) : (
                <ul className="space-y-4">
                    {categories.map((category) => (
                        <li
                            key={category._id}
                            className="flex items-center justify-between bg-gray-100 p-4 rounded shadow"
                        >
                            <div className="flex items-center space-x-4">
                                {category.image && (
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-16 h-16 rounded"
                                    />
                                )}
                                <div>
                                    <p className="font-semibold">{category.name}</p>
                                    <p className="text-gray-500 text-sm">{category.slug}</p>
                                    <p className="text-gray-600 text-xs">{category.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleEditCategory(category)}
                                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(category._id)}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Categories;
