import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import DocumentDetail from './pages/DocumentDetail';
import NotFound from './pages/NotFound';
import DarkModeToggle from './components/ui/DarkModeToggle';
import { ToastProvider } from './components/ui/ToastContext';

function App() {
  return (
    <ToastProvider>
      <div className="app">
        <div className="top-right">
          <DarkModeToggle />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="page-shell"
          >
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/documents/:id" element={<DocumentDetail />} />
              <Route path="/" element={<Navigate to="/documents" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </ToastProvider>
  );
}

export default App;
