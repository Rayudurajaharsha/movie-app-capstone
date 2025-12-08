const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); // Import 'path' module
const Review = require('./models/Review');
const WatchlistItem = require('./models/WatchlistItem');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080; // Google App Engine expects 8080

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- API ROUTES ---
app.post('/reviews', async (req, res) => {
    try {
        const { userId, userEmail, movieId, movieTitle, content, rating } = req.body;
        const newReview = new Review({ userId, userEmail, movieId, movieTitle, content, rating });
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/reviews/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params;
        const reviews = await Review.find({ movieId });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

app.get('/watchlist/:userId', async (req, res) => {
    try {
        const items = await WatchlistItem.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/watchlist/:id', async (req, res) => {
    try {
        await WatchlistItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Removed from watchlist' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/watchlist/:userId/:movieId', async (req, res) => {
    try {
        const item = await WatchlistItem.findOne({ userId: req.params.userId, movieId: req.params.movieId });
        res.json({ isSaved: !!item, itemId: item?._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SERVE REACT FRONTEND (DEPLOYMENT) ---
// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
// Handle React routing - USE REGEX /.*/ TO PREVENT CRASH
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});