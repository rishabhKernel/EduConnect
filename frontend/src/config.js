// API configuration
const config = {
  API_URL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000'
    : 'https://educonnect-backend-2sj8.onrender.com'
};

export default config;

