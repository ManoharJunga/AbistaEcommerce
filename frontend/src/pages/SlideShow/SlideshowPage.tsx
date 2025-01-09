import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_API_URL } from "../../App";

const SlideshowPage: React.FC = () => {
  const [slides, setSlides] = useState<any[]>([]);

  useEffect(() => {
    // Fetch slides from the server
    axios.get(`${BASE_API_URL}/slideshow`)
      .then((response) => {
        setSlides(response.data);
      })
      .catch((error) => {
        console.error("Error fetching slides:", error);
      });
  }, []);

  const handleDelete = (id: string) => {
    // Delete slide by ID
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
      <Typography variant="h4" className="mb-4 text-center">Manage Slideshows</Typography>
      <Grid container spacing={4}>
        {slides.map((slide) => (
          <Grid item xs={12} sm={6} md={4} key={slide._id}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="250"
                src={slide.image}  // Use src={slide.image} here
                alt={slide.title}
                sx={{ objectFit: 'cover', borderRadius: '4px' }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {slide.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {slide.description}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  className="mt-3"
                  onClick={() => handleDelete(slide._id)}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: 'red',
                    '&:hover': {
                      backgroundColor: '#ff3333',
                    },
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
