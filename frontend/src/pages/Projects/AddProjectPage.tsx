import React, { useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../App"; // Import base URL
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const AddProjectPage: React.FC = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", title);
    if (image) formData.append("image", image);

    try {
      await axios.post(`${BASE_API_URL}/projects`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Project added successfully!");
      // Reset form
      setName("");
      setTitle("");
      setImage(null);
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h1 className="text-center mb-4">Add Project</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name:</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Title:</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Image:</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              required
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary w-50">
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectPage;
