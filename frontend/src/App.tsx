import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Production } from './pages/Production';
import { History } from './pages/History';
import { Dashboard } from './pages/Dashboard';
import { ProductionProvider } from './context/ProductionContext';

const App: React.FC = () => {
  return (
    <ProductionProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/production" element={<Production />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </Layout>
      </Router>
    </ProductionProvider>
  );
};

export default App; 