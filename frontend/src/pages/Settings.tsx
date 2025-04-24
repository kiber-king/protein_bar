import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert
} from '@mui/material';

interface Settings {
  autoMode: boolean;
  updateInterval: number;
  temperatureRange: {
    min: number;
    max: number;
  };
  humidityRange: {
    min: number;
    max: number;
  };
  pressureRange: {
    min: number;
    max: number;
  };
  speedRange: {
    min: number;
    max: number;
  };
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    autoMode: true,
    updateInterval: 5000,
    temperatureRange: { min: 20, max: 30 },
    humidityRange: { min: 50, max: 70 },
    pressureRange: { min: 1000, max: 1020 },
    speedRange: { min: 90, max: 110 }
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (field === 'autoMode') {
      setSettings({
        ...settings,
        autoMode: event.target.checked
      });
    } else if (field === 'updateInterval') {
      setSettings({
        ...settings,
        updateInterval: parseInt(event.target.value)
      });
    } else if (field.includes('Range')) {
      const [param, bound] = field.split('.');
      setSettings({
        ...settings,
        [param]: {
          ...settings[param as keyof Settings],
          [bound]: parseFloat(event.target.value)
        }
      });
    }
  };

  const handleSave = () => {
    // Здесь будет логика сохранения настроек
    setShowSuccess(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Настройки системы
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoMode}
                      onChange={handleChange('autoMode')}
                    />
                  }
                  label="Автоматический режим"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Интервал обновления (мс)"
                  type="number"
                  value={settings.updateInterval}
                  onChange={handleChange('updateInterval')}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Допустимые диапазоны параметров
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Температура (°C)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Мин"
                    type="number"
                    value={settings.temperatureRange.min}
                    onChange={handleChange('temperatureRange.min')}
                  />
                  <TextField
                    label="Макс"
                    type="number"
                    value={settings.temperatureRange.max}
                    onChange={handleChange('temperatureRange.max')}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Влажность (%)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Мин"
                    type="number"
                    value={settings.humidityRange.min}
                    onChange={handleChange('humidityRange.min')}
                  />
                  <TextField
                    label="Макс"
                    type="number"
                    value={settings.humidityRange.max}
                    onChange={handleChange('humidityRange.max')}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Давление (гПа)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Мин"
                    type="number"
                    value={settings.pressureRange.min}
                    onChange={handleChange('pressureRange.min')}
                  />
                  <TextField
                    label="Макс"
                    type="number"
                    value={settings.pressureRange.max}
                    onChange={handleChange('pressureRange.max')}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Скорость (ед/мин)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Мин"
                    type="number"
                    value={settings.speedRange.min}
                    onChange={handleChange('speedRange.min')}
                  />
                  <TextField
                    label="Макс"
                    type="number"
                    value={settings.speedRange.max}
                    onChange={handleChange('speedRange.max')}
                  />
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                Сохранить настройки
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Настройки успешно сохранены
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings; 