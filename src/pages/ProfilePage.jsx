import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  RotateCcw, 
  ShieldCheck, 
  Save, 
  Check, 
  Bell, 
  Sliders, 
  Heart,
  Database
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { userSettings, setUserSettings, resetToDemoData } = useApp();

  const [formData, setFormData] = useState({ ...userSettings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Jain', 'Gluten-Free', 'Dairy-Free', 'Omnivore'];

  const handleSave = (e) => {
    e.preventDefault();
    setUserSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all pantry and cooking history back to initial demo defaults?')) {
      resetToDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-cream-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-3 py-1 rounded-full mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences & Settings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
            Kitchen Profile
          </h1>
          <p className="text-textMuted text-sm sm:text-base mt-1">
            Customize dietary rules, household members, and food waste alerts.
          </p>
        </div>
      </div>

      {/* 2. PROFILE SETTINGS FORM */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: User & Household */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-5">
          <h3 className="text-lg font-extrabold text-forest-900 pb-2 border-b border-cream-200 flex items-center space-x-2">
            <User className="w-5 h-5 text-forest-700" />
            <span>Household Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-1">
                Household Members
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.householdSize}
                onChange={(e) => setFormData({ ...formData, householdSize: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
              />
              <span className="text-[10px] text-textMuted">Used to calculate default cooking portions</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-1">
                Currency
              </label>
              <input
                type="text"
                disabled
                value="₹ (Indian Rupee - INR)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-textMuted"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Dietary Preferences */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-5">
          <h3 className="text-lg font-extrabold text-forest-900 pb-2 border-b border-cream-200 flex items-center space-x-2">
            <Heart className="w-5 h-5 text-forest-700" />
            <span>Dietary Discipline & Allergens</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-2">
              Primary Kitchen Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {dietaryOptions.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setFormData({ ...formData, dietary: opt })}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left ${
                    formData.dietary === opt
                      ? 'bg-forest-700 text-white border-forest-800 shadow-sm'
                      : 'bg-cream-50 text-textDark border-cream-200 hover:bg-cream-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Expiry Notifications */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-4">
          <h3 className="text-lg font-extrabold text-forest-900 pb-2 border-b border-cream-200 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-forest-700" />
            <span>Food Spoilage Early Warning</span>
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-cream-50 border border-cream-200">
            <div>
              <span className="font-bold text-sm text-forest-900 block">
                Enable Use-Soon Smart Alerts
              </span>
              <span className="text-xs text-textMuted">
                Automatically flags ingredients with 2 days or less remaining
              </span>
            </div>

            <input
              type="checkbox"
              checked={formData.notifications}
              onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
              className="w-5 h-5 text-forest-700 rounded border-sage-300 focus:ring-forest-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-forest-700 text-white font-black text-sm hover:bg-forest-800 shadow-soft transition-all"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-softYellow" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-softYellow" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* 3. DEMO & JUDGING DATA RESET */}
      <div className="bg-coral-50/70 border border-coral-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-coral-800 font-bold text-base">
          <Database className="w-5 h-5 text-coral-600" />
          <span>Evaluation & Demo Reset</span>
        </div>

        <p className="text-xs text-coral-900/80 leading-relaxed">
          Need to test the application from a clean state? This will restore the curated demo pantry with 15 initial items, simulated past food-rescue history, and clear any test scans.
        </p>

        <button
          type="button"
          onClick={handleResetData}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-coral-300 text-coral-700 font-bold text-xs hover:bg-coral-100 transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{resetSuccess ? 'Reset Complete!' : 'Reset Demo Kitchen Data'}</span>
        </button>
      </div>

    </div>
  );
}
