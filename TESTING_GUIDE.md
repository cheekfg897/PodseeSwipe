# 🧪 Testing Guide

Comprehensive testing checklist for Parents' Wait Time Guide.

---

## 🎯 Quick Test (5 minutes)

**Purpose:** Verify basic functionality works

### Steps:
1. Open app in browser
2. Enter location: "Orchard Road, Singapore"
3. Select 2-3 categories
4. Click "Find Nearby Places"
5. Wait for cards to load
6. Swipe left on one card
7. Swipe right on one card
8. Verify Google Maps opens

**Expected Result:** All steps work smoothly ✅

---

## 🏗️ Component Testing

### 1. Landing Page Tests

#### Test 1.1: Page Loads
```
Action: Navigate to app
Expected: Landing page appears with title and instructions
Status: [ ]
```

#### Test 1.2: Location Input
```
Action: Type address in location field
Expected: Can enter text, no errors
Status: [ ]
```

#### Test 1.3: Category Selection
```
Action: Click multiple categories
Expected: 
- Buttons change color when selected
- Can select multiple
- Counter shows "X categories selected"
Status: [ ]
```

#### Test 1.4: Validation - No Location
```
Action: Leave location empty, click "Find Nearby Places"
Expected: Alert message "Please enter the tuition center location"
Status: [ ]
```

#### Test 1.5: Validation - No Categories
```
Action: Enter location but select no categories, click submit
Expected: Alert message "Please select at least one category"
Status: [ ]
```

#### Test 1.6: Submit Valid Form
```
Action: Enter location + select categories + click submit
Expected: 
- Transitions to swipe view
- Shows loading spinner
- Header displays entered location
Status: [ ]
```

---

### 2. Swipe Interface Tests

#### Test 2.1: Cards Display
```
Action: After searching, wait for results
Expected:
- Cards appear stacked
- Current card on top
- Next card visible behind
- Shows place name, image, rating, distance
Status: [ ]
```

#### Test 2.2: Swipe Left (Desktop)
```
Action: Click and drag card to the left > 100px
Expected:
- "SKIP" overlay appears
- Card animates out to left
- Next card becomes active
Status: [ ]
```

#### Test 2.3: Swipe Right (Desktop)
```
Action: Click and drag card to the right > 100px
Expected:
- "GO!" overlay appears
- Card animates out to right
- Google Maps opens in new tab
- Next card becomes active
Status: [ ]
```

#### Test 2.4: Swipe Left (Mobile)
```
Action: Touch and drag card left
Expected: Same as Test 2.2
Status: [ ]
```

#### Test 2.5: Swipe Right (Mobile)
```
Action: Touch and drag card right
Expected:
- "GO!" overlay appears
- Google Maps app opens
- Next card appears
Status: [ ]
```

#### Test 2.6: Incomplete Swipe
```
Action: Drag card 50px (not enough), then release
Expected: Card returns to center position
Status: [ ]
```

#### Test 2.7: No More Cards
```
Action: Swipe through all cards
Expected:
- "No More Places" message
- "Start Over" button
- "Change Settings" button
Status: [ ]
```

#### Test 2.8: Start Over
```
Action: Click "Start Over" when no cards left
Expected: First card appears again
Status: [ ]
```

#### Test 2.9: Back to Home
```
Action: Click "Back to Home" link
Expected: Returns to landing page
Status: [ ]
```

---

### 3. Location Header Tests

#### Test 3.1: Location Display
```
Action: Start search from landing page
Expected: Header shows entered location
Status: [ ]
```

#### Test 3.2: Long Location Name
```
Action: Enter very long address (> 30 chars)
Expected: Truncated with "..." at end
Status: [ ]
```

#### Test 3.3: Radius Toggle - 2km
```
Action: Click "2 km" button
Expected:
- Button highlighted (blue)
- Loading spinner appears
- New results for 2km radius
Status: [ ]
```

#### Test 3.4: Radius Toggle - 5km
```
Action: Click "5 km" button
Expected:
- Button highlighted (blue)
- Loading spinner appears
- New results for 5km radius
Status: [ ]
```

---

### 4. API Integration Tests

#### Test 4.1: Demo Mode (No Backend)
```
Action: Run frontend only (no backend)
Expected:
- Uses mock data
- Yellow banner: "Demo Mode: Using mock data"
- Shows 6 sample places
Status: [ ]
```

#### Test 4.2: Backend Connection
```
Action: Run with backend + API key
Expected:
- No "Demo Mode" banner
- Real Google Maps data
- Actual place photos
Status: [ ]
```

#### Test 4.3: Backend Offline
```
Action: Stop backend, try to search
Expected:
- Falls back to mock data
- Shows "Demo Mode" banner
Status: [ ]
```

#### Test 4.4: Invalid API Key
```
Action: Set wrong API key in backend .env
Expected:
- Backend logs error
- Frontend falls back to mock data
Status: [ ]
```

#### Test 4.5: API Rate Limit
```
Action: Make 100+ requests quickly
Expected:
- Cache hits return instantly
- New searches may be rate limited
Status: [ ]
```

---

## 📱 Mobile-Specific Tests

### 5. iOS Safari Tests

#### Test 5.1: Touch Gestures
```
Device: iPhone (any model)
Browser: Safari
Action: Touch and drag card left/right
Expected: Smooth swipe without lag
Status: [ ]
```

#### Test 5.2: Google Maps App
```
Device: iPhone with Google Maps installed
Action: Swipe right on a place
Expected: Google Maps app opens (not browser)
Status: [ ]
```

#### Test 5.3: Landscape Mode
```
Device: iPhone in landscape
Action: View app
Expected: Layout adapts properly
Status: [ ]
```

#### Test 5.4: Safe Area (Notch)
```
Device: iPhone with notch (X, 11, 12, etc.)
Action: View app
Expected: Content not hidden by notch
Status: [ ]
```

---

### 6. Android Tests

#### Test 6.1: Chrome Touch
```
Device: Android phone
Browser: Chrome
Action: Swipe cards
Expected: Smooth gesture response
Status: [ ]
```

#### Test 6.2: Google Maps App
```
Device: Android with Google Maps
Action: Swipe right
Expected: Google Maps app opens
Status: [ ]
```

#### Test 6.3: Back Button
```
Device: Android
Action: Press hardware back button
Expected: Doesn't break app navigation
Status: [ ]
```

---

## 🌐 Browser Compatibility Tests

### 7. Desktop Browsers

#### Test 7.1: Chrome Desktop
```
Browser: Chrome (latest)
OS: Windows/Mac/Linux
Actions: All main features
Expected: Full functionality
Status: [ ]
```

#### Test 7.2: Firefox Desktop
```
Browser: Firefox (latest)
Actions: All main features
Expected: Full functionality
Status: [ ]
```

#### Test 7.3: Safari Desktop
```
Browser: Safari (latest)
OS: macOS
Actions: All main features
Expected: Full functionality
Status: [ ]
```

#### Test 7.4: Edge Desktop
```
Browser: Edge (latest)
Actions: All main features
Expected: Full functionality
Status: [ ]
```

---

## 🔒 Security Tests

### 8. API Key Security

#### Test 8.1: Frontend Source Code
```
Action: View page source / DevTools Network tab
Expected: No API key visible anywhere
Status: [ ]
```

#### Test 8.2: Network Requests
```
Action: Open DevTools Network, make search
Expected:
- Requests go to backend (/api/nearby-places)
- No direct Google API calls from frontend
Status: [ ]
```

#### Test 8.3: Environment Variables
```
Action: Check .env files in git
Expected: .env files in .gitignore, not committed
Status: [ ]
```

---

## 💾 Data & Caching Tests

### 9. Backend Caching

#### Test 9.1: First Search
```
Action: Search "Orchard Road" + Food + 5km
Measure: Response time
Expected: 3-5 seconds (cold cache)
Status: [ ]
```

#### Test 9.2: Second Search (Same)
```
Action: Immediately search same location/categories
Measure: Response time
Expected: < 100ms (cache hit)
Status: [ ]
```

#### Test 9.3: Different Radius
```
Action: Same location, different radius (2km vs 5km)
Expected: Different results, new API call
Status: [ ]
```

#### Test 9.4: Cache Expiry
```
Action: Wait 2+ hours, search same location
Expected: Fresh API call (cache expired)
Status: [ ]
```

---

## ⚡ Performance Tests

### 10. Load Time Tests

#### Test 10.1: Initial Page Load
```
Tool: Chrome DevTools Performance
Metric: Time to Interactive (TTI)
Expected: < 2 seconds
Status: [ ]
```

#### Test 10.2: Search Response
```
Tool: Network tab
Metric: API response time
Expected: < 5 seconds (first call)
Status: [ ]
```

#### Test 10.3: Swipe Animation
```
Tool: DevTools FPS meter
Metric: Frames per second during swipe
Expected: Solid 60 FPS
Status: [ ]
```

#### Test 10.4: Bundle Size
```
Command: npm run build
Check: dist/ folder size
Expected: < 1MB total
Status: [ ]
```

---

## 🚨 Error Handling Tests

### 11. Error Scenarios

#### Test 11.1: No Internet
```
Action: Disconnect internet, try to search
Expected: Error message or fallback to demo data
Status: [ ]
```

#### Test 11.2: Invalid Location
```
Action: Enter "zzzzzzz" as location
Expected: Helpful error message
Status: [ ]
```

#### Test 11.3: No Results
```
Action: Search remote location (e.g., "0,0" coordinates)
Expected: "No places found" message
Status: [ ]
```

#### Test 11.4: Server Error
```
Action: Cause backend to crash
Expected: Frontend handles gracefully, shows error
Status: [ ]
```

#### Test 11.5: Partial Results
```
Action: Search location with only 1-2 places
Expected: Shows available places, works normally
Status: [ ]
```

---

## 🎨 UI/UX Tests

### 12. Visual Tests

#### Test 12.1: Responsive Breakpoints
```
Sizes: 320px, 375px, 768px, 1024px, 1920px
Expected: Layout adapts smoothly at all sizes
Status: [ ]
```

#### Test 12.2: Color Contrast
```
Tool: Chrome DevTools Accessibility
Check: Text readability
Expected: WCAG AA compliance
Status: [ ]
```

#### Test 12.3: Loading States
```
Action: Trigger loading
Expected: 
- Spinner visible
- Clear feedback
- Proper positioning
Status: [ ]
```

#### Test 12.4: Empty States
```
Scenarios: No results, end of cards
Expected: Helpful messages and actions
Status: [ ]
```

---

## 📊 Edge Cases

### 13. Unusual Scenarios

#### Test 13.1: Very Long Place Name
```
Scenario: Place with 100+ character name
Expected: Text truncated or wrapped properly
Status: [ ]
```

#### Test 13.2: No Rating
```
Scenario: Place with 0 rating (new business)
Expected: Shows 0.0 or "New" badge
Status: [ ]
```

#### Test 13.3: No Image
```
Scenario: Place without photos
Expected: Fallback Unsplash image shows
Status: [ ]
```

#### Test 13.4: Rapid Swipes
```
Action: Swipe 10 cards very quickly
Expected: No crashes, smooth transitions
Status: [ ]
```

#### Test 13.5: Multi-Touch
```
Action: Try to swipe multiple cards at once
Expected: Only one card responds
Status: [ ]
```

---

## 🔄 Integration Tests

### 14. End-to-End Flows

#### Flow 1: Happy Path
```
1. Open app
2. Enter "123 Main St, Singapore"
3. Select: Food, Cafe
4. Click "Find Nearby Places"
5. Wait for results
6. Swipe left on 2 cards
7. Swipe right on 1 card
8. Verify Maps opens
9. Return to app
10. Swipe through remaining cards
11. Click "Start Over"
12. Verify cards reset

Expected: All steps work ✅
Status: [ ]
```

#### Flow 2: Change Settings Mid-Session
```
1. Complete a search
2. Click "Back to Home"
3. Change location
4. Select different categories
5. Search again
6. Verify new results

Expected: All works correctly ✅
Status: [ ]
```

#### Flow 3: Radius Toggle During Session
```
1. Search with 5km
2. View some cards
3. Toggle to 2km
4. Verify new, closer results
5. Toggle back to 5km
6. Verify all results return

Expected: Smooth transitions ✅
Status: [ ]
```

---

## 📝 Test Report Template

### Test Session Report

```
Date: _______________
Tester: _______________
Environment: _______________
Device: _______________
Browser: _______________

Tests Passed: _____ / _____
Tests Failed: _____
Blockers: _____

Critical Issues:
1. 
2. 

Minor Issues:
1.
2.

Notes:


Recommendation: [ ] PASS  [ ] FAIL  [ ] NEEDS WORK
```

---

## ✅ Pre-Launch Checklist

Before deploying to production:

### Functionality
- [ ] All landing page features work
- [ ] All swipe gestures work
- [ ] Google Maps integration works
- [ ] Mobile gestures work
- [ ] Desktop mouse drag works
- [ ] Radius toggle works
- [ ] Back navigation works
- [ ] Error handling works

### Performance
- [ ] Load time < 2 seconds
- [ ] API response < 5 seconds
- [ ] Swipe animations smooth (60 FPS)
- [ ] No memory leaks
- [ ] Works offline (demo mode)

### Mobile
- [ ] Tested on iOS Safari
- [ ] Tested on Android Chrome
- [ ] Touch gestures smooth
- [ ] Maps app opens correctly
- [ ] Responsive on all screen sizes

### Security
- [ ] API key not in frontend
- [ ] .env files not committed
- [ ] CORS configured
- [ ] Input validation working

### Data
- [ ] Caching works
- [ ] Real Google Maps data loads
- [ ] Demo mode fallback works
- [ ] Images load properly

### Documentation
- [ ] README complete
- [ ] Setup guide clear
- [ ] Deployment guide ready
- [ ] Known issues documented

---

## 🤖 Automated Testing (Future)

### Recommended Tools

**Unit Tests:**
```bash
npm install --save-dev jest @testing-library/react
```

**E2E Tests:**
```bash
npm install --save-dev playwright
```

**Sample Test:**
```javascript
// src/app/components/__tests__/LandingPage.test.tsx
import { render, screen } from '@testing-library/react';
import { LandingPage } from '../LandingPage';

test('renders landing page title', () => {
  render(<LandingPage onStart={() => {}} />);
  expect(screen.getByText(/Parents' Wait Time Guide/i)).toBeInTheDocument();
});
```

---

**Testing is crucial for production readiness! 🧪**

Use this guide to ensure quality before launch.
