const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Greeting = require('./models/Greeting');
const Photo = require('./models/Photo');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ מחובר למסד הנתונים!'))
    .catch((err) => console.error('❌ שגיאה בחיבור:', err));

// ==========================================
// API - ברכות (עם טיפול בשגיאות)
// ==========================================
app.get('/api/greetings', async (req, res) => {
    try {
        const greetings = await Greeting.find().sort({ createdAt: -1 });
        res.json(greetings);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/greetings', async (req, res) => {
    try {
        const newGreeting = new Greeting(req.body);
        await newGreeting.save();
        res.status(201).json(newGreeting);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/greetings/:id', async (req, res) => {
    try {
        await Greeting.findByIdAndDelete(req.params.id);
        res.json({ message: 'נמחק' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// API - גלריה
// ==========================================
app.get('/api/photos', async (req, res) => {
    try {
        const photos = await Photo.find().sort({ createdAt: -1 });
        res.json(photos);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/photos', async (req, res) => {
    try {
        const newPhoto = new Photo({ imageUrl: req.body.imageUrl });
        await newPhoto.save();
        res.status(201).json(newPhoto);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/photos/:id', async (req, res) => {
    try {
        await Photo.findByIdAndDelete(req.params.id);
        res.json({ message: 'תמונה נמחקה' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});
const path = require('path');

// הגדרה שמאפשרת לשרת להגיש קבצים סטטיים מהתיקייה של האתר
app.use(express.static(path.join(__dirname, 'frontend')));

// כל פנייה אחרת (שלא מתחילה ב-/api) תשלח את ה-index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 השרת רץ על פורט ${PORT}`);
});