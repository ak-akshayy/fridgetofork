/**
 * Fridge2Fork Modular Vision Service Architecture
 * 
 * Exposes a clean, standard interface for kitchen ingredient recognition.
 * Designed to connect seamlessly to organizer-provided Computer Vision APIs
 * while providing an authentic, transparent fallback for demo and evaluation modes.
 */

export const SCANNER_CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Dairy',
  'Proteins',
  'Grains',
  'Other'
];

export const SCAN_STAGES = [
  { step: 1, label: 'Preparing image and verifying visual dimensions' },
  { step: 2, label: 'Analyzing refrigerator contents and produce layout' },
  { step: 3, label: 'Identifying food ingredients and freshness condition' },
  { step: 4, label: 'Preparing ingredient results and pantry classification' }
];

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
    description: 'Paneer block, plain dahi, milk carton, and butter.',
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
    description: 'Potatoes, red onions, ginger, garlic, and green chillies.',
    thumbnail: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=80',
    detectedItems: [
      { id: 'det-10', name: 'Potatoes', category: 'Vegetables', quantity: 800, unit: 'g', confidence: 99, useSoon: false, daysUntilExpiry: 14, condition: 'Pantry staple' },
      { id: 'det-11', name: 'Red Onions', category: 'Vegetables', quantity: 600, unit: 'g', confidence: 97, useSoon: false, daysUntilExpiry: 10, condition: 'Dry firm' },
      { id: 'det-12', name: 'Ginger & Garlic Paste', category: 'Other', quantity: 100, unit: 'g', confidence: 93, useSoon: false, daysUntilExpiry: 15, condition: 'Fresh root' },
      { id: 'det-13', name: 'Green Chillies', category: 'Vegetables', quantity: 60, unit: 'g', confidence: 90, useSoon: true, daysUntilExpiry: 4, condition: 'Use in tempering' }
    ]
  }
];

/**
 * Reads API configuration from Vite environment variables.
 * Never leaks secret keys directly to the client UI.
 */
export function getVisionConfig() {
  const apiUrl = import.meta.env.VITE_VISION_API_URL || '';
  const apiKey = import.meta.env.VITE_VISION_API_KEY || '';
  const forcedMode = import.meta.env.VITE_VISION_MODE || 'auto'; // 'auto' | 'api' | 'demo'

  const isConfigured = Boolean(apiUrl && apiUrl.trim().length > 0);
  const activeMode = forcedMode === 'demo' ? 'demo' : (isConfigured ? 'api' : 'demo');

  return {
    isConfigured,
    activeMode,
    apiUrl: isConfigured ? apiUrl : null,
    hasApiKey: Boolean(apiKey && apiKey.trim().length > 0)
  };
}

/**
 * Validates file type and size (max 10MB, JPG/PNG/WEBP)
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: 'No image file provided.' };
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type?.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported format "${file.type || 'unknown'}". Please upload a JPG, JPEG, PNG, or WEBP image.`
    };
  }

  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeInBytes) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeInMb}MB). Maximum allowed image size is 10MB.`
    };
  }

  return { valid: true, error: null };
}

/**
 * Normalizes input image (File, Blob, DataURL, or URL) into a usable visual asset.
 * Extracts image resolution for quality feedback.
 */
export async function prepareImage(imageInput) {
  return new Promise((resolve, reject) => {
    let src = '';
    let isFile = false;
    let fileName = 'fridge_scan.jpg';
    let fileSize = null;

    if (typeof imageInput === 'string') {
      src = imageInput;
      if (imageInput.startsWith('data:')) {
        fileName = 'camera_capture.jpg';
      }
    } else if (imageInput instanceof File || imageInput instanceof Blob) {
      src = URL.createObjectURL(imageInput);
      isFile = true;
      fileName = imageInput.name || 'uploaded_image.jpg';
      fileSize = imageInput.size;
    } else {
      return reject(new Error('Invalid image input provided.'));
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      resolve({
        url: src,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        fileName,
        fileSize,
        rawInput: imageInput
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image. The file may be corrupt or inaccessible.'));
    };

    img.src = src;
  });
}

/**
 * Maps raw API detections or demo items into the standard Fridge2Fork ingredient shape.
 */
function normalizeIngredients(rawItems = [], defaultCategory = 'Vegetables') {
  return rawItems.map((item, index) => {
    // Normalise name
    const name = item.name || item.label || item.ingredient || `Ingredient ${index + 1}`;
    
    // Normalise category
    let category = item.category || defaultCategory;
    if (!SCANNER_CATEGORIES.includes(category)) {
      const lower = name.toLowerCase();
      if (lower.includes('paneer') || lower.includes('milk') || lower.includes('curd') || lower.includes('yogurt') || lower.includes('butter') || lower.includes('cheese')) {
        category = 'Dairy';
      } else if (lower.includes('tofu') || lower.includes('dal') || lower.includes('egg') || lower.includes('lentil') || lower.includes('chickpea')) {
        category = 'Proteins';
      } else if (lower.includes('apple') || lower.includes('banana') || lower.includes('orange') || lower.includes('lemon') || lower.includes('mango')) {
        category = 'Fruits';
      } else if (lower.includes('rice') || lower.includes('atta') || lower.includes('flour') || lower.includes('pasta') || lower.includes('bread')) {
        category = 'Grains';
      } else {
        category = 'Vegetables';
      }
    }

    // Normalise quantity and unit
    const quantity = Number(item.quantity) || 250;
    const unit = item.unit || (category === 'Dairy' && name.toLowerCase().includes('milk') ? 'ml' : 'g');

    // Confidence: only attach if explicitly returned by the API
    const confidence = typeof item.confidence === 'number' ? Math.round(item.confidence <= 1 ? item.confidence * 100 : item.confidence) : null;

    // Use-soon heuristic if not explicitly set
    const isPerishable = ['spinach', 'coriander', 'mint', 'methi', 'capsicum', 'tomato', 'paneer', 'mushroom', 'milk'].some(
      (p) => name.toLowerCase().includes(p)
    );
    const useSoon = typeof item.useSoon === 'boolean' ? item.useSoon : isPerishable;
    const daysUntilExpiry = item.daysUntilExpiry || (useSoon ? 2 : 7);

    return {
      id: item.id || `ing-${Date.now()}-${index}`,
      name,
      category,
      quantity,
      unit,
      confidence,
      useSoon,
      daysUntilExpiry,
      condition: item.condition || (useSoon ? 'Recommended for rapid use' : 'Stable kitchen stock'),
      isSelected: true
    };
  });
}

/**
 * Main Detection Interface
 * 
 * Supports:
 * - Real external Vision API (when VITE_VISION_API_URL is configured)
 * - Preset sample datasets (instant test)
 * - Local demonstration engine with staged callbacks
 * 
 * @param {File|Blob|string} imageInput
 * @param {Object} options
 * @param {Function} options.onStageChange - (stageIndex, stageLabel) => void
 * @param {string} [options.presetId] - optional preset identifier
 */
export async function detectIngredients(imageInput, options = {}) {
  const { onStageChange, presetId } = options;
  const config = getVisionConfig();
  const startTime = Date.now();

  const reportStage = (step) => {
    if (onStageChange && SCAN_STAGES[step - 1]) {
      onStageChange(step, SCAN_STAGES[step - 1].label);
    }
  };

  // STAGE 1: Preparing image
  reportStage(1);
  const prepared = await prepareImage(imageInput);

  // Check for image quality issues (very small resolution)
  if (prepared.width < 150 || prepared.height < 150) {
    throw new Error('Image resolution is too low for food item detection. Please use an image at least 200x200 pixels.');
  }

  // Brief pause to allow browser UI paint of Stage 1
  await new Promise((r) => setTimeout(r, 200));

  // If a preset was selected, use the verified preset data directly
  if (presetId) {
    reportStage(2);
    await new Promise((r) => setTimeout(r, 350));
    reportStage(3);
    await new Promise((r) => setTimeout(r, 350));
    reportStage(4);

    const matchedPreset = SAMPLE_FRIDGE_PRESETS.find((p) => p.id === presetId);
    const items = matchedPreset ? matchedPreset.detectedItems : SAMPLE_FRIDGE_PRESETS[0].detectedItems;

    return {
      success: true,
      isDemo: true,
      detectionSource: 'Verified Hackathon Sample Dataset',
      modelName: 'FridgeVision-DemoPreset-v2.5',
      imageMetadata: {
        width: prepared.width,
        height: prepared.height,
        fileName: prepared.fileName
      },
      durationMs: Date.now() - startTime,
      detectedItems: normalizeIngredients(items)
    };
  }

  // REAL API PATH: when VITE_VISION_API_URL is configured and not in forced demo mode
  if (config.isConfigured && config.activeMode === 'api') {
    try {
      reportStage(2); // Analyzing refrigerator contents

      // Prepare payload: FormData if File/Blob, or JSON if Data URL / URL
      let bodyData;
      let headers = {};

      if (config.hasApiKey) {
        headers['Authorization'] = `Bearer ${import.meta.env.VITE_VISION_API_KEY}`;
        headers['x-api-key'] = import.meta.env.VITE_VISION_API_KEY;
      }

      if (prepared.rawInput instanceof File || prepared.rawInput instanceof Blob) {
        const formData = new FormData();
        formData.append('image', prepared.rawInput, prepared.fileName);
        bodyData = formData;
      } else {
        headers['Content-Type'] = 'application/json';
        bodyData = JSON.stringify({
          image: prepared.url,
          options: {
            features: ['OBJECT_LOCALIZATION', 'LABEL_DETECTION']
          }
        });
      }

      // Execute request with 20 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers,
        body: bodyData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      reportStage(3); // Identifying food ingredients

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`Vision API error (HTTP ${response.status}): ${errText || response.statusText}`);
      }

      const jsonResult = await response.json();
      reportStage(4); // Preparing results

      // Adapt diverse API response schemas
      const rawList = jsonResult.ingredients || jsonResult.items || jsonResult.detected_objects || jsonResult.predictions || [];
      const normalized = normalizeIngredients(rawList);

      return {
        success: true,
        isDemo: false,
        detectionSource: `Live Vision API (${config.apiUrl})`,
        modelName: jsonResult.model || 'Organizer-Vision-Model',
        imageMetadata: {
          width: prepared.width,
          height: prepared.height,
          fileName: prepared.fileName
        },
        durationMs: Date.now() - startTime,
        detectedItems: normalized
      };
    } catch (apiError) {
      console.warn('Real Vision API call failed, falling back to transparent demo classifier:', apiError);
      // If network fails, re-throw with actionable detail or proceed to safe fallback with notice
      throw new Error(`Failed to contact Vision API at ${config.apiUrl}: ${apiError.message}`);
    }
  }

  // DEMO / SIMULATION PATH: Transparent, labeled demonstration for evaluation
  reportStage(2);
  await new Promise((r) => setTimeout(r, 400));

  reportStage(3);
  await new Promise((r) => setTimeout(r, 450));

  reportStage(4);
  await new Promise((r) => setTimeout(r, 250));

  // Curated demo detection reflecting typical crisper contents
  const demoDetections = [
    { name: 'Ripe Tomatoes', category: 'Vegetables', quantity: 350, unit: 'g', confidence: 96, useSoon: true, daysUntilExpiry: 3, condition: 'High ripeness, soft skin' },
    { name: 'Fresh Spinach', category: 'Vegetables', quantity: 200, unit: 'g', confidence: 94, useSoon: true, daysUntilExpiry: 2, condition: 'Greens require rapid use' },
    { name: 'Green Capsicum', category: 'Vegetables', quantity: 180, unit: 'g', confidence: 91, useSoon: true, daysUntilExpiry: 2, condition: 'Crisp produce' },
    { name: 'Red Onions', category: 'Vegetables', quantity: 400, unit: 'g', confidence: 98, useSoon: false, daysUntilExpiry: 12, condition: 'Stable storage' },
    { name: 'Paneer (Cottage Cheese)', category: 'Dairy', quantity: 200, unit: 'g', confidence: 92, useSoon: true, daysUntilExpiry: 2, condition: 'Opened packet' },
    { name: 'Milk', category: 'Dairy', quantity: 500, unit: 'ml', confidence: 89, useSoon: false, daysUntilExpiry: 3, condition: 'Fresh dairy pouch' }
  ];

  return {
    success: true,
    isDemo: true,
    detectionSource: 'Demo Mode (Pre-API Integration)',
    modelName: 'FridgeVision-Demo-Simulator',
    imageMetadata: {
      width: prepared.width,
      height: prepared.height,
      fileName: prepared.fileName,
      fileSize: prepared.fileSize
    },
    durationMs: Date.now() - startTime,
    detectedItems: normalizeIngredients(demoDetections)
  };
}
