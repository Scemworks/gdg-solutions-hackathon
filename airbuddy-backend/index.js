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

// AQI API endpoint using WAQI API
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

    // Request forecast data from the WAQI API
    let forecastData = null;
    try {
      const forecastResponse = await axios.get(`https://api.waqi.info/feed/geo:${lat};${lon}/forecast/?token=${API_KEY}`);
      if (forecastResponse.data.status === 'ok') {
        forecastData = forecastResponse.data.data;
      }
    } catch (error) {
      console.error('WAQI Forecast API Error:', error.response?.data || error.message);
    }

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
    
    // Process forecast data if available
    const processForecast = (forecast) => {
      const componentMapping = { pm25: 'pm2_5' };
      const dailyForecast = [];
      const pollutants = Object.keys(forecast.daily || {});
      const days = new Set();
      
      pollutants.forEach(pollutant => {
        (forecast.daily[pollutant] || []).forEach(entry => {
          days.add(entry.day);
        });
      });
      
      Array.from(days).sort().forEach(day => {
        const components = {};
        pollutants.forEach(pollutant => {
          const entry = (forecast.daily[pollutant] || []).find(e => e.day === day);
          if (entry && entry.avg !== undefined) {
            const key = componentMapping[pollutant] || pollutant;
            components[key] = entry.avg;
          }
        });
        
        dailyForecast.push({
          day: day,
          components: components
        });
      });
      
      return dailyForecast;
    };

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
      components: components,
      forecast: forecastData?.forecast ? processForecast(forecastData.forecast) : []
    };
    
    res.json(aqiData);
  } catch (error) {
    console.error('WAQI API Error:', error.response?.data || error.message);
    
    // Handle different error scenarios
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      const status = error.response.status || 500;
      const errorMessage = error.response.data?.data || error.response.data?.message || 'API server error';
      res.status(status).json({ error: errorMessage });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      res.status(503).json({ error: 'Unable to connect to AQI service' });
    } else {
      // Something happened in setting up the request
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
    
    const result = response.data[0];
    res.json({
      lat: result.lat,
      lon: result.lon,
      display_name: result.display_name
    });
    
  } catch (error) {
    console.error('Geocoding API Error:', error.response?.data || error.message);
    
    // Handle different error scenarios
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      const status = error.response.status || 500;
      const errorMessage = error.response.data?.error || 'Geocoding service error';
      res.status(status).json({ error: errorMessage });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      res.status(503).json({ error: 'Unable to connect to geocoding service' });
    } else {
      // Something happened in setting up the request
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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the Express API
export default app;
