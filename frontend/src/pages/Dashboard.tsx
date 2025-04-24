import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Thermostat as ThermostatIcon,
  Opacity as OpacityIcon,
  Compress as CompressIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useProduction } from '../context/ProductionContext';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  progress: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, icon, color, progress }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ 
          backgroundColor: `${color}22`,
          borderRadius: '50%',
          p: 1,
          mr: 2
        }}>
          {React.cloneElement(icon as React.ReactElement, { sx: { color: color } })}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
        {value.toFixed(1)} {unit}
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          backgroundColor: `${color}22`,
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
          }
        }} 
      />
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { processes, stats } = useProduction();

  // Получаем последние значения из всех активных процессов
  const getLatestValues = () => {
    const runningProcesses = processes.filter(p => p.isRunning);
    if (runningProcesses.length === 0) return null;

    // Берем последний процесс для отображения на метриках
    const latestProcess = runningProcesses[runningProcesses.length - 1];
    return latestProcess.currentParams;
  };

  // Собираем историю всех процессов для графиков
  const getAllHistory = () => {
    return processes
      .filter(p => p.isRunning)
      .flatMap(p => p.history)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-60); // Показываем последнюю минуту данных
  };

  const currentParams = getLatestValues();
  const history = getAllHistory();

  if (!currentParams) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Нет активных процессов. Запустите процесс на вкладке "Производство".
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Панель управления
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Температура"
            value={currentParams.temperature}
            unit="°C"
            icon={<ThermostatIcon />}
            color="#FF6B6B"
            progress={(currentParams.temperature / 100) * 100}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Влажность"
            value={currentParams.humidity}
            unit="%"
            icon={<OpacityIcon />}
            color="#4ECDC4"
            progress={currentParams.humidity}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Давление"
            value={currentParams.pressure}
            unit="кПа"
            icon={<CompressIcon />}
            color="#45B7D1"
            progress={(currentParams.pressure / 150) * 100}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Скорость"
            value={currentParams.speed}
            unit="ед/мин"
            icon={<SpeedIcon />}
            color="#96CEB4"
            progress={(currentParams.speed / 200) * 100}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Тренды параметров
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#FF6B6B" 
                    name="Температура" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#4ECDC4" 
                    name="Влажность" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pressure" 
                    stroke="#45B7D1" 
                    name="Давление" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="speed" 
                    stroke="#96CEB4" 
                    name="Скорость" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Статистика производства
            </Typography>
            <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              <Box>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Общее количество продукции
                </Typography>
                <Typography variant="h3">
                  {stats.totalProducts.toLocaleString()}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Количество брака
                </Typography>
                <Typography variant="h3" color="error">
                  {stats.defectiveProducts.toLocaleString()}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Процент брака
                </Typography>
                <Typography variant="h3" color={stats.defectiveProducts / stats.totalProducts > 0.05 ? "error" : "success"}>
                  {((stats.defectiveProducts / stats.totalProducts) * 100).toFixed(2)}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.defectiveProducts / stats.totalProducts) * 100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    mt: 1,
                    backgroundColor: '#ffebee',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: stats.defectiveProducts / stats.totalProducts > 0.05 ? '#f44336' : '#4caf50',
                    }
                  }} 
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}; 