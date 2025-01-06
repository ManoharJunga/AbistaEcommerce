import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../App";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: "", image: null });
    const [editingCategory, setEditingCategory] = useState<any>(null); // To track category being edited
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch categories on component load
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (newCategory.image) {
            formData.append("image", newCategory.image);
        }

        try {
            if (editingCategory) {
                // Update existing category
                await axios.put(`${BASE_API_URL}/categories/${editingCategory._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setEditingCategory(null); // Clear the edit mode
            } else {
                // Add new category
                await axios.post(`${BASE_API_URL}/categories`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            fetchCategories(); // Refresh the categories list
            setNewCategory({ name: "", image: null }); // Reset form
        } catch (err) {
            setError("Failed to save category.");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            await axios.delete(`${BASE_API_URL}/categories/${id}`);
            fetchCategories(); // Refresh the categories list
        } catch (err) {
            setError("Failed to delete category.");
        }
    };

    const handleEditCategory = (category: any) => {
        setEditingCategory(category); // Set the category to be edited
        setNewCategory({ name: category.name, image: null }); // Pre-fill the form with category data
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Product Categories</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Add or Edit Category Form */}
            <form onSubmit={handleAddCategory} className="bg-white p-4 shadow-md rounded mb-6">
                <h2 className="text-xl font-semibold mb-2">{editingCategory ? "Edit Category" : "Add New Category"}</h2>
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
                                <span className="font-semibold">{category.name}</span>
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
