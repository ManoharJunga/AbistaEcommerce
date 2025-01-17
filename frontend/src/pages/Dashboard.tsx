import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Button,
  Modal,
  Divider,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BASE_API_URL } from '../App';

const fetchDashboardReport = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/reports/dashboard`);
    return response.data.report;
  } catch (error) {
    console.error('Error fetching dashboard report:', error);
    throw error;
  }
};

const Dashboard: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getReport = async () => {
      try {
        const data = await fetchDashboardReport();
        setReport(data);
      } catch (err) {
        setError('Failed to fetch report.');
      } finally {
        setLoading(false);
      }
    };

    getReport();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <CircularProgress />
        <Typography variant="h6" className="mt-3">
          Loading Dashboard Report...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Prepare compact Bar Chart data
  const barChartData = report.topPages.map((page: any) => ({
    name: page._id,
    timeSpent: (page.totalTime / 60).toFixed(1),
  })).slice(0, 5); // Limit data points to 5 for brevity

  // Function to export data as CSV
  const exportToCSV = (data: any, filename: string) => {
    const csvData = [
      ['Page', 'Visits', 'Total Time Spent (minutes)'],
      ...data.map((page: any) => [page._id, page.visits, (page.totalTime / 60).toFixed(1)]),
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <Container className="mt-4">
      <Typography variant="h4" gutterBottom>
        Dashboard Report
      </Typography>

      <Grid container spacing={3}>
        {/* Metrics Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4">
            <Typography variant="h5" gutterBottom>
              Metrics
            </Typography>
            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography variant="body1">
                Sessions: {report.sessions} <span style={{ color: 'green' }}>↑ {report.sessionsGrowth}%</span> vs previous 30 days
              </Typography>
              <Typography variant="body1">
                Page Views: {report.pageViews} <span style={{ color: 'green' }}>↑ {report.pageViewsGrowth}%</span> vs previous 30 days
              </Typography>
              <Typography variant="body1">
                Users: {report.users} <span style={{ color: 'green' }}>↑ {report.usersGrowth}%</span> vs previous 30 days
              </Typography>
              <Typography variant="body1">
                Website Visits: {report.websiteVisits} <span style={{ color: 'green' }}>↑ {report.websiteVisitsGrowth}%</span> vs previous 30 days
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Export to CSV Button */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4 text-center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => exportToCSV(report.topPages, 'topPagesReport.csv')}
              startIcon={<Download />}
            >
              Export Data
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Divider className="my-4" />

      <Grid container spacing={3}>
        {/* Bar Chart Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4">
            <Typography variant="h6" gutterBottom>
              Top Pages - Total Time Spent (Minutes)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="timeSpent" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top Pages Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4">
            <Typography variant="h6" gutterBottom>
              Top Pages
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Page</TableCell>
                    <TableCell style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Visits</TableCell>
                    <TableCell style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Total Time Spent (minutes)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.topPages.slice(0, 5).map((page: any) => (
                    <TableRow key={page._id}>
                      <TableCell>{page._id}</TableCell>
                      <TableCell>{page.visits}</TableCell>
                      <TableCell>{(page.totalTime / 60).toFixed(1)} mins</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
