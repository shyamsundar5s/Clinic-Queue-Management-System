const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/clinic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Models
const Patient = mongoose.model('Patient', {
  name: String,
  doctorId: String,
  token: Number,
  checkInTime: Date,
});

const Doctor = mongoose.model('Doctor', {
  name: String,
  specialization: String,
  available: Boolean,
});

// Routes
app.post('/patient/checkin', async (req, res) => {
  const { name, doctorId } = req.body;

  const token = await Patient.countDocuments({ doctorId }) + 1;
  const patient = new Patient({ name, doctorId, token, checkInTime: new Date() });

  await patient.save();
  res.json({ success: true, token });
});

app.get('/doctor/:id/queue', async (req, res) => {
  const patients = await Patient.find({ doctorId: req.params.id }).sort('checkInTime');
  res.json(patients);
});

app.post('/doctor', async (req, res) => {
  const doctor = new Doctor(req.body);
  await doctor.save();
  res.json(doctor);
});

app.get('/doctors', async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
});

app.listen(5000, () => console.log('Clinic system running on port 5000'));
