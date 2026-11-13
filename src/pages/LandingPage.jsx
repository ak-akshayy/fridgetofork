import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ScanLine, 
  Sparkles, 
  Scale, 
  ChefHat, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Shuffle, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  BarChart3,
  UtensilsCrossed,
  Leaf
} from 'lucide-react';
import { FOOD_WASTE_DATA } from '../data/foodWasteStats';

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="pt-8 sm:pt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sage-200/80 border border-sage-300 text-forest-800 text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-forest-700" />
              <span>YOUR SMART KITCHEN COMPANION</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-900 tracking-tight leading-[1.12]">
              Turn Forgotten Ingredients Into{' '}
              <span className="text-forest-700 underline decoration-sage-300 decoration-wavy decoration-2">
                Meaningful Meals.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-textMuted leading-relaxed max-w-2xl">
              Your fridge has more possibilities than you think. Scan your ingredients, discover personalized recipes, and rescue food before it goes to waste.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link
                to="/scanner"
                className="inline-flex items-center justify-center space-x-2.5 px-7 py-4 rounded-2xl bg-forest-700 text-white font-bold text-base shadow-soft-lg hover:bg-forest-800 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
              >
                <ScanLine className="w-5 h-5 text-softYellow" />
                <span>Scan My Fridge</span>
              </Link>

              <Link
                to="/recipes"
                className="inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-2xl bg-white border border-sage-300 text-forest-800 font-bold text-base shadow-sm hover:bg-cream-100 hover:border-forest-600 transition-all duration-200"
              >
                <span>Explore Recipes</span>
                <ArrowRight className="w-4 h-4 text-forest-700" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-cream-300/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-textDark">
                <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                <span>AI-Powered Ingredient Detection</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-textDark">
                <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                <span>Smart Recipe Matching</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-textDark">
                <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                <span>Food Waste Tracking</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Art-Directed Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Background ambient glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-sage-200/50 to-softYellow/30 rounded-3xl blur-2xl -z-10 transform rotate-1"></div>

              {/* Main Refrigerator / Kitchen Visual Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-cream-50">
                <img
                  src="https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&w=800&q=80"
                  alt="Well-stocked open kitchen refrigerator with fresh ingredients"
                  className="w-full h-[430px] object-cover"
                />

                {/* Simulated Scanning Laser Overlay */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-softYellow to-transparent animate-scan-laser shadow-[0_0_12px_#F2D58A]"></div>

                {/* AI Scanning Active HUD Badge */}
                <div className="absolute top-4 left-4 bg-forest-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/20 flex items-center space-x-2 text-xs font-semibold shadow-soft">
                  <span className="w-2 h-2 rounded-full bg-softYellow animate-ping"></span>
                  <span>Optical Produce Scan Active</span>
                </div>

                {/* Floating Tag 1: Spinach */}
                <div className="absolute top-28 left-6 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-soft border border-sage-200 flex items-center space-x-2 animate-float">
                  <span className="w-2.5 h-2.5 rounded-full bg-forest-600"></span>
                  <span className="text-xs font-bold text-textDark">Spinach (Palak)</span>
                  <span className="text-[10px] bg-coral-100 text-coral-700 font-bold px-1.5 py-0.5 rounded-md">2d left</span>
                </div>

                {/* Floating Tag 2: Paneer */}
                <div className="absolute bottom-32 right-6 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-soft border border-sage-200 flex items-center space-x-2 animate-float [animation-delay:1.5s]">
                  <span className="w-2.5 h-2.5 rounded-full bg-softYellow"></span>
                  <span className="text-xs font-bold text-textDark">Paneer Block</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">Available</span>
                </div>

                {/* Floating Card: 12 Ingredients Found */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-card-hover border border-sage-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-700 text-cream-100 flex items-center justify-center font-black text-sm">
                      12
                    </div>
                    <div>
                      <div className="text-xs font-bold text-textDark">Ingredients Found</div>
                      <div className="text-[11px] text-textMuted">Fresh produce & dairy recognized</div>
                    </div>
                  </div>

                  {/* Rescue Opportunity Notification */}
                  <div className="bg-coral-50 border border-coral-200 px-3 py-1.5 rounded-xl text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-coral-700">Rescue Alert</div>
                    <div className="text-xs font-extrabold text-forest-900">4 Items Urgent</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FOOD WASTE STATISTICS SECTION */}
      <section className="bg-gradient-to-b from-forest-900 to-forest-800 text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-softYellow">
              Global Awareness & Household Action
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Small Kitchen Habits. A Bigger Global Impact.
            </h2>
            <p className="text-sage-200 text-sm sm:text-base leading-relaxed">
              Household waste is the single largest contributor to food spoilage worldwide. Small inventory adjustments create monumental ecological savings.
            </p>
          </div>

          {/* Prominent Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Stat 1: 78.2 Million Tonnes */}
            <div className="bg-forest-800/80 border border-forest-700/80 rounded-3xl p-8 text-center space-y-3 shadow-lg relative overflow-hidden group hover:border-sage-400 transition-colors">
              <div className="text-xs font-bold uppercase tracking-wider text-sage-300">
                Annual Household Burden
              </div>
              <div className="text-4xl sm:text-5xl font-black text-softYellow tracking-tight">
                78.2 Million Tonnes
              </div>
              <p className="text-sm text-sage-100 max-w-sm mx-auto">
                Estimated Indian household food waste in 2022.
              </p>
            </div>

            {/* Stat 2: 55 KG Per Person */}
            <div className="bg-forest-800/80 border border-forest-700/80 rounded-3xl p-8 text-center space-y-3 shadow-lg relative overflow-hidden group hover:border-sage-400 transition-colors">
              <div className="text-xs font-bold uppercase tracking-wider text-sage-300">
                Per-Capita Metric
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                55 KG
              </div>
              <p className="text-sm text-sage-100 max-w-sm mx-auto">
                Estimated annual household food waste per person.
              </p>
            </div>

          </div>

          {/* UNEP Attribution Notice */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs text-sage-300/80 italic">
              {FOOD_WASTE_DATA.sourceAttribution}
            </p>
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-200 px-3 py-1 rounded-full">
            Effortless Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
            How Fridge2Fork Works
          </h2>
          <p className="text-textMuted text-sm sm:text-base">
            From optical recognition to your dinner table in four frictionless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft relative group hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 rounded-2xl bg-forest-700 text-softYellow flex items-center justify-center font-black text-lg mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-forest-900 mb-2">Scan Your Fridge</h3>
            <p className="text-textMuted text-xs leading-relaxed">
              Snap a quick photo of your crisper drawer or shelves. AI vision detects produce, dairy, and pantry staples in seconds.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft relative group hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 rounded-2xl bg-forest-700 text-softYellow flex items-center justify-center font-black text-lg mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-forest-900 mb-2">Build Your Pantry</h3>
            <p className="text-textMuted text-xs leading-relaxed">
              Verify detected items, edit quantities, and flag expiring items as "Use Soon" for high-priority culinary matching.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft relative group hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 rounded-2xl bg-forest-700 text-softYellow flex items-center justify-center font-black text-lg mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-forest-900 mb-2">Discover Smart Recipes</h3>
            <p className="text-textMuted text-xs leading-relaxed">
              Our Flavor-Smart Rescue Engine scores dishes from 0 to 100 based on what you already own and intelligent substitutions.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft relative group hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 rounded-2xl bg-forest-700 text-softYellow flex items-center justify-center font-black text-lg mb-4">
              4
            </div>
            <h3 className="text-lg font-bold text-forest-900 mb-2">Rescue Food & Track Impact</h3>
            <p className="text-textMuted text-xs leading-relaxed">
              Tap "I Cooked This!" to automatically deduct ingredients, record grams saved, and watch your domestic savings multiply.
            </p>
          </div>

        </div>
      </section>

      {/* 4. FEATURE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-200 px-3 py-1 rounded-full">
            Startup Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
            Crafted for Mindful, Modern Kitchens
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: AI Scanner */}
          <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-4 hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 text-forest-700 flex items-center justify-center">
              <ScanLine className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-forest-900">AI Fridge Scanner</h3>
            <p className="text-textMuted text-xs leading-relaxed">
              Multimodal optical recognition segments fresh produce, tags expiring items, and generates editable ingredient chips instantly.
            </p>
            <Link to="/scanner" className="inline-flex items-center text-xs font-bold text-forest-700 hover:text-forest-900">
              <span>Try Scanner Interface</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Card 2: Digital Pantry */}
          <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-4 hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 text-forest-700 flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-forest-900">Smart Digital Pantry</h3>
            <p className="text-textMuted text-xs leading-relaxed">
              Categorized inventory across vegetables, dairy, grains, pulses, and spices with persistent LocalStorage synchronisation.
            </p>
            <Link to="/pantry" className="inline-flex items-center text-xs font-bold text-forest-700 hover:text-forest-900">
              <span>View Kitchen Pantry</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Card 3: Rescue Engine */}
          <div className="bg-white rounded-3xl p-6 border border-coral-200 bg-gradient-to-br from-white to-coral-50/40 shadow-soft space-y-4 hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-coral-100 border border-coral-300 text-coral-700 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-forest-900">Flavor-Smart Rescue</h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-coral-500 text-white">USP</span>
            </div>
            <p className="text-textMuted text-xs leading-relaxed">
              Deterministic, explainable 0–100 scoring algorithm that prioritizes expiring ingredients and eliminates unnecessary grocery runs.
            </p>
            <Link to="/rescue-engine" className="inline-flex items-center text-xs font-bold text-coral-700 hover:text-coral-900">
              <span>Explore Rescue Engine</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Card 4: Recipe Discovery */}
          <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-4 hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 text-forest-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-forest-900">Intelligent Recipe Discovery</h3>
            <p className="text-textMuted text-xs leading-relaxed">
              Filter by cuisine, prep time, and dietary constraints with instant "Can Cook Now" and "Rescue Opportunity" badges.
            </p>
            <Link to="/recipes" className="inline-flex items-center text-xs font-bold text-forest-700 hover:text-forest-900">
              <span>Browse Recipes</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Card 5: Smart Substitutions */}
          <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-4 hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 text-forest-700 flex items-center justify-center">
              <Shuffle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-forest-900">Flavor Substitutions</h3>
            <p className="text-textMuted text-xs leading-relaxed">
              FlavorDB-inspired culinary chemistry: swap buttermilk for diluted dahi, paneer for pressed tofu, or heavy cream for cashew cream.
            </p>
            <Link to="/substitutions" className="inline-flex items-center text-xs font-bold text-forest-700 hover:text-forest-900">
              <span>Check Substitutions</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Card 6: Impact Dashboard */}
          <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-4 hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 text-forest-700 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-forest-900">Food Rescue Impact</h3>
            <p className="text-textMuted text-xs leading-relaxed">
              Transparent sustainability ledger showing grams rescued, ₹ saved, meal logs, and contextual UNEP comparison.
            </p>
            <Link to="/impact" className="inline-flex items-center text-xs font-bold text-forest-700 hover:text-forest-900">
              <span>View Sustainability Stats</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-800 rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-forest-700/50 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sage-400/20 rounded-full blur-3xl -z-0"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-softYellow/20 text-softYellow text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5" />
              <span>Zero-Waste Cooking</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Your Next Great Meal Might Already Be in Your Fridge.
            </h2>

            <p className="text-sage-100 text-base sm:text-lg">
              Join thousands of conscious home cooks turning forgotten produce into flavorful, nourishing dinners.
            </p>

            <div className="pt-2">
              <Link
                to="/scanner"
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-coral-500 text-white font-bold text-base hover:bg-coral-600 shadow-soft-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Start Rescuing Food</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
