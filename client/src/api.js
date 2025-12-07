// If we are in production (Vercel), use the Cloud Backend URL.
// If we are in dev (Localhost), use port 5000.

const API_URL = import.meta.env.MODE === 'production'
    ? 'https://your-backend-app-name.onrender.com' // We will update this string later!
    : 'http://localhost:5000';

export default API_URL;