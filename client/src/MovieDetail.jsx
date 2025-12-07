import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import { auth } from './firebase';
import API_URL from './api'; // Import API_URL
import './App.css';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const MovieDetail = () => {
    const { id } = useParams();
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const currentUser = auth.currentUser;
    const [isSaving, setIsSaving] = useState(false);

    // Fetch Movie Data
    const { data: movie, error: movieError } = useSWR(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`,
        fetcher
    );

    // Fetch Reviews
    const { data: reviews } = useSWR(`${API_URL}/reviews/${id}`, fetcher);

    // Check if already in watchlist (only if logged in)
    const { data: watchlistStatus, mutate: mutateStatus } = useSWR(
        currentUser ? `${API_URL}/watchlist/${currentUser.uid}/${id}` : null,
        fetcher
    );

    const toggleWatchlist = async () => {
        if (!currentUser) return alert("Please login to save movies!");
        setIsSaving(true);
        try {
            if (watchlistStatus?.isSaved) {
                // Remove
                await axios.delete(`${API_URL}/watchlist/${watchlistStatus.itemId}`);
            } else {
                // Add
                await axios.post(`${API_URL}/watchlist`, {
                    userId: currentUser.uid,
                    movieId: movie.id,
                    title: movie.title,
                    posterPath: movie.poster_path,
                    voteAverage: movie.vote_average
                });
            }
            // Refresh the status
            mutateStatus();
        } catch (error) {
            console.error("Watchlist error", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReviewAdded = () => {
        mutate(`${API_URL}/reviews/${id}`);
    };

    if (movieError) return <div className="error">Failed to load movie.</div>;
    if (!movie) return <div className="loading">Loading details...</div>;

    return (
        <div className="movie-detail-container">
            <div
                className="hero-section"
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
            >
                <div className="hero-content">
                    <h1>{movie.title}</h1>
                    <p className="tagline">{movie.tagline}</p>

                    {/* Watchlist Button */}
                    <button
                        onClick={toggleWatchlist}
                        disabled={isSaving}
                        className={`btn-watchlist ${watchlistStatus?.isSaved ? 'saved' : ''}`}
                    >
                        {watchlistStatus?.isSaved ? '✅ In Watchlist' : '➕ Add to Watchlist'}
                    </button>

                    <p className="overview">{movie.overview}</p>
                </div>
            </div>

            <div className="content-section">
                <div className="review-section">
                    <ReviewForm
                        movieId={movie.id}
                        movieTitle={movie.title}
                        user={currentUser}
                        onReviewAdded={handleReviewAdded}
                    />
                    <h2>Reviews ({reviews?.length || 0})</h2>
                    <div className="reviews-list">
                        {reviews?.map((review) => (
                            <div key={review._id} className="review-card">
                                <div className="review-header">
                                    <strong>{review.userEmail.split('@')[0]}</strong>
                                    <span className="star-rating">⭐ {review.rating}/10</span>
                                </div>
                                <p>{review.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;