import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Add middleware to parse JSON requests and enable CORS
app.use(express.json());
app.use(cors());

app.get('/', (_, res) => {
  res.send('Server is running');
});

// AQI API endpoint with pollutant details
app.get('/api/aqi', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    // Get API key from .env file
    const API_KEY = process.env.AQI_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    // Request data from the AirVisual API
    const response = await axios.get(`https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${API_KEY}`);
    
    const currentData = response.data.data.current;
    const pollution = currentData.pollution;
    const weather = currentData.weather;
    
    // Return AQI data along with detailed pollutant information
    const aqiData = {
      city: response.data.data.city,
      state: response.data.data.state, // optional: if available
      country: response.data.data.country,
      location: response.data.data.location, // coordinates and type
      pollution: {
        aqius: pollution.aqius,        // US AQI value
        mainus: pollution.mainus,        // Main pollutant for US standard (e.g., "p2" for PM2.5)
        aqicn: pollution.aqicn,          // Chinese AQI value
        maincn: pollution.maincn,        // Main pollutant for Chinese standard
        timestamp: pollution.ts          // Timestamp of the data
      },
      weather: {
        temperature: weather.tp,         // Temperature in Celsius
        pressure: weather.pr,            // Atmospheric pressure in hPa
        humidity: weather.hu,            // Humidity percentage
        wind_speed: weather.ws           // Wind speed (m/s or km/h, depending on API documentation)
      }
    };
    
    res.json(aqiData);
  } catch (error) {
    console.error('AQI API Error:', error);
    res.status(500).json({ error: 'Failed to fetch AQI data' });
  }
});

// Geocoding API endpoint
app.get('/api/geocode', async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }
    
    // Get LocationIQ access token from .env file
    const GEOCODE_ACCESS_TOKEN = process.env.LOCATIONIQ_API_KEY;
    
    if (!GEOCODE_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Geocoding access token not configured' });
    }
    
    const response = await axios.get(`https://us1.locationiq.com/v1/search.php`, {
      params: {
        key: GEOCODE_ACCESS_TOKEN,
        q: location,
        format: 'json'
      }
    });
    
    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    const result = response.data[0];
    res.json({
      lat: result.lat,
      lon: result.lon,
      display_name: result.display_name
    });
    
  } catch (error) {
    console.error('Geocoding API Error:', error);
    res.status(500).json({ error: 'Failed to geocode location' });
  }
});

// Debug route to check if .env is loaded correctly
app.get('/api/env-check', (_, res) => {
  const envVars = {
    aqi_api_key: process.env.AQI_API_KEY ? 'loaded' : 'not loaded',
    locationiq_api_key: process.env.LOCATIONIQ_API_KEY ? 'loaded' : 'not loaded'
  };
  
  res.json({
    status: 'Environment check',
    environment: process.env.NODE_ENV || 'development',
    variables: envVars
  });
});

app.listen(port, () => {
// Export the Express API
export default app;
