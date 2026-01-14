# ⚠️ Potential Issues & Solutions

A comprehensive list of problems you might encounter and how to solve them.

---

## 🔴 Critical Issues

### 1. API Key Exposure

**Problem:**
- API key accidentally committed to GitHub
- Visible in browser DevTools
- Stolen and abused by others → **Huge bills!**

**Solutions:**
✅ **Never** put API key in frontend code  
✅ Always use backend to make API calls  
✅ Add `.env` to `.gitignore`  
✅ Use environment variables  
✅ If exposed: Immediately delete key and create new one  

**Cost if exposed:** $10,000+ possible if abused for crypto mining

---

### 2. API Costs Spiral Out of Control

**Problem:**
- Too many API calls
- No caching implemented
- Users abuse the system
- Monthly bill of $1000+ instead of $50

**Solutions:**
✅ Implement 2-hour caching (already done)  
✅ Set Google Cloud billing alerts ($50, $100)  
✅ Add rate limiting per IP/user  
✅ Monitor usage daily first week  
✅ Increase cache duration if needed  

**Prevention:**
```javascript
// backend/server.js - Add rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

### 3. Google Maps API Not Enabled

**Problem:**
- API calls return 403 Forbidden
- Backend logs show errors
- No places returned

**Solutions:**
✅ Enable **Places API** in Google Cloud Console  
✅ Enable **Geocoding API**  
✅ Enable **billing** (required even with free tier)  
✅ Wait 5 minutes for activation  

**How to check:**
1. Google Cloud Console → APIs & Services → Library
2. Search "Places API" → Should show "Manage" (not "Enable")
3. Search "Geocoding API" → Should show "Manage"

---

## 🟠 Major Issues

### 4. Location Accuracy Problems

**Problem:**
- GPS doesn't work well indoors
- Parents inside tuition center can't get location
- Wrong location detected

**Solutions:**
✅ Ask for tuition center address (don't rely on GPS)  
✅ Let parents manually enter location  
✅ Save favorite locations  
✅ Pre-populate common tuition centers  

**Workaround:**
Add location selector instead of auto-detect:
```typescript
// Add to LandingPage.tsx
const [useGPS, setUseGPS] = useState(false);

<button onClick={() => navigator.geolocation.getCurrentPosition(...)}>
  Use My Location
</button>
```

---

### 5. CORS Errors

**Problem:**
```
Access to fetch at 'http://localhost:3001/api' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Solutions:**
✅ Backend must have CORS enabled (already done)  
✅ Check frontend is calling correct backend URL  
✅ In production, whitelist frontend domain  

**Fix:**
```javascript
// backend/server.js
const cors = require('cors');

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend.com'
    : 'http://localhost:5173'
}));
```

---

### 6. Mobile Safari Touch Issues

**Problem:**
- Swipe doesn't work smoothly on iPhone
- Cards don't respond to touch
- Conflicting with browser swipe gestures

**Solutions:**
✅ Disable browser default swipe (back/forward)  
✅ Increase touch sensitivity threshold  
✅ Test on real devices, not just simulator  

**Fix:**
```css
/* Add to global CSS */
body {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}
```

---

## 🟡 Moderate Issues

### 7. Slow API Response Times

**Problem:**
- Takes 5-10 seconds to load places
- Users see loading spinner too long
- Bad user experience

**Causes:**
- First API call (no cache)
- Geocoding + Multiple place type searches
- Network latency

**Solutions:**
✅ Show estimated time (e.g., "Finding places... ~5 seconds")  
✅ Optimize: Use lat/lng instead of address  
✅ Batch requests more efficiently  
✅ Show skeleton loading states  
✅ Consider preloading common locations  

---

### 8. No Results Found

**Problem:**
- Search returns 0 places
- User frustrated
- Bad experience

**Common Reasons:**
- Location too remote (no places nearby)
- Radius too small (2km in rural area)
- Wrong category selection
- Google Maps has no data for area

**Solutions:**
✅ Show helpful message: "Try increasing radius to 5km"  
✅ Suggest different categories  
✅ Fallback to show ANY places (not just selected categories)  
✅ Show map view of search area  

**Implementation:**
```typescript
if (places.length === 0) {
  // Retry with larger radius
  // Or retry with broader categories
  // Or show helpful suggestion
}
```

---

### 9. Opening Hours Inaccurate

**Problem:**
- Shows "Open now" but actually closed
- Misleading information
- Angry users

**Why:**
- Google Maps data not real-time
- Businesses don't update hours
- Public holidays not accounted for

**Solutions:**
✅ Add disclaimer: "Hours may not be current"  
✅ Link to Google Maps for verification  
✅ Don't rely solely on open/closed status  
✅ Show full hours schedule  

---

### 10. Images Not Loading

**Problem:**
- Broken image placeholders
- No photos for some places
- Generic fallback images

**Causes:**
- Place has no photos in Google Maps
- Photo reference expired
- API photo quota exceeded

**Solutions:**
✅ Always have fallback image (Unsplash)  
✅ Handle 404 errors gracefully  
✅ Cache photo URLs  
✅ Use ImageWithFallback component  

**Already implemented in backend:**
```javascript
imageUrl: place.photos?.[0] 
  ? `https://maps.googleapis.com/maps/api/place/photo?...`
  : 'https://images.unsplash.com/photo-fallback'
```

---

## 🟢 Minor Issues

### 11. Cache Never Expires

**Problem:**
- Stale data shown for days
- New businesses not appearing
- Closed businesses still shown

**Solution:**
✅ Default: 2 hours (good balance)  
✅ For high-traffic: 4-6 hours  
✅ Manual cache clear option  
✅ Show cache timestamp  

---

### 12. Multiple Duplicate Places

**Problem:**
- Same place appears 2-3 times
- Different categories, same place
- Confusing for users

**Solution (Already Implemented):**
```javascript
// backend/server.js - Remove duplicates by place_id
const uniquePlaces = Array.from(
  new Map(allPlaces.map(place => [place.place_id, place])).values()
);
```

---

### 13. Backend Crashes on Invalid Input

**Problem:**
- User enters emoji or special chars
- Backend throws error
- 500 Internal Server Error

**Solution:**
✅ Validate all inputs  
✅ Sanitize user input  
✅ Handle errors gracefully  

**Add validation:**
```javascript
// backend/server.js
app.post('/api/nearby-places', async (req, res) => {
  const { location, radius, categories } = req.body;
  
  // Validate
  if (!location || typeof location !== 'string') {
    return res.status(400).json({ error: 'Invalid location' });
  }
  
  if (radius < 1 || radius > 50) {
    return res.status(400).json({ error: 'Radius must be 1-50 km' });
  }
  
  // ... continue
});
```

---

## 🔵 Edge Cases

### 14. Midnight Bug (Hours Calculation)

**Problem:**
- Place shows "Open until 2:00 AM" (next day)
- Logic breaks at midnight
- Timezone confusion

**Solution:**
- Use UTC consistently
- Handle date boundaries
- Use libraries like `date-fns` or `moment.js`

---

### 15. International Locations

**Problem:**
- App designed for Singapore
- User tries in USA → Different address format
- Different measurement units (miles vs km)

**Solutions:**
✅ Auto-detect country from IP  
✅ Support both km and miles  
✅ Handle different address formats  
✅ Internationalization (i18n)  

---

### 16. Very Long Business Names

**Problem:**
- Name: "The Super Amazing Best Coffee Shop & Bakery in Town"
- Breaks card layout
- Text overflow

**Solution (Already Implemented):**
```typescript
// LocationHeader.tsx
const displayLocation = tuitionCenter.length > 30 
  ? tuitionCenter.substring(0, 30) + '...' 
  : tuitionCenter;
```

Apply same to business names in PlaceCard.tsx

---

### 17. Zero Ratings

**Problem:**
- New business has 0 rating
- Shows 0.0 stars → Looks bad
- Users skip it

**Solution:**
```typescript
// Display "New" badge instead of 0 rating
{place.rating === 0 ? (
  <span className="bg-green-500 text-white px-2 py-1 rounded">New</span>
) : (
  <span>{place.rating} ⭐</span>
)}
```

---

## 🛠️ Technical Debt

### 18. No Database

**Current State:**
- Everything in memory (cache)
- Restart = lose cache
- No user data persistence

**When to Add Database:**
- User accounts needed
- Favorite places
- Search history
- Analytics

**Recommendation:**
- Start: PostgreSQL (Supabase, Neon)
- Alternative: MongoDB (Atlas)
- Simple: SQLite for prototypes

---

### 19. No Authentication

**Current State:**
- No user login
- No usage tracking per user
- Can't limit abuse easily

**When to Add:**
- User features needed
- Want to track individual usage
- Prevent API abuse

**Options:**
- Supabase Auth
- Firebase Auth
- Auth0
- NextAuth.js

---

### 20. No Error Logging

**Current State:**
- Errors only in console
- No persistence
- Hard to debug production issues

**Solution:**
Add Sentry or LogRocket:
```bash
npm install @sentry/react @sentry/node
```

---

## 📊 Performance Issues

### 21. Memory Leaks

**Potential Problem:**
- React components not unmounting
- Event listeners not removed
- Cache growing infinitely

**Prevention:**
```typescript
useEffect(() => {
  // Setup
  return () => {
    // Cleanup
  };
}, []);
```

---

### 22. Bundle Size Too Large

**Problem:**
- Slow initial load
- Large JavaScript file
- Poor mobile experience

**Check:**
```bash
npm run build
# Look at dist/ folder size
```

**Optimize:**
- Code splitting
- Lazy loading
- Tree shaking
- Remove unused dependencies

---

## 🌐 Browser Compatibility

### 23. IE11 Not Supported

**Issue:** Modern JavaScript not compatible

**Solution:** Don't support IE11 (it's dead anyway!)

**Add warning:**
```html
<noscript>
  This app requires a modern browser.
  Please use Chrome, Safari, Firefox, or Edge.
</noscript>
```

---

### 24. Safari Private Mode

**Problem:**
- LocalStorage disabled
- Caching doesn't work
- Features break

**Detection:**
```javascript
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
} catch (e) {
  // Private mode detected
  showWarning('Private mode may limit functionality');
}
```

---

## 💡 User Experience Issues

### 25. No Onboarding

**Problem:**
- First-time users confused
- Don't understand swipe gestures
- Skip without trying

**Solution:**
- Add tutorial overlay
- Animated swipe hints
- "Try swiping!" message

---

### 26. No Feedback on Swipe

**Problem:**
- User swipes right
- Nothing happens (Maps opening in background)
- Thinks it's broken

**Solution:**
- Show success message: "Opening Google Maps..."
- Haptic feedback on mobile
- Visual confirmation

---

## 🔐 Privacy & Legal

### 27. No Privacy Policy

**Problem:**
- Required if collecting any data
- GDPR compliance
- User trust

**Solution:**
- Add privacy policy page
- State what data is collected (location searches)
- How it's used (Google Maps API calls)
- Retention period (not stored)

---

### 28. Location Permission Denied

**Problem:**
- User denies browser location access
- App can't function (if relying on GPS)

**Solution (Already Implemented):**
- Use address input instead
- Don't rely on GPS
- Show helpful message

---

## 📱 Mobile-Specific Issues

### 29. Battery Drain

**Problem:**
- Heavy animations
- Constant GPS polling
- Background processes

**Solution:**
- Optimize animations
- Don't poll GPS continuously
- Minimize re-renders

---

### 30. Data Usage

**Problem:**
- High-res images
- Repeated API calls
- Expensive for users on limited data

**Solution:**
- Compress images
- Respect cache headers
- Add "Low Data Mode"

---

## 🎯 Summary of Top 5 Critical Issues

1. **API Key Security** → Use backend, never frontend
2. **API Costs** → Implement caching, monitoring, rate limiting
3. **CORS Errors** → Configure backend properly
4. **Mobile Touch** → Test on real devices
5. **Location Accuracy** → Use address input, not GPS

---

## ✅ Prevention Checklist

- [ ] API key in backend only
- [ ] Billing alerts set up
- [ ] CORS configured
- [ ] Input validation added
- [ ] Error handling implemented
- [ ] Mobile tested (iOS + Android)
- [ ] Rate limiting added
- [ ] Cache monitoring
- [ ] Logging/monitoring setup
- [ ] Documented all limitations

---

**This list is based on real-world scenarios!**  
Keep it handy during development and deployment. 🛡️
