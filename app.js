const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// 🔌 Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
//🧠 Define Student Schema and Model
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  course: String
});

const Student = mongoose.model('Student', studentSchema);

// 🚦 API Routes

// Create
app.post('/api/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Read All
app.get('/api/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Read One
app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Delete
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🚀 Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


