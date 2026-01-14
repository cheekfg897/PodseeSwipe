# Parents' Wait Time Guide - Backend API

Backend Node.js server for handling Google Maps Places API calls securely.

## Features

- 🔒 Secure API key storage (never exposed to frontend)
- 💾 Automatic caching (2 hours) to reduce API costs
- 🗺️ Geocoding support (address → coordinates)
- 📍 Nearby places search with custom radius (2km/5km)
- 🏷️ Category filtering (restaurants, cafes, banks, etc.)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - **Places API**
   - **Geocoding API**
   - **Places API (New)** (optional, for better pricing)
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API key
nano .env  # or use any text editor
```

Add your key:
```
GOOGLE_MAPS_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3001
```

### 4. (Optional) Restrict API Key

For security, restrict your API key in Google Cloud Console:

1. Go to your API key settings
2. Under "Application restrictions":
   - Choose "HTTP referrers" for frontend key
   - Choose "IP addresses" for backend key (use backend server IP)
3. Under "API restrictions":
   - Select "Restrict key"
   - Choose only: Places API, Geocoding API

### 5. Run the Server

Development mode (auto-restart on changes):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "message": "Server is running",
  "hasApiKey": true
}
```

### Geocode Address
```
POST /api/geocode
Content-Type: application/json

{
  "address": "123 Main Street, Singapore"
}
```

Response:
```json
{
  "success": true,
  "location": {
    "lat": 1.3521,
    "lng": 103.8198
  }
}
```

### Get Nearby Places
```
POST /api/nearby-places
Content-Type: application/json

{
  "location": "1.3521,103.8198",  // or address string
  "radius": 5,                     // in km
  "categories": ["food", "cafe"]   // array of category IDs
}
```

Response:
```json
{
  "success": true,
  "places": [
    {
      "id": "ChIJxxxx",
      "name": "The Cozy Cafe",
      "category": "Cafe",
      "rating": 4.5,
      "distance": 0.8,
      "openingHours": "Open now",
      "description": "123 Main St",
      "imageUrl": "https://...",
      "latitude": 1.3521,
      "longitude": 103.8198,
      "address": "123 Main St"
    }
  ]
}
```

## Category IDs

- `food` - Restaurants & Food
- `cafe` - Cafes & Coffee
- `shopping` - Shopping & Malls
- `banking` - Banks & ATMs
- `parks` - Parks & Recreation
- `library` - Libraries
- `health` - Pharmacy & Health
- `gym` - Gyms & Fitness

## Caching

Results are cached for 2 hours to reduce costs:
- Cache key: `location:radius:categories`
- Automatically expires after 7200 seconds
- Can be cleared by restarting server

## Cost Estimation

Google Maps API pricing (as of 2024):
- **Nearby Search**: $32 per 1000 requests
- **Geocoding**: $5 per 1000 requests
- **Place Photos**: $7 per 1000 requests

With caching:
- 100 unique searches/day = ~$3.20/day = ~$96/month
- 1000 unique searches/day = ~$32/day = ~$960/month

Free tier: $200/month credit (covers ~6000 searches)

## Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku login
heroku create your-app-name

# Set environment variable
heroku config:set GOOGLE_MAPS_API_KEY=your_key_here

# Deploy
git push heroku main
```

### Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Add environment variable: `GOOGLE_MAPS_API_KEY`
4. Railway will auto-detect Node.js and deploy

### Deploy to DigitalOcean App Platform

1. Go to DigitalOcean App Platform
2. Create new app from GitHub repo
3. Add environment variable
4. Deploy

## Security Best Practices

1. ✅ Never commit `.env` file to git
2. ✅ Use different API keys for dev/production
3. ✅ Set up billing alerts in Google Cloud
4. ✅ Restrict API key by IP address in production
5. ✅ Monitor API usage regularly
6. ✅ Implement rate limiting for production

## Troubleshooting

**API Key not working?**
- Make sure Places API and Geocoding API are enabled
- Check if billing is enabled in Google Cloud
- Verify API key restrictions

**CORS errors?**
- Update `cors()` middleware with specific origin in production
- Example: `app.use(cors({ origin: 'https://yourfrontend.com' }))`

**High costs?**
- Increase cache duration (change `stdTTL` in code)
- Implement user authentication and rate limiting
- Use the new Places API for better pricing

## License

MIT
