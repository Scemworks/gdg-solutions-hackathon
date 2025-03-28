# AirBuddy - Your Personal Air Quality Companion

AirBuddy is a full-stack web application that helps you track air pollution, get health alerts based on the air quality index (AQI), and provides tips to stay safe during periods of poor air quality.

## Project Structure

The project is divided into two main components:

### Frontend (`/airbuddy-frontend`)

Built with Next.js 15 and TypeScript, the frontend provides an intuitive user interface for monitoring air quality.

```
/airbuddy-frontend
├── public/         # Static assets
├── src/            # Source code
│   ├── app/        # Next.js App Router components
│   │   ├── components/  # Reusable UI components
│   │   ├── about/       # About page
│   │   ├── aqi-tracking/ # AQI monitoring page
│   │   ├── forecast/    # 5-day forecast page
│   │   ├── safety-tips/ # Health recommendations page
├── package.json    # Dependencies and scripts
└── next.config.ts  # Next.js configuration
```

### Backend (`/airbuddy-backend`)

Built with Express.js, the backend provides API endpoints for retrieving air quality data.

```
/airbuddy-backend
├── index.js       # Express server and API routes
├── package.json   # Dependencies and scripts
└── vercel.json    # Vercel deployment configuration
```

## Features

- **Real-time Air Quality Index (AQI) Tracking**: Get up-to-date AQI information for your current location
- **Location-based Data**: Search for air quality information in any location
- **5-Day Pollution Forecast**: Plan ahead with pollution forecasts
- **Health Alerts**: Receive personalized health recommendations based on air quality
- **Detailed Pollutant Information**: View breakdowns of specific pollutants (PM2.5, PM10, Ozone, etc.)
- **Safety Tips**: Get practical advice on how to protect yourself during poor air quality days
- **Community Reports**: Share and view local air quality observations

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS 4
- **Data Visualization**: Chart.js, Leaflet (maps)
- **State Management**: React Hooks

### Backend
- **Server**: Express.js
- **External APIs**: World Air Quality Index (WAQI), LocationIQ (geocoding)
- **Hosting**: Vercel

## Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd airbuddy-frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    ```

4. Open your browser to `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
    ```bash
    cd airbuddy-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file with the following content:
    ```
    AQI_API_KEY=your_waqi_api_key
    LOCATIONIQ_API_KEY=your_locationiq_api_key
    ```

4. Start the server:
    ```bash
    npm start
    ```

5. The API will be available at `http://localhost:5000`

## Contributing

Feel free to submit issues or pull requests. Follow these steps to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- World Air Quality Index project for providing the air quality data API
- LocationIQ for geocoding services
- GDG Solutions Hackathon for the inspiration