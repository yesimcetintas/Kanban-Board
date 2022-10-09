import React from 'react';
import 'antd/dist/antd.min.css'
import './App.css';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useLoginContext } from './contexts/LoginContext/LoginContext';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import Board from './pages/Board';
import { ListProvider } from './contexts/ListContext/ListContext';



function App() {
  const { isLoggedIn } = useLoginContext()
  return (
    <div>
      {!isLoggedIn ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <ListProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/board/:id" element={<Board />} />
            </Routes>
          </BrowserRouter>
        </ListProvider>
        
      )}

    </div>
  );
}

export default App;
