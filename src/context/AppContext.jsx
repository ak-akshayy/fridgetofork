import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PANTRY } from '../data/initialPantry';
import confetti from 'canvas-confetti';

const AppContext = createContext();

const INITIAL_COOKED_HISTORY = [
  {
    id: 'cook-hist-1',
    recipeId: 'rec-1',
    recipeTitle: 'Silky Restaurant-Style Palak Paneer',
    date: '2026-11-08',
    timestamp: Date.now() - 86400000 * 1.5,
    servings: 3,
    ingredientsRescued: [
      { name: 'Fresh Spinach (Palak)', quantity: 250, unit: 'g', pricePerUnit: 60, wasRescued: true },
      { name: 'Ripe Tomatoes', quantity: 150, unit: 'g', pricePerUnit: 40, wasRescued: true }
    ],
    totalGramsRescued: 400,
    totalMoneySaved: 21, // (250*0.06) + (150*0.04) = 15 + 6 = ₹21
    notes: 'Rescued spinach that had begun wilting at leaf edges.'
  },
  {
    id: 'cook-hist-2',
    recipeId: 'rec-2',
    recipeTitle: 'Smoky Kadhai Paneer & Crispy Capsicum',
    date: '2026-11-06',
    timestamp: Date.now() - 86400000 * 3.5,
    servings: 2,
    ingredientsRescued: [
      { name: 'Green Capsicum', quantity: 150, unit: 'g', pricePerUnit: 80, wasRescued: true },
      { name: 'Paneer (Cottage Cheese)', quantity: 150, unit: 'g', pricePerUnit: 380, wasRescued: true }
    ],
    totalGramsRescued: 300,
    totalMoneySaved: 69, // (150*0.08) + (150*0.38) = 12 + 57 = ₹69
    notes: 'Cooked paneer packet on the day of its expiry date.'
  }
];

export function AppProvider({ children }) {
  // 1. Pantry State
  const [pantry, setPantry] = useState(() => {
    try {
      const saved = localStorage.getItem('f2f_pantry');
      return saved ? JSON.parse(saved) : INITIAL_PANTRY;
    } catch {
      return INITIAL_PANTRY;
    }
  });

  // 2. Cooked History & Rescue Impact
  const [cookedHistory, setCookedHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('f2f_history');
      return saved ? JSON.parse(saved) : INITIAL_COOKED_HISTORY;
    } catch {
      return INITIAL_COOKED_HISTORY;
    }
  });

  // 3. User Settings
  const [userSettings, setUserSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('f2f_settings');
      return saved
        ? JSON.parse(saved)
        : {
            name: 'Ananya Sharma',
            email: 'ananya@fridge2fork.app',
            dietary: 'Vegetarian',
            householdSize: 3,
            currency: '₹',
            notifications: true,
            theme: 'nature'
          };
    } catch {
      return {
        name: 'Ananya Sharma',
        email: 'ananya@fridge2fork.app',
        dietary: 'Vegetarian',
        householdSize: 3,
        currency: '₹',
        notifications: true,
        theme: 'nature'
      };
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('f2f_pantry', JSON.stringify(pantry));
    } catch (e) {
      console.warn('LocalStorage save failed for pantry', e);
    }
  }, [pantry]);

  useEffect(() => {
    try {
      localStorage.setItem('f2f_history', JSON.stringify(cookedHistory));
    } catch (e) {
      console.warn('LocalStorage save failed for history', e);
    }
  }, [cookedHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('f2f_settings', JSON.stringify(userSettings));
    } catch (e) {
      console.warn('LocalStorage save failed for settings', e);
    }
  }, [userSettings]);

  // Derived Impact Totals
  const totalGramsRescued = cookedHistory.reduce((acc, curr) => acc + (curr.totalGramsRescued || 0), 0);
  const totalMoneySaved = cookedHistory.reduce((acc, curr) => acc + (curr.totalMoneySaved || 0), 0);
  const totalMealsCooked = cookedHistory.length;
  const ingredientsRescuedCount = cookedHistory.reduce(
    (acc, curr) => acc + (curr.ingredientsRescued ? curr.ingredientsRescued.length : 0),
    0
  );

  // Pantry Management Actions
  const addPantryItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: `p-${Date.now()}`,
      addedAt: new Date().toISOString()
    };
    setPantry((prev) => [itemWithId, ...prev]);
  };

  const updatePantryItem = (id, updates) => {
    setPantry((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deletePantryItem = (id) => {
    setPantry((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleUseSoon = (id) => {
    setPantry((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              useSoon: !item.useSoon,
              daysUntilExpiry: !item.useSoon ? 2 : 7
            }
          : item
      )
    );
  };

  const toggleStockStatus = (id) => {
    setPantry((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus =
          item.status === 'Available'
            ? 'Low'
            : item.status === 'Low'
            ? 'Out of Stock'
            : 'Available';
        return { ...item, status: nextStatus };
      })
    );
  };

  // Add / Merge Detected Items from AI Scanner
  const batchAddOrUpdateDetectedItems = (detectedItems) => {
    setPantry((prev) => {
      const updated = [...prev];
      detectedItems.forEach((det) => {
        const existingIndex = updated.findIndex(
          (p) => p.name.toLowerCase() === det.name.toLowerCase()
        );
        if (existingIndex >= 0) {
          // Update quantity & useSoon flag
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: Number(updated[existingIndex].quantity) + Number(det.quantity),
            useSoon: det.useSoon || updated[existingIndex].useSoon,
            status: 'Available'
          };
        } else {
          // Add new pantry item
          updated.push({
            id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: det.name,
            category: det.category || 'Vegetables',
            quantity: Number(det.quantity) || 200,
            unit: det.unit || 'g',
            status: 'Available',
            useSoon: !!det.useSoon,
            daysUntilExpiry: det.daysUntilExpiry || (det.useSoon ? 2 : 7),
            pricePerUnit: det.pricePerUnit || 60,
            image: det.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80',
            notes: det.condition || 'Detected via AI Fridge Scanner'
          });
        }
      });
      return updated;
    });
  };

  // Record Cooked Meal, Deduct Ingredients, Calculate Rescued Metrics
  const recordCookedMeal = ({ recipe, confirmedIngredients, servings }) => {
    let gramsRescuedForThisMeal = 0;
    let moneySavedForThisMeal = 0;
    const rescuedList = [];

    // Deduct quantities from pantry
    setPantry((prevPantry) => {
      const updatedPantry = [...prevPantry];

      confirmedIngredients.forEach((conf) => {
        const matchIndex = updatedPantry.findIndex(
          (p) => p.name.toLowerCase().includes(conf.name.toLowerCase()) || conf.name.toLowerCase().includes(p.name.toLowerCase())
        );

        if (matchIndex >= 0) {
          const item = updatedPantry[matchIndex];
          const newQty = Math.max(0, item.quantity - Number(conf.quantityUsed));
          const newStatus = newQty === 0 ? 'Out of Stock' : newQty < (item.quantity * 0.25) ? 'Low' : 'Available';

          updatedPantry[matchIndex] = {
            ...item,
            quantity: newQty,
            status: newStatus,
            useSoon: newQty === 0 ? false : item.useSoon
          };

          // If ingredient was flagged as rescued (or marked useSoon)
          if (conf.wasRescued || item.useSoon) {
            const grams = conf.unit === 'kg' ? Number(conf.quantityUsed) * 1000 : Number(conf.quantityUsed);
            gramsRescuedForThisMeal += grams;

            // Value calculation: pricePerUnit is ₹/kg (so /1000 for grams)
            const pricePerGram = (item.pricePerUnit || 50) / 1000;
            const savings = Math.round(grams * pricePerGram);
            moneySavedForThisMeal += savings;

            rescuedList.push({
              name: item.name,
              quantity: conf.quantityUsed,
              unit: conf.unit,
              pricePerUnit: item.pricePerUnit,
              wasRescued: true,
              estimatedSavings: savings
            });
          }
        }
      });

      return updatedPantry;
    });

    // Create history entry
    const newEntry = {
      id: `cook-${Date.now()}`,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      servings: servings || recipe.servings,
      ingredientsRescued: rescuedList,
      totalGramsRescued: gramsRescuedForThisMeal,
      totalMoneySaved: moneySavedForThisMeal,
      notes: `Successfully prepared ${recipe.title}. Reduced household food spoilage!`
    };

    setCookedHistory((prev) => [newEntry, ...prev]);

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#244B3A', '#A8B99A', '#E88D70', '#F2D58A']
      });
    } catch {
      // Ignore if confetti not supported
    }

    return newEntry;
  };

  // Reset to initial demo data
  const resetToDemoData = () => {
    setPantry(INITIAL_PANTRY);
    setCookedHistory(INITIAL_COOKED_HISTORY);
    localStorage.removeItem('f2f_pantry');
    localStorage.removeItem('f2f_history');
    localStorage.removeItem('f2f_settings');
  };

  return (
    <AppContext.Provider
      value={{
        pantry,
        cookedHistory,
        userSettings,
        setUserSettings,
        totalGramsRescued,
        totalMoneySaved,
        totalMealsCooked,
        ingredientsRescuedCount,
        addPantryItem,
        updatePantryItem,
        deletePantryItem,
        toggleUseSoon,
        toggleStockStatus,
        batchAddOrUpdateDetectedItems,
        recordCookedMeal,
        resetToDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
