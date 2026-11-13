import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ScanLine, 
  Plus, 
  Sparkles, 
  Flame, 
  AlertCircle, 
  Scale, 
  IndianRupee, 
  UtensilsCrossed, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  BarChart3,
  ChefHat
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RECIPES_DATA } from '../data/recipes';
import { calculateRescueScore } from '../services/rescueScoreCalculator';
import RescueScoreBadge from '../components/RescueScoreBadge';
import PantryItemModal from '../components/PantryItemModal';
import CookModal from '../components/CookModal';

export default function DashboardPage() {
  const { 
    pantry, 
    cookedHistory, 
    totalGramsRescued, 
    totalMoneySaved, 
    totalMealsCooked,
    addPantryItem,
    toggleUseSoon
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCookRecipe, setSelectedCookRecipe] = useState(null);

  // Calculate dynamic recipe scores against current pantry
  const recipeScores = useMemo(() => {
    return RECIPES_DATA.map((rec) => {
      const rescueInfo = calculateRescueScore(rec, pantry);
      return {
        ...rec,
        rescueInfo
      };
    }).sort((a, b) => b.rescueInfo.score - a.rescueInfo.score);
  }, [pantry]);

  // Derived counts
  const totalPantryCount = pantry.filter((p) => p.status !== 'Out of Stock').length;
  const useSoonItems = pantry.filter((p) => p.useSoon && p.status !== 'Out of Stock');
  const canCookNowRecipes = recipeScores.filter((r) => r.rescueInfo.canCookNow);
  const rescueOpportunityRecipes = recipeScores.filter((r) => r.rescueInfo.isRescueOpportunity);

  // Recommended recipes (top 3)
  const topRecommendations = recipeScores.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. GREETING & HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-cream-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-3 py-1 rounded-full mb-2">
            <ChefHat className="w-3.5 h-3.5" />
            <span>AI Kitchen Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
            Good afternoon! Let's make something delicious.
          </h1>
          <p className="text-textMuted text-sm sm:text-base mt-1">
            Your kitchen has possibilities waiting to be discovered.
          </p>
        </div>

        {/* Quick Action Pill Bar */}
        <div className="flex items-center space-x-2.5">
          <Link
            to="/scanner"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-forest-700 text-white font-bold text-xs sm:text-sm hover:bg-forest-800 shadow-soft transition-all"
          >
            <ScanLine className="w-4 h-4 text-softYellow" />
            <span>Scan Fridge</span>
          </Link>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-sage-300 text-forest-800 font-bold text-xs sm:text-sm hover:bg-cream-100 transition-colors"
          >
            <Plus className="w-4 h-4 text-forest-700" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* 2. SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* KPI 1: Total Pantry Ingredients */}
        <div className="bg-white rounded-3xl p-5 border border-cream-300 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider">Pantry Stock</span>
            <div className="w-8 h-8 rounded-xl bg-cream-100 text-forest-700 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-forest-900">{totalPantryCount}</div>
          <div className="text-xs text-textMuted flex items-center space-x-1">
            <span className="text-forest-700 font-semibold">{pantry.length} total entries</span>
          </div>
        </div>

        {/* KPI 2: Ingredients to Use Soon */}
        <div className="bg-white rounded-3xl p-5 border border-coral-200 shadow-soft space-y-2 bg-gradient-to-br from-white to-coral-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-coral-700 uppercase tracking-wider">Use Soon</span>
            <div className="w-8 h-8 rounded-xl bg-coral-100 text-coral-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-coral-600">{useSoonItems.length}</div>
          <div className="text-xs text-coral-700 font-semibold">
            {useSoonItems.length > 0 ? 'High rescue priority' : 'All produce stable'}
          </div>
        </div>

        {/* KPI 3: Recipes You Can Make */}
        <div className="bg-white rounded-3xl p-5 border border-cream-300 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider">Ready to Cook</span>
            <div className="w-8 h-8 rounded-xl bg-sage-100 text-forest-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-forest-700" />
            </div>
          </div>
          <div className="text-3xl font-black text-forest-900">{canCookNowRecipes.length}</div>
          <div className="text-xs text-forest-700 font-semibold">
            100% matched recipes
          </div>
        </div>

        {/* KPI 4: Food Rescued */}
        <div className="bg-white rounded-3xl p-5 border border-cream-300 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider">Food Rescued</span>
            <div className="w-8 h-8 rounded-xl bg-softYellow/30 text-forest-900 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-forest-900">
            {totalGramsRescued >= 1000 ? `${(totalGramsRescued / 1000).toFixed(1)} kg` : `${totalGramsRescued} g`}
          </div>
          <div className="text-xs text-forest-700 font-semibold">
            Saved ₹{totalMoneySaved} grocery cost
          </div>
        </div>

      </div>

      {/* 3. MAIN DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Rescue First & Recommended Recipes */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION B: RESCUE FIRST (Urgent Ingredients) */}
          {useSoonItems.length > 0 && (
            <div className="bg-gradient-to-r from-coral-500/10 via-coral-50/60 to-cream-100 border border-coral-200 rounded-3xl p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-coral-500 text-white flex items-center justify-center">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-forest-900 text-lg">
                      Rescue First — Expiring Soon
                    </h3>
                    <p className="text-xs text-coral-800">
                      These {useSoonItems.length} ingredients are nearing their shelf life. Cook them today!
                    </p>
                  </div>
                </div>

                <Link
                  to="/rescue-engine"
                  className="text-xs font-bold text-coral-700 hover:text-coral-800 flex items-center"
                >
                  <span>Rescue Engine</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              {/* Items Pill Carousel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                {useSoonItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-3 border border-coral-200/80 shadow-sm flex items-center space-x-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-cream-200"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-textDark truncate">{item.name}</h4>
                      <p className="text-[11px] text-textMuted">{item.quantity} {item.unit}</p>
                      <span className="inline-block text-[10px] font-bold text-coral-600 bg-coral-50 px-1.5 py-0.2 rounded-md">
                        {item.daysUntilExpiry} days left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION C: RECOMMENDED FOR YOU (Smart Recipe Matching) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-forest-900">
                  Recommended For You
                </h3>
                <p className="text-xs text-textMuted">
                  Ranked by our Flavor-Smart Food Rescue Score
                </p>
              </div>

              <Link
                to="/recipes"
                className="text-xs font-bold text-forest-700 hover:underline flex items-center"
              >
                <span>View All ({recipeScores.length})</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topRecommendations.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-3xl overflow-hidden border border-cream-300 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col group"
                >
                  {/* Recipe Image & Badges */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Food Rescue Score Meter */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-soft">
                      <RescueScoreBadge
                        score={recipe.rescueInfo.score}
                        breakdown={recipe.rescueInfo.breakdown}
                        reasons={recipe.rescueInfo.reasons}
                        size="sm"
                        showTooltip={false}
                      />
                    </div>

                    {/* Can Cook Now / Rescue badge */}
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                      {recipe.rescueInfo.canCookNow ? (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-forest-700 text-white shadow-sm">
                          Can Cook Now
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/90 text-textDark shadow-sm">
                          {recipe.rescueInfo.availableIngredients.length}/{recipe.ingredients.length} Available
                        </span>
                      )}

                      {recipe.rescueInfo.isRescueOpportunity && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-coral-500 text-white shadow-sm">
                          Rescues Food
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center space-x-2 text-[11px] text-textMuted mb-1">
                        <span>{recipe.cuisine}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {recipe.cookTime} mins
                        </span>
                      </div>

                      <h4 className="font-bold text-textDark text-sm group-hover:text-forest-700 transition-colors line-clamp-2">
                        {recipe.title}
                      </h4>

                      <p className="text-xs text-textMuted mt-1 line-clamp-2">
                        {recipe.tagline}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-cream-200 flex items-center justify-between">
                      <Link
                        to={`/recipes/${recipe.id}`}
                        className="text-xs font-bold text-forest-700 hover:text-forest-800"
                      >
                        View Recipe
                      </Link>

                      <button
                        type="button"
                        onClick={() => setSelectedCookRecipe(recipe)}
                        className="px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-700 text-forest-800 hover:text-white font-bold text-xs transition-colors"
                      >
                        Cook This
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Kitchen Snapshot & Your Impact */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* SECTION A: YOUR KITCHEN SNAPSHOT */}
          <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-forest-900 text-base">
                  Kitchen Snapshot
                </h3>
                <p className="text-xs text-textMuted">Current produce & dairy status</p>
              </div>

              <Link
                to="/pantry"
                className="text-xs font-bold text-forest-700 hover:underline"
              >
                Open Pantry
              </Link>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {pantry.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-cream-50/70 border border-cream-200 hover:bg-cream-100 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-textDark truncate">{item.name}</div>
                      <div className="text-[11px] text-textMuted">{item.quantity} {item.unit}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {item.useSoon ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-coral-100 text-coral-700">
                        {item.daysUntilExpiry}d left
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sage-200/60 text-forest-800">
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-sage-400 text-forest-800 font-bold text-xs hover:bg-cream-100 transition-colors flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Ingredient</span>
            </button>
          </div>

          {/* SECTION D: YOUR IMPACT SUMMARY */}
          <div className="bg-forest-800 text-white rounded-3xl p-6 shadow-soft space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-softYellow">
                  Sustainability Tracker
                </span>
                <h3 className="font-extrabold text-white text-lg">Your Impact</h3>
              </div>

              <div className="w-8 h-8 rounded-xl bg-forest-700 text-softYellow flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-forest-900/60 rounded-2xl p-3.5 border border-forest-700 flex items-center justify-between">
                <span className="text-xs text-sage-200">Rescued From Waste</span>
                <span className="font-black text-softYellow text-base">
                  {totalGramsRescued >= 1000 ? `${(totalGramsRescued / 1000).toFixed(2)} kg` : `${totalGramsRescued} g`}
                </span>
              </div>

              <div className="bg-forest-900/60 rounded-2xl p-3.5 border border-forest-700 flex items-center justify-between">
                <span className="text-xs text-sage-200">Estimated Money Saved</span>
                <span className="font-black text-coral-400 text-base">₹{totalMoneySaved}</span>
              </div>

              <div className="bg-forest-900/60 rounded-2xl p-3.5 border border-forest-700 flex items-center justify-between">
                <span className="text-xs text-sage-200">Meals Prepared</span>
                <span className="font-black text-white text-base">{totalMealsCooked} recipes</span>
              </div>
            </div>

            <p className="text-[11px] text-sage-300 leading-relaxed">
              Every confirmed recipe keeps edible produce out of municipal waste streams.
            </p>

            <Link
              to="/impact"
              className="w-full inline-flex items-center justify-center space-x-1 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-600 text-white font-bold text-xs transition-colors"
            >
              <span>View Detailed Impact Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* Add Item Modal */}
      <PantryItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(newItem) => addPantryItem(newItem)}
      />

      {/* Cooking Confirmation Modal */}
      {selectedCookRecipe && (
        <CookModal
          recipe={selectedCookRecipe}
          isOpen={!!selectedCookRecipe}
          onClose={() => setSelectedCookRecipe(null)}
        />
      )}

    </div>
  );
}
