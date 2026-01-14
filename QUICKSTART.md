# ⚡ Quick Start Guide

Get the app running in **5 minutes**!

## 🎯 Choose Your Path

### Path 1: Demo Mode (Fastest - 2 minutes)

Perfect for testing the UI and swipe functionality with mock data.

```bash
# Install and run
npm install
npm run dev
```

✅ **Done!** Visit `http://localhost:5173`

---

### Path 2: Full Setup with Google Maps (10 minutes)

For production-ready functionality with real place data.

#### Step 1: Get Google Maps API Key (5 min)

1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable: **Places API** + **Geocoding API**
4. Create API Key
5. Copy the key

#### Step 2: Setup Backend (3 min)

```bash
# Install backend dependencies
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env and paste your API key
echo "GOOGLE_MAPS_API_KEY=your_key_here" > .env
```

#### Step 3: Setup Frontend (1 min)

```bash
# From project root
cp .env.example .env.local

# Edit .env.local (optional for local dev)
# VITE_API_URL=http://localhost:3001/api
```

#### Step 4: Run Everything (1 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
# From project root
npm install
npm run dev
```

✅ **Done!** Visit `http://localhost:5173`

---

## 🎮 How to Use

1. **Enter tuition location** (e.g., "Orchard Road, Singapore")
2. **Pick categories** (restaurants, cafes, etc.)
3. **Click "Find Nearby Places"**
4. **Swipe:**
   - ← Left = Skip
   - → Right = Navigate via Google Maps

---

## 🐛 Troubleshooting

**"Demo Mode" message showing?**
- Backend not running OR
- API key not configured
- Check backend terminal for errors

**Nothing happens when searching?**
```bash
# Check backend is running
curl http://localhost:3001/api/health

# Should return: {"status":"ok","hasApiKey":true}
```

**Swipe not working?**
- Try Chrome or Safari
- Disable browser extensions
- Clear cache and reload

---

## 📚 Next Steps

- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
- Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand how it works
- Check [backend/README.md](./backend/README.md) for API documentation

---

## 💡 Pro Tips

1. **Save API costs:** Increase cache duration in `backend/server.js`
2. **Local testing:** Use "1.3521,103.8198" (lat,lng) instead of address
3. **Mobile testing:** Use `ngrok` to expose localhost to mobile device
4. **Production:** Deploy backend to Railway.app (easiest)

---

**Happy Swiping! 🎉**
