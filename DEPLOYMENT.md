# 🚀 Deployment Guide

Step-by-step guide to deploy your Parents' Wait Time Guide to production.

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Google Maps API key obtained and tested
- [ ] Billing enabled in Google Cloud Console
- [ ] API key restrictions configured
- [ ] Budget alerts set up ($50/month recommended)
- [ ] Backend tested locally with real API
- [ ] Frontend tested on mobile devices
- [ ] All environment variables documented
- [ ] .gitignore includes .env files

---

## 🎯 Deployment Options

### Option A: Quick Deploy (Railway + Vercel) ⚡
**Best for:** MVPs, prototypes, small projects  
**Cost:** Free tier available  
**Time:** 15 minutes

### Option B: Professional (DigitalOcean + Netlify) 💼
**Best for:** Production apps, scalability  
**Cost:** ~$5-10/month  
**Time:** 30 minutes

### Option C: Enterprise (AWS + CloudFront) 🏢
**Best for:** Large scale, custom infrastructure  
**Cost:** Variable, can be optimized  
**Time:** 1-2 hours

### Option D: GitHub Pages (Frontend-only)
**Best for:** Fast static hosting, demos  
**Cost:** Free  
**Time:** 10 minutes  
**Note:** Uses a frontend Google Maps key (no backend)

---

## ⚡ Option A: Quick Deploy (Recommended)

### Part 1: Deploy Backend to Railway

**1. Create Railway Account**
```bash
# Visit https://railway.app
# Sign up with GitHub
```

**2. Deploy Backend**
```bash
# In your project root
cd backend

# Create railway.json for configuration
```

Create `backend/railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**3. Deploy via Railway Dashboard**
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Select `backend` folder as root directory
5. Add environment variable:
   - Key: `GOOGLE_MAPS_API_KEY`
   - Value: Your API key
6. Click "Deploy"

**4. Get Backend URL**
```
Railway will provide a URL like:
https://your-app-production.up.railway.app

Copy this URL!
```

### Part 2: Deploy Frontend to Vercel

**1. Install Vercel CLI**
```bash
npm install -g vercel
```

**2. Configure Frontend**
```bash
# From project root
# Create vercel.json
```

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "https://your-backend.up.railway.app/api"
  }
}
```

**3. Deploy**
```bash
vercel

# Follow prompts:
# ? Set up and deploy? Yes
# ? Which scope? Your account
# ? Link to existing project? No
# ? What's your project's name? parents-wait-time-guide
# ? In which directory is your code located? ./
```

**4. Add Environment Variable**
```bash
# Add production environment variable
vercel env add VITE_API_URL production

# Enter your Railway backend URL:
# https://your-backend.up.railway.app/api
```

**5. Deploy to Production**
```bash
vercel --prod
```

**✅ Done!** Your app is live at `https://your-app.vercel.app`

---

## 💼 Option B: Professional Setup

### Backend: DigitalOcean App Platform

**1. Create DigitalOcean Account**
- Visit: https://www.digitalocean.com/
- Sign up and add payment method

**2. Create App**
1. Click "Apps" → "Create App"
2. Connect GitHub repository
3. Select repository and `backend` folder
4. Configure:
   - **Name:** parents-wait-time-api
   - **Region:** Closest to your users
   - **Instance Size:** Basic ($5/month)
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`

**3. Environment Variables**
```
GOOGLE_MAPS_API_KEY=your_key_here
PORT=8080
NODE_ENV=production
```

**4. Deploy**
- Click "Create Resources"
- Wait 5-10 minutes
- Copy the provided URL

### Frontend: Netlify

**1. Install Netlify CLI**
```bash
npm install -g netlify-cli
```

**2. Build Settings**

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_URL = "https://your-backend.ondigitalocean.app/api"
```

**3. Deploy**
```bash
netlify deploy --prod
```

**4. Configure Environment**
```bash
# Add environment variable via Netlify dashboard
# Site settings → Environment variables
# VITE_API_URL = your backend URL
```

---

## 🏢 Option C: Enterprise (AWS)

### Backend: AWS Elastic Beanstalk

**1. Install EB CLI**
```bash
pip install awsebcli
```

**2. Initialize**
```bash
cd backend
eb init

# Select:
# - Region: us-east-1 (or closest)
# - Application name: parents-wait-time-backend
# - Platform: Node.js
# - SSH: Yes
```

**3. Create Environment**
```bash
eb create production

# Set environment variables
eb setenv GOOGLE_MAPS_API_KEY=your_key_here
```

**4. Deploy**
```bash
eb deploy
```

### Frontend: AWS S3 + CloudFront

**1. Build**
```bash
npm run build
```

**2. Create S3 Bucket**
```bash
aws s3 mb s3://parents-wait-time-guide
aws s3 website s3://parents-wait-time-guide --index-document index.html
```

**3. Upload**
```bash
aws s3 sync dist/ s3://parents-wait-time-guide --acl public-read
```

**4. Create CloudFront Distribution**
- Origin: Your S3 bucket
- Default root object: index.html
- Enable HTTPS

---

## Option D: GitHub Pages (Frontend-only)

**1. Create a restricted frontend key (Google Cloud Console)**
- Application restrictions: **HTTP referrers (web sites)**
  - `https://YOURUSERNAME.github.io/*`
  - (Optional custom domain) `https://yourdomain.com/*`
- API restrictions: **Restrict key**
  - Places API
  - (Optional) Maps JavaScript API
  - (Optional) Geocoding API
- Set quotas and billing budget alerts

**2. Add the frontend key for build**
Set `VITE_GOOGLE_MAPS_API_KEY` at build time (this is embedded into the static JS bundle).

Local dev:
```
# .env.local
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDxxxxxxxxxx
```

GitHub Actions (example):
```
VITE_GOOGLE_MAPS_API_KEY: ${{ secrets.VITE_GOOGLE_MAPS_API_KEY }}
```

**3. Build and deploy to GitHub Pages**
```
npm run build
```
Upload the `dist` folder to the `gh-pages` branch (or use GitHub Actions to deploy).

## 🔒 Security Configuration

### Google Maps API Key Restrictions

**For Backend (Production):**
```
Application restrictions:
  ✅ HTTP referrers (websites)
  
Referrer rules:
  your-backend-domain.com/*
  your-backend-domain.railway.app/*

API restrictions:
  ✅ Restrict key
  
APIs allowed:
  ✅ Places API
  ✅ Geocoding API
  ✅ Maps JavaScript API (if using)
```

**Alternative: IP Restriction (More Secure)**
```
Application restrictions:
  ✅ IP addresses
  
IP addresses:
  123.456.789.0  # Your backend server IP
```

### CORS Configuration

Update `backend/server.js`:
```javascript
// Production CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app.vercel.app', 'https://your-custom-domain.com']
    : 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
```

---

## 📊 Monitoring & Analytics

### 1. Google Cloud Monitoring

**Set Up Billing Alerts:**
1. Google Cloud Console → Billing
2. Budgets & alerts
3. Create budget: $50/month
4. Set alerts at: 50%, 90%, 100%

**Monitor API Usage:**
1. APIs & Services → Dashboard
2. View: Places API, Geocoding API
3. Track daily requests

### 2. Backend Monitoring

**Add Logging (Winston):**
```bash
cd backend
npm install winston
```

Update `server.js`:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});
```

### 3. Error Tracking (Sentry)

**Frontend:**
```bash
npm install @sentry/react
```

**Backend:**
```bash
cd backend
npm install @sentry/node
```

Configure in both environments with your Sentry DSN.

### 4. Uptime Monitoring

**Free Options:**
- UptimeRobot: https://uptimerobot.com/
- Better Stack: https://betterstack.com/
- Pingdom: https://www.pingdom.com/

Add checks for:
- Backend: `https://your-backend.com/api/health`
- Frontend: `https://your-app.com`

---

## 🧪 Post-Deployment Testing

### 1. Smoke Tests

```bash
# Test backend health
curl https://your-backend.com/api/health

# Test geocoding
curl -X POST https://your-backend.com/api/geocode \
  -H "Content-Type: application/json" \
  -d '{"address":"Orchard Road, Singapore"}'

# Test nearby places
curl -X POST https://your-backend.com/api/nearby-places \
  -H "Content-Type: application/json" \
  -d '{
    "location":"1.3521,103.8198",
    "radius":2,
    "categories":["cafe"]
  }'
```

### 2. Frontend Tests

- ✅ Landing page loads
- ✅ Can enter location
- ✅ Can select categories
- ✅ Loading spinner appears
- ✅ Cards display correctly
- ✅ Swipe gestures work
- ✅ Google Maps opens on swipe right

### 3. Mobile Tests

- ✅ Test on iPhone (Safari)
- ✅ Test on Android (Chrome)
- ✅ Test touch gestures
- ✅ Test Google Maps app opens
- ✅ Test different screen sizes

### 4. Load Testing

```bash
# Install Artillery
npm install -g artillery

# Create load test
artillery quick --count 100 --num 10 https://your-backend.com/api/health
```

---

## 🎯 Performance Optimization

### 1. Frontend

**Enable Compression:**
```javascript
// vite.config.ts
import compression from 'vite-plugin-compression';

export default {
  plugins: [compression()]
}
```

**Optimize Images:**
- Use WebP format
- Lazy load images
- Set proper image sizes

### 2. Backend

**Enable Gzip:**
```bash
npm install compression
```

```javascript
// server.js
const compression = require('compression');
app.use(compression());
```

**Database for Caching (Optional):**
```bash
npm install redis
```

Replace node-cache with Redis for persistent caching.

### 3. CDN Setup

**CloudFlare (Free):**
1. Add your domain to CloudFlare
2. Enable: Auto Minify, Brotli
3. Set caching rules
4. Enable Always Online

---

## 📈 Scaling Strategy

### Phase 1: MVP (< 1000 users/day)
- ✅ Railway/Vercel free tier
- ✅ 2-hour caching
- ✅ Basic monitoring

### Phase 2: Growth (1000-10000 users/day)
- ✅ Upgrade to paid tiers
- ✅ Add Redis caching
- ✅ CDN for frontend
- ✅ Database for user data
- ✅ Rate limiting per user

### Phase 3: Scale (10000+ users/day)
- ✅ Kubernetes/auto-scaling
- ✅ Multiple backend instances
- ✅ Load balancer
- ✅ Database replication
- ✅ Advanced caching strategies

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          # Railway deployment commands
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📝 Environment Variables Summary

### Frontend (.env.local or Vercel/Netlify)
```
VITE_API_URL=https://your-backend.com/api
```

### Frontend (GitHub Pages / frontend-only)
```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDxxxxxxxxxx
```

### Backend (.env or Railway/DigitalOcean)
```
GOOGLE_MAPS_API_KEY=AIzaSyDxxxxxxxxxx
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend.com
```

---

## ✅ Final Checklist

Before going live:

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Google Maps API key restricted
- [ ] Billing alerts configured
- [ ] CORS properly configured
- [ ] HTTPS enabled (both frontend and backend)
- [ ] Error tracking enabled
- [ ] Uptime monitoring set up
- [ ] Tested on mobile devices
- [ ] Load tested
- [ ] Documentation updated
- [ ] Privacy policy added (if collecting data)
- [ ] Custom domain configured (optional)

---

## 🆘 Rollback Plan

If something goes wrong:

**Vercel:**
```bash
vercel rollback
```

**Railway:**
- Go to Deployments
- Click previous deployment
- Click "Redeploy"

**DigitalOcean:**
- Go to App → Settings
- Revert to previous deployment

**AWS:**
```bash
eb deploy --version <previous-version>
```

---

**You're ready to deploy! 🚀**

For issues, check logs:
- Railway: Dashboard → Logs
- Vercel: Dashboard → Deployments → Logs
- DigitalOcean: App → Runtime Logs
