import React, { useState, useEffect } from "react";
import { BASE_API_URL } from "../App"; // Import the BASE_API_URL
import { Card, CardContent, Grid, Typography, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Customers = () => {
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null);
  const [newCustomers, setNewCustomers] = useState<any>(null);
  const [topDemographics, setTopDemographics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch total customers
  const fetchTotalCustomers = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/customer/insights/total`);
      const data = await response.json();
      setTotalCustomers(data.totalCustomers);
    } catch (error) {
      console.error("Error fetching total customers:", error);
    }
  };

  // Function to fetch new customers (daily, weekly, monthly)
  const fetchNewCustomers = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/customer/insights/new`);
      const data = await response.json();
      setNewCustomers(data);
    } catch (error) {
      console.error("Error fetching new customers:", error);
    }
  };

  // Function to fetch top demographics (top cities)
  const fetchTopDemographics = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/customer/insights/top-demographics`);
      const data = await response.json();
      setTopDemographics(data.topCities);
    } catch (error) {
      console.error("Error fetching top demographics:", error);
    }
  };

  useEffect(() => {
    fetchTotalCustomers();
    fetchNewCustomers();
    fetchTopDemographics();
    setLoading(false); // Stop loading after fetching data
  }, []);

  // Chart data for new customers trend (daily, weekly, monthly)
  const chartData = {
    labels: ['Daily', 'Weekly', 'Monthly'],
    datasets: [
      {
        label: 'New Customers',
        data: [newCustomers?.daily, newCustomers?.weekly, newCustomers?.monthly],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Customer Insights</h1>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">Total Customers</Typography>
              <Typography variant="h4" align="center">
                {loading ? <CircularProgress size={24} /> : totalCustomers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">New Customers</Typography>
              <ul>
                <li>Daily: {newCustomers?.daily}</li>
                <li>Weekly: {newCustomers?.weekly}</li>
                <li>Monthly: {newCustomers?.monthly}</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">Top Demographics (Cities)</Typography>
              <ul>
                {topDemographics?.map((item: any, index: number) => (
                  <li key={index}>
                    {item._id} - {item.count} customers
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mt-4">
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">Customer Trend (New Customers)</Typography>
              {loading ? <CircularProgress size={24} /> : <Chart type="bar" data={chartData} />}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">Customer Distribution</Typography>
              {/* This could be a map component showing customer distribution */}
              <FontAwesomeIcon icon={faMapMarkedAlt} size="3x" />
              <p align="center">View the customer distribution on the map</p>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Customers;
