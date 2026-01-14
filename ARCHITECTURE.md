# System Architecture & Flow

## 📊 Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         PARENT USER                              │
│                    (Mobile/Desktop Browser)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LANDING PAGE                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. Enter tuition center location                         │  │
│  │ 2. Select categories (restaurants, cafes, banks, etc.)   │  │
│  │ 3. Click "Find Nearby Places"                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • Calls /api/nearby-places                               │  │
│  │ • Sends: location, radius, categories                    │  │
│  │ • Shows loading spinner                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js/Express)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 1: Check Cache                                      │  │
│  │   • Key: "location:radius:categories"                    │  │
│  │   • If found → Return cached data (skip Google API)      │  │
│  │   • If not found → Continue                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 2: Geocode (if needed)                              │  │
│  │   • Convert address → lat/lng coordinates                │  │
│  │   • Call: Google Geocoding API                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 3: Fetch Nearby Places                              │  │
│  │   • For each category type                               │  │
│  │   • Call: Google Places Nearby Search API                │  │
│  │   • Radius: 2000m or 5000m                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 4: Transform & Sort                                 │  │
│  │   • Remove duplicates                                    │  │
│  │   • Calculate distances                                  │  │
│  │   • Sort by distance (nearest first)                     │  │
│  │   • Get place photos                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 5: Cache Results                                    │  │
│  │   • Store for 2 hours (7200 seconds)                     │  │
│  │   • Reduces future API calls                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   GOOGLE MAPS APIs                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • Geocoding API          (address → coordinates)         │  │
│  │ • Places Nearby Search   (find places within radius)     │  │
│  │ • Place Photos API       (get place images)              │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FRONTEND (React) - Results                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • Display swipeable cards                                │  │
│  │ • Show place details (name, distance, rating)            │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERACTION                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ SWIPE LEFT  ← Skip to next place                         │  │
│  │ SWIPE RIGHT → Navigate to place                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ (if swiped right)
┌─────────────────────────────────────────────────────────────────┐
│                      GOOGLE MAPS APP                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • Opens with directions to selected place                │  │
│  │ • Mobile: Native Google Maps app                         │  │
│  │ • Desktop: Browser tab with Google Maps                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Component Architecture

### Frontend Components

```
App.tsx (Main Controller)
├── LandingPage.tsx
│   └── Category Selection Grid
│
└── Swipe View
    ├── LocationHeader.tsx
    │   └── Radius Toggle (2km/5km)
    │
    └── SwipeableCard.tsx (Stack)
        └── PlaceCard.tsx
            ├── Image
            ├── Name & Rating
            ├── Distance & Hours
            └── Swipe Instructions
```

### Backend Structure

```
server.js
├── /api/health           (Health check endpoint)
├── /api/geocode          (Address → Coordinates)
└── /api/nearby-places    (Main search endpoint)
    ├── Cache Check
    ├── Geocoding
    ├── Places Search
    ├── Data Transformation
    └── Cache Storage
```

---

## 🔄 Data Flow Examples

### Example 1: First Search (No Cache)

```
User: "Find cafes near 123 Main St, Singapore (5km)"
  ↓
Frontend: POST /api/nearby-places
{
  location: "123 Main St, Singapore",
  radius: 5,
  categories: ["cafe"]
}
  ↓
Backend:
  1. Cache miss (first time)
  2. Geocode: "123 Main St" → {lat: 1.3521, lng: 103.8198}
  3. Google Places API: Find cafes within 5000m
  4. Transform: 15 cafes found
  5. Cache: Store for 2 hours
  6. Return: [{cafe1}, {cafe2}, ...]
  ↓
Frontend: Display 15 swipeable cards
  ↓
User: Swipes right on "The Cozy Cafe"
  ↓
Open Google Maps: Navigate to cafe location
```

**Cost:** ~$0.037 (Geocoding $0.005 + Nearby Search $0.032)

---

### Example 2: Same Search Within 2 Hours (Cache Hit)

```
User: "Find cafes near 123 Main St, Singapore (5km)"
  ↓
Frontend: POST /api/nearby-places
  ↓
Backend:
  1. Cache HIT! ✅
  2. Return cached data (no Google API calls)
  ↓
Frontend: Display 15 swipeable cards
```

**Cost:** $0.00 (Free! Using cache)

---

## 🎯 Category Mapping

| User Category | Google Places API Types |
|--------------|-------------------------|
| **Food** | `restaurant`, `meal_takeaway`, `meal_delivery` |
| **Cafe** | `cafe`, `bakery` |
| **Shopping** | `shopping_mall`, `store`, `supermarket` |
| **Banking** | `bank`, `atm`, `finance` |
| **Parks** | `park` |
| **Library** | `library` |
| **Health** | `pharmacy`, `drugstore`, `hospital` |
| **Gym** | `gym`, `spa` |

---

## 📱 Swipe Gesture Detection

```javascript
// Motion (Framer Motion) handles touch/mouse events

User drags card →
  ↓
Calculate offset.x:
  • offset.x > 100 → Swipe RIGHT (Navigate)
  • offset.x < -100 → Swipe LEFT (Skip)
  • else → Return to center (No action)
  ↓
Animate card out:
  • Right: Green "GO!" overlay
  • Left: Red "SKIP" overlay
  ↓
If RIGHT:
  • Open: https://maps.google.com/dir/?destination=lat,lng
  • Mobile: Opens native app
  • Desktop: Opens new tab
  ↓
Next card appears
```

---

## 🔒 Security Flow

```
Frontend (Exposed to users)
  ↓
  │ NO API KEY HERE! ✅
  ↓
Backend (Private server)
  ↓
  │ API KEY stored in .env file 🔐
  ↓
Google Maps API
  ↓
  │ Restricted by:
  │ • Specific APIs only
  │ • Optional: Server IP restriction
  ↓
Returns data to backend
  ↓
Backend returns to frontend
```

**Why this is secure:**
- API key never sent to browser
- Users can't steal or abuse key
- Backend controls rate limiting
- Cache reduces API costs

---

## 💾 Caching Strategy

```
Cache Key Format:
"places:{location}:{radius}:{category1,category2}"

Example:
"places:123 Main St:5:cafe,food"

Cache Duration: 2 hours (7200 seconds)

Benefits:
✅ Same search = instant results
✅ Reduces Google API costs by ~80%
✅ Faster response times
✅ Less server load

Cache Invalidation:
• Auto-expires after 2 hours
• Server restart clears all cache
• Can manually clear by restarting backend
```

---

## 🌐 API Request Examples

### Request 1: Search for nearby cafes

```bash
curl -X POST http://localhost:3001/api/nearby-places \
  -H "Content-Type: application/json" \
  -d '{
    "location": "1.3521,103.8198",
    "radius": 2,
    "categories": ["cafe"]
  }'
```

### Response:

```json
{
  "success": true,
  "places": [
    {
      "id": "ChIJxxx",
      "name": "Starbucks Reserve",
      "category": "Cafe",
      "rating": 4.5,
      "distance": 0.3,
      "openingHours": "Open now",
      "description": "123 Main Street",
      "imageUrl": "https://maps.googleapis.com/...",
      "latitude": 1.3525,
      "longitude": 103.8200,
      "address": "123 Main Street, #01-01"
    }
  ]
}
```

---

## 🚨 Error Handling

### Frontend Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Network Error | Backend down | Fallback to mock data |
| Empty results | No places found | Show "No places" message |
| Geolocation denied | User blocked location | Ask for address input |

### Backend Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 403 Forbidden | API not enabled | Enable in Google Cloud |
| 429 Too Many Requests | Quota exceeded | Wait or upgrade quota |
| Invalid API key | Wrong key | Check .env file |
| ZERO_RESULTS | No places found | Return empty array |

---

## 📊 Performance Optimization

1. **Image Loading**
   - Use Google Place Photos API
   - Fallback to Unsplash if no photos

2. **Card Stacking**
   - Only render current + next card
   - Previous cards destroyed (not hidden)

3. **API Calls**
   - Batch multiple place types
   - Cache for 2 hours minimum

4. **Mobile Optimization**
   - Touch-optimized swipe threshold
   - Reduced animations on low-end devices
   - Lazy load images

---

## 🧪 Testing Scenarios

### Test Case 1: Happy Path
1. Enter location: "Orchard Road, Singapore"
2. Select: Food, Cafe
3. Radius: 2km
4. Expected: 20+ places shown
5. Swipe right → Opens Google Maps ✅

### Test Case 2: No Results
1. Enter location: "Middle of ocean: 0,0"
2. Select: Library
3. Radius: 2km
4. Expected: "No places found" message ✅

### Test Case 3: Cache Test
1. Search: "123 Main St" + Food + 5km
2. Wait for results
3. Go back and search same thing
4. Expected: Instant results (< 100ms) ✅

### Test Case 4: Mobile Swipe
1. Open on iPhone
2. Swipe card right
3. Expected: Google Maps app opens ✅

---

## 📈 Monitoring & Analytics

### Metrics to Track

1. **User Behavior**
   - Most selected categories
   - Average swipes per session
   - Most common locations

2. **Performance**
   - API response times
   - Cache hit rate
   - Error rates

3. **Costs**
   - Daily API calls
   - Cache efficiency
   - Monthly spend

### Recommended Tools

- **Backend:** Winston (logging)
- **Frontend:** Google Analytics 4
- **Errors:** Sentry
- **Uptime:** UptimeRobot

---

## 🔮 Future Enhancements

1. **User Accounts**
   - Save favorite places
   - History of visited locations
   - Personalized recommendations

2. **Advanced Filters**
   - Price range
   - Open now only
   - Ratings threshold (e.g., 4+ stars)

3. **Social Features**
   - Share places with other parents
   - Reviews and comments
   - Parent groups by tuition center

4. **Offline Mode**
   - Cache last searches
   - PWA with offline support

5. **AI Recommendations**
   - Learn parent preferences
   - Suggest based on time of day
   - Weather-based suggestions

---

This architecture is designed for **scalability**, **cost-efficiency**, and **great user experience**! 🚀
