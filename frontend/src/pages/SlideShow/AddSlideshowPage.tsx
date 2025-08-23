import React, { useState } from "react";
import { TextField, Button, Typography, MenuItem } from "@mui/material";
import axios from "axios";
import { BASE_API_URL } from "../../App"; // Update this to your API's base URL

const AddSlideshowPage = () => {
  const [subtitle, setSubtitle] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("Shop Now");
  const [ctaLink, setCtaLink] = useState("/");
  const [tags, setTags] = useState("doors");
  const [order, setOrder] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("subtitle", subtitle);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("ctaText", ctaText);
    formData.append("ctaLink", ctaLink);
    formData.append("tags", tags);
    formData.append("order", order.toString());
    formData.append("image", image);

    axios
      .post(`${BASE_API_URL}/slideshow`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Slide added successfully!");
        setSubtitle("");
        setTitle("");
        setDescription("");
        setCtaText("Shop Now");
        setCtaLink("/");
        setTags("doors");
        setOrder(0);
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
            label="Subtitle"
            variant="outlined"
            fullWidth
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            required
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
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <TextField
            label="CTA Text"
            variant="outlined"
            fullWidth
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <TextField
            label="CTA Link"
            variant="outlined"
            fullWidth
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <TextField
            select
            label="Tags"
            variant="outlined"
            fullWidth
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          >
            <MenuItem value="doors">Doors</MenuItem>
            <MenuItem value="frames">Frames</MenuItem>
            <MenuItem value="hardware">Hardware</MenuItem>
            <MenuItem value="main page">Main Page</MenuItem>
          </TextField>
        </div>
        <div className="mb-3">
          <TextField
            type="number"
            label="Order"
            variant="outlined"
            fullWidth
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
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
