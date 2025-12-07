const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    movieId: { type: Number, required: true },
    title: { type: String, required: true },
    posterPath: { type: String }, // We save this so we can show the image without refetching TMDB
    voteAverage: { type: Number }
}, { timestamps: true });

// Prevent duplicate saves: A user can't save the same movie twice
watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('WatchlistItem', watchlistSchema);