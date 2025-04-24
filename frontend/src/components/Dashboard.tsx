import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Панель управления
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Текущие параметры
            </Typography>
            {/* Здесь будет компонент с текущими параметрами */}
          </Paper>
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              График производства
            </Typography>
            {/* Здесь будет компонент с графиком */}
          </Paper>
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Статистика
            </Typography>
            {/* Здесь будет компонент со статистикой */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 