import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlogList from './pages/Blog';
import UserLogin from './pages/Login';
import UserRegister from './pages/Register';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
