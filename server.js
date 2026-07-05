const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const Greeting = require('./models/Greeting');
const Photo = require('./models/Photo');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ מחובר למסד הנתונים!'))
    .catch((err) => console.error('❌ שגיאה בחיבור:', err));

// API Routes
app.get('/api/greetings', async (req, res) => {
    try { const g = await Greeting.find().sort({ createdAt: -1 }); res.json(g); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/greetings', async (req, res) => {
    try { const g = new Greeting(req.body); await g.save(); res.status(201).json(g); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/greetings/:id', async (req, res) => {
    try { await Greeting.findByIdAndDelete(req.params.id); res.json({ message: 'נמחק' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/photos', async (req, res) => {
    try { const p = await Photo.find().sort({ createdAt: -1 }); res.json(p); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/photos', async (req, res) => {
    try { const p = new Photo({ imageUrl: req.body.imageUrl }); await p.save(); res.status(201).json(p); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/photos/:id', async (req, res) => {
    try { await Photo.findByIdAndDelete(req.params.id); res.json({ message: 'תמונה נמחקה' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// הגשה של האתר (התיקון הקריטי)
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 השרת רץ על פורט ${PORT}`);
});