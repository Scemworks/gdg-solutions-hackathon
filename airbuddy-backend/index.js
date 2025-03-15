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

// New endpoint: Forecast API route for 5 future days using WAQI API
app.get('/api/aqi/forecast', async (req, res) => {
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
    
    // Request data from the WAQI API
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

// AQI Map Data - Get multiple locations at once
app.get('/api/aqi/map', async (req, res) => {
  try {
    const API_KEY = process.env.AQI_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    // Get query parameters
    const { bounds, zoom } = req.query;
    
    // Fetch data from WAQI map data endpoint which gives stations in the viewport
    let mapDataUrl = 'https://api.waqi.info/mapq/bounds/';
    
    if (bounds) {
      // Format should be bounds=lat1,lng1,lat2,lng2 (SW and NE corners of viewport)
      mapDataUrl += `?token=${API_KEY}&bounds=${bounds}`;
    } else {
      // If no bounds provided, get world data (limited by WAQI API)
      mapDataUrl += `?token=${API_KEY}`;
    }
    
    // Add latlng parameter if user clicked on a specific point
    const { lat, lon } = req.query;
    if (lat && lon) {
      mapDataUrl += `&latlng=${lat},${lon}`;
    }
    
    const response = await axios.get(mapDataUrl);
    
    if (!response.data || response.data.status !== 'ok') {
      return res.status(400).json({ error: 'Unable to fetch AQI map data' });
    }
    
    // Transform the data into our API format
    const stations = response.data.data || [];
    const results = stations.map(station => ({
      location: {
        lat: parseFloat(station.lat),
        lon: parseFloat(station.lon),
        name: station.station?.name || 'Unknown'
      },
      pollution: {
        aqius: station.aqi,
        mainus: station.pol || 'pm25',
        aqicn: station.aqi,
        timestamp: new Date().toISOString()
      }
    }));
    
    // Allow custom locations through query params
    if (req.query.locations) {
      try {
        // Format should be: ?locations=[{"lat":37.7749,"lon":-122.4194,"name":"San Francisco"},...]
        const customLocations = JSON.parse(req.query.locations);
        
        // Process all custom locations in parallel
        const customPromises = customLocations.map(async location => {
          try {
            const { lat, lon, name } = location;
            const response = await axios.get(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${API_KEY}`);
            
            if (response.data.status !== 'ok') {
              return null;
            }
            
            const data = response.data.data;
            const mainPollutant = data.dominentpol || 'pm25';
            
            return {
              location: {
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                name: name || data.city?.name || 'Unknown'
              },
              pollution: {
                aqius: data.aqi,
                mainus: mainPollutant,
                aqicn: data.aqi,
                timestamp: data.time?.iso || new Date().toISOString()
              }
            };
          } catch (error) {
            console.error(`Error fetching data for location ${location.name}:`, error.message);
            return null;
          }
        });
        
        const customResults = await Promise.all(customPromises);
        const validCustomResults = customResults.filter(result => result !== null);
        
        // Combine the results with any custom locations
        results.push(...validCustomResults);
      } catch (e) {
        console.error('Error parsing custom locations:', e);
      }
    }
    
    res.json(results);
    
  } catch (error) {
    console.error('AQI Map API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch AQI map data' });
  }
});

// Handle clicking on arbitrary map locations
app.get('/api/aqi/point', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const API_KEY = process.env.AQI_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    // Request data from the WAQI API for the clicked point
    const response = await axios.get(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${API_KEY}`);
    
    if (response.data.status !== 'ok') {
      return res.status(400).json({ error: 'Unable to fetch AQI data for this location' });
    }
    
    const data = response.data.data;
    const mainPollutant = data.dominentpol || 'pm25';
    
    // Extract pollutant information
    const components = {
      co: data.iaqi?.co?.v || 0,
      no: data.iaqi?.no?.v || 0,
      no2: data.iaqi?.no2?.v || 0,
      o3: data.iaqi?.o3?.v || 0,
      so2: data.iaqi?.so2?.v || 0,
      pm2_5: data.iaqi?.pm25?.v || 0,
      pm10: data.iaqi?.pm10?.v || 0,
      nh3: data.iaqi?.nh3?.v || 0
    };
    
    // Prepare and send the response
    res.json({
      location: {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        name: data.city?.name || 'Unknown'
      },
      pollution: {
        aqius: data.aqi,
        mainus: mainPollutant,
        aqicn: data.aqi,
        timestamp: data.time?.iso || new Date().toISOString()
      },
      components: components
    });
    
  } catch (error) {
    console.error('AQI Point API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch AQI data for this location' });
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
