const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://spaqoo:13941212meer...@todolist.4lvjwei.mongodb.net/?retryWrites=true&w=majority&appName=todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Task schema and model
const taskSchema = new mongoose.Schema({
  value: String,
});

const Task = mongoose.model('Task', taskSchema);

// Routes
// Create task
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

// Get tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

// Update task
app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
