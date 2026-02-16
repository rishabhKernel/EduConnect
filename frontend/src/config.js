// API configuration
const config = {
  // Use localhost for local development, Render URL for everything else
  API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000'
    : 'https://educonnect-backend-2sj8.onrender.com'
};

export default config;

