import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface FAQ {
  _id: string;
  category: string;
  question: string;
  answer: string;
}

const FaqEntryPage: React.FC = () => {
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const categories = [
    "Orders & Shipping",
    "Returns & Exchanges",
    "Account & Payment",
    "Products & Pricing",
  ];

  // Fetch FAQs from backend
  const fetchFAQs = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/faqs");
      setFaqs(res.data);
    } catch (error) {
      console.error("Failed to fetch FAQs", error);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Handle new FAQ submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !question || !answer) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/faqs", {
        category,
        question,
        answer,
      });

      alert("FAQ added successfully ✅");
      setCategory("");
      setQuestion("");
      setAnswer("");
      fetchFAQs(); // Refresh FAQs after adding new one
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add FAQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} bgcolor="#f4f6f8" minHeight="100vh">
      {/* Entry Form */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Paper elevation={4} sx={{ p: 4, maxWidth: 500, width: "100%" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Add New FAQ
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Category */}
            <TextField
              select
              label="Category"
              fullWidth
              margin="normal"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            {/* Question */}
            <TextField
              label="Question"
              fullWidth
              margin="normal"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            {/* Answer */}
            <TextField
              label="Answer"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add FAQ"}
            </Button>
          </form>
        </Paper>
      </Box>

      {/* FAQ List */}
      <Box maxWidth={700} mx="auto">
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          All FAQs
        </Typography>

        {faqs.map((faq) => (
          <Accordion key={faq._id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                <strong>Category:</strong> {faq.category}
              </Typography>
              <Typography mt={1}>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default FaqEntryPage;
