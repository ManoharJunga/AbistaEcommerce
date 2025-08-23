import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, CardMedia, Typography, Grid, Chip, Stack } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_API_URL } from "../../App";

const SlideshowPage: React.FC = () => {
  const [slides, setSlides] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${BASE_API_URL}/slideshow`)
      .then((response) => {
        // sort by order before rendering
        const sortedSlides = response.data.sort((a: any, b: any) => a.order - b.order);
        setSlides(sortedSlides);
      })
      .catch((error) => {
        console.error("Error fetching slides:", error);
      });
  }, []);

  const handleDelete = (id: string) => {
    axios.delete(`${BASE_API_URL}/slideshow/${id}`)
      .then(() => {
        setSlides(slides.filter(slide => slide._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting slide:", error);
      });
  };

  return (
    <div className="container mt-5">
      <Typography variant="h4" className="mb-4 text-center">
        Manage Slideshows
      </Typography>
      <Grid container spacing={4}>
        {slides.map((slide) => (
          <Grid item xs={12} sm={6} md={4} key={slide._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
              <CardMedia
                component="img"
                height="250"
                src={slide.image}
                alt={slide.title}
                sx={{ objectFit: "cover", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
              />
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {slide.subtitle}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {slide.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {slide.description}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip label={slide.tags} color="primary" size="small" />
                  <Chip label={`Order: ${slide.order}`} variant="outlined" size="small" />
                </Stack>

                <Button
                  variant="contained"
                  color="primary"
                  href={slide.ctaLink}
                  target="_blank"
                  fullWidth
                  sx={{ mb: 2, textTransform: "none" }}
                >
                  {slide.ctaText || "Shop Now"}
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={() => handleDelete(slide._id)}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "red",
                    "&:hover": { backgroundColor: "#ff3333" },
                  }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default SlideshowPage;
