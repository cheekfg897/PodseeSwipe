# Parents' Wait Time Guide - Complete Setup Guide

A mobile-responsive web app that helps parents discover nearby places to eat, shop, and relax while their children are in tuition.

## 🎯 Features

- **Landing Page** with category selection (restaurants, cafes, banks, shopping, etc.)
- **Swipe Interface** (Tinder-style) - swipe left to skip, swipe right to navigate
- **Google Maps Integration** - instant directions to selected places
- **Radius Selection** - filter by 2km or 5km distance
- **Smart Caching** - reduces API costs by caching results
- **Mobile-First Design** - optimized for parents on-the-go

---

## 📋 Prerequisites

- **Node.js** 16+ installed
- **Google Cloud Account** (for Maps API)
- **npm** or **yarn** package manager

---

## 🚀 Quick Start (2 Options)

### Option 1: Demo Mode (No Backend Required)

The app works with mock data out of the box!

```bash
# Just run the frontend
npm install
npm run dev
```

Visit `http://localhost:5173` and start swiping!

### Option 2: Full Setup (With Real Google Maps Data)

Follow the complete setup below for production-ready functionality.

---

## 🔧 Complete Setup Instructions

### Step 1: Clone/Download the Project

```bash
# If using git
git clone your-repo-url
cd parents-wait-time-guide
```

### Step 2: Frontend Setup

```bash
# Install frontend dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local and set your backend URL
# For local development:
VITE_API_URL=http://localhost:3001/api

# For production:
VITE_API_URL=https://your-backend-url.com/api
```

### Step 3: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install backend dependencies
npm install

# Copy environment example
cp .env.example .env

# Edit .env and add your Google Maps API key (see Step 4)
nano .env
```

### Step 4: Get Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a Project**
   - Click "Select a project" → "New Project"
   - Name it (e.g., "Parents Wait Time App")
   - Click "Create"

3. **Enable Required APIs**
   - Go to "APIs & Services" → "Library"
   - Search and enable:
     - ✅ **Places API**
     - ✅ **Geocoding API**
     - ✅ **Maps JavaScript API** (optional)

4. **Create API Key**
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy the key (e.g., `AIzaSyDxxx...`)

5. **Restrict API Key (IMPORTANT)**
   - Click on your API key to edit
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose: Places API, Geocoding API
   - Click "Save"

6. **Enable Billing**
   - Go to "Billing"
   - Add a payment method (Google gives $200/month free credit)
   - Set up budget alerts (recommended: $50/month)

7. **Add Key to Backend**
   ```bash
   # In backend/.env file:
   GOOGLE_MAPS_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxx
   PORT=3001
   ```

### Step 5: Run the Application

#### Terminal 1 - Backend Server
```bash
cd backend
npm start
```

You should see:
```
🚀 Server running on http://localhost:3001
🔑 Google Maps API Key: ✅ Configured
```

#### Terminal 2 - Frontend App
```bash
# From project root
npm run dev
```

Visit: `http://localhost:5173`

---

## 🎮 How to Use

1. **Landing Page**
   - Enter tuition center address
   - Select categories (restaurants, cafes, etc.)
   - Click "Find Nearby Places"

2. **Swipe Interface**
   - **Swipe Left** ← Skip to next place
   - **Swipe Right** → Navigate to place via Google Maps
   - Toggle between 2km and 5km radius

3. **Navigation**
   - Swiping right automatically opens Google Maps
   - On mobile: Opens native Google Maps app
   - On desktop: Opens in new browser tab

---

## 📂 Project Structure

```
parents-wait-time-guide/
├── backend/                    # Node.js backend
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment template
│   └── README.md              # Backend documentation
│
├── src/
│   ├── app/
│   │   ├── App.tsx            # Main app component
│   │   └── components/
│   │       ├── LandingPage.tsx      # Initial page with settings
│   │       ├── SwipeableCard.tsx    # Swipeable card component
│   │       ├── PlaceCard.tsx        # Place details display
│   │       └── LocationHeader.tsx   # Header with radius toggle
│   │
│   ├── services/
│   │   └── api.ts             # Backend API calls
│   │
│   ├── types/
│   │   └── place.ts           # TypeScript interfaces
│   │
│   └── utils/
│       └── mockData.ts        # Mock data for demo mode
│
├── .env.example               # Frontend environment template
├── package.json               # Frontend dependencies
└── SETUP_GUIDE.md            # This file
```

---

## 🔐 Security Checklist

- ✅ **Never** commit `.env` files to git
- ✅ Google Maps API key is stored in backend only
- ✅ API key restricted to specific APIs
- ✅ Set up billing alerts in Google Cloud
- ✅ Use different keys for dev/production
- ✅ Monitor API usage weekly

---

## 💰 Cost Estimation

### Google Maps API Pricing

**Per 1000 requests:**
- Nearby Search: $32
- Geocoding: $5
- Place Photos: $7

**Free Tier:**
- $200/month credit (covers ~6,000 searches)

**With Caching (2 hours):**
- 100 users/day = ~$3.20/day = ~$96/month ✅ FREE
- 500 users/day = ~$16/day = ~$480/month 💵 Paid

**Tips to Reduce Costs:**
1. Increase cache duration (current: 2 hours)
2. Limit searches per user
3. Use geolocation instead of address search
4. Implement user authentication

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm run build
# Upload dist/ folder to Netlify
```

**Environment Variable:**
```
VITE_API_URL=https://your-backend.herokuapp.com/api
```

### Backend (Heroku)

```bash
# Install Heroku CLI
heroku login
heroku create parents-wait-time-api

# Set environment variable
heroku config:set GOOGLE_MAPS_API_KEY=your_key_here

# Deploy
git subtree push --prefix backend heroku main
```

### Backend (Railway.app) - Easiest

1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Select the `backend` folder
4. Add environment variable: `GOOGLE_MAPS_API_KEY`
5. Copy the provided URL (e.g., `https://xxx.railway.app`)
6. Update frontend `VITE_API_URL` to Railway URL

---

## 🐛 Troubleshooting

### Backend Issues

**"API Key not configured"**
- Make sure `.env` file exists in backend folder
- Check `GOOGLE_MAPS_API_KEY` is set correctly
- Restart the server

**"API error: 403"**
- Places API or Geocoding API not enabled
- Check Google Cloud Console

**"API error: 429"**
- Rate limit exceeded
- Wait a few minutes or increase quota

### Frontend Issues

**"Network Error" when searching**
- Backend server not running
- Check `VITE_API_URL` in `.env.local`
- CORS issue - verify backend allows frontend origin

**Swipe not working on mobile**
- Clear browser cache
- Try Chrome or Safari
- Check for JavaScript errors in console

**Using mock data instead of real data**
- Check backend connection
- Verify API key is valid
- Look for errors in browser console

---

## 📱 Mobile Testing

### iOS Safari
- Open in Safari
- Swipe gestures work natively
- Google Maps opens in app

### Android Chrome
- Best experience on Chrome
- Test touch sensitivity
- Verify Maps app opens correctly

### PWA (Progressive Web App)
The app can be installed on mobile:
1. Open in mobile browser
2. Click "Add to Home Screen"
3. Use like a native app

---

## 🎨 Customization

### Change Categories
Edit `/src/app/components/LandingPage.tsx`:
```typescript
const categories: Category[] = [
  {
    id: 'custom',
    name: 'Custom Category',
    icon: <Icon className="w-6 h-6" />,
    types: ['google_type_1', 'google_type_2']
  }
];
```

### Change Radius Options
Edit `/src/app/components/LocationHeader.tsx`:
```typescript
// Add more radius options
<button onClick={() => onRadiusChange(1)}>1 km</button>
<button onClick={() => onRadiusChange(10)}>10 km</button>
```

### Change Cache Duration
Edit `/backend/server.js`:
```javascript
// Cache for 4 hours instead of 2
const cache = new NodeCache({ stdTTL: 14400 });
```

---

## 📄 License

MIT License - Feel free to use for personal or commercial projects

---

## 🤝 Support

For issues or questions:
1. Check this guide
2. Review backend logs: `cd backend && npm start`
3. Check browser console for frontend errors
4. Review Google Cloud Console for API issues

---

## ✅ Production Checklist

Before going live:

- [ ] Test with real addresses in your area
- [ ] Set up Google Cloud billing alerts
- [ ] Restrict API keys properly
- [ ] Deploy backend to production server
- [ ] Update frontend `VITE_API_URL` to production backend
- [ ] Test on multiple mobile devices
- [ ] Monitor API usage for first week
- [ ] Set up error logging (e.g., Sentry)
- [ ] Add user analytics (optional)
- [ ] Create privacy policy (if collecting data)

---

**Happy Coding! 🎉**
