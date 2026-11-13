import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  ChefHat, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Shuffle, 
  ArrowLeft, 
  Heart, 
  Check, 
  UtensilsCrossed, 
  HelpCircle,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RECIPES_DATA } from '../data/recipes';
import { calculateRescueScore } from '../services/rescueScoreCalculator';
import RescueScoreBadge from '../components/RescueScoreBadge';
import CookModal from '../components/CookModal';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pantry } = useApp();

  const [isCookModalOpen, setIsCookModalOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});

  // Find the recipe
  const recipe = RECIPES_DATA.find((r) => r.id === id) || RECIPES_DATA[0];

  // Calculate dynamic rescue score against current pantry
  const rescueInfo = useMemo(() => {
    return calculateRescueScore(recipe, pantry);
  }, [recipe, pantry]);

  const toggleStep = (index) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/recipes"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-textMuted hover:text-forest-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Recipes</span>
        </Link>

        <div className="flex items-center space-x-2">
          {rescueInfo.isRescueOpportunity && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-coral-100 text-coral-700 flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-coral-600" />
              <span>High Rescue Priority</span>
            </span>
          )}
        </div>
      </div>

      {/* Hero Visual Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-cream-300 bg-cream-100 h-72 sm:h-96">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Floating Circular Rescue Score Meter */}
        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-3xl p-3 shadow-card-hover border border-sage-200">
          <RescueScoreBadge
            score={rescueInfo.score}
            breakdown={rescueInfo.breakdown}
            reasons={rescueInfo.reasons}
            size="lg"
            showTooltip={true}
          />
        </div>

        {/* Hero Title & Meta Overlay */}
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-forest-700 text-white shadow-sm">
              {recipe.cuisine}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white">
              {recipe.difficulty}
            </span>
            {recipe.dietary?.map((d) => (
              <span key={d} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-md text-softYellow">
                {d}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {recipe.title}
          </h1>

          <p className="text-sage-100 text-sm max-w-2xl line-clamp-2">
            {recipe.tagline}
          </p>

          <div className="flex items-center space-x-6 text-xs text-sage-200 pt-1">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-softYellow" />
              <span>Prep: {recipe.prepTime}m • Cook: {recipe.cookTime}m</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-softYellow" />
              <span>{recipe.servings} Servings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Split: Left (Ingredients & Substitutions), Right (Cooking Instructions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (5 cols): Ingredients, Stock Status, Substitutions & Nutrition */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Ingredients Ledger */}
          <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h3 className="font-extrabold text-lg text-forest-900">
                Ingredients Required
              </h3>
              <span className="text-xs font-bold text-textMuted">
                {rescueInfo.availableIngredients.length}/{recipe.ingredients.length} Available
              </span>
            </div>

            <div className="space-y-2.5">
              {recipe.ingredients.map((ing, idx) => {
                const isAvail = rescueInfo.availableIngredients.some(
                  (a) => a.recipeIngredient.name === ing.name
                );
                const isSub = rescueInfo.substitutionsAvailable.some(
                  (s) => s.original === ing.name
                );
                const isExpiring = rescueInfo.useSoonUsed.some(
                  (u) => u.name.toLowerCase().includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(u.name.toLowerCase())
                );

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                      isExpiring
                        ? 'bg-coral-50/70 border-coral-200'
                        : isAvail
                        ? 'bg-cream-50 border-cream-200'
                        : isSub
                        ? 'bg-forest-50 border-forest-200'
                        : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isExpiring
                            ? 'bg-coral-500'
                            : isAvail
                            ? 'bg-forest-700'
                            : isSub
                            ? 'bg-forest-500'
                            : 'bg-gray-400'
                        }`}
                      ></div>
                      <div>
                        <span className="font-bold text-textDark block">{ing.name}</span>
                        {isExpiring && (
                          <span className="text-[10px] text-coral-600 font-bold">
                            🔥 Expiring soon in pantry
                          </span>
                        )}
                        {isSub && !isAvail && (
                          <span className="text-[10px] text-forest-700 font-semibold">
                            ✓ Has smart pantry substitute
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="font-extrabold text-forest-800">
                      {ing.quantity} {ing.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flavor-Smart Substitutions Card (if applicable) */}
          {rescueInfo.substitutionsAvailable.length > 0 && (
            <div className="bg-gradient-to-br from-forest-50 to-sage-50 border border-forest-200 rounded-3xl p-6 shadow-soft space-y-3">
              <div className="flex items-center space-x-2">
                <Shuffle className="w-4 h-4 text-forest-700" />
                <h4 className="font-extrabold text-forest-900 text-sm">
                  Smart Alternative Found!
                </h4>
              </div>

              {rescueInfo.substitutionsAvailable.map((sub, i) => (
                <div key={i} className="text-xs space-y-1.5 pt-1">
                  <div className="font-bold text-forest-800">
                    Use {sub.substitute} instead of {sub.original}
                  </div>
                  <p className="text-textMuted text-[11px] leading-relaxed">
                    {sub.whyItWorks}
                  </p>
                  <div className="flex items-center space-x-2 text-[10px] text-forest-700 font-semibold pt-1">
                    <span>Role: {sub.culinaryRole}</span>
                    <span>•</span>
                    <span>{sub.flavorCompatibility}% Flavor Match</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reliable Nutrition Overview */}
          {recipe.nutrition && (
            <div className="bg-white rounded-3xl p-5 border border-cream-300 shadow-soft space-y-3">
              <h4 className="font-bold text-textDark text-xs uppercase tracking-wider">
                Reliable Nutritional Overview (Per Serving)
              </h4>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-cream-50 rounded-2xl">
                  <div className="text-[10px] text-textMuted uppercase font-semibold">Calories</div>
                  <div className="font-extrabold text-forest-900 text-sm">{recipe.nutrition.calories}</div>
                </div>
                <div className="p-2.5 bg-cream-50 rounded-2xl">
                  <div className="text-[10px] text-textMuted uppercase font-semibold">Protein</div>
                  <div className="font-extrabold text-forest-900 text-sm">{recipe.nutrition.protein}</div>
                </div>
                <div className="p-2.5 bg-cream-50 rounded-2xl">
                  <div className="text-[10px] text-textMuted uppercase font-semibold">Carbs</div>
                  <div className="font-extrabold text-forest-900 text-sm">{recipe.nutrition.carbs}</div>
                </div>
                <div className="p-2.5 bg-cream-50 rounded-2xl">
                  <div className="text-[10px] text-textMuted uppercase font-semibold">Fats</div>
                  <div className="font-extrabold text-forest-900 text-sm">{recipe.nutrition.fat}</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column (7 cols): Step-by-Step Cooking & Action CTA */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Instructions Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <div>
                <h3 className="font-extrabold text-xl text-forest-900">
                  Step-by-Step Cooking
                </h3>
                <p className="text-xs text-textMuted">
                  Check off each step as you proceed in the kitchen
                </p>
              </div>

              <span className="text-xs font-bold text-forest-700 bg-sage-100 px-3 py-1 rounded-full">
                {recipe.steps.length} Steps
              </span>
            </div>

            <div className="space-y-4">
              {recipe.steps.map((step, index) => {
                const isDone = !!completedSteps[index];
                return (
                  <div
                    key={index}
                    onClick={() => toggleStep(index)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                      isDone
                        ? 'bg-sage-50/80 border-sage-200 text-textMuted line-through'
                        : 'bg-cream-50 border-cream-200 text-textDark hover:bg-cream-100/70'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-colors ${
                        isDone
                          ? 'bg-forest-700 text-white'
                          : 'bg-white border border-sage-300 text-forest-800'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5" /> : index + 1}
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Food Rescue Story / Pro Tip */}
            {recipe.story && (
              <div className="p-4 bg-coral-50/60 border border-coral-200 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-coral-800 flex items-center space-x-1.5">
                  <Flame className="w-3.5 h-3.5 text-coral-600" />
                  <span>The Food Rescue Impact of This Dish</span>
                </div>
                <p className="text-coral-900/90 leading-relaxed text-[11px]">
                  {recipe.story}
                </p>
              </div>
            )}

            {/* Prominent "I Cooked This!" CTA */}
            <div className="pt-4 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-forest-900 block">
                  Finished Preparing Your Meal?
                </span>
                <span className="text-[11px] text-textMuted">
                  Confirm portions to deduct from your pantry and record rescued food!
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsCookModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl bg-forest-700 text-white font-black text-sm hover:bg-forest-800 shadow-soft-lg transition-all hover:-translate-y-0.5"
              >
                <CheckCircle2 className="w-5 h-5 text-softYellow" />
                <span>I Cooked This!</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Cooking Modal */}
      <CookModal
        recipe={recipe}
        isOpen={isCookModalOpen}
        onClose={() => setIsCookModalOpen(false)}
      />

    </div>
  );
}
