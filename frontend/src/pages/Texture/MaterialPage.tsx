import React, { useState, useEffect } from "react";
import axios from "axios";

interface Material {
  _id: string;
  name: string;
}

const MaterialPage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch materials
  const fetchMaterials = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/materials");
      setMaterials(res.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Add material
  const addMaterial = async () => {
    if (!newMaterial.trim()) return;
    try {
      if (editId) {
        await axios.put(`http://localhost:8000/api/materials/${editId}`, { name: newMaterial });
        setEditId(null);
      } else {
        await axios.post("http://localhost:8000/api/materials", { name: newMaterial });
      }
      setNewMaterial("");
      fetchMaterials();
    } catch (error) {
      console.error("Error saving material:", error);
    }
  };

  // Edit material
  const editMaterial = (material: Material) => {
    setNewMaterial(material.name);
    setEditId(material._id);
  };

  // Delete material
  const deleteMaterial = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/materials/${id}`);
      fetchMaterials();
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Materials</h2>
      <div>
        <input
          type="text"
          value={newMaterial}
          onChange={(e) => setNewMaterial(e.target.value)}
          placeholder="Enter material name"
        />
        <button onClick={addMaterial}>{editId ? "Update" : "Add"}</button>
      </div>

      <ul>
        {materials.map((material) => (
          <li key={material._id}>
            {material.name}
            <button onClick={() => editMaterial(material)}>Edit</button>
            <button onClick={() => deleteMaterial(material._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaterialPage;
