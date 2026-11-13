import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  AlertCircle, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  Flame,
  ArrowUpDown,
  UtensilsCrossed
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PANTRY_CATEGORIES } from '../data/initialPantry';
import PantryItemModal from '../components/PantryItemModal';

export default function PantryPage() {
  const { 
    pantry, 
    addPantryItem, 
    updatePantryItem, 
    deletePantryItem, 
    toggleUseSoon, 
    toggleStockStatus 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Available', 'Low', 'Out of Stock', 'UseSoon'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Filter and search pantry items
  const filteredItems = useMemo(() => {
    return pantry.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      let matchesStatus = true;
      if (statusFilter === 'Available') matchesStatus = item.status === 'Available';
      else if (statusFilter === 'Low') matchesStatus = item.status === 'Low';
      else if (statusFilter === 'Out of Stock') matchesStatus = item.status === 'Out of Stock';
      else if (statusFilter === 'UseSoon') matchesStatus = item.useSoon && item.status !== 'Out of Stock';

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [pantry, searchQuery, selectedCategory, statusFilter]);

  const useSoonCount = pantry.filter((p) => p.useSoon && p.status !== 'Out of Stock').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-cream-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-3 py-1 rounded-full mb-2">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Digital Inventory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
            Your Kitchen, Organized.
          </h1>
          <p className="text-textMuted text-sm sm:text-base mt-1">
            Keep track of everything you have, from fresh vegetables to everyday essentials.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => {
            setEditingItem(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 shadow-soft transition-all hover:-translate-y-0.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-softYellow" />
          <span>Add Ingredient</span>
        </button>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="bg-white rounded-3xl p-5 border border-cream-300 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ingredients in your pantry (e.g. spinach, paneer)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
            />
          </div>

          {/* Status Quick Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                statusFilter === 'All'
                  ? 'bg-forest-700 text-white'
                  : 'bg-cream-100 text-textDark hover:bg-cream-200'
              }`}
            >
              All ({pantry.length})
            </button>

            <button
              onClick={() => setStatusFilter('UseSoon')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
                statusFilter === 'UseSoon'
                  ? 'bg-coral-500 text-white'
                  : 'bg-coral-50 text-coral-700 border border-coral-200 hover:bg-coral-100'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Use Soon ({useSoonCount})</span>
            </button>

            <button
              onClick={() => setStatusFilter('Available')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                statusFilter === 'Available'
                  ? 'bg-forest-700 text-white'
                  : 'bg-cream-100 text-textDark hover:bg-cream-200'
              }`}
            >
              In Stock
            </button>

            <button
              onClick={() => setStatusFilter('Low')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                statusFilter === 'Low'
                  ? 'bg-forest-700 text-white'
                  : 'bg-cream-100 text-textDark hover:bg-cream-200'
              }`}
            >
              Low Stock
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-2 border-t border-cream-200 pb-1">
          {PANTRY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-sage-200 text-forest-900 font-bold'
                  : 'text-textMuted hover:text-textDark hover:bg-cream-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. PANTRY CARDS GRID */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const isOutOfStock = item.status === 'Out of Stock';
            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-soft hover:shadow-card-hover group ${
                  item.useSoon
                    ? 'border-coral-300 ring-1 ring-coral-300/40'
                    : 'border-cream-300'
                } ${isOutOfStock ? 'opacity-60 bg-gray-50' : ''}`}
              >
                <div>
                  {/* Card Image Header */}
                  <div className="relative h-40 overflow-hidden bg-cream-100">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category Tag */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-forest-800 shadow-sm">
                      {item.category}
                    </span>

                    {/* Stock Status Badge */}
                    <button
                      type="button"
                      onClick={() => toggleStockStatus(item.id)}
                      className={`absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-sm transition-transform active:scale-95 ${
                        item.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : item.status === 'Low'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-gray-200 text-gray-700 border border-gray-300'
                      }`}
                      title="Click to toggle stock status"
                    >
                      {item.status}
                    </button>

                    {/* Use Soon Urgent Badge */}
                    {item.useSoon && (
                      <div className="absolute bottom-3 left-3 bg-coral-500 text-white px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center space-x-1 shadow-sm">
                        <Flame className="w-3 h-3" />
                        <span>Use within {item.daysUntilExpiry} days</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-extrabold text-base text-forest-900 group-hover:text-forest-700 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm font-bold text-forest-700 mt-0.5">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-textMuted line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3.5 bg-cream-50 border-t border-cream-200 flex items-center justify-between">
                  {/* Use Soon Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleUseSoon(item.id)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl border transition-colors ${
                      item.useSoon
                        ? 'bg-coral-50 text-coral-700 border-coral-200'
                        : 'bg-white text-textMuted border-cream-300 hover:text-textDark'
                    }`}
                  >
                    {item.useSoon ? '🔥 Rescuing' : '+ Mark Use Soon'}
                  </button>

                  {/* Edit and Delete */}
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item);
                        setIsAddModalOpen(true);
                      }}
                      className="p-1.5 text-textMuted hover:text-forest-700 transition-colors"
                      title="Edit item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => deletePantryItem(item.id)}
                      className="p-1.5 text-textMuted hover:text-coral-600 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 border border-cream-300 shadow-soft">
          <div className="w-16 h-16 rounded-full bg-cream-100 text-forest-700 mx-auto flex items-center justify-center">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-forest-900">No Ingredients Found</h3>
            <p className="text-xs text-textMuted mt-1">
              No pantry items matched your active search or filters. Try adjusting your query or add a new ingredient.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setStatusFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-forest-700 text-white font-bold text-xs"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Floating Add Ingredient Button for quick mobile access */}
      <div className="fixed bottom-6 right-6 z-30 sm:hidden">
        <button
          onClick={() => {
            setEditingItem(null);
            setIsAddModalOpen(true);
          }}
          className="w-14 h-14 rounded-full bg-forest-700 text-white shadow-soft-lg flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Add Ingredient"
        >
          <Plus className="w-6 h-6 text-softYellow" />
        </button>
      </div>

      {/* Add / Edit Modal */}
      <PantryItemModal
        isOpen={isAddModalOpen}
        initialData={editingItem}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onSave={(data) => {
          if (editingItem) {
            updatePantryItem(editingItem.id, data);
          } else {
            addPantryItem(data);
          }
        }}
      />

    </div>
  );
}
