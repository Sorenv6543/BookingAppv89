# 🚀 Claro Calendar Grid Prototype

## Quick Start

### Option 1: Instant Demo (No Setup Required)
Simply open `index.html` in any modern browser:
```bash
cd claro-prototype
open index.html  # Mac
start index.html # Windows
```

### Option 2: Vue Component Development
```bash
# Install Vue project
npm create vue@latest claro-app
cd claro-app

# Copy prototype files
cp ../claro-prototype/CalendarGrid.vue src/components/
cp ../claro-prototype/types.ts src/types/

# Install dependencies
npm install @heroicons/vue tailwindcss @headlessui/vue
npm install -D @types/node

# Run development server
npm run dev
```

## 🎯 Features Demonstrated

### ✅ Core Functionality
- **Cleaner-Centric Grid**: Cleaners as rows, days/time-slots as columns
- **Drag & Drop Assignment**: Drag unassigned jobs onto calendar slots
- **Visual Status Indicators**: Color-coded job cards (pending/assigned/in-progress/completed)
- **Same-Day Turn Alerts**: Red warning icon (⚠) for urgent turnarounds
- **Mobile Responsive**: Fully functional on phones and tablets

### 🤖 AI Suggestions (Simulated)
- Click "AI Suggest" on any unassigned job
- See ranked cleaner suggestions with scores
- One-click assignment from suggestions
- Reasoning displayed for each suggestion

### 📱 Mobile Features
- Touch-friendly drag and drop
- Collapsible sidebar on mobile
- Bottom navigation bar
- Optimized grid for small screens

## 🎨 Key UI/UX Elements

### Calendar Grid
```
         Mon    Tue    Wed    Thu    Fri    Sat    Sun
Maria S. [Job]  [Job]         [Job]              [Job]
John D.         [Job]  [Job]         [Job]
Sarah M. [Job]                [Job]  [Job]  
Mike R.                [Job]                [Job]
```

### Status Colors
- 🔴 **Red**: Pending (needs assignment)
- 🟡 **Yellow**: Assigned (scheduled)
- 🔵 **Blue**: In Progress (being cleaned)
- 🟢 **Green**: Completed (done)

### AI Suggestion Scoring
```
John D.    95% - Closest location, available slot
Mike R.    85% - No jobs today, good rating
Maria S.   70% - Experienced, but 2 jobs already
```

## 💡 Testing Scenarios

### 1. Basic Scheduling
- Drag "Garden Cottage" from unassigned to any cleaner slot
- Notice immediate visual feedback
- See notification confirming assignment

### 2. AI Suggestions
- Click "AI Suggest" on unassigned "Garden Cottage"
- Review scored suggestions
- Click any suggestion to auto-assign

### 3. Mobile Experience
- Resize browser to mobile width (<768px)
- Try touch-drag on mobile device
- Test collapsible sidebar

### 4. View Switching
- Toggle between "Cleaners" and "Properties" view
- Notice how grid reorganizes

## 🔧 Customization

### Add More Sample Data
Edit the data in `index.html`:
```javascript
const cleaners = ref([
  { id: 1, name: 'Your Cleaner', status: 'available', jobs: 0 },
  // Add more...
]);

const jobs = ref([
  { id: 1, propertyName: 'Your Property', status: 'pending' },
  // Add more...
]);
```

### Modify AI Scoring Logic
In `index.html`, find the `calculateScore` function concept:
```javascript
// Distance penalty
score -= distance * 2

// Workload balance  
score -= jobsToday * 10

// Skill match bonus
if (job.requirements.includes('deep-clean')) {
  score += 20
}
```

## 📊 Customer Demo Script

### Opening (30 seconds)
"Claro solves the biggest challenge in cleaning management - efficiently scheduling your cleaners across multiple properties."

### Demo Flow (3 minutes)
1. **Show the Problem**: "Here's an unassigned same-day turn" (point to red job with ⚠)
2. **Manual Assignment**: Drag job to cleaner slot - "Simple drag and drop"
3. **AI Magic**: Click "AI Suggest" - "But here's where we're different"
4. **Show Results**: "AI considers distance, workload, and skills"
5. **One-Click Solution**: Click suggestion - "Optimal assignment in seconds"

### Key Differentiators (1 minute)
- "No other system thinks cleaner-first like this"
- "AI suggestions save 70% of scheduling time"
- "Same-day turns get priority automatically"
- "Works perfectly on phones for cleaners in the field"

### Close (30 seconds)
"We're looking for 10 beta customers to help shape the final product. Interested?"

## 🐛 Known Limitations (Prototype Only)

1. **Data doesn't persist** - Refreshing loses changes
2. **AI suggestions are simulated** - Real version uses ML
3. **No real-time sync** - Production uses WebSockets
4. **Limited to week view** - Full version has month/day views
5. **No photo uploads** - Coming in production

## 🚀 Next Steps

### For Development
1. Set up Supabase backend
2. Implement real AI scoring algorithm
3. Add real-time synchronization
4. Build mobile PWA wrapper
5. Add photo verification system

### For Business
1. Test with 5-10 cleaning companies
2. Gather feedback on AI suggestions
3. Validate pricing model
4. Refine same-day turn handling
5. Build integration roadmap

## 📞 Support

**Technical Questions**: Check `CLARO_TECHNICAL_ARCHITECTURE.md`
**Business Questions**: See roadmap in main documentation
**Feedback**: Document all customer reactions during demos

---

## Quick Feature Toggle

To disable features for simpler demos, edit these flags in `index.html`:
```javascript
const FEATURES = {
  showAISuggestions: true,
  enableDragDrop: true,
  showMobileNav: true,
  showStats: true,
  animateTransitions: true
}
```

---

*Prototype Version 1.0 - January 2025*
*Estimated Production Timeline: 8 weeks from approval*
