import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";

import { BASE_API_URL } from "../../App";// Update this to your API's base URL

const AddSlideshowPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("name", name);
    formData.append("tags", tags);
    formData.append("image", image);

    axios
      .post(`${BASE_API_URL}/slideshow`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Slide added successfully!");
        setTitle("");
        setDescription("");
        setName("");
        setTags("");
        setImage(null);
      })
      .catch((error) => {
        console.error("Error adding slide:", error.response?.data || error.message);
        alert("Failed to add slide.");
      });
  };

  return (
    <div className="container mt-5">
      <Typography variant="h4" className="mb-4 text-center">
        Add a New Slide
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <TextField
            label="Tags (comma-separated)"
            variant="outlined"
            fullWidth
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="mt-3"
        >
          Upload Slide
        </Button>
      </form>
    </div>
  );
};

export default AddSlideshowPage;
