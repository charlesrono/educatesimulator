// src/App.js

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import axios from 'axios';
import { Container, Typography, Button, TextField, Box } from '@mui/material';

function Pendulum({ length }) {
  return (
    <mesh>
      <cylinderBufferGeometry args={[0.05, 0.05, length, 32]} />
      <meshStandardMaterial color="blue" />
      <mesh position={[0, -length / 2, 0]}>
        <sphereBufferGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </mesh>
  );
}

function App() {
  const [experiments, setExperiments] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [length, setLength] = useState(1);
  const [gravity, setGravity] = useState(9.81);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/experiments').then((response) => {
      setExperiments(response.data);
    });
  }, []);

  const handleSimulate = () => {
    axios
      .post(`http://localhost:5000/api/experiments/${selectedExperiment.id}/simulate`, {
        length,
        gravity,
      })
      .then((response) => {
        setResult(response.data.result);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Virtual Lab Platform
      </Typography>
      {experiments.length > 0 && (
        <Box>
          <Typography variant="h6">Experiments:</Typography>
          {experiments.map((exp) => (
            <Button
              key={exp.id}
              variant="contained"
              onClick={() => setSelectedExperiment(exp)}
              style={{ marginRight: 10 }}
            >
              {exp.name}
            </Button>
          ))}
        </Box>
      )}
      {selectedExperiment && (
        <Box mt={4}>
          <Typography variant="h5">{selectedExperiment.name}</Typography>
          <Typography>{selectedExperiment.description}</Typography>
          <TextField
            label="Length (m)"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            type="number"
            margin="normal"
          />
          <TextField
            label="Gravity (m/s²)"
            value={gravity}
            onChange={(e) => setGravity(e.target.value)}
            type="number"
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSimulate}>
            Simulate
          </Button>
          {result && (
            <Typography variant="h6" mt={2}>
              Result: Period = {result.period.toFixed(2)} seconds
            </Typography>
          )}
          <Canvas style={{ height: 400, marginTop: 20 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Pendulum length={length} />
            <OrbitControls />
          </Canvas>
        </Box>
      )}
    </Container>
  );
}

export default App;
