// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define API routes
app.get('/', (req, res) => {
  res.send('Welcome to the Virtual Lab Platform API');
});

// Simulated experiment data
const experiments = [
  {
    id: 1,
    name: 'Pendulum Experiment',
    description: 'Measure the period of a pendulum with different lengths.',
    parameters: ['length', 'gravity'],
  },
];

// Get all experiments
app.get('/api/experiments', (req, res) => {
  res.send(experiments);
});

// Simulate an experiment result
app.post('/api/experiments/:id/simulate', (req, res) => {
  const { id } = req.params;
  const { length, gravity } = req.body;

  // Simple physics formula to calculate the period of a pendulum: T = 2π√(L/g)
  const period = 2 * Math.PI * Math.sqrt(length / gravity);

  res.send({
    experimentId: id,
    parameters: { length, gravity },
    result: { period },
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
