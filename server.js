const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data storage
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    tasks: [],
    events: []
  }));
}

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Load data
const loadData = () => {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
};

// Save data
const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Task endpoints
app.get('/api/tasks', (req, res) => {
  const data = loadData();
  res.json(data.tasks);
});

app.post('/api/tasks', (req, res) => {
  const data = loadData();
  const newTask = {
    id: Date.now(),
    ...req.body
  };
  data.tasks.push(newTask);
  saveData(data);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const data = loadData();
  const index = data.tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index !== -1) {
    data.tasks[index] = { ...data.tasks[index], ...req.body };
    saveData(data);
    res.json(data.tasks[index]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  const data = loadData();
  const index = data.tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index !== -1) {
    const deleted = data.tasks.splice(index, 1);
    saveData(data);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Event endpoints
app.get('/api/events', (req, res) => {
  const data = loadData();
  res.json(data.events);
});

app.post('/api/events', (req, res) => {
  const data = loadData();
  const newEvent = {
    id: Date.now(),
    ...req.body
  };
  data.events.push(newEvent);
  saveData(data);
  res.status(201).json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const data = loadData();
  const index = data.events.findIndex(e => e.id === parseInt(req.params.id));
  if (index !== -1) {
    data.events[index] = { ...data.events[index], ...req.body };
    saveData(data);
    res.json(data.events[index]);
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

app.delete('/api/events/:id', (req, res) => {
  const data = loadData();
  const index = data.events.findIndex(e => e.id === parseInt(req.params.id));
  if (index !== -1) {
    const deleted = data.events.splice(index, 1);
    saveData(data);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});