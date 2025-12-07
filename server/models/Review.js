const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    // We save the Firebase User ID so we know who wrote it
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },

    // We save the Movie ID from TMDB
    movieId: { type: Number, required: true },
    movieTitle: { type: String, required: true },

    // The actual review content
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 10, required: true },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('Review', reviewSchema);