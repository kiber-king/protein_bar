import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProductionData {
  temperature: number;
  humidity: number;
  pressure: number;
  speed: number;
  timestamp: string;
  is_target?: boolean;
}

interface ProductionStats {
  totalProducts: number;
  defectiveProducts: number;
}

interface ProductionProcess {
  id: string;
  targetParams: ProductionData;
  currentParams: ProductionData | null;
  isRunning: boolean;
  history: ProductionData[];
}

interface ProductionContextType {
  processes: ProductionProcess[];
  stats: ProductionStats;
  startProcess: (targetParams: ProductionData) => void;
  stopProcess: (id: string) => void;
  updateCurrentParams: (id: string, params: ProductionData) => void;
  updateTargetParams: (id: string, params: ProductionData) => void;
}

const ProductionContext = createContext<ProductionContextType | undefined>(undefined);

export const useProduction = () => {
  const context = useContext(ProductionContext);
  if (!context) {
    throw new Error('useProduction must be used within a ProductionProvider');
  }
  return context;
};

export const ProductionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [processes, setProcesses] = useState<ProductionProcess[]>([]);
  const [stats, setStats] = useState<ProductionStats>(() => {
    const savedStats = localStorage.getItem('productionStats');
    return savedStats ? JSON.parse(savedStats) : { totalProducts: 0, defectiveProducts: 0 };
  });

  const generateRandomValue = (baseValue: number): number => {
    const deviation = (Math.random() - 0.5) * 0.2;
    return baseValue * (1 + deviation);
  };

  const checkForDefect = (params: ProductionData, targetParams: ProductionData): boolean => {
    // Проверяем отклонение каждого параметра от целевого значения
    const tempDiff = Math.abs(params.temperature - targetParams.temperature) / targetParams.temperature;
    const humidityDiff = Math.abs(params.humidity - targetParams.humidity) / targetParams.humidity;
    const pressureDiff = Math.abs(params.pressure - targetParams.pressure) / targetParams.pressure;
    const speedDiff = Math.abs(params.speed - targetParams.speed) / targetParams.speed;

    // Если любой параметр отклоняется более чем на 15%, считаем это браком
    const isDefective = (tempDiff > 0.15 || humidityDiff > 0.15 || pressureDiff > 0.15 || speedDiff > 0.15);
    
    // Добавляем небольшой случайный шанс брака (0.5%)
    const randomDefect = Math.random() < 0.005;

    return isDefective || randomDefect;
  };

  const saveToDatabase = async (params: ProductionData) => {
    try {
      await fetch('http://localhost:8000/api/parameters/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
    } catch (error) {
      console.error('Error saving parameters:', error);
    }
  };

  const startProcess = (targetParams: ProductionData) => {
    const newProcess: ProductionProcess = {
      id: Date.now().toString(),
      targetParams,
      currentParams: null,
      isRunning: true,
      history: [],
    };
    setProcesses(prev => [...prev, newProcess]);
  };

  const stopProcess = (id: string) => {
    setProcesses(prev => prev.map(process => 
      process.id === id ? { ...process, isRunning: false } : process
    ));
  };

  const updateCurrentParams = (id: string, params: ProductionData) => {
    setProcesses(prev => prev.map(process =>
      process.id === id 
        ? { 
            ...process, 
            currentParams: params,
            history: [...process.history, params].slice(-60)
          } 
        : process
    ));
  };

  const updateTargetParams = (id: string, params: ProductionData) => {
    setProcesses(prev => prev.map(process =>
      process.id === id ? { ...process, targetParams: params } : process
    ));
  };

  // Генерация значений для всех активных процессов
  useEffect(() => {
    const generateValues = () => {
      setProcesses(prevProcesses => 
        prevProcesses.map(process => {
          if (!process.isRunning) return process;

          const newParams: ProductionData = {
            temperature: generateRandomValue(process.targetParams.temperature),
            humidity: generateRandomValue(process.targetParams.humidity),
            pressure: generateRandomValue(process.targetParams.pressure),
            speed: generateRandomValue(process.targetParams.speed),
            timestamp: new Date().toISOString(),
            is_target: false
          };

          // Увеличиваем общее количество продукции и проверяем на брак
          setStats(prevStats => {
            const isDefective = checkForDefect(newParams, process.targetParams);
            const newStats = {
              totalProducts: prevStats.totalProducts + 1,
              defectiveProducts: prevStats.defectiveProducts + (isDefective ? 1 : 0)
            };
            localStorage.setItem('productionStats', JSON.stringify(newStats));
            return newStats;
          });

          saveToDatabase(newParams);

          return {
            ...process,
            currentParams: newParams,
            history: [...process.history, newParams].slice(-60)
          };
        })
      );
    };

    const interval = setInterval(generateValues, 1000);
    return () => clearInterval(interval);
  }, []);

  // Сохраняем состояние в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('productionProcesses', JSON.stringify(processes));
  }, [processes]);

  // Загружаем состояние из localStorage при монтировании
  useEffect(() => {
    const savedProcesses = localStorage.getItem('productionProcesses');
    if (savedProcesses) {
      setProcesses(JSON.parse(savedProcesses));
    }
  }, []);

  return (
    <ProductionContext.Provider value={{ 
      processes, 
      stats,
      startProcess, 
      stopProcess, 
      updateCurrentParams,
      updateTargetParams 
    }}>
      {children}
    </ProductionContext.Provider>
  );
}; 