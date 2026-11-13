import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Dumbbell,
  TrendingUp,
  Scale,
  Heart,
  Leaf,
  Drumstick,
  Bean,
  AlertTriangle,
  Clock,
  ChefHat,
  Sparkles,
  Check,
  SkipForward
} from 'lucide-react';

const NUTRITION_GOALS = [
  {
    id: 'Muscle Building',
    title: 'Muscle Building',
    description: 'Prioritize protein-rich recipes for strength and recovery.',
    icon: Dumbbell,
    color: 'bg-forest-700'
  },
  {
    id: 'Healthy Weight Gain',
    title: 'Healthy Weight Gain',
    description: 'Balanced, energy-rich meals for healthy caloric intake.',
    icon: TrendingUp,
    color: 'bg-coral-500'
  },
  {
    id: 'Balanced Nutrition',
    title: 'Balanced Nutrition',
    description: 'Varied nutritious meals with well-rounded macros.',
    icon: Scale,
    color: 'bg-sage-600'
  },
  {
    id: 'General Wellness',
    title: 'General Wellness',
    description: 'Balanced everyday meals for overall well-being.',
    icon: Heart,
    color: 'bg-softYellow'
  }
];

const DIETARY_OPTIONS = [
  { id: 'Vegetarian', label: 'Vegetarian', icon: Leaf, desc: 'No meat or fish' },
  { id: 'Non-Vegetarian', label: 'Non-Vegetarian', icon: Drumstick, desc: 'All food types' },
  { id: 'Vegan', label: 'Vegan', icon: Bean, desc: 'No animal products' }
];

const ALLERGY_OPTIONS = [
  'Gluten', 'Dairy', 'Nuts', 'Soy', 'Shellfish', 'Eggs'
];

const CUISINE_OPTIONS = [
  'North Indian', 'South Indian', 'Mediterranean', 'Continental', 'Western Indian',
  'Homestyle Indian', 'Fusion', 'Asian'
];

const COOKING_TIME_OPTIONS = [
  { value: 20, label: 'Quick (≤20 min)' },
  { value: 30, label: 'Moderate (≤30 min)' },
  { value: 45, label: 'Relaxed (≤45 min)' },
  { value: 0, label: 'No limit' }
];

export default function NutritionOnboardingModal({ isOpen, onClose, onSave, existingProfile }) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form state initialized from existing profile or defaults
  const [goal, setGoal] = useState(existingProfile?.goal || '');
  const [dietary, setDietary] = useState(existingProfile?.dietary || 'Vegetarian');
  const [allergies, setAllergies] = useState(existingProfile?.allergies || []);
  const [preferredCuisine, setPreferredCuisine] = useState(existingProfile?.preferredCuisine || []);
  const [maxCookingTime, setMaxCookingTime] = useState(existingProfile?.maxCookingTime || 0);
  const [height, setHeight] = useState(existingProfile?.height || '');
  const [weight, setWeight] = useState(existingProfile?.weight || '');

  if (!isOpen) return null;

  const toggleAllergy = (a) => {
    setAllergies((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const toggleCuisine = (c) => {
    setPreferredCuisine((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const handleComplete = () => {
    onSave({
      goal: goal || 'General Wellness',
      dietary,
      allergies,
      preferredCuisine,
      maxCookingTime: maxCookingTime || null,
      height: height ? Number(height) : null,
      weight: weight ? Number(weight) : null,
      onboardingCompleted: true
    });
    onClose();
  };

  const handleSkip = () => {
    onSave({
      goal: '',
      dietary: dietary || 'Vegetarian',
      allergies: [],
      preferredCuisine: [],
      maxCookingTime: null,
      height: null,
      weight: null,
      onboardingCompleted: false
    });
    onClose();
  };

  const canProceed = () => {
    if (step === 1) return !!goal;
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-cream-300 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-cream-200 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-700 text-softYellow flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-forest-900 text-lg">Personalize Your Recipes</h2>
                <p className="text-[11px] text-textMuted">Step {step} of {totalSteps}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-cream-100 hover:bg-cream-200 text-textMuted flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1.5 bg-cream-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-forest-700 rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">

          {/* STEP 1: Nutrition Goal */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-forest-900 text-base">What's your nutrition goal?</h3>
                <p className="text-xs text-textMuted mt-1">
                  We'll prioritize recipes that align with your objective.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {NUTRITION_GOALS.map((g) => {
                  const Icon = g.icon;
                  const isSelected = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all space-y-2 ${
                        isSelected
                          ? 'border-forest-700 bg-forest-50 shadow-sm'
                          : 'border-cream-200 bg-white hover:border-sage-300 hover:bg-cream-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-8 h-8 rounded-xl ${isSelected ? 'bg-forest-700' : 'bg-cream-100'} flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-textMuted'}`} />
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-forest-700 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${isSelected ? 'text-forest-900' : 'text-textDark'}`}>
                          {g.title}
                        </div>
                        <div className="text-[11px] text-textMuted leading-relaxed mt-0.5">{g.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Dietary Preference */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-forest-900 text-base">Dietary preference</h3>
                <p className="text-xs text-textMuted mt-1">
                  This helps filter recipes to your eating style.
                </p>
              </div>

              <div className="space-y-2.5">
                {DIETARY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = dietary === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDietary(opt.id)}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-forest-700 bg-forest-50 shadow-sm'
                          : 'border-cream-200 bg-white hover:border-sage-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-xl ${isSelected ? 'bg-forest-700' : 'bg-cream-100'} flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-textMuted'}`} />
                        </div>
                        <div>
                          <div className={`text-sm font-bold ${isSelected ? 'text-forest-900' : 'text-textDark'}`}>{opt.label}</div>
                          <div className="text-[11px] text-textMuted">{opt.desc}</div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-forest-700 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Allergies & Restrictions */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-forest-900 text-base">Allergies & restrictions</h3>
                <p className="text-xs text-textMuted mt-1">
                  Select any food allergies. Recipes with these ingredients will be filtered out.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {ALLERGY_OPTIONS.map((a) => {
                  const isSelected = allergies.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAllergy(a)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-coral-500 text-white border-coral-600 shadow-sm'
                          : 'bg-white text-textDark border-cream-200 hover:border-coral-300 hover:bg-coral-50'
                      }`}
                    >
                      {isSelected && <AlertTriangle className="w-3 h-3" />}
                      <span>{a}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-textMuted">
                No allergies? Just proceed to the next step.
              </p>
            </div>
          )}

          {/* STEP 4: Cuisine, Cooking Time & Optional Body Stats */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-forest-900 text-base">Cuisine & cooking time</h3>
                <p className="text-xs text-textMuted mt-1">
                  Select your preferred cuisines and available cooking time.
                </p>
              </div>

              {/* Cuisine chips */}
              <div>
                <label className="text-xs font-bold text-textDark uppercase tracking-wider block mb-2">
                  Preferred Cuisines
                </label>
                <div className="flex flex-wrap gap-2">
                  {CUISINE_OPTIONS.map((c) => {
                    const isSelected = preferredCuisine.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCuisine(c)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-forest-700 text-white border-forest-800'
                            : 'bg-white text-textDark border-cream-200 hover:bg-cream-50'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-textMuted mt-1">Leave empty for all cuisines</p>
              </div>

              {/* Cooking time */}
              <div>
                <label className="text-xs font-bold text-textDark uppercase tracking-wider block mb-2">
                  Available Cooking Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COOKING_TIME_OPTIONS.map((opt) => {
                    const isSelected = maxCookingTime === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setMaxCookingTime(opt.value)}
                        className={`p-3 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 ${
                          isSelected
                            ? 'bg-forest-700 text-white border-forest-800'
                            : 'bg-white text-textDark border-cream-200 hover:bg-cream-50'
                        }`}
                      >
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-softYellow' : 'text-textMuted'}`} />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional: Height & Weight */}
              <div className="pt-3 border-t border-cream-200">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs font-bold text-textDark uppercase tracking-wider">
                    Optional Profile Details
                  </span>
                  <span className="text-[10px] bg-cream-200 text-textMuted px-2 py-0.5 rounded-full font-semibold">
                    Optional
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-textMuted font-medium block mb-1">Height (cm)</label>
                    <input
                      type="number"
                      min="100"
                      max="250"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 170"
                      className="w-full px-3 py-2 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-textMuted font-medium block mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      min="20"
                      max="250"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 65"
                      className="w-full px-3 py-2 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-textMuted mt-1.5 leading-relaxed">
                  Stored locally for your reference only. Fridge2Fork does not calculate BMI, impose calorie restrictions, or make body-transformation claims.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white rounded-b-3xl px-6 py-4 border-t border-cream-200 flex items-center justify-between">
          {/* Left: Skip / Back */}
          <div className="flex items-center space-x-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold text-textMuted hover:bg-cream-100 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold text-textMuted hover:bg-cream-100 transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Skip for Now</span>
              </button>
            )}
          </div>

          {/* Right: Next / Finish */}
          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={`inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                canProceed()
                  ? 'bg-forest-700 text-white hover:bg-forest-800 shadow-soft'
                  : 'bg-cream-200 text-textMuted cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 shadow-soft transition-all"
            >
              <Sparkles className="w-4 h-4 text-softYellow" />
              <span>Personalize My Recipes</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
