import React, { useEffect, useState } from "react";
import axios from "axios";

interface Texture {
  _id: string;
  name: string;
}

const API_URL = "http://localhost:8000/api/textures"; // adjust your backend port

const TexturesPage: React.FC = () => {
  const [textures, setTextures] = useState<Texture[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch all textures
  const fetchTextures = async () => {
    try {
      const res = await axios.get<Texture[]>(API_URL);
      setTextures(res.data);
    } catch (error) {
      console.error("Error fetching textures:", error);
    }
  };

  useEffect(() => {
    fetchTextures();
  }, []);

  // Add or Update Texture
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update
        await axios.put(`${API_URL}/${editingId}`, { name });
        setEditingId(null);
      } else {
        // Create
        await axios.post(API_URL, { name });
      }
      setName("");
      fetchTextures();
    } catch (error) {
      console.error("Error saving texture:", error);
    }
  };

  // Edit
  const handleEdit = (texture: Texture) => {
    setEditingId(texture._id);
    setName(texture.name);
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTextures();
    } catch (error) {
      console.error("Error deleting texture:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Textures</h2>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Texture Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">{editingId ? "Update" : "Add"} Texture</button>
      </form>

      {/* List Textures */}
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {textures.map((texture) => (
            <tr key={texture._id}>
              <td>{texture.name}</td>
              <td>
                <button onClick={() => handleEdit(texture)}>Edit</button>
                <button onClick={() => handleDelete(texture._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {textures.length === 0 && (
            <tr>
              <td colSpan={2}>No textures found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TexturesPage;
