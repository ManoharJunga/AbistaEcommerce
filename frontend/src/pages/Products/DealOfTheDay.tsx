import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

interface Product {
  _id: string;
  name: string;
  price: number;
  slug: string;
}

interface Deal {
  _id: string;
  dealPrice: number;
  startDate: string;
  endDate: string;
  product: Product;
}

const API_URL = "http://localhost:8000/api";

const DealOfTheDay: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  // form state
  const [product, setProduct] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dealPrice, setDealPrice] = useState<number>(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // fetch products
  useEffect(() => {
    axios
      .get(`${API_URL}/products/get`)
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error(err));
  }, []);

  // fetch existing deals
  const fetchDeals = () => {
    axios
      .get(`${API_URL}/deals`)
      .then((res) => setDeals(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // submit deal form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/deals`, {
        product,
        dealPrice,
        startDate,
        endDate,
      });
      setProduct("");
      setSelectedProduct(null);
      setDealPrice(0);
      setStartDate("");
      setEndDate("");
      fetchDeals();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Deal of the Day</h1>

      {/* ✅ Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4"
      >
        {/* Product Select */}
        <div>
          <label className="block font-medium mb-1">Select Product</label>
          <Select
            options={products.map((p) => ({
              value: p._id,
              label: `${p.name} (₹${p.price})`,
            }))}
            onChange={(selected) => {
              const chosen = products.find((p) => p._id === selected?.value) || null;
              setProduct(selected?.value || "");
              setSelectedProduct(chosen);
            }}
            value={
              product
                ? {
                    value: product,
                    label:
                      products.find((p) => p._id === product)?.name || "",
                  }
                : null
            }
            placeholder="Search & select product..."
            isSearchable
          />
        </div>

        {/* Show original price when product selected */}
        {selectedProduct && (
          <div>
            <label className="block font-medium mb-1">Original Price</label>
            <input
              type="number"
              className="w-full border rounded p-2 bg-gray-100"
              value={selectedProduct.price}
              readOnly
            />
          </div>
        )}

        {/* Deal Price */}
        <div>
          <label className="block font-medium mb-1">Deal Price</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={dealPrice}
            onChange={(e) => setDealPrice(Number(e.target.value))}
            required
          />
        </div>

        {/* Dates */}
        <div>
          <label className="block font-medium mb-1">Start Date</label>
          <input
            type="datetime-local"
            className="w-full border rounded p-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">End Date</label>
          <input
            type="datetime-local"
            className="w-full border rounded p-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Deal
        </button>
      </form>

      {/* ✅ Table of deals */}
      <h2 className="text-xl font-semibold mb-3">Current Deals</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Product</th>
            <th className="border p-2">Original Price</th>
            <th className="border p-2">Deal Price</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">End</th>
          </tr>
        </thead>
        <tbody>
          {deals.length > 0 ? (
            deals.map((deal) => (
              <tr key={deal._id}>
                <td className="border p-2">{deal.product?.name}</td>
                <td className="border p-2">₹{deal.product?.price}</td>
                <td className="border p-2 text-green-600 font-semibold">
                  ₹{deal.dealPrice}
                </td>
                <td className="border p-2">
                  {new Date(deal.startDate).toLocaleString()}
                </td>
                <td className="border p-2">
                  {new Date(deal.endDate).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border p-2 text-center" colSpan={5}>
                No deals available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DealOfTheDay;
