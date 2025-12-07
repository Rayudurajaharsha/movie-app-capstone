const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Review = require('./models/Review');
const WatchlistItem = require('./models/WatchlistItem'); // Import the new model
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- EXISTING REVIEW ROUTES ---
app.post('/reviews', async (req, res) => { /* ... existing code ... */ });
app.get('/reviews/:movieId', async (req, res) => { /* ... existing code ... */ });
app.put('/reviews/:id', async (req, res) => { /* ... existing code ... */ });
app.delete('/reviews/:id', async (req, res) => { /* ... existing code ... */ });

// --- NEW WATCHLIST ROUTES ---

// 1. ADD to Watchlist
app.post('/watchlist', async (req, res) => {
    try {
        const { userId, movieId, title, posterPath, voteAverage } = req.body;
        const newItem = new WatchlistItem({ userId, movieId, title, posterPath, voteAverage });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Movie already in watchlist' });
        }
        res.status(500).json({ error: err.message });
    }
});

// 2. GET User's Watchlist
app.get('/watchlist/:userId', async (req, res) => {
    try {
        const items = await WatchlistItem.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. REMOVE from Watchlist
app.delete('/watchlist/:id', async (req, res) => {
    try {
        await WatchlistItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Removed from watchlist' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check if specific movie is saved (for button state)
app.get('/watchlist/:userId/:movieId', async (req, res) => {
    try {
        const item = await WatchlistItem.findOne({ userId: req.params.userId, movieId: req.params.movieId });
        res.json({ isSaved: !!item, itemId: item?._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});