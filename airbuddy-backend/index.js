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
    
    // Request current data (still needed for location and basic info)
    const currentResponse = await axios.get(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${API_KEY}`);
    
    // Check if the current response was successful
    if (currentResponse.data.status !== 'ok') {
      return res.status(400).json({ error: 'Unable to fetch AQI data' });
    }
    
    const currentData = currentResponse.data.data;

    // Fetch forecast data separately
    const forecastResponse = await axios.get(`https://api.waqi.info/forecast/geo:${lat};${lon}/?token=${API_KEY}`);
    
    // Check if the forecast response was successful
    if (forecastResponse.data.status !== 'ok') {
      return res.status(400).json({ error: 'Unable to fetch forecast data' });
    }
    
    const forecastData = forecastResponse.data.data;

    // Extract current pollutant information
    const components = {
      co: currentData.iaqi.co?.v || 0,
      no: currentData.iaqi.no?.v || 0,
      no2: currentData.iaqi.no2?.v || 0,
      o3: currentData.iaqi.o3?.v || 0,
      so2: currentData.iaqi.so2?.v || 0,
      pm2_5: currentData.iaqi.pm25?.v || 0,
      pm10: currentData.iaqi.pm10?.v || 0,
      nh3: currentData.iaqi.nh3?.v || 0
    };
    
    // Determine the main pollutant
    const mainPollutant = currentData.dominentpol || 'pm25';
    
    // Process forecast data
    const processForecast = (forecast) => {
      const componentMapping = { 
        pm25: 'pm2_5',
        pm10: 'pm10',
        o3: 'o3',
        no2: 'no2',
        so2: 'so2'
      };
      
      const dailyForecast = [];
      const pollutants = Object.keys(forecast.daily || {});
      const days = new Set();
      
      // Collect all unique days from all pollutants
      pollutants.forEach(pollutant => {
        (forecast.daily[pollutant] || []).forEach(entry => {
          days.add(entry.day);
        });
      });
      
      // For each day, collect data for all available pollutants
      Array.from(days).sort().forEach(day => {
        const components = {};
        let maxAqi = 0;
        let mainPollutant = '';
        
        pollutants.forEach(pollutant => {
          const entry = (forecast.daily[pollutant] || []).find(e => e.day === day);
          if (entry) {
            const key = componentMapping[pollutant] || pollutant;
            
            // Store min, max and avg values if available
            if (entry.avg !== undefined) components[`${key}_avg`] = entry.avg;
            if (entry.min !== undefined) components[`${key}_min`] = entry.min;
            if (entry.max !== undefined) components[`${key}_max`] = entry.max;
            
            // Track the highest AQI value to determine main pollutant
            if (entry.max > maxAqi) {
              maxAqi = entry.max;
              mainPollutant = key;
            }
          }
        });
        
        // Calculate approximate AQI for the day based on max values
        const aqi = maxAqi || (components.pm2_5_max || components.pm2_5_avg || 0);
        
        dailyForecast.push({
          day,
          aqi,
          mainPollutant: mainPollutant || 'pm2_5',
          components
        });
      });
      
      return dailyForecast;
    };

    // Build the final AQI data response with emphasis on forecast data
    const aqiData = {
      location: {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        name: currentData.city?.name || 'Unknown'
      },
      current: {
        aqi: currentData.aqi,
        mainPollutant,
        components,
        timestamp: currentData.time?.iso || new Date().toISOString()
      },
      forecast: processForecast(forecastData.forecast)
    };
    
    res.json(aqiData);
  } catch (error) {
    console.error('WAQI API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the Express API
export default app;