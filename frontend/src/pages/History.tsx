import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, TextField, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Parameter {
  temperature: number;
  humidity: number;
  pressure: number;
  speed: number;
  timestamp: string;
}

export const History: React.FC = () => {
  const [history, setHistory] = useState<Parameter[]>([]);
  const [hours, setHours] = useState<number>(24);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/parameters/history/?hours=${hours}`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [hours]);

  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setHours(value);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              История параметров производства
            </Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Период (часы)"
                type="number"
                value={hours}
                onChange={handleHoursChange}
                inputProps={{ min: 1 }}
              />
            </Box>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Температура" />
                  <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Влажность" />
                  <Line type="monotone" dataKey="pressure" stroke="#ffc658" name="Давление" />
                  <Line type="monotone" dataKey="speed" stroke="#ff7300" name="Скорость" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}; 