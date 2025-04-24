import React from 'react';
import { Container, Grid, Paper, Typography, Button, Box } from '@mui/material';
import { useProduction } from '../context/ProductionContext';
import { ParametersControl } from '../components/ParametersControl';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ProductionData {
  temperature: number;
  humidity: number;
  pressure: number;
  speed: number;
  timestamp: string;
  is_target?: boolean;
}

const ProcessCard: React.FC<{ 
  process: any; 
  onUpdateParams: (params: { 
    temperature: number;
    humidity: number;
    pressure: number;
    speed: number;
  }) => void;
}> = ({ process, onUpdateParams }) => {
  const { stopProcess } = useProduction();

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Процесс #{process.id}
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => stopProcess(process.id)}
            disabled={!process.isRunning}
            sx={{ ml: 1 }}
          >
            Остановить
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Целевые параметры:</Typography>
          <ParametersControl 
            onUpdate={onUpdateParams}
            initialValues={process.targetParams}
            buttonText="Обновить параметры"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Текущие параметры:</Typography>
          {process.currentParams ? (
            <>
              <Typography>Температура: {process.currentParams.temperature.toFixed(1)}°C</Typography>
              <Typography>Влажность: {process.currentParams.humidity.toFixed(1)}%</Typography>
              <Typography>Давление: {process.currentParams.pressure.toFixed(1)} кПа</Typography>
              <Typography>Скорость: {process.currentParams.speed.toFixed(1)} ед/мин</Typography>
            </>
          ) : (
            <Typography color="text.secondary">Ожидание данных...</Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>График параметров в реальном времени:</Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={process.history}>
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
        </Grid>
      </Grid>
    </Paper>
  );
};

export const Production: React.FC = () => {
  const { processes, startProcess, updateTargetParams } = useProduction();

  const handleUpdateParams = async (params: { 
    temperature: number;
    humidity: number;
    pressure: number;
    speed: number;
  }) => {
    const newParams: ProductionData = {
      ...params,
      timestamp: new Date().toISOString(),
      is_target: true
    };
    startProcess(newParams);
  };

  const handleUpdateProcessParams = (processId: string) => async (params: {
    temperature: number;
    humidity: number;
    pressure: number;
    speed: number;
  }) => {
    const newParams: ProductionData = {
      ...params,
      timestamp: new Date().toISOString(),
      is_target: true
    };
    updateTargetParams(processId, newParams);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Управление параметрами
            </Typography>
            <ParametersControl 
              onUpdate={handleUpdateParams}
              buttonText="Запустить новый процесс"
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Активные процессы
          </Typography>
          {processes.length > 0 ? (
            processes.map(process => (
              <ProcessCard 
                key={process.id} 
                process={process}
                onUpdateParams={handleUpdateProcessParams(process.id)}
              />
            ))
          ) : (
            <Paper sx={{ p: 2 }}>
              <Typography color="text.secondary">
                Нет активных процессов. Установите параметры и запустите новый процесс.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}; 