// src/pages/details/TermsPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

interface Terms {
  _id?: string;
  lastUpdated: string;
  acceptanceOfTerms: string;
  useLicense: string[];
  accountTerms: {
    accountCreation: string;
    accountResponsibilities: string;
  };
  purchaseTerms: {
    productInformation: string;
    pricingAndPayment: string;
    orderAcceptance: string;
    shippingAndReturns: string;
  };
  prohibitedUses: string[];
  disclaimer: string;
  limitations: string;
  governingLaw: string;
  contactInformation: {
    email: string;
    phone: string;
    address: string;
  };
}

export default function TermsPage() {
  const [terms, setTerms] = useState<Terms>({
    lastUpdated: "",
    acceptanceOfTerms: "",
    useLicense: [""],
    accountTerms: {
      accountCreation: "",
      accountResponsibilities: "",
    },
    purchaseTerms: {
      productInformation: "",
      pricingAndPayment: "",
      orderAcceptance: "",
      shippingAndReturns: "",
    },
    prohibitedUses: [""],
    disclaimer: "",
    limitations: "",
    governingLaw: "",
    contactInformation: {
      email: "",
      phone: "",
      address: "",
    },
  });

  const [loading, setLoading] = useState(false);

  // Fetch existing terms (only one)
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/terms-of-service");
        if (res.data && res.data.length > 0) {
          setTerms(res.data[0]); // first entry only
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
      }
    };
    fetchTerms();
  }, []);

  // handleChange for simple string fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTerms((prev) => ({ ...prev, [name]: value }));
  };

  // handleChange for nested objects
  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    parent: string
  ) => {
    const { name, value } = e.target;
    setTerms((prev) => ({
      ...prev,
      [parent]: { ...prev[parent as keyof Terms], [name]: value },
    }));
  };

  // handleChange for arrays
  const handleArrayChange = (
    index: number,
    value: string,
    field: "useLicense" | "prohibitedUses"
  ) => {
    setTerms((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addArrayField = (field: "useLicense" | "prohibitedUses") => {
    setTerms((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (index: number, field: "useLicense" | "prohibitedUses") => {
    setTerms((prev) => {
      const updated = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: updated.length ? updated : [""] }; // keep at least 1
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (terms._id) {
        await axios.put(`http://localhost:8000/api/terms-of-service/${terms._id}`, terms);
        alert("Terms updated successfully!");
      } else {
        const res = await axios.post("http://localhost:8000/api/terms-of-service", terms);
        setTerms(res.data);
        alert("Terms added successfully!");
      }
    } catch (error) {
      console.error("Error saving terms:", error);
      alert("Failed to save terms.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom>
        Manage Terms of Service
      </Typography>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Last Updated"
          name="lastUpdated"
          value={terms.lastUpdated}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Acceptance of Terms"
          name="acceptanceOfTerms"
          value={terms.acceptanceOfTerms}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />

        {/* Use License */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Use License
        </Typography>
        {terms.useLicense.map((item, index) => (
          <Grid container spacing={1} alignItems="center" key={index}>
            <Grid item xs={11}>
              <TextField
                label={`Use License #${index + 1}`}
                value={item}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, "useLicense")
                }
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={() => removeArrayField(index, "useLicense")}>
                <RemoveCircle color="error" />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddCircle />}
          onClick={() => addArrayField("useLicense")}
          sx={{ mb: 2 }}
        >
          Add Use License
        </Button>

        {/* Account Terms */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Account Terms
        </Typography>
        <TextField
          label="Account Creation"
          name="accountCreation"
          value={terms.accountTerms.accountCreation}
          onChange={(e) => handleNestedChange(e, "accountTerms")}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Account Responsibilities"
          name="accountResponsibilities"
          value={terms.accountTerms.accountResponsibilities}
          onChange={(e) => handleNestedChange(e, "accountTerms")}
          fullWidth
          margin="normal"
        />

        {/* Purchase Terms */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Purchase Terms
        </Typography>
        <TextField
          label="Product Information"
          name="productInformation"
          value={terms.purchaseTerms.productInformation}
          onChange={(e) => handleNestedChange(e, "purchaseTerms")}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Pricing and Payment"
          name="pricingAndPayment"
          value={terms.purchaseTerms.pricingAndPayment}
          onChange={(e) => handleNestedChange(e, "purchaseTerms")}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Order Acceptance"
          name="orderAcceptance"
          value={terms.purchaseTerms.orderAcceptance}
          onChange={(e) => handleNestedChange(e, "purchaseTerms")}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Shipping and Returns"
          name="shippingAndReturns"
          value={terms.purchaseTerms.shippingAndReturns}
          onChange={(e) => handleNestedChange(e, "purchaseTerms")}
          fullWidth
          margin="normal"
        />

        {/* Prohibited Uses */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Prohibited Uses
        </Typography>
        {terms.prohibitedUses.map((item, index) => (
          <Grid container spacing={1} alignItems="center" key={index}>
            <Grid item xs={11}>
              <TextField
                label={`Prohibited Use #${index + 1}`}
                value={item}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, "prohibitedUses")
                }
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton
                onClick={() => removeArrayField(index, "prohibitedUses")}
              >
                <RemoveCircle color="error" />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddCircle />}
          onClick={() => addArrayField("prohibitedUses")}
          sx={{ mb: 2 }}
        >
          Add Prohibited Use
        </Button>

        {/* Rest fields */}
        <TextField
          label="Disclaimer"
          name="disclaimer"
          value={terms.disclaimer}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Limitations"
          name="limitations"
          value={terms.limitations}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Governing Law"
          name="governingLaw"
          value={terms.governingLaw}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Contact Info */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Contact Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={terms.contactInformation.email}
              onChange={(e) => handleNestedChange(e, "contactInformation")}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              name="phone"
              value={terms.contactInformation.phone}
              onChange={(e) => handleNestedChange(e, "contactInformation")}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={terms.contactInformation.address}
              onChange={(e) => handleNestedChange(e, "contactInformation")}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {terms._id ? "Update Terms" : "Add Terms"}
        </Button>
      </form>

      {/* Preview */}
      <Paper elevation={3} sx={{ p: 3, mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Preview
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
          Last Updated: {terms.lastUpdated}
        </Typography>
        <Typography variant="h6">Acceptance of Terms</Typography>
        <p>{terms.acceptanceOfTerms}</p>
        <Typography variant="h6">Use License</Typography>
        <ul>
          {terms.useLicense.map((u, i) => (
            <li key={i}>{u}</li>
          ))}
        </ul>
        <Typography variant="h6">Account Terms</Typography>
        <p>
          <strong>Account Creation:</strong> {terms.accountTerms.accountCreation}
        </p>
        <p>
          <strong>Responsibilities:</strong>{" "}
          {terms.accountTerms.accountResponsibilities}
        </p>
        <Typography variant="h6">Purchase Terms</Typography>
        <p>
          <strong>Product Info:</strong>{" "}
          {terms.purchaseTerms.productInformation}
        </p>
        <p>
          <strong>Pricing:</strong> {terms.purchaseTerms.pricingAndPayment}
        </p>
        <p>
          <strong>Order Acceptance:</strong>{" "}
          {terms.purchaseTerms.orderAcceptance}
        </p>
        <p>
          <strong>Shipping:</strong> {terms.purchaseTerms.shippingAndReturns}
        </p>
        <Typography variant="h6">Prohibited Uses</Typography>
        <ul>
          {terms.prohibitedUses.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <Typography variant="h6">Disclaimer</Typography>
        <p>{terms.disclaimer}</p>
        <Typography variant="h6">Limitations</Typography>
        <p>{terms.limitations}</p>
        <Typography variant="h6">Governing Law</Typography>
        <p>{terms.governingLaw}</p>
        <Typography variant="h6">Contact</Typography>
        <p>Email: {terms.contactInformation.email}</p>
        <p>Phone: {terms.contactInformation.phone}</p>
        <p>Address: {terms.contactInformation.address}</p>
      </Paper>
    </Container>
  );
}
