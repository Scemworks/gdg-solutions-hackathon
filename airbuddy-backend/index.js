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

// Current AQI API endpoint using WAQI API
app.get('/api/aqi', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    // Get WAQI API key from .env file
    const API_KEY = process.env.AQI_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    // Request current data from the WAQI API
    const currentResponse = await axios.get(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${API_KEY}`);
    
    // Check if the response was successful
    if (currentResponse.data.status !== 'ok') {
      return res.status(400).json({ error: 'Unable to fetch AQI data' });
    }
    
    const currentData = currentResponse.data.data;

    // Extract pollutant information from current data
    const components = {
      co: currentData.iaqi?.co?.v || 0,
      no: currentData.iaqi?.no?.v || 0,
      no2: currentData.iaqi?.no2?.v || 0,
      o3: currentData.iaqi?.o3?.v || 0,
      so2: currentData.iaqi?.so2?.v || 0,
      pm2_5: currentData.iaqi?.pm25?.v || 0,
      pm10: currentData.iaqi?.pm10?.v || 0,
      nh3: currentData.iaqi?.nh3?.v || 0
    };
    
    // Determine the main pollutant
    const mainPollutant = currentData.dominentpol || 'pm25';
    
    // Build the final AQI data response
    const aqiData = {
      location: {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        name: currentData.city?.name || 'Unknown'
      },
      pollution: {
        aqius: currentData.aqi,
        mainus: mainPollutant,
        aqicn: currentData.aqi,
        timestamp: currentData.time?.iso || new Date().toISOString()
      },
      components: components
    };
    
    res.json(aqiData);
  } catch (error) {
    console.error('WAQI API Error:', error.response?.data || error.message);
    
    // Handle different error scenarios
    if (error.response) {
      const status = error.response.status || 500;
      const errorMessage = error.response.data?.data || error.response.data?.message || 'API server error';
      res.status(status).json({ error: errorMessage });
    } else if (error.request) {
      console.error('No response received:', error.request);
      res.status(503).json({ error: 'Unable to connect to AQI service' });
    } else {
      res.status(500).json({ error: `Request error: ${error.message}` });
    }
  }
});

// Forecast API route for 5 future days using WAQI API
app.get('/api/aqi/forecast', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const API_KEY = process.env.AQI_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    const response = await axios.get(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${API_KEY}`);
    
    if (response.data.status !== 'ok') {
      return res.status(400).json({ error: 'Unable to fetch AQI forecast data' });
    }
    
    const data = response.data.data;
    const forecastData = data.forecast;
    
    if (!forecastData || !forecastData.daily) {
      return res.status(404).json({ error: 'Forecast data not available for this location' });
    }
    
    const dailyForecast = forecastData.daily;
    // Process forecast data for each pollutant: slice to return only the next 5 days
    const forecastFor5Days = {};
    Object.keys(dailyForecast).forEach(pollutant => {
      const forecastArray = dailyForecast[pollutant];
      forecastFor5Days[pollutant] = forecastArray.slice(0, 5);
    });
    
    res.json({
      location: data.city ? data.city.name : 'Unknown',
      forecast: forecastFor5Days
    });
  } catch (error) {
    console.error('WAQI Forecast API Error:', error.response?.data || error.message);
    
    if (error.response) {
      const status = error.response.status || 500;
      const errorMessage = error.response.data?.data || error.response.data?.message || 'API server error';
      res.status(status).json({ error: errorMessage });
    } else if (error.request) {
      console.error('No response received:', error.request);
      res.status(503).json({ error: 'Unable to connect to AQI service' });
    } else {
      res.status(500).json({ error: `Request error: ${error.message}` });
    }
  }
});



app.get('/api/geocode', async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }
    
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
    
    const result = response.data[0];
    res.json({
      lat: result.lat,
      lon: result.lon,
      display_name: result.display_name
    });
    
  } catch (error) {
    console.error('Geocoding API Error:', error.response?.data || error.message);
    
    if (error.response) {
      const status = error.response.status || 500;
      const errorMessage = error.response.data?.error || 'Geocoding service error';
      res.status(status).json({ error: errorMessage });
    } else if (error.request) {
      console.error('No response received:', error.request);
      res.status(503).json({ error: 'Unable to connect to geocoding service' });
    } else {
      res.status(500).json({ error: `Request error: ${error.message}` });
    }
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

// Export the Express API
export default app;
