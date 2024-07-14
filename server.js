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

// Define the task schema and model
const taskSchema = new mongoose.Schema({
  value: String,
});

const Task = mongoose.model('Task', taskSchema);

// Routes
//create task
app.post('/tasks', async (req, res) => {
  const { value } = req.body;
  const task = new Task({ value });
  await task.save();
  res.json(task);
});

//get task
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

//delete task
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

//update task
app.put('/tasks/:id', async (req, res) => {
  const { value } = req.body;
  const task = await Task.findByIdAndUpdate(req.params.id, { value }, { new: true });
  res.json(task);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
