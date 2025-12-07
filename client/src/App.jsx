import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import useSWR, { mutate } from 'swr'; // Import mutate
import axios from 'axios';
import { motion } from 'framer-motion';
import { signInWithGoogle, logout, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import MovieDetail from './MovieDetail';
import './App.css';

// ... (fetcher and Home component remain the same) ...
const fetcher = (url) => axios.get(url).then((res) => res.data);

const Home = () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const { data, error, isLoading } = useSWR(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`,
    fetcher
  );

  if (isLoading) return <div className="loading">Loading movies...</div>;
  if (error) return <div className="error">Failed to load movies.</div>;

  return (
    <motion.div className="movie-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {data?.results.map((movie) => (
        <Link to={`/movie/${movie.id}`} key={movie.id} style={{ textDecoration: 'none' }}>
          <motion.div className="movie-card" whileHover={{ scale: 1.05 }}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <h3>{movie.title}</h3>
            <p>⭐ {movie.vote_average}</p>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  );
};

// --- UPDATED WATCHLIST COMPONENT ---
const Watchlist = ({ user }) => {
  const { data: watchlist, error } = useSWR(
    user ? `http://localhost:5000/watchlist/${user.uid}` : null,
    fetcher
  );

  const removeFromWatchlist = async (e, id) => {
    e.preventDefault(); // Prevent clicking the link
    try {
      await axios.delete(`http://localhost:5000/watchlist/${id}`);
      mutate(`http://localhost:5000/watchlist/${user.uid}`); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div className="error">Please login to view your watchlist.</div>;
  if (!watchlist) return <div className="loading">Loading watchlist...</div>;

  return (
    <div className="container">
      <h2>My Watchlist ({watchlist.length})</h2>
      {watchlist.length === 0 ? (
        <p style={{ color: '#ccc' }}>No movies saved yet.</p>
      ) : (
        <div className="movie-grid">
          {watchlist.map((item) => (
            <Link to={`/movie/${item.movieId}`} key={item._id} style={{ textDecoration: 'none' }}>
              <motion.div className="movie-card" whileHover={{ scale: 1.05 }}>
                <img src={`https://image.tmdb.org/t/p/w500${item.posterPath}`} alt={item.title} />
                <h3>{item.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '10px' }}>
                  <p>⭐ {item.voteAverage}</p>
                  <button
                    className="remove-btn"
                    onClick={(e) => removeFromWatchlist(e, item._id)}
                  >
                    🗑️
                  </button>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      <header className="app-header">
        <Link to="/" style={{ textDecoration: 'none' }}><h1>🎬 Movie App</h1></Link>
        <div className="header-right">
          <nav>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/watchlist" className="nav-link">Watchlist</Link>
          </nav>
          {user ? (
            <div className="user-info">
              <img src={user.photoURL} alt="User" className="avatar" />
              <span className="user-name">Welcome, {user.displayName?.split(' ')[0]}</span>
              <button onClick={logout} className="btn-logout">Logout</button>
            </div>
          ) : (
            <button onClick={signInWithGoogle} className="btn-login">Login</button>
          )}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        {/* Pass user prop to Watchlist */}
        <Route path="/watchlist" element={<Watchlist user={user} />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>

      {/* FOOTER ADDED HERE */}
      <footer className="app-footer">
        &copy; 2025 RRH
      </footer>
    </div>
  );
}

export default App;