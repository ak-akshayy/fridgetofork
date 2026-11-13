export const SAMPLE_FRIDGE_PRESETS = [
  {
    id: 'preset-crisper',
    name: 'Vegetable Crisper Drawer',
    description: 'Fresh leafy greens, tomatoes, bell peppers, and carrots.',
    thumbnail: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    detectedItems: [
      { id: 'det-1', name: 'Fresh Spinach', category: 'Vegetables', quantity: 250, unit: 'g', confidence: 98, useSoon: true, daysUntilExpiry: 2, condition: 'Slight wilting, high rescue priority' },
      { id: 'det-2', name: 'Ripe Tomatoes', category: 'Vegetables', quantity: 400, unit: 'g', confidence: 96, useSoon: true, daysUntilExpiry: 3, condition: 'Very ripe, soft skin' },
      { id: 'det-3', name: 'Green Capsicum', category: 'Vegetables', quantity: 200, unit: 'g', confidence: 94, useSoon: true, daysUntilExpiry: 2, condition: 'Crisp, ready to cook' },
      { id: 'det-4', name: 'Carrots', category: 'Vegetables', quantity: 300, unit: 'g', confidence: 92, useSoon: false, daysUntilExpiry: 7, condition: 'Firm and fresh' },
      { id: 'det-5', name: 'Cucumber', category: 'Vegetables', quantity: 250, unit: 'g', confidence: 91, useSoon: false, daysUntilExpiry: 5, condition: 'Fresh crisp' }
    ]
  },
  {
    id: 'preset-dairy-greens',
    name: 'Dairy Shelf & Quick Greens',
    description: 'Paneer block, plain dahi, milk carton, and herbs.',
    thumbnail: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&w=600&q=80',
    detectedItems: [
      { id: 'det-6', name: 'Paneer (Cottage Cheese)', category: 'Dairy', quantity: 200, unit: 'g', confidence: 97, useSoon: true, daysUntilExpiry: 2, condition: 'Opened packet, use soon' },
      { id: 'det-7', name: 'Plain Yogurt (Curd)', category: 'Dairy', quantity: 350, unit: 'g', confidence: 95, useSoon: false, daysUntilExpiry: 4, condition: 'Fresh probiotic curd' },
      { id: 'det-8', name: 'Milk', category: 'Dairy', quantity: 500, unit: 'ml', confidence: 99, useSoon: false, daysUntilExpiry: 3, condition: 'Chilled pouch' },
      { id: 'det-9', name: 'Butter', category: 'Dairy', quantity: 100, unit: 'g', confidence: 89, useSoon: false, daysUntilExpiry: 18, condition: 'Chilled block' }
    ]
  },
  {
    id: 'preset-leftover-mix',
    name: 'Weekend Produce Box',
    description: 'Potatoes, onions, ginger, and green chillies.',
    thumbnail: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=80',
    detectedItems: [
      { id: 'det-10', name: 'Potatoes', category: 'Vegetables', quantity: 800, unit: 'g', confidence: 99, useSoon: false, daysUntilExpiry: 14, condition: 'Pantry staple' },
      { id: 'det-11', name: 'Red Onions', category: 'Vegetables', quantity: 600, unit: 'g', confidence: 97, useSoon: false, daysUntilExpiry: 10, condition: 'Dry firm' },
      { id: 'det-12', name: 'Ginger & Garlic Paste', category: 'Spices', quantity: 100, unit: 'g', confidence: 93, useSoon: false, daysUntilExpiry: 15, condition: 'Fresh root' },
      { id: 'det-13', name: 'Green Chillies', category: 'Vegetables', quantity: 60, unit: 'g', confidence: 90, useSoon: true, daysUntilExpiry: 4, condition: 'Use in tempering' }
    ]
  }
];

/**
 * Simulates a deep vision pipeline with staged updates
 */
export async function simulateVisionDetection(imageSource, onProgress) {
  const steps = [
    { pct: 15, msg: 'Calibrating image lighting & color balance...' },
    { pct: 35, msg: 'Segmenting multi-class bounding boxes in refrigerator...' },
    { pct: 60, msg: 'Classifying botanical & dairy ingredient signatures...' },
    { pct: 85, msg: 'Evaluating surface freshness & days-until-spoilage...' },
    { pct: 100, msg: 'Classification complete! Generated editable ingredient ledger.' }
  ];

  for (const step of steps) {
    if (onProgress) onProgress(step.pct, step.msg);
    await new Promise((resolve) => setTimeout(resolve, 450));
  }

  // If a preset was passed, return its items
  const matchedPreset = SAMPLE_FRIDGE_PRESETS.find((p) => p.thumbnail === imageSource || p.id === imageSource);
  if (matchedPreset) {
    return {
      isDemoPreset: true,
      modelUsed: 'FridgeVision-Core-v2.4 (Edge Optimized)',
      detectionTimeMs: 1850,
      detectedItems: JSON.parse(JSON.stringify(matchedPreset.detectedItems))
    };
  }

  // For a custom uploaded user photo:
  return {
    isDemoPreset: false,
    modelUsed: 'FridgeVision-Demo-Simulator (Ready for Gemini Vision)',
    detectionTimeMs: 2100,
    detectedItems: [
      { id: 'custom-1', name: 'Ripe Tomatoes', category: 'Vegetables', quantity: 350, unit: 'g', confidence: 96, useSoon: true, daysUntilExpiry: 3, condition: 'Detected high ripeness' },
      { id: 'custom-2', name: 'Fresh Spinach', category: 'Vegetables', quantity: 200, unit: 'g', confidence: 94, useSoon: true, daysUntilExpiry: 2, condition: 'Greens require rapid use' },
      { id: 'custom-3', name: 'Green Capsicum', category: 'Vegetables', quantity: 180, unit: 'g', confidence: 91, useSoon: true, daysUntilExpiry: 2, condition: 'Fresh produce' },
      { id: 'custom-4', name: 'Red Onions', category: 'Vegetables', quantity: 400, unit: 'g', confidence: 98, useSoon: false, daysUntilExpiry: 12, condition: 'Stable bulb' },
      { id: 'custom-5', name: 'Milk', category: 'Dairy', quantity: 500, unit: 'ml', confidence: 89, useSoon: false, daysUntilExpiry: 3, condition: 'Dairy item' }
    ]
  };
}
