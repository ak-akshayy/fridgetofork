import React, { useState, useEffect } from 'react';
import { X, Plus, Save, AlertTriangle, Sparkles } from 'lucide-react';
import { PANTRY_CATEGORIES } from '../data/initialPantry';

export default function PantryItemModal({
  isOpen,
  onClose,
  onSave,
  initialData = null
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    quantity: 250,
    unit: 'g',
    status: 'Available',
    useSoon: false,
    daysUntilExpiry: 5,
    pricePerUnit: 50,
    notes: '',
    image: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Vegetables',
        quantity: initialData.quantity || 250,
        unit: initialData.unit || 'g',
        status: initialData.status || 'Available',
        useSoon: !!initialData.useSoon,
        daysUntilExpiry: initialData.daysUntilExpiry || 5,
        pricePerUnit: initialData.pricePerUnit || 50,
        notes: initialData.notes || '',
        image: initialData.image || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Vegetables',
        quantity: 250,
        unit: 'g',
        status: 'Available',
        useSoon: false,
        daysUntilExpiry: 5,
        pricePerUnit: 50,
        notes: '',
        image: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      ...formData,
      quantity: Number(formData.quantity),
      daysUntilExpiry: Number(formData.daysUntilExpiry),
      pricePerUnit: Number(formData.pricePerUnit)
    });
    onClose();
  };

  const categories = PANTRY_CATEGORIES.filter((c) => c !== 'All');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-cream-300 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-forest-700 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              {initialData ? 'Edit Pantry Item' : 'Add Ingredient to Pantry'}
            </h3>
            <p className="text-xs text-sage-200">
              Keep your kitchen stock fresh and ready for recipe matching
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Ingredient Name */}
          <div>
            <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-1">
              Ingredient Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Fresh Baby Spinach, Paneer, Bell Peppers"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium text-sm text-textDark"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium text-sm bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-1">
                Availability
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium text-sm bg-white"
              >
                <option value="Available">Available</option>
                <option value="Low">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-1">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium text-sm bg-white"
              >
                <option value="g">grams (g)</option>
                <option value="kg">kilograms (kg)</option>
                <option value="ml">milliliters (ml)</option>
                <option value="L">liters (L)</option>
                <option value="pcs">pieces (pcs)</option>
                <option value="tbsp">tablespoons (tbsp)</option>
              </select>
            </div>
          </div>

          {/* Use Soon Toggle and Expiry Days */}
          <div className="p-3.5 bg-coral-50/70 border border-coral-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-coral-600" />
                <span className="text-xs font-bold text-coral-900">
                  Mark as "Use Soon" (Rescue Priority)
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.useSoon}
                onChange={(e) => setFormData({ ...formData, useSoon: e.target.checked })}
                className="w-5 h-5 text-coral-600 rounded border-coral-300 focus:ring-coral-500 cursor-pointer"
              />
            </div>

            {formData.useSoon && (
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-coral-800">Days until likely spoilage:</span>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.daysUntilExpiry}
                  onChange={(e) => setFormData({ ...formData, daysUntilExpiry: e.target.value })}
                  className="w-20 px-2 py-1 bg-white border border-coral-300 rounded-lg text-coral-900 font-bold text-center"
                />
              </div>
            )}
          </div>

          {/* Approx Price Per Kg (for accurate savings calculations) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-1">
                Est. Price / Unit (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-sage-300 text-sm"
              />
              <span className="text-[10px] text-textMuted">Used for calculating money saved</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-textDark uppercase tracking-wider mb-1">
                Storage Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. In crisper box, opened pack"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-sage-300 text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end space-x-3 border-t border-cream-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-textMuted hover:text-textDark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-forest-700 text-white font-bold hover:bg-forest-800 transition-colors shadow-soft"
            >
              <Save className="w-4 h-4 text-softYellow" />
              <span>{initialData ? 'Update Item' : 'Add to Pantry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
