import React, { useState, useEffect } from 'react';
import { Check, X, Sparkles, Scale, IndianRupee, AlertCircle, Heart, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CookModal({ recipe, isOpen, onClose, onCookedSuccess }) {
  const { pantry, recordCookedMeal } = useApp();

  // Prepare initial ingredient rows based on recipe & pantry state
  const [ingredientRows, setIngredientRows] = useState([]);
  const [servings, setServings] = useState(recipe?.servings || 2);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (!recipe || !recipe.ingredients) return;

    const rows = recipe.ingredients.map((ing) => {
      // Find matching pantry item
      const reqNameLower = ing.name.toLowerCase();
      const reqKeyLower = (ing.key || '').toLowerCase();
      const matchedPantry = pantry.find((p) => {
        const pLower = p.name.toLowerCase();
        return (
          pLower.includes(reqNameLower) ||
          reqNameLower.includes(pLower) ||
          (reqKeyLower && pLower.includes(reqKeyLower))
        );
      });

      const isExpiringSoon = matchedPantry ? !!matchedPantry.useSoon : false;
      const unitPrice = matchedPantry ? matchedPantry.pricePerUnit : 50;

      return {
        id: ing.name,
        name: ing.name,
        quantityUsed: ing.quantity,
        unit: ing.unit,
        isUsed: true,
        wasRescued: isExpiringSoon,
        pricePerUnit: unitPrice,
        inPantry: !!matchedPantry,
        pantryStock: matchedPantry ? matchedPantry.quantity : 0
      };
    });

    setIngredientRows(rows);
    setServings(recipe.servings || 2);
    setIsSuccess(false);
  }, [recipe, pantry, isOpen]);

  if (!isOpen || !recipe) return null;

  // Calculate live estimates
  const liveRescuedGrams = ingredientRows
    .filter((r) => r.isUsed && r.wasRescued)
    .reduce((sum, r) => {
      const g = r.unit === 'kg' ? Number(r.quantityUsed) * 1000 : Number(r.quantityUsed);
      return sum + (isNaN(g) ? 0 : g);
    }, 0);

  const liveMoneySaved = ingredientRows
    .filter((r) => r.isUsed && r.wasRescued)
    .reduce((sum, r) => {
      const g = r.unit === 'kg' ? Number(r.quantityUsed) * 1000 : Number(r.quantityUsed);
      const pricePerGram = (r.pricePerUnit || 50) / 1000;
      return sum + (isNaN(g) ? 0 : g * pricePerGram);
    }, 0);

  const handleToggleUsed = (id) => {
    setIngredientRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isUsed: !r.isUsed } : r))
    );
  };

  const handleToggleRescued = (id) => {
    setIngredientRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, wasRescued: !r.wasRescued } : r))
    );
  };

  const handleQuantityChange = (id, newQty) => {
    setIngredientRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, quantityUsed: Math.max(0, Number(newQty)) } : r))
    );
  };

  const handleConfirmCooked = () => {
    const activeConfirmed = ingredientRows.filter((r) => r.isUsed);
    const result = recordCookedMeal({
      recipe,
      confirmedIngredients: activeConfirmed,
      servings
    });
    setSuccessData(result);
    setIsSuccess(true);
    if (onCookedSuccess) onCookedSuccess(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-cream-300 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-forest-800 to-forest-700 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-softYellow/20 text-softYellow border border-softYellow/30">
                Pantry Sync
              </span>
              <span className="text-xs text-sage-200">Step-by-Step Cooking Confirmation</span>
            </div>
            <h3 className="text-xl font-extrabold mt-1 text-white">
              {isSuccess ? 'Meal Cooked & Food Rescued!' : `Confirm Ingredients: ${recipe.title}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isSuccess ? (
            /* Success Celebration View */
            <div className="text-center py-6 space-y-5">
              <div className="w-20 h-20 rounded-full bg-sage-100 text-forest-700 mx-auto flex items-center justify-center border-4 border-sage-200 shadow-soft">
                <Sparkles className="w-10 h-10 text-forest-700 animate-bounce" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-forest-900">Delicious Work!</h4>
                <p className="text-textMuted text-sm max-w-md mx-auto mt-1">
                  Your kitchen inventory has been updated and your domestic food rescue statistics have been recorded.
                </p>
              </div>

              {/* Highlights Cards */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-cream-100 border border-cream-300 rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center space-x-1 text-forest-700 mb-1">
                    <Scale className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Food Rescued</span>
                  </div>
                  <div className="text-2xl font-black text-forest-800">
                    {successData?.totalGramsRescued || 0}g
                  </div>
                  <div className="text-[11px] text-textMuted mt-0.5">Kept out of landfills</div>
                </div>

                <div className="bg-cream-100 border border-cream-300 rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center space-x-1 text-coral-600 mb-1">
                    <IndianRupee className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Money Saved</span>
                  </div>
                  <div className="text-2xl font-black text-coral-600">
                    ₹{successData?.totalMoneySaved || 0}
                  </div>
                  <div className="text-[11px] text-textMuted mt-0.5">Estimated grocery value</div>
                </div>
              </div>

              <div className="pt-4 flex justify-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-forest-700 text-white font-bold hover:bg-forest-800 transition-colors shadow-soft"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            /* Confirmation Form */
            <>
              {/* Educational info notice */}
              <div className="p-3.5 bg-forest-50 border border-forest-200/80 rounded-2xl flex items-start space-x-3 text-xs text-forest-900">
                <AlertCircle className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Transparent Tracking:</span> Confirm the actual quantities you consumed. Only ingredients marked as <strong className="text-coral-600">"Rescued from spoilage"</strong> will count toward your Food Rescued metrics.
                </div>
              </div>

              {/* Ingredients Table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-textMuted uppercase tracking-wider px-2">
                  <span>Ingredient</span>
                  <span>Quantity Used & Rescue Status</span>
                </div>

                <div className="space-y-2.5">
                  {ingredientRows.map((row) => (
                    <div
                      key={row.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        row.isUsed
                          ? 'bg-cream-50 border-cream-300 shadow-sm'
                          : 'bg-gray-50/70 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Left: Checkbox & Name */}
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={row.isUsed}
                            onChange={() => handleToggleUsed(row.id)}
                            className="w-4 h-4 text-forest-700 rounded border-sage-300 focus:ring-forest-500 cursor-pointer"
                            id={`check-${row.id}`}
                          />
                          <label htmlFor={`check-${row.id}`} className="cursor-pointer">
                            <span className="font-bold text-textDark text-sm block">
                              {row.name}
                            </span>
                            <span className="text-[11px] text-textMuted">
                              {row.inPantry ? `In Pantry (${row.pantryStock} ${row.unit})` : 'Not in pantry inventory'}
                            </span>
                          </label>
                        </div>

                        {/* Right: Quantity Input & Rescue Toggle */}
                        {row.isUsed && (
                          <div className="flex items-center space-x-3 self-end sm:self-auto">
                            {/* Quantity Input */}
                            <div className="flex items-center space-x-1.5 bg-white border border-sage-200 rounded-xl px-2.5 py-1">
                              <input
                                type="number"
                                min="0"
                                value={row.quantityUsed}
                                onChange={(e) => handleQuantityChange(row.id, e.target.value)}
                                className="w-16 text-sm font-bold text-forest-800 text-right focus:outline-none"
                              />
                              <span className="text-xs text-textMuted font-medium">{row.unit}</span>
                            </div>

                            {/* Rescued Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleRescued(row.id)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                                row.wasRescued
                                  ? 'bg-coral-50 text-coral-700 border-coral-300 shadow-sm'
                                  : 'bg-white text-textMuted border-gray-200 hover:border-gray-300'
                              }`}
                              title="Check if this ingredient was expiring or rescued from waste"
                            >
                              {row.wasRescued ? '✓ Rescued' : '+ Flag Rescued'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Summary Bar */}
              <div className="p-4 bg-cream-200/60 rounded-2xl border border-cream-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-textDark">
                  <span className="font-semibold text-textMuted uppercase tracking-wider block text-[10px]">
                    Impact of this cooking session:
                  </span>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="font-bold text-forest-800">
                      🥗 {liveRescuedGrams}g food rescued
                    </span>
                    <span className="font-bold text-coral-600">
                      💰 ~₹{Math.round(liveMoneySaved)} saved
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-textMuted">
                  <span>Portions cooked:</span>
                  <select
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                    className="bg-white border border-sage-300 rounded-lg px-2 py-1 font-bold text-forest-800 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((s) => (
                      <option key={s} value={s}>{s} servings</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isSuccess && (
          <div className="px-6 py-4 bg-cream-100 border-t border-cream-200 flex justify-between items-center shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-textMuted hover:text-textDark transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmCooked}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-forest-700 text-white font-bold hover:bg-forest-800 transition-all shadow-soft hover:-translate-y-0.5"
            >
              <Check className="w-4 h-4 text-softYellow" />
              <span>Confirm & Deduct from Pantry</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
