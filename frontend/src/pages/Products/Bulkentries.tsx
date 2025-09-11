import Container from "@mui/material/Container";
import ProductTableForm from "../../components/ProductBulkForm";
import axios from "axios";
import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: { _id: string; name: string };
  subCategory: { _id: string; name: string };
  sizes: Size[];
  attributes?: {
    textures?: { _id: string; name: string }[];
    finishes?: { _id: string; name: string }[];
    materials?: { _id: string; name: string }[];
  };
  specifications?: Specification[];
  images: string[];
  variants?: Variant[];
  averageRating: number;
  totalReviews: number;
}
interface Size {
  height: number;
  width: number;
  weight?: number;
}
interface Variant {
  name?: string;
  color?: string;
  images?: string[];
  stock?: number;
}
interface Specification {
  key: string;
  value: string;
}

const Bulkentries = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const fetchProducts = () => {
        axios
            .get("http://localhost:8000/api/products/get")
            .then((response) => {
                setProducts(response.data.products || []);
            })
            .catch((err) => console.error("Error fetching products", err));
    };


    return (
        <Container>
            <ProductTableForm fetchProducts={fetchProducts} />
        </Container>
    );
};

export default Bulkentries;
