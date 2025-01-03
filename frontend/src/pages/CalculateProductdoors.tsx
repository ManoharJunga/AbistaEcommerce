import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CalculateCost = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',  // Changed from productId to productName
    height: '',
    width: '',
    numberOfDoors: '',
  });
  const [totalCost, setTotalCost] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products/get');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const calculateCost = async () => {
    try {
      const { productName, height, width, numberOfDoors } = formData;
      if (!productName || !height || !width || !numberOfDoors) {
        alert('Please fill all fields');
        return;
      }

      const response = await axios.post('http://localhost:8000/api/calculate-cost', {
        productName,  // Use productName in the request
        height: parseFloat(height),
        width: parseFloat(width),
        numberOfDoors: parseInt(numberOfDoors),
      });

      setTotalCost(response.data.totalCost);
    } catch (error) {
      console.error('Error calculating cost:', error);
    }
  };

  return (
    <div>
      <h2>Calculate Cost</h2>
      <div>
        <select
          name="productName"  // Changed from productId to productName
          value={formData.productName}
          onChange={handleInputChange}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product.name}>  {/* Use product.name for value */}
              {product.name} - ${product.price}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="height"
          placeholder="Height"
          value={formData.height}
          onChange={handleInputChange}
        />

        <input
          type="number"
          name="width"
          placeholder="Width"
          value={formData.width}
          onChange={handleInputChange}
        />

        <input
          type="number"
          name="numberOfDoors"
          placeholder="Number of Doors"
          value={formData.numberOfDoors}
          onChange={handleInputChange}
        />

        <button onClick={calculateCost}>Calculate</button>
      </div>

      {totalCost !== null && (
        <h3>Total Cost: ${totalCost}</h3>
      )}
    </div>
  );
};

export default CalculateCost;
