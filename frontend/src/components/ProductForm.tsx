// ProductForm.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    MenuItem,
    Typography,
    Grid,
    Paper,
    Box,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    Chip,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    subCategory: string;
    images: string[];
    attributes?: {
        textures?: string[];
        finishes?: string[];
        materials?: string[];
    };
}

interface Category {
    _id: string;
    name: string;
}

interface SubCategory {
    _id: string;
    name: string;
}

interface Finish {
    _id: string;
    name: string;
}

interface Material {
    _id: string;
    name: string;
}

interface Texture {
    _id: string;
    name: string;
}

interface ProductFormProps {
    fetchProducts: () => void;
    editingProduct: Product | null;
    setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

const ProductForm: React.FC<ProductFormProps> = ({
    fetchProducts,
    editingProduct,
    setEditingProduct,
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const [textures, setTextures] = useState<Texture[]>([]);
    const [finishes, setFinishes] = useState<Finish[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);

    // Selected values
    const [selectedTextures, setSelectedTextures] = useState<string[]>([]);
    const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

    // Fetch categories
    useEffect(() => {
        axios
            .get('http://localhost:8000/api/categories')
            .then((res) => setCategories(res.data))
            .catch((err) => console.error('Error fetching categories', err));
    }, []);

    // Fetch subcategories
    useEffect(() => {
        if (category) {
            axios
                .get(`http://localhost:8000/api/subcategories?categoryId=${category}`)
                .then((res) => setSubCategories(res.data))
                .catch((err) => console.error('Error fetching subcategories', err));
        } else {
            setSubCategories([]);
        }
    }, [category]);

    // Fetch finishes, materials, textures
    useEffect(() => {
        axios.get('http://localhost:8000/api/finishes').then((res) => setFinishes(res.data));
        axios.get('http://localhost:8000/api/materials').then((res) => setMaterials(res.data));
        axios.get('http://localhost:8000/api/textures').then((res) => setTextures(res.data));
    }, []);

    // Pre-fill form on edit
    useEffect(() => {
        if (editingProduct) {
            setName(editingProduct.name || '');
            setDescription(editingProduct.description || '');
            setPrice(editingProduct.price?.toString() || '');
            setStock(editingProduct.stock?.toString() || '');
            setCategory(editingProduct.category || '');
            setSubCategory(editingProduct.subCategory || '');

            // Attributes
            const attributes = editingProduct.attributes || {};
            setSelectedFinishes(attributes.finishes || []);
            setSelectedMaterials(attributes.materials || []);
            setSelectedTextures(attributes.textures || []);

            // Handle images
            const mappedImages =
                editingProduct.images?.map(
                    (image: string) =>
                    ({
                        name: image,
                        size: 0,
                        type: 'image/jpeg',
                    } as File)
                ) || [];

            setUploadedFiles(mappedImages);
            setImages(mappedImages);
        } else {
            setName('');
            setDescription('');
            setPrice('');
            setStock('');
            setCategory('');
            setSubCategory('');
            setSelectedFinishes([]);
            setSelectedMaterials([]);
            setSelectedTextures([]);
            setUploadedFiles([]);
            setImages([]);
        }
    }, [editingProduct]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
        setImages((prevImages) => [...prevImages, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('price', price);
  formData.append('stock', stock);
  formData.append('category', category);
  formData.append('subCategory', subCategory);

  // ✅ Send attributes as one JSON object
  formData.append(
    'attributes',
    JSON.stringify({
      textures: selectedTextures,
      finishes: selectedFinishes,
      materials: selectedMaterials
    })
  );

  uploadedFiles.forEach((file) => formData.append('images', file));

  const apiEndpoint = editingProduct
    ? `http://localhost:8000/api/products/${editingProduct._id}`
    : 'http://localhost:8000/api/products/upload';
  const axiosMethod = editingProduct ? axios.put : axios.post;

  axiosMethod(apiEndpoint, formData)
    .then(() => {
      alert(editingProduct ? 'Product updated successfully' : 'Product uploaded successfully');
      setEditingProduct(null);
      fetchProducts();
    })
    .catch((error) => console.error('Error:', error));

  console.log("Submitted Form Data:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
};


    const handleRemoveImage = (index: number) => {
        setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    return (
        <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
            <Typography variant="h5" gutterBottom>
                {editingProduct ? 'Edit Product' : 'Create a New Product'}
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>

                    {/* Left Side: Input Fields */}
                    <Grid item xs={12} sm={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Name" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField label="Price" type="number" fullWidth required value={price} onChange={(e) => setPrice(e.target.value)} />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField label="Description" fullWidth required value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={2} />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <TextField label="Stock" type="number" fullWidth required value={stock} onChange={(e) => setStock(e.target.value)} />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <TextField select label="Category" fullWidth required value={category} onChange={(e) => setCategory(e.target.value)}>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <TextField select label="SubCategory" fullWidth required value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                                    {subCategories.map((subCat) => (
                                        <MenuItem key={subCat._id} value={subCat._id}>{subCat.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* New Attribute Dropdowns */}
                            {/* Attribute Multi Selects */}
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Textures</InputLabel>
                                    <Select
                                        multiple
                                        value={selectedTextures}
                                        onChange={(e) => setSelectedTextures(e.target.value as string[])}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {(selected as string[]).map((value) => {
                                                    const tex = textures.find((t) => t._id === value);
                                                    return <Chip key={value} label={tex?.name || value} />;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {textures.map((t) => (
                                            <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Finishes</InputLabel>
                                    <Select
                                        multiple
                                        value={selectedFinishes}
                                        onChange={(e) => setSelectedFinishes(e.target.value as string[])}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {(selected as string[]).map((value) => {
                                                    const fin = finishes.find((f) => f._id === value);
                                                    return <Chip key={value} label={fin?.name || value} />;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {finishes.map((f) => (
                                            <MenuItem key={f._id} value={f._id}>{f.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Materials</InputLabel>
                                    <Select
                                        multiple
                                        value={selectedMaterials}
                                        onChange={(e) => setSelectedMaterials(e.target.value as string[])}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {(selected as string[]).map((value) => {
                                                    const mat = materials.find((m) => m._id === value);
                                                    return <Chip key={value} label={mat?.name || value} />;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {materials.map((m) => (
                                            <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Right Side: Image Upload */}
                    <Grid item xs={12} sm={4}>
                        <Box {...getRootProps()} sx={{ border: '1px dashed gray', p: 2, textAlign: 'center', height: '100%' }}>
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <Typography>Drop the files here ...</Typography>
                            ) : (
                                <Typography>Drag & drop or click to upload</Typography>
                            )}
                        </Box>

                        {uploadedFiles.length > 0 && (
                            <Box mt={2}>
                                {uploadedFiles.map((file, index) => (
                                    <Box key={file.name} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                        <Avatar
                                            src={file instanceof File ? URL.createObjectURL(file) : file.name}
                                            alt={file.name}
                                            sx={{ width: 40, height: 40, mr: 1 }}
                                        />
                                        <Typography variant="body2">{file.name}</Typography>
                                        <Button onClick={() => handleRemoveImage(index)} color="error" size="small">Remove</Button>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={3}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            {editingProduct ? 'Update Product' : 'Upload Product'}
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </Paper>
    );
};

export default ProductForm;
