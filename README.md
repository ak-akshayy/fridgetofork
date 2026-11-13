# Fridge2Fork — Turn Forgotten Ingredients into Meaningful Meals 🥑🍲

> **An AI-powered Smart Kitchen Assistant with a Flavor-Smart Food Rescue Engine & Smart Nutrition Personalization.**

Fridge2Fork is a modern, production-grade startup web application designed to solve domestic food waste. By bridging optical ingredient recognition, deterministic culinary chemistry, personalized nutrition goals, and pantry tracking, Fridge2Fork empowers home cooks to discover delicious recipes from ingredients they already own before they spoil.

---

## 🌟 Key Highlights & Features

1. **AI Fridge Scanner with Modular Vision Architecture**:
   - Device upload (JPG, PNG, WebP) with drag-and-drop validation.
   - Live camera capture with shelf guide overlay and front/rear switching.
   - Multi-stage scanning visualization with real-time feedback.
   - Complete ingredient correction system (rename, edit quantity, change category, mark "Use Soon", manual entry).
   - Clean, modular service architecture (`src/services/visionService.js`) ready to integrate external Vision APIs via environment variables.

2. **Flavor-Smart Food Rescue Engine**:
   - Deterministic, explainable 0–100 scoring system evaluating:
     - *Use-Soon Produce Utilization* (+35 max pts)
     - *Pantry Ingredient Stock Coverage* (+45 max pts)
     - *FlavorDB Chemical Substitutions* (+12 max pts)
     - *Zero-Friction / No-Grocery-Run Bonus* (+8 max pts)

3. **Smart Nutrition Personalization**:
   - Multi-step onboarding to personalize recipes without body-shaming or restrictive diets.
   - Goals supported: *Muscle Building* (protein-prioritized), *Healthy Weight Gain* (energy-rich meals), *Balanced Nutrition*, *General Wellness*.
   - Allergen filter (Gluten, Dairy, Nuts, Soy, Shellfish, Eggs) and dietary discipline (Vegetarian, Non-Vegetarian, Vegan).
   - Optional height and weight fields for user reference only — strictly no BMI calculations or medical claims.

4. **Smart Digital Pantry**:
   - Real-time categorized inventory (Vegetables, Fruits, Dairy, Grains, Pulses, Spices) synced to `LocalStorage`.
   - Batch integration directly from the AI Scanner with duplicate merging.

5. **Interactive "I Cooked This!" Workflow**:
   - Confirms actual ingredient weights consumed, automatically decrements pantry stock, calculates grams rescued from spoilage, computes estimated rupee (₹) savings, and celebrates with confetti.

6. **Food Rescue Impact Analytics**:
   - Interactive Recharts tracking cumulative edible weight rescued, money saved, and produce category distribution alongside UNEP Food Waste Index 2024 benchmarks.

---

## 🎨 Nature-Inspired Color Palette

- **Primary Forest Green**: `#244B3A`
- **Deep Green**: `#18382D`
- **Sage Green**: `#A8B99A`
- **Cream Background**: `#F8F7F1`
- **Warm White**: `#FFFFFF`
- **Soft Yellow**: `#F2D58A`
- **Coral Accent**: `#E88D70`
- **Text Dark**: `#242D27`
- **Secondary Text**: `#788078`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation
```bash
git clone https://github.com/<your-username>/fridge2fork.git
cd fridge2fork
npm install
```

### Run Development Server
```bash
npm run dev
```
Visit `http://localhost:5173` in your browser.

### Build Production Bundle
```bash
npm run build
```

---

## 🏛️ Project Architecture

```
fridge2fork/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── .gitignore
├── README.md
└── src/
    ├── components/
    │   ├── CameraCaptureModal.jsx       # Camera capture with shelf guidelines
    │   ├── CookModal.jsx                # "I Cooked This!" confirmation & pantry sync
    │   ├── Footer.jsx                   # Startup footer with UNEP 2024 citation
    │   ├── Navbar.jsx                   # Navigation bar with live "Use Soon" alerts
    │   ├── NutritionOnboardingModal.jsx # Multi-step nutrition profile setup
    │   ├── PantryItemModal.jsx          # Modal to add/edit pantry inventory
    │   └── RescueScoreBadge.jsx         # Circular SVG score meter with popover breakdown
    ├── context/
    │   └── AppContext.jsx               # Global state with LocalStorage persistence
    ├── data/
    │   ├── foodWasteStats.js            # UNEP Food Waste Index 2024 data points
    │   ├── initialPantry.js             # Curated initial pantry inventory (15 items)
    │   ├── recipes.js                   # 8 chef-crafted rescue recipes with nutrition & steps
    │   └── substitutions.js             # Flavor-Smart culinary chemistry database
    ├── pages/
    │   ├── DashboardPage.jsx            # Kitchen snapshot, KPIs, personalized recommendations
    │   ├── ImpactPage.jsx               # Recharts sustainability analytics & history log
    │   ├── LandingPage.jsx              # Split hero, scanner HUD, UNEP stats, feature cards
    │   ├── PantryPage.jsx               # Digital inventory with search, categories, and stock filters
    │   ├── ProfilePage.jsx              # Preferences, nutrition goals, dietary settings, reset
    │   ├── RecipeDetailPage.jsx         # Step-by-step checklist, substitutions & cook modal
    │   ├── RecipesPage.jsx              # Smart recipe search, filters (cuisine, time, dietary, goals)
    │   ├── RescueEnginePage.jsx         # Main USP page: "Can Cook Now" & "Rescue Opportunities"
    │   └── ScannerPage.jsx              # AI image upload, camera capture, laser scan animation, editable chips
    ├── services/
    │   ├── rescueScoreCalculator.js     # Deterministic 0-100 scoring algorithm
    │   └── visionService.js             # Modular vision API service with demo presets
    ├── utils/
    │   └── nutritionMatcher.js          # Nutrition-aware goal scoring & allergen filter
    ├── App.jsx                          # Route configuration & ScrollToTop
    ├── main.jsx                         # React root entry
    └── index.css                        # Tailwind directives & scan animations
```

---

## 📄 License
MIT
