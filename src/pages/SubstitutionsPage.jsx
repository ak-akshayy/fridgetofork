import React, { useState, useMemo } from 'react';
import { 
  Shuffle, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen, 
  Layers,
  Atom,
  ChefHat
} from 'lucide-react';
import { SUBSTITUTIONS_DATA } from '../data/substitutions';
import { useApp } from '../context/AppContext';

export default function SubstitutionsPage() {
  const { pantry } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Check which substitutions the user currently has in their pantry
  const substitutionsWithInventory = useMemo(() => {
    return SUBSTITUTIONS_DATA.map((sub) => {
      const matchInPantry = pantry.find((p) =>
        sub.pantryKeys.some((k) =>
          p.name.toLowerCase().includes(k.toLowerCase()) && p.status !== 'Out of Stock'
        )
      );
      return {
        ...sub,
        inPantry: !!matchInPantry,
        pantryItemName: matchInPantry ? matchInPantry.name : null
      };
    });
  }, [pantry]);

  const filteredSubs = useMemo(() => {
    return substitutionsWithInventory.filter((sub) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        sub.original.toLowerCase().includes(q) ||
        sub.substitute.toLowerCase().includes(q) ||
        sub.culinaryRole.toLowerCase().includes(q) ||
        sub.whyItWorks.toLowerCase().includes(q);

      return matchesSearch;
    });
  }, [substitutionsWithInventory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-200 px-3.5 py-1.5 rounded-full">
          <Atom className="w-3.5 h-3.5 text-forest-800" />
          <span>Culinary Chemistry & FlavorDB</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
          Flavor-Smart Substitution Engine
        </h1>
        <p className="text-textMuted text-sm sm:text-base">
          Never let a missing ingredient stall dinner. Discover science-backed alternatives evaluated for culinary function, moisture matrix, and shared volatile compounds.
        </p>
      </div>

      {/* 2. SEARCH & INFO BANNER */}
      <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ingredient substitutions (e.g. buttermilk, heavy cream, paneer, tomato puree)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
          />
        </div>

        <div className="p-3.5 bg-forest-50 border border-forest-200 rounded-2xl flex items-start space-x-2.5 text-xs text-forest-900">
          <ChefHat className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
          <div>
            <strong>Flavor Pairing Principle:</strong> We do not assume shared flavor compounds alone mean two items are interchangeable. Every alternative is vetted for its thermal behavior, pH acidity balance, and specific cuisine matrix.
          </div>
        </div>
      </div>

      {/* 3. SUBSTITUTION CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSubs.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-cream-300 shadow-soft hover:shadow-card-hover transition-all duration-300 space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Top Banner: In-Pantry Match & Compatibility Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800 bg-sage-200 px-2.5 py-1 rounded-lg">
                    {sub.culinaryRole}
                  </span>

                  {sub.inPantry && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>In Your Pantry</span>
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-forest-800">
                    {sub.flavorCompatibility}%
                  </div>
                  <div className="text-[10px] text-textMuted uppercase font-semibold">
                    Flavor Match
                  </div>
                </div>
              </div>

              {/* Original -> Suggested Substitute Flow */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] text-textMuted uppercase font-bold block">
                    Recipe Calls For:
                  </span>
                  <span className="font-extrabold text-base text-forest-900 truncate block">
                    {sub.original}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full bg-forest-700 text-white flex items-center justify-center shrink-0">
                  <Shuffle className="w-4 h-4 text-softYellow" />
                </div>

                <div className="min-w-0 text-right">
                  <span className="text-[10px] text-coral-700 uppercase font-bold block">
                    Smart Alternative:
                  </span>
                  <span className="font-extrabold text-base text-coral-600 truncate block">
                    {sub.substitute}
                  </span>
                </div>
              </div>

              {/* Ratio & Preparation */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-textDark block uppercase tracking-wider text-[11px]">
                  Preparation Ratio:
                </span>
                <p className="p-2.5 rounded-xl bg-forest-50/70 border border-forest-100 text-forest-900 font-medium">
                  {sub.ratio}
                </p>
              </div>

              {/* Why It Works Scientific Explanation */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-textDark block uppercase tracking-wider text-[11px]">
                  Why It Works:
                </span>
                <p className="text-textMuted leading-relaxed">
                  {sub.whyItWorks}
                </p>
              </div>

              {/* Shared Flavor Compounds */}
              {sub.sharedFlavorCompounds && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">
                    Shared Chemical Compounds:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sub.sharedFlavorCompounds.map((comp, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cream-200 text-forest-800"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Best For vs Caution Footer */}
            <div className="pt-3 border-t border-cream-200 space-y-2 text-xs">
              <div className="flex items-start space-x-1.5 text-forest-700">
                <span className="font-bold shrink-0">Best in:</span>
                <span className="text-textMuted">{sub.bestFor.join(', ')}</span>
              </div>

              {sub.caution && (
                <div className="flex items-start space-x-1.5 text-coral-700 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{sub.caution}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
