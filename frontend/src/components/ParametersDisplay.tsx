import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Parameter {
  temperature: number;
  humidity: number;
  pressure: number;
  speed: number;
  timestamp: string;
}

interface ParametersDisplayProps {
  data: Parameter[];
  currentParameters: Parameter | null;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
}

const ParametersDisplay: React.FC<ParametersDisplayProps> = ({ 
  data, 
  currentParameters, 
  isRunning,
  onStart,
  onStop 
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Текущие параметры
          </Typography>
          {currentParameters && (
            <Box>
              <Typography>Температура: {currentParameters.temperature.toFixed(1)}°C</Typography>
              <Typography>Влажность: {currentParameters.humidity.toFixed(1)}%</Typography>
              <Typography>Давление: {currentParameters.pressure.toFixed(1)} бар</Typography>
              <Typography>Скорость: {currentParameters.speed.toFixed(1)} м/с</Typography>
            </Box>
          )}
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onStart}
              disabled={isRunning}
            >
              Старт производства
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={onStop}
              disabled={!isRunning}
            >
              Стоп производства
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            График параметров
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
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
  );
};

export default ParametersDisplay; 