import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';

interface ParametersControlProps {
  onUpdate: (params: {
    temperature: number;
    humidity: number;
    pressure: number;
    speed: number;
  }) => void;
  initialValues?: {
    temperature: number;
    humidity: number;
    pressure: number;
    speed: number;
  };
  buttonText?: string;
}

export const ParametersControl: React.FC<ParametersControlProps> = ({ 
  onUpdate, 
  initialValues,
  buttonText = "Применить"
}) => {
  const [params, setParams] = useState({
    temperature: initialValues?.temperature?.toString() || '25.0',
    humidity: initialValues?.humidity?.toString() || '60.0',
    pressure: initialValues?.pressure?.toString() || '1013.0',
    speed: initialValues?.speed?.toString() || '100.0'
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setParams({
        ...params,
        temperature: initialValues.temperature.toString(),
        humidity: initialValues.humidity.toString(),
        pressure: initialValues.pressure.toString(),
        speed: initialValues.speed.toString()
      });
    }
  }, [initialValues]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? 0 : parseFloat(event.target.value);
    if (!isNaN(value)) {
      setParams({
        ...params,
        [field]: value.toString()
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      temperature: parseFloat(params.temperature),
      humidity: parseFloat(params.humidity),
      pressure: parseFloat(params.pressure),
      speed: parseFloat(params.speed),
    });
    setShowSuccess(true);
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Ручное управление параметрами
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Температура (°C)"
              type="number"
              value={params.temperature}
              onChange={handleChange('temperature')}
              inputProps={{ step: 0.1 }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Влажность (%)"
              type="number"
              value={params.humidity}
              onChange={handleChange('humidity')}
              inputProps={{ step: 0.1 }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Давление (гПа)"
              type="number"
              value={params.pressure}
              onChange={handleChange('pressure')}
              inputProps={{ step: 0.1 }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Скорость (ед/мин)"
              type="number"
              value={params.speed}
              onChange={handleChange('speed')}
              inputProps={{ step: 0.1 }}
              required
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            {buttonText}
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Параметры успешно обновлены
        </Alert>
      </Snackbar>
    </Paper>
  );
}; 