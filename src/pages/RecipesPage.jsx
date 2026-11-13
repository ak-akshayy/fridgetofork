import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Clock, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  ChefHat, 
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RECIPES_DATA } from '../data/recipes';
import { calculateRescueScore } from '../services/rescueScoreCalculator';
import RescueScoreBadge from '../components/RescueScoreBadge';
import CookModal from '../components/CookModal';

export default function RecipesPage() {
  const { pantry } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedDietary, setSelectedDietary] = useState('All');
  const [maxCookTime, setMaxCookTime] = useState(60); // mins
  const [canCookNowOnly, setCanCookNowOnly] = useState(false);
  const [rescueOnly, setRescueOnly] = useState(false);
  const [selectedCookRecipe, setSelectedCookRecipe] = useState(null);

  // Compute dynamic scores for all recipes
  const scoredRecipes = useMemo(() => {
    return RECIPES_DATA.map((rec) => {
      const rescueInfo = calculateRescueScore(rec, pantry);
      return {
        ...rec,
        rescueInfo
      };
    }).sort((a, b) => b.rescueInfo.score - a.rescueInfo.score);
  }, [pantry]);

  // Unique cuisines and dietary tags
  const cuisines = ['All', 'North Indian', 'Homestyle Indian', 'Mediterranean', 'Western Indian', 'Continental Fusion'];
  const dietaryOptions = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free'];

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return scoredRecipes.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.ingredients.some((ing) => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCuisine = selectedCuisine === 'All' || r.cuisine === selectedCuisine;

      const matchesDietary =
        selectedDietary === 'All' || (r.dietary && r.dietary.includes(selectedDietary));

      const matchesTime = r.cookTime <= maxCookTime;

      const matchesCanCook = !canCookNowOnly || r.rescueInfo.canCookNow;

      const matchesRescue = !rescueOnly || r.rescueInfo.isRescueOpportunity;

      return matchesSearch && matchesCuisine && matchesDietary && matchesTime && matchesCanCook && matchesRescue;
    });
  }, [scoredRecipes, searchQuery, selectedCuisine, selectedDietary, maxCookTime, canCookNowOnly, rescueOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-cream-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recipe Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
            Discover What's Cooking.
          </h1>
          <p className="text-textMuted text-sm sm:text-base mt-1">
            Personalized recipes ranked in real-time by your kitchen inventory and food rescue impact.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/rescue-engine"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-coral-50 border border-coral-200 text-coral-700 font-bold text-xs hover:bg-coral-100 transition-colors"
          >
            <Flame className="w-4 h-4 text-coral-600" />
            <span>Rescue Engine Priority</span>
          </Link>
        </div>
      </div>

      {/* 2. FILTER CONTROLS */}
      <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-5">
        
        {/* Top Search & Toggles */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recipes, ingredients (e.g. palak, paneer, tomatoes)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
            />
          </div>

          {/* Quick Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCanCookNowOnly(!canCookNowOnly)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center space-x-1.5 ${
                canCookNowOnly
                  ? 'bg-forest-700 text-white border-forest-800 shadow-sm'
                  : 'bg-cream-100 text-textDark border-cream-200 hover:bg-cream-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Can Cook Now Only</span>
            </button>

            <button
              onClick={() => setRescueOnly(!rescueOnly)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center space-x-1.5 ${
                rescueOnly
                  ? 'bg-coral-500 text-white border-coral-600 shadow-sm'
                  : 'bg-coral-50 text-coral-700 border-coral-200 hover:bg-coral-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Rescue Opportunities</span>
            </button>
          </div>
        </div>

        {/* Cuisines & Dietary Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-cream-200 text-xs">
          
          {/* Cuisine selector */}
          <div>
            <label className="font-bold text-textDark uppercase tracking-wider block mb-1.5 text-[11px]">
              Cuisine
            </label>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-sage-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-forest-600"
            >
              {cuisines.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Dietary selector */}
          <div>
            <label className="font-bold text-textDark uppercase tracking-wider block mb-1.5 text-[11px]">
              Dietary Preference
            </label>
            <select
              value={selectedDietary}
              onChange={(e) => setSelectedDietary(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-sage-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-forest-600"
            >
              {dietaryOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Max Cook Time Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-textDark uppercase tracking-wider text-[11px]">
                Max Cook Time
              </label>
              <span className="font-bold text-forest-700">{maxCookTime} mins</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="5"
              value={maxCookTime}
              onChange={(e) => setMaxCookTime(Number(e.target.value))}
              className="w-full accent-forest-700 cursor-pointer"
            />
          </div>

        </div>

      </div>

      {/* 3. RECIPES GRID */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-3xl overflow-hidden border border-cream-300 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col group"
            >
              {/* Image & Score Meter */}
              <div className="relative h-48 overflow-hidden bg-cream-100">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Circular Score Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-soft">
                  <RescueScoreBadge
                    score={recipe.rescueInfo.score}
                    breakdown={recipe.rescueInfo.breakdown}
                    reasons={recipe.rescueInfo.reasons}
                    size="sm"
                    showTooltip={false}
                  />
                </div>

                {/* Badges on Bottom Left */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                  {recipe.rescueInfo.canCookNow ? (
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-forest-700 text-white shadow-sm">
                      ✓ Can Cook Now
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white/95 text-textDark shadow-sm">
                      {recipe.rescueInfo.availableIngredients.length}/{recipe.ingredients.length} in Pantry
                    </span>
                  )}

                  {recipe.rescueInfo.isRescueOpportunity && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-coral-500 text-white shadow-sm flex items-center space-x-1">
                      <Flame className="w-3 h-3" />
                      <span>Rescues Food</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Recipe Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[11px] text-textMuted">
                    <span>{recipe.cuisine}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {recipe.cookTime} mins
                    </span>
                    <span>•</span>
                    <span>{recipe.difficulty}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-forest-900 group-hover:text-forest-700 transition-colors">
                    {recipe.title}
                  </h3>

                  <p className="text-xs text-textMuted line-clamp-2">
                    {recipe.tagline}
                  </p>

                  {/* Missing vs Available summary */}
                  <div className="pt-2 border-t border-cream-200 text-xs">
                    {recipe.rescueInfo.missingIngredients.length > 0 ? (
                      <div className="text-[11px] text-coral-600 font-medium">
                        Missing: {recipe.rescueInfo.missingIngredients.map((m) => m.name).join(', ')}
                      </div>
                    ) : (
                      <div className="text-[11px] text-forest-700 font-semibold flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        <span>All ingredients ready in your kitchen</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
                  <Link
                    to={`/recipes/${recipe.id}`}
                    className="text-xs font-bold text-forest-700 hover:underline"
                  >
                    View Recipe
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedCookRecipe(recipe)}
                    className="px-3.5 py-1.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs transition-colors shadow-soft"
                  >
                    Cook This
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto space-y-3 border border-cream-300 shadow-soft">
          <ChefHat className="w-10 h-10 text-forest-700 mx-auto" />
          <h3 className="font-bold text-forest-900 text-base">No Recipes Matched Filters</h3>
          <p className="text-xs text-textMuted">
            Try loosening the cook time filter, resetting cuisine, or adding more ingredients to your pantry.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCuisine('All');
              setSelectedDietary('All');
              setMaxCookTime(60);
              setCanCookNowOnly(false);
              setRescueOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-forest-700 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Cooking Modal */}
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
