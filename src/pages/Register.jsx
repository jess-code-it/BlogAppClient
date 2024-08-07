import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const UserRegister = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = () => {
    fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'User registered successfully') {
          setSuccess('Registration successful! You can now log in.');
          setError('');
        } else {
          setError(data.message || 'Registration failed.');
          setSuccess('');
        }
      })
      .catch(error => {
        setError('An error occurred while registering.');
        setSuccess('');
        console.error('Error registering:', error);
      });
  };

  return (
    <Container>
      <h1 className="my-4">Register</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleRegister}>
          Register
        </Button>
      </Form>
      <p className="mt-3">
        Have an account? <Link to="/login">Login here</Link>
      </p>
    </Container>
  );
};

export default UserRegister;
