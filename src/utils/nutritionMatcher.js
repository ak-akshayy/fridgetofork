/**
 * Nutrition-aware recipe scoring and filtering utility.
 *
 * This module applies the user's nutrition profile as a SECONDARY layer
 * on top of the existing Food Rescue Score. It never overrides food
 * availability, allergen safety, or rescue priority.
 */

// ── Common allergen keywords that map to allergy selections ──
const ALLERGEN_INGREDIENT_MAP = {
  Gluten: ['wheat', 'flour', 'bread', 'pasta', 'maida', 'atta', 'roti', 'naan', 'pav', 'semolina', 'barley', 'rye'],
  Dairy: ['milk', 'paneer', 'cheese', 'butter', 'ghee', 'cream', 'yogurt', 'dahi', 'curd', 'whey', 'cottage cheese'],
  Nuts: ['almond', 'cashew', 'walnut', 'pistachio', 'peanut', 'hazelnut', 'pecan', 'macadamia', 'kaju'],
  Soy: ['soy', 'soya', 'tofu', 'edamame', 'tempeh', 'soybean'],
  Shellfish: ['shrimp', 'prawn', 'crab', 'lobster', 'crayfish', 'clam', 'mussel', 'oyster'],
  Eggs: ['egg', 'eggs', 'meringue', 'mayonnaise']
};

/**
 * Parse a nutrition value string like "18g" into a number.
 */
function parseNutritionValue(val) {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseFloat(val) || 0;
  return 0;
}

/**
 * Check if a recipe contains any ingredients that match the user's allergen list.
 *
 * @param {Object} recipe - Recipe object with `ingredients` array
 * @param {string[]} allergies - User's selected allergies (e.g. ['Gluten', 'Dairy'])
 * @returns {boolean} true if the recipe contains at least one allergen
 */
export function recipeContainsAllergen(recipe, allergies) {
  if (!allergies || allergies.length === 0) return false;

  const ingredientNames = recipe.ingredients.map((i) => i.name.toLowerCase());

  return allergies.some((allergy) => {
    const keywords = ALLERGEN_INGREDIENT_MAP[allergy] || [];
    return keywords.some((keyword) =>
      ingredientNames.some((name) => name.includes(keyword))
    );
  });
}

/**
 * Check whether a recipe matches the user's dietary preference.
 *
 * @param {Object} recipe - Recipe with `dietary` array
 * @param {string} dietaryPref - 'Vegetarian' | 'Non-Vegetarian' | 'Vegan'
 * @returns {boolean}
 */
export function matchesDietaryPreference(recipe, dietaryPref) {
  if (!dietaryPref || dietaryPref === 'Non-Vegetarian') return true; // Non-veg eats everything
  if (!recipe.dietary) return false;
  if (dietaryPref === 'Vegan') return recipe.dietary.includes('Vegan');
  if (dietaryPref === 'Vegetarian') {
    return recipe.dietary.includes('Vegetarian') || recipe.dietary.includes('Vegan');
  }
  return true;
}

/**
 * Compute a nutrition goal relevance boost for a recipe.
 * Returns a value between 0 and 20 that can be added as a secondary
 * ranking signal to the rescue score.
 *
 * @param {Object} recipe - Recipe with `nutrition` and `tags`
 * @param {string} goal - 'Muscle Building' | 'Healthy Weight Gain' | 'Balanced Nutrition' | 'General Wellness'
 * @returns {{ boost: number, reason: string }}
 */
export function computeGoalBoost(recipe, goal) {
  if (!goal || !recipe.nutrition) return { boost: 0, reason: '' };

  const protein = parseNutritionValue(recipe.nutrition.protein);
  const calories = parseNutritionValue(recipe.nutrition.calories);
  const fiber = parseNutritionValue(recipe.nutrition.fiber);
  const fat = parseNutritionValue(recipe.nutrition.fat);
  const carbs = parseNutritionValue(recipe.nutrition.carbs);
  const tags = recipe.tags || [];

  switch (goal) {
    case 'Muscle Building': {
      let boost = 0;
      let reason = '';
      if (protein >= 15) { boost += 12; reason = 'High protein content'; }
      else if (protein >= 10) { boost += 6; reason = 'Good protein content'; }
      if (tags.includes('High Protein')) { boost += 8; reason = 'High protein recipe'; }
      return { boost: Math.min(boost, 20), reason };
    }

    case 'Healthy Weight Gain': {
      let boost = 0;
      let reason = '';
      if (calories >= 300) { boost += 10; reason = 'Energy-rich meal'; }
      else if (calories >= 250) { boost += 5; reason = 'Good caloric content'; }
      // Balanced macros bonus
      if (protein >= 10 && carbs >= 20 && fat >= 5) { boost += 6; reason = 'Balanced, energy-rich meal'; }
      return { boost: Math.min(boost, 20), reason };
    }

    case 'Balanced Nutrition': {
      let boost = 0;
      let reason = '';
      // Favor meals with good macro distribution
      if (protein >= 8 && carbs >= 10 && fat >= 5 && fiber >= 4) {
        boost += 14;
        reason = 'Well-balanced macro profile';
      } else if (protein >= 6 && fiber >= 3) {
        boost += 8;
        reason = 'Good nutritional balance';
      }
      return { boost: Math.min(boost, 20), reason };
    }

    case 'General Wellness': {
      let boost = 0;
      let reason = '';
      if (fiber >= 5) { boost += 8; reason = 'Rich in dietary fiber'; }
      if (calories <= 300 && protein >= 6) { boost += 6; reason = 'Light, nutritious meal'; }
      if (tags.includes('Immunity Booster') || tags.includes('Low Calorie')) {
        boost += 6;
        reason = 'Wellness-focused recipe';
      }
      return { boost: Math.min(boost, 20), reason };
    }

    default:
      return { boost: 0, reason: '' };
  }
}

/**
 * Check if a recipe matches the user's preferred cuisines.
 */
export function matchesCuisinePreference(recipe, preferredCuisines) {
  if (!preferredCuisines || preferredCuisines.length === 0) return true;
  return preferredCuisines.some((c) =>
    recipe.cuisine?.toLowerCase().includes(c.toLowerCase())
  );
}

/**
 * Check if a recipe fits within the user's max cooking time.
 */
export function matchesCookingTime(recipe, maxCookingTime) {
  if (!maxCookingTime) return true;
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  return totalTime <= maxCookingTime;
}

/**
 * Main entry point: apply nutrition preferences as a secondary layer on
 * top of already rescue-score-sorted recipes.
 *
 * This function:
 * 1. Filters out allergen-containing recipes
 * 2. Filters by dietary preference
 * 3. Optionally filters by cuisine and cooking time
 * 4. Computes a goal-based boost score
 * 5. Returns re-sorted recipes (rescue score remains primary)
 *
 * @param {Object[]} scoredRecipes - Recipes already sorted by rescue score, each with `.rescueInfo`
 * @param {Object} nutritionProfile - The user's nutrition profile
 * @returns {Object[]} Filtered and re-sorted recipes with added `.nutritionBoost` data
 */
export function applyNutritionPreferences(scoredRecipes, nutritionProfile) {
  if (!nutritionProfile || !nutritionProfile.onboardingCompleted) {
    // No profile or not completed — return recipes unchanged
    return scoredRecipes.map((r) => ({ ...r, nutritionBoost: null }));
  }

  const { goal, dietary, allergies, preferredCuisine, maxCookingTime } = nutritionProfile;

  return scoredRecipes
    .filter((recipe) => {
      // 1. Allergen safety check — always enforced
      if (recipeContainsAllergen(recipe, allergies)) return false;

      // 2. Dietary preference
      if (!matchesDietaryPreference(recipe, dietary)) return false;

      return true;
    })
    .map((recipe) => {
      // 3. Compute goal boost
      const goalResult = computeGoalBoost(recipe, goal);

      // 4. Cuisine match indicator (non-blocking — doesn't filter out)
      const cuisineMatch = matchesCuisinePreference(recipe, preferredCuisine);

      // 5. Cooking time match
      const timeMatch = matchesCookingTime(recipe, maxCookingTime);

      // Combined secondary score (goal boost + small bonuses)
      let secondaryScore = goalResult.boost;
      if (cuisineMatch) secondaryScore += 3;
      if (timeMatch) secondaryScore += 2;

      return {
        ...recipe,
        nutritionBoost: {
          boost: secondaryScore,
          goalMatch: goalResult.reason,
          cuisineMatch,
          timeMatch,
          goal
        }
      };
    })
    .sort((a, b) => {
      // Primary: rescue score (already present in rescueInfo.score)
      const rescueDiff = b.rescueInfo.score - a.rescueInfo.score;
      if (Math.abs(rescueDiff) > 5) return rescueDiff;
      // Secondary: nutrition boost (only breaks ties or near-ties)
      return (b.nutritionBoost?.boost || 0) - (a.nutritionBoost?.boost || 0);
    });
}

/**
 * Check whether a specific recipe matches the user's nutrition goal.
 * Useful for showing a "Matches your goal" badge on individual recipe pages.
 */
export function getGoalMatchInfo(recipe, nutritionProfile) {
  if (!nutritionProfile || !nutritionProfile.onboardingCompleted || !nutritionProfile.goal) {
    return null;
  }

  const goalResult = computeGoalBoost(recipe, nutritionProfile.goal);
  if (goalResult.boost >= 8) {
    return {
      matches: true,
      goal: nutritionProfile.goal,
      reason: goalResult.reason
    };
  }

  return null;
}
