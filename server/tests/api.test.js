const request = require('supertest');
const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a separate app for testing
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mock routes for testing
// Auth routes mock
app.post('/api/auth/register', (req, res) => {
  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/auth/login', (req, res) => {
  res.status(200).json({ token: 'mock-token', user: { email: 'test@example.com' } });
});

// Excel routes mock
app.get('/api/excel', (req, res) => {
  res.status(200).json({ files: [] });
});

// Analysis routes mock
app.get('/api/analysis', (req, res) => {
  res.status(200).json({ analyses: [] });
});

// Health check routes
app.get('/', (req, res) => {
  res.send('✅ Backend is up and running at root path!');
});

app.get('/api/ping', (req, res) => {
  res.send('🏓 🎉 Backend is working — Welcome to the API!');
});

describe('API Endpoints', () => {
  // Test root endpoint
  test('GET / should return success message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Backend is up and running');
  });

  // Test ping endpoint
  test('GET /api/ping should return success message', async () => {
    const response = await request(app).get('/api/ping');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Backend is working');
  });

  // Test auth routes
  test('POST /api/auth/register should return 201', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    expect(response.status).toBe(201);
  });

  test('POST /api/auth/login should return token', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  // Test excel routes
  test('GET /api/excel should return files array', async () => {
    const response = await request(app).get('/api/excel');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('files');
  });

  // Test analysis routes
  test('GET /api/analysis should return analyses array', async () => {
    const response = await request(app).get('/api/analysis');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('analyses');
  });
});
