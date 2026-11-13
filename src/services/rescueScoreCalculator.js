import { SUBSTITUTIONS_DATA } from '../data/substitutions';

/**
 * Calculates deterministic, explainable Food Rescue Score (0 - 100)
 * for a recipe against current user pantry state.
 */
export function calculateRescueScore(recipe, pantry = []) {
  if (!recipe || !recipe.ingredients) {
    return {
      score: 0,
      breakdown: { availableScore: 0, useSoonScore: 0, subScore: 0, bonus: 0 },
      reasons: [],
      canCookNow: false,
      isRescueOpportunity: false,
      availableIngredients: [],
      missingIngredients: [],
      substitutionsAvailable: [],
      useSoonUsed: []
    };
  }

  const availableIngredients = [];
  const missingIngredients = [];
  const substitutionsAvailable = [];
  const useSoonUsed = [];

  recipe.ingredients.forEach((reqIng) => {
    // Try to match against pantry
    const reqNameLower = reqIng.name.toLowerCase();
    const reqKeyLower = (reqIng.key || '').toLowerCase();

    const matchedPantry = pantry.find((p) => {
      const pNameLower = p.name.toLowerCase();
      const pCategoryLower = (p.category || '').toLowerCase();
      return (
        p.status !== 'Out of Stock' &&
        (pNameLower.includes(reqNameLower) ||
          reqNameLower.includes(pNameLower) ||
          (reqKeyLower && pNameLower.includes(reqKeyLower)) ||
          (reqKeyLower && pCategoryLower.includes(reqKeyLower)))
      );
    });

    if (matchedPantry) {
      availableIngredients.push({
        recipeIngredient: reqIng,
        pantryItem: matchedPantry
      });

      if (matchedPantry.useSoon) {
        useSoonUsed.push({
          name: matchedPantry.name,
          quantity: reqIng.quantity,
          unit: reqIng.unit,
          daysUntilExpiry: matchedPantry.daysUntilExpiry
        });
      }
    } else {
      // Check if there's an approved substitution available in the user's pantry
      const subOption = SUBSTITUTIONS_DATA.find((sub) => {
        const origLower = sub.original.toLowerCase();
        return (
          origLower.includes(reqNameLower) ||
          reqNameLower.includes(origLower) ||
          (reqKeyLower && origLower.includes(reqKeyLower))
        );
      });

      let subAvailableInPantry = null;
      if (subOption) {
        subAvailableInPantry = pantry.find((p) =>
          subOption.pantryKeys.some((k) =>
            p.name.toLowerCase().includes(k.toLowerCase()) && p.status !== 'Out of Stock'
          )
        );
      }

      if (subOption && subAvailableInPantry) {
        substitutionsAvailable.push({
          original: reqIng.name,
          substitute: subOption.substitute,
          pantryItemName: subAvailableInPantry.name,
          culinaryRole: subOption.culinaryRole,
          flavorCompatibility: subOption.flavorCompatibility,
          whyItWorks: subOption.whyItWorks,
          ratio: subOption.ratio
        });
      } else {
        missingIngredients.push(reqIng);
      }
    }
  });

  const totalCount = recipe.ingredients.length;
  const availCount = availableIngredients.length;
  const subCount = substitutionsAvailable.length;
  const useSoonCount = useSoonUsed.length;

  // 1. Availability Score: up to 45 pts
  const availRatio = (availCount + subCount * 0.8) / totalCount;
  const availableScore = Math.round(availRatio * 45);

  // 2. Use-Soon Utilization: up to 35 pts (15 pts per item, max 35)
  const useSoonScore = Math.min(35, useSoonCount * 17);

  // 3. Substitution Compatibility: up to 12 pts (6 pts per matched substitution)
  const subScore = Math.min(12, subCount * 6);

  // 4. Low Friction / No Purchase Bonus: up to 8 pts if missingCount === 0
  const bonus = missingIngredients.length === 0 ? 8 : (missingIngredients.length === 1 ? 3 : 0);

  const rawScore = availableScore + useSoonScore + subScore + bonus;
  const finalScore = Math.min(100, Math.max(10, rawScore));

  // Determine categories
  const canCookNow = missingIngredients.length === 0;
  const isRescueOpportunity = useSoonCount > 0 && finalScore >= 65;

  // Build human-friendly explainability reasons
  const reasons = [];

  if (useSoonCount > 0) {
    const itemNames = useSoonUsed.map((u) => u.name).join(', ');
    reasons.push(`Rescues ${useSoonCount} expiring ingredient${useSoonCount > 1 ? 's' : ''} (${itemNames}) before spoilage (+${useSoonScore} pts)`);
  }

  const availabilityPct = Math.round((availCount / totalCount) * 100);
  reasons.push(`${availabilityPct}% of recipe ingredients directly in stock in your pantry (+${availableScore} pts)`);

  if (subCount > 0) {
    substitutionsAvailable.forEach((s) => {
      reasons.push(`Smart flavor-compatible alternative: ${s.substitute} for ${s.original} with ${s.flavorCompatibility}% profile match (+${Math.round(subScore / subCount)} pts)`);
    });
  }

  if (missingIngredients.length === 0) {
    reasons.push('100% complete pantry match — no grocery run required! (+8 pts)');
  } else if (missingIngredients.length === 1) {
    reasons.push(`Only 1 secondary item missing (${missingIngredients[0].name})`);
  } else {
    reasons.push(`Requires ${missingIngredients.length} ingredients to be purchased or prepped`);
  }

  return {
    score: finalScore,
    breakdown: {
      availableScore,
      useSoonScore,
      subScore,
      bonus
    },
    reasons,
    canCookNow,
    isRescueOpportunity,
    availableIngredients,
    missingIngredients,
    substitutionsAvailable,
    useSoonUsed
  };
}
