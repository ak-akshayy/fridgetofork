import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Shuffle, 
  ArrowRight, 
  Clock, 
  Scale, 
  ChefHat,
  HelpCircle,
  TrendingUp,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RECIPES_DATA } from '../data/recipes';
import { calculateRescueScore } from '../services/rescueScoreCalculator';
import RescueScoreBadge from '../components/RescueScoreBadge';
import CookModal from '../components/CookModal';

export default function RescueEnginePage() {
  const { pantry } = useApp();
  const [selectedCookRecipe, setSelectedCookRecipe] = useState(null);

  // Calculate scores for all recipes
  const scoredRecipes = useMemo(() => {
    return RECIPES_DATA.map((rec) => {
      const rescueInfo = calculateRescueScore(rec, pantry);
      return {
        ...rec,
        rescueInfo
      };
    }).sort((a, b) => b.rescueInfo.score - a.rescueInfo.score);
  }, [pantry]);

  // Section A: CAN COOK NOW (100% available or substituted)
  const canCookNowList = scoredRecipes.filter((r) => r.rescueInfo.canCookNow);

  // Section B: RESCUE OPPORTUNITIES (Prioritizes expiring ingredients)
  const rescueOpportunities = scoredRecipes.filter(
    (r) => r.rescueInfo.isRescueOpportunity
  );

  const useSoonCount = pantry.filter((p) => p.useSoon && p.status !== 'Out of Stock').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* 1. HERO HEADER */}
      <div className="relative rounded-3xl bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-forest-700">
        
        {/* Glow decor */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-coral-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-softYellow/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-coral-500/20 border border-coral-500/30 text-coral-300 text-xs font-black tracking-wider uppercase">
            <Flame className="w-4 h-4 text-coral-400" />
            <span>Core Platform Engine • USP</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Rescue More. Waste Less.{' '}
            <span className="text-softYellow">Cook Smarter.</span>
          </h1>

          <p className="text-sage-200 text-base sm:text-lg leading-relaxed">
            Our intelligent engine finds recipes that use what you already have, prioritizing ingredients that need attention before spoilage occurs.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs">
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-softYellow" />
              <span>100% Deterministic Rule-Based Math</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
              <Flame className="w-4 h-4 text-coral-400" />
              <span>{useSoonCount} Items Expiring Soon in Pantry</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HOW THE SCORE WORKS (Explainability Banner) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-200 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-forest-900 flex items-center space-x-2">
              <span>The Food Rescue Score (0 – 100) Explained</span>
            </h2>
            <p className="text-xs text-textMuted mt-0.5">
              Transparent algorithms instead of black-box guesses. We evaluate 4 deterministic culinary dimensions:
            </p>
          </div>

          <span className="text-xs font-bold text-forest-700 bg-sage-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Algorithm v2.4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-1">
            <div className="text-xs font-bold text-forest-800 uppercase tracking-wider">1. Use-Soon Weight</div>
            <div className="text-lg font-black text-coral-600">+35 Max Pts</div>
            <p className="text-[11px] text-textMuted leading-relaxed">
              Heavily prioritizes vegetables and dairy within 48-72h of expiration.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-1">
            <div className="text-xs font-bold text-forest-800 uppercase tracking-wider">2. Pantry Stock</div>
            <div className="text-lg font-black text-forest-700">+45 Max Pts</div>
            <p className="text-[11px] text-textMuted leading-relaxed">
              Calculates percentage ratio of required ingredients present in your inventory.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-1">
            <div className="text-xs font-bold text-forest-800 uppercase tracking-wider">3. Smart Substitutes</div>
            <div className="text-lg font-black text-forest-700">+12 Max Pts</div>
            <p className="text-[11px] text-textMuted leading-relaxed">
              Integrates FlavorDB chemical compatibility when you lack the primary item.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-1">
            <div className="text-xs font-bold text-forest-800 uppercase tracking-wider">4. Zero-Friction Bonus</div>
            <div className="text-lg font-black text-softYellow-400 text-amber-600">+8 Bonus Pts</div>
            <p className="text-[11px] text-textMuted leading-relaxed">
              Awarded if no additional supermarket trips or secondary purchases are required.
            </p>
          </div>
        </div>
      </div>

      {/* 3. SECTION B: RESCUE OPPORTUNITIES (Highlighting Expiring Items) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-coral-700 bg-coral-100 px-2.5 py-0.5 rounded-full mb-1">
              <Flame className="w-3.5 h-3.5 text-coral-600" />
              <span>High Urgency Tier</span>
            </div>
            <h2 className="text-2xl font-extrabold text-forest-900">
              Rescue Opportunities
            </h2>
            <p className="text-xs text-textMuted">
              Recipes that specifically utilize ingredients marked as <strong>Use Soon</strong> in your pantry.
            </p>
          </div>

          <span className="text-xs font-bold text-textMuted">
            {rescueOpportunities.length} opportunities found
          </span>
        </div>

        {rescueOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rescueOpportunities.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-3xl overflow-hidden border-2 border-coral-200/90 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col group relative"
              >
                {/* Visual Header */}
                <div className="relative h-48 overflow-hidden bg-cream-100">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Circular Rescue Score Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-soft">
                    <RescueScoreBadge
                      score={recipe.rescueInfo.score}
                      breakdown={recipe.rescueInfo.breakdown}
                      reasons={recipe.rescueInfo.reasons}
                      size="sm"
                      showTooltip={false}
                    />
                  </div>

                  {/* Badges */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-coral-500 text-white shadow-sm flex items-center space-x-1">
                      <Flame className="w-3 h-3" />
                      <span>Rescue Opportunity</span>
                    </span>

                    {recipe.rescueInfo.canCookNow && (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-forest-700 text-white shadow-sm">
                        Can Cook Now
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
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

                    <h3 className="text-lg font-extrabold text-forest-900 group-hover:text-forest-700 transition-colors">
                      {recipe.title}
                    </h3>

                    <p className="text-xs text-textMuted line-clamp-2">
                      {recipe.story || recipe.tagline}
                    </p>

                    {/* Rescued Ingredients Tag List */}
                    <div className="pt-2 border-t border-cream-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-coral-700 block mb-1">
                        Rescues Expiring Produce:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {recipe.rescueInfo.useSoonUsed.map((u, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-coral-50 text-coral-700 border border-coral-200"
                          >
                            ✓ {u.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Substitution indicator if present */}
                    {recipe.rescueInfo.substitutionsAvailable.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-forest-50 border border-forest-200 text-[11px] text-forest-900 flex items-start space-x-2">
                        <Shuffle className="w-3.5 h-3.5 text-forest-700 shrink-0 mt-0.5" />
                        <div>
                          <strong>Flavor swap:</strong> {recipe.rescueInfo.substitutionsAvailable[0].substitute} for {recipe.rescueInfo.substitutionsAvailable[0].original}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="text-xs font-bold text-forest-700 hover:underline"
                    >
                      View Instructions
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSelectedCookRecipe(recipe)}
                      className="px-4 py-2 rounded-xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-800 transition-colors shadow-soft"
                    >
                      I Cooked This!
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-auto space-y-3 border border-cream-300">
            <CheckCircle2 className="w-10 h-10 text-forest-700 mx-auto" />
            <h4 className="font-bold text-forest-900">No Ingredients Expiring Soon!</h4>
            <p className="text-xs text-textMuted">
              All pantry produce is currently stable. Mark items as "Use Soon" in your pantry to prioritize them here.
            </p>
          </div>
        )}
      </div>

      {/* 4. SECTION A: CAN COOK NOW (100% Pantry Match) */}
      <div className="space-y-6 pt-4 border-t border-cream-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-forest-800 bg-sage-200 px-2.5 py-0.5 rounded-full mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
              <span>Zero-Shopping Meals</span>
            </div>
            <h2 className="text-2xl font-extrabold text-forest-900">
              Can Cook Now
            </h2>
            <p className="text-xs text-textMuted">
              You already own every required ingredient or have an approved in-stock flavor substitute.
            </p>
          </div>

          <span className="text-xs font-bold text-textMuted">
            {canCookNowList.length} ready-to-cook recipes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canCookNowList.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-3xl overflow-hidden border border-cream-300 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col group"
            >
              {/* Header Image */}
              <div className="relative h-44 overflow-hidden bg-cream-100">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-soft">
                  <RescueScoreBadge
                    score={recipe.rescueInfo.score}
                    breakdown={recipe.rescueInfo.breakdown}
                    reasons={recipe.rescueInfo.reasons}
                    size="sm"
                    showTooltip={false}
                  />
                </div>

                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-forest-700 text-white shadow-sm">
                    ✓ 100% In Stock
                  </span>
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

                  <h4 className="font-bold text-textDark text-sm group-hover:text-forest-700 transition-colors">
                    {recipe.title}
                  </h4>

                  <p className="text-xs text-textMuted mt-1 line-clamp-2">
                    {recipe.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
                  <Link
                    to={`/recipes/${recipe.id}`}
                    className="text-xs font-bold text-forest-700 hover:underline"
                  >
                    View Details
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
