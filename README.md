# 🗺️ Parents' Wait Time Guide

A mobile-first web application that helps parents discover nearby places to eat, shop, and relax while their children are in tuition classes.

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![React](https://img.shields.io/badge/React-18.3-61dafb) ![Node](https://img.shields.io/badge/Node.js-16+-339933)

## ✨ Features

- 🎯 **Smart Landing Page** - Select categories and set location before searching
- 📱 **Swipe Interface** - Tinder-style card swiping (left to skip, right to navigate)
- 🗺️ **Google Maps Integration** - Instant navigation to selected places
- 📍 **Flexible Radius** - Toggle between 2km and 5km search radius
- 🏷️ **8 Categories** - Restaurants, cafes, shopping, banks, parks, libraries, health, gyms
- ⚡ **Smart Caching** - Reduces API costs by caching results for 2 hours
- 📱 **Mobile-Optimized** - Touch gestures and responsive design
- 🎨 **Beautiful UI** - Modern gradient backgrounds and smooth animations

## 🎬 Demo

**Try it now:**
1. Enter any address (e.g., "Orchard Road, Singapore")
2. Select categories you're interested in
3. Swipe through nearby places
4. Swipe right to navigate instantly!

## 🚀 Quick Start

### Option 1: Demo Mode (No setup required)

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` - Uses mock data for immediate testing.

### Option 2: Full Setup (10 minutes)

See [QUICKSTART.md](./QUICKSTART.md) for step-by-step instructions.

## 📸 Screenshots

### Landing Page
- Enter tuition center location
- Select categories (multi-select)
- Choose what you're looking for

### Swipe Interface
- Beautiful card design
- Swipe left to skip
- Swipe right to navigate
- Shows distance, ratings, hours

### Google Maps Integration
- Opens native app on mobile
- Instant directions
- One-tap navigation

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Motion (Framer Motion)** - Swipe animations
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Axios** - HTTP client
- **Node-Cache** - Caching layer
- **Google Maps APIs** - Places, Geocoding

## 📂 Project Structure

```
parents-wait-time-guide/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Main app
│   │   └── components/
│   │       ├── LandingPage.tsx        # Initial page
│   │       ├── SwipeableCard.tsx      # Swipeable card
│   │       ├── PlaceCard.tsx          # Place details
│   │       └── LocationHeader.tsx     # Header with radius
│   ├── services/
│   │   └── api.ts                     # Backend API calls
│   ├── types/
│   │   └── place.ts                   # TypeScript types
│   └── utils/
│       └── mockData.ts                # Demo data
│
├── backend/
│   ├── server.js                      # Express server
│   ├── package.json                   # Backend deps
│   └── .env.example                   # Config template
│
├── QUICKSTART.md                      # Quick setup guide
├── SETUP_GUIDE.md                     # Detailed setup
├── ARCHITECTURE.md                    # System design
└── README.md                          # This file
```

## 🔧 Installation

### Prerequisites
- Node.js 16+
- Google Maps API key (for production)

### Setup

```bash
# Clone repository
git clone <your-repo-url>
cd parents-wait-time-guide

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Add your GOOGLE_MAPS_API_KEY to .env

# Run backend (Terminal 1)
npm start

# Run frontend (Terminal 2)
cd ..
npm run dev
```

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and flow
- **[backend/README.md](./backend/README.md)** - Backend API documentation

## 🎯 Use Cases

### For Parents
- Find cafes to work while child is in tuition
- Discover nearby restaurants for dinner after class
- Locate banks/ATMs for quick errands
- Find parks for relaxation

### For Tuition Centers
- Provide value-added service to parents
- Embed on website or app
- Customize categories for location

### For Developers
- Learn swipe gesture implementation
- Study Google Maps API integration
- Reference backend caching strategies

## 💰 Cost Estimation

### Google Maps API Pricing
- Nearby Search: $32 per 1,000 requests
- Geocoding: $5 per 1,000 requests
- Free tier: $200/month credit

### With Caching (2 hours)
- 100 users/day: ~$3/day = **$96/month** (FREE with credit)
- 500 users/day: ~$16/day = **$480/month**

### Cost Optimization
- ✅ 2-hour caching reduces costs by ~80%
- ✅ Batch requests for multiple categories
- ✅ Use geolocation instead of address search
- ✅ Implement rate limiting per user

## 🔐 Security

- ✅ API key stored securely in backend `.env`
- ✅ Never exposed to frontend/browser
- ✅ CORS configured for specific origins
- ✅ API key restricted to specific Google APIs
- ✅ Rate limiting and caching prevent abuse

## 🚀 Deployment

### Frontend (Vercel)
```bash
vercel
# Set VITE_API_URL to your backend URL
```

### Backend (Railway.app)
1. Connect GitHub repo
2. Set `GOOGLE_MAPS_API_KEY` environment variable
3. Deploy automatically

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- Google Maps Platform for location APIs
- Unsplash for placeholder images
- Motion (Framer Motion) for smooth animations
- Lucide for beautiful icons

## 📞 Support

- **Issues:** Open a GitHub issue
- **Questions:** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Backend:** See [backend/README.md](./backend/README.md)

## 🔮 Roadmap

- [ ] User accounts and favorites
- [ ] Advanced filters (price, ratings, open now)
- [ ] Social sharing features
- [ ] Offline PWA support
- [ ] AI-powered recommendations
- [ ] Parent community groups
- [ ] Multi-language support
- [ ] Dark mode

## ⚠️ Known Issues

1. **Indoor GPS accuracy** - May not get precise location inside buildings
2. **API costs** - Can scale with heavy usage (use caching!)
3. **Rate limits** - Google Maps has daily quotas
4. **Opening hours** - May not be real-time accurate

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) troubleshooting section for solutions.

## 🎓 Learning Resources

**Built with:**
- [React Documentation](https://react.dev/)
- [Google Maps Platform](https://developers.google.com/maps)
- [Motion Documentation](https://motion.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for parents who deserve a break while their kids learn!**

⭐ Star this repo if you find it useful!
