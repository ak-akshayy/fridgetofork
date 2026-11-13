import React, { useState, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UploadCloud, 
  Camera, 
  ScanLine, 
  Sparkles, 
  Trash2, 
  Plus, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight, 
  Image as ImageIcon,
  CheckCircle2,
  Cpu,
  Info,
  X,
  Edit3,
  SlidersHorizontal,
  Flame,
  UtensilsCrossed,
  ShieldCheck,
  HelpCircle,
  CheckCheck
} from 'lucide-react';
import { 
  detectIngredients, 
  validateImageFile, 
  getVisionConfig, 
  SAMPLE_FRIDGE_PRESETS,
  SCANNER_CATEGORIES,
  SCAN_STAGES
} from '../services/visionService';
import { useApp } from '../context/AppContext';
import CameraCaptureModal from '../components/CameraCaptureModal';

export default function ScannerPage() {
  const navigate = useNavigate();
  const { batchAddOrUpdateDetectedItems } = useApp();

  // Active image state
  const [selectedImage, setSelectedImage] = useState(SAMPLE_FRIDGE_PRESETS[0].thumbnail);
  const [selectedPresetId, setSelectedPresetId] = useState(SAMPLE_FRIDGE_PRESETS[0].id);
  const [rawFile, setRawFile] = useState(null);
  const [imageMeta, setImageMeta] = useState({ name: 'Vegetable Crisper Preset', size: null });

  // Camera modal state
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  // Scanning progress & stage state
  const [isScanning, setIsScanning] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(1);
  const [currentStageLabel, setCurrentStageLabel] = useState('');
  const [scanError, setScanError] = useState(null);

  // Results & ingredient editing state
  const [scanResults, setScanResults] = useState(null);
  const [detectionList, setDetectionList] = useState([]);
  const [activeCategoryTab, setActiveCategoryTab] = useState('All');
  const [editingItemId, setEditingItemId] = useState(null);

  // Form for manually adding an ingredient
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [manualItem, setManualItem] = useState({
    name: '',
    category: 'Vegetables',
    quantity: 250,
    unit: 'g',
    useSoon: false
  });

  // Success Confirmation State
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const fileInputRef = useRef(null);

  // Read current Vision API configuration
  const visionConfig = useMemo(() => getVisionConfig(), []);

  // Handle local file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setScanError(validation.error);
      return;
    }

    setScanError(null);
    const objectUrl = URL.createObjectURL(file);
    setSelectedImage(objectUrl);
    setRawFile(file);
    setSelectedPresetId(null);
    setImageMeta({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    });
    setScanResults(null);
    setDetectionList([]);
    setSaveSuccess(false);
  };

  // Handle live camera capture
  const handleCameraCapture = (dataUrl) => {
    setScanError(null);
    setSelectedImage(dataUrl);
    setRawFile(null);
    setSelectedPresetId(null);
    setImageMeta({
      name: `Camera_Capture_${new Date().toLocaleTimeString().replace(/:/g, '-')}.jpg`,
      size: 'Direct Camera Stream'
    });
    setScanResults(null);
    setDetectionList([]);
    setSaveSuccess(false);
  };

  // Handle sample preset selection
  const handleSelectPreset = (preset) => {
    setScanError(null);
    setSelectedImage(preset.thumbnail);
    setRawFile(null);
    setSelectedPresetId(preset.id);
    setImageMeta({
      name: `${preset.name} (Sample Preset)`,
      size: 'Verified Demo Benchmark'
    });
    setScanResults(null);
    setDetectionList([]);
    setSaveSuccess(false);
  };

  // Clear / remove image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setRawFile(null);
    setSelectedPresetId(null);
    setImageMeta({ name: '', size: null });
    setScanResults(null);
    setDetectionList([]);
    setScanError(null);
    setSaveSuccess(false);
  };

  // Run the Vision Detection pipeline
  const handleScanFridge = async () => {
    if (!selectedImage) {
      setScanError('Please select or upload an image of your refrigerator first.');
      return;
    }

    setIsScanning(true);
    setScanError(null);
    setCurrentStageIndex(1);
    setCurrentStageLabel(SCAN_STAGES[0].label);

    try {
      const results = await detectIngredients(rawFile || selectedImage, {
        presetId: selectedPresetId,
        onStageChange: (step, label) => {
          setCurrentStageIndex(step);
          setCurrentStageLabel(label);
        }
      });

      setScanResults(results);
      setDetectionList(results.detectedItems);
    } catch (err) {
      console.error('Scan failed:', err);
      setScanError(err.message || 'Unable to scan refrigerator image. Please verify file format and try again.');
    } finally {
      setIsScanning(false);
    }
  };

  // Toggle item selection for confirmation
  const handleToggleSelect = (id) => {
    setDetectionList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isSelected: !item.isSelected } : item))
    );
  };

  // Select all or deselect all
  const handleSelectAll = (select) => {
    setDetectionList((prev) => prev.map((item) => ({ ...item, isSelected: select })));
  };

  // Toggle "Use Soon" flag
  const handleToggleUseSoon = (id) => {
    setDetectionList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, useSoon: !item.useSoon } : item))
    );
  };

  // Update item field (rename, category change, quantity)
  const handleUpdateItem = (id, field, value) => {
    setDetectionList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Delete item chip
  const handleRemoveItem = (id) => {
    setDetectionList((prev) => prev.filter((item) => item.id !== id));
  };

  // Add manual ingredient
  const handleAddManualIngredient = (e) => {
    e.preventDefault();
    if (!manualItem.name.trim()) return;

    const newItem = {
      id: `manual-${Date.now()}`,
      name: manualItem.name.trim(),
      category: manualItem.category || 'Vegetables',
      quantity: Number(manualItem.quantity) || 200,
      unit: manualItem.unit || 'g',
      confidence: null, // Transparently null for user-added items
      useSoon: manualItem.useSoon,
      daysUntilExpiry: manualItem.useSoon ? 2 : 7,
      condition: 'Manually verified by user',
      isSelected: true
    };

    setDetectionList((prev) => [...prev, newItem]);
    setManualItem({
      name: '',
      category: 'Vegetables',
      quantity: 250,
      unit: 'g',
      useSoon: false
    });
    setIsAddingManual(false);
  };

  // Save selected detected items to the pantry
  const handleSaveToPantry = () => {
    const selectedItems = detectionList.filter((item) => item.isSelected);
    if (selectedItems.length === 0) {
      alert('Please select at least one ingredient to save to your pantry.');
      return;
    }

    batchAddOrUpdateDetectedItems(selectedItems);
    setSavedCount(selectedItems.length);
    setSaveSuccess(true);
  };

  // Filtered ingredients by active category tab
  const filteredDetectionList = useMemo(() => {
    if (activeCategoryTab === 'All') return detectionList;
    if (activeCategoryTab === 'Use Soon') return detectionList.filter((i) => i.useSoon);
    return detectionList.filter((i) => i.category === activeCategoryTab);
  }, [detectionList, activeCategoryTab]);

  const selectedCount = detectionList.filter((i) => i.isSelected).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. HEADER & VISION API ARCHITECTURE BADGE */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-cream-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-200 px-3.5 py-1.5 rounded-full mb-2">
            <ScanLine className="w-3.5 h-3.5 text-forest-800" />
            <span>AI Kitchen Vision Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
            Let's See What's in Your Fridge.
          </h1>
          <p className="text-textMuted text-sm sm:text-base mt-1">
            Capture or upload a photo of your refrigerator shelves, crisper drawer, or pantry to identify ingredients.
          </p>
        </div>

        {/* API Architecture Mode Pill */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          {visionConfig.activeMode === 'api' ? (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-forest-100 border border-forest-300 text-forest-800 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-forest-700 animate-pulse"></span>
              <span>Vision API Connected</span>
            </div>
          ) : (
            <div 
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sage-100 border border-sage-300 text-forest-800 text-xs font-bold shadow-sm"
              title="Application is currently using the modular demo vision architecture. Organizers can connect the real API via VITE_VISION_API_URL."
            >
              <Cpu className="w-3.5 h-3.5 text-forest-700" />
              <span>Demo Vision Architecture</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN INTERACTION GRID: Upload & Camera (Left) + Results & Verification (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (6 cols): Image Capture / Upload Area */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-5">
            
            {/* Viewfinder / Image Preview Container */}
            <div className="relative rounded-2xl overflow-hidden bg-cream-100 border-2 border-dashed border-sage-300 min-h-[340px] flex items-center justify-center group">
              {selectedImage ? (
                <div className="relative w-full h-[360px] bg-black">
                  <img
                    src={selectedImage}
                    alt="Refrigerator or ingredients"
                    className="w-full h-full object-contain sm:object-cover"
                  />

                  {/* Scanning Laser Animation during scan */}
                  {isScanning && (
                    <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-softYellow to-transparent animate-scan-laser shadow-[0_0_18px_#F2D58A] z-10"></div>
                  )}

                  {/* Dynamic Stage Progression Overlay Backdrop */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-forest-900/60 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-white text-center z-20">
                      <div className="w-16 h-16 rounded-full bg-forest-700/90 border-2 border-softYellow flex items-center justify-center mb-4 shadow-xl">
                        <Cpu className="w-8 h-8 text-softYellow animate-spin [animation-duration:3s]" />
                      </div>

                      {/* Current Stage Indicator */}
                      <span className="text-[11px] font-bold uppercase tracking-wider text-softYellow mb-1">
                        Stage {currentStageIndex} of 4
                      </span>
                      <div className="text-sm sm:text-base font-extrabold tracking-wide max-w-xs text-white">
                        {currentStageLabel || SCAN_STAGES[currentStageIndex - 1]?.label}
                      </div>

                      {/* Progress Bar */}
                      <div className="w-64 h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
                        <div
                          className="h-full bg-softYellow rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${currentStageIndex * 25}%` }}
                        ></div>
                      </div>

                      {/* Stage steps check pills */}
                      <div className="flex items-center space-x-2 mt-4">
                        {SCAN_STAGES.map((s) => (
                          <span
                            key={s.step}
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${
                              s.step <= currentStageIndex ? 'bg-softYellow' : 'bg-white/30'
                            }`}
                            title={s.label}
                          ></span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Floating Image Metadata Badge */}
                  {!isScanning && (
                    <div className="absolute top-3 left-3 bg-forest-900/80 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm">
                      <ImageIcon className="w-3.5 h-3.5 text-softYellow" />
                      <span className="max-w-[200px] truncate">{imageMeta.name}</span>
                    </div>
                  )}

                  {/* Replace / Remove Controls */}
                  {!isScanning && (
                    <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-forest-900/80 hover:bg-forest-900 backdrop-blur-md text-white text-xs font-bold transition-colors shadow-soft"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-1.5 rounded-xl bg-coral-600/90 hover:bg-coral-600 text-white transition-colors shadow-soft"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty Upload / Drop State */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer text-center p-8 space-y-3"
                >
                  <div className="w-16 h-16 rounded-full bg-sage-100 text-forest-700 mx-auto flex items-center justify-center border border-sage-200 shadow-sm">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-textDark text-base">
                      Drag & drop or click to upload
                    </h4>
                    <p className="text-xs text-textMuted mt-1">
                      Supports JPG, JPEG, PNG, WEBP (Maximum 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Error Message Banner */}
            {scanError && (
              <div className="p-3.5 bg-coral-50 border border-coral-200 rounded-2xl flex items-start space-x-2.5 text-xs text-coral-800 animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 text-coral-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong>Scanning Error:</strong> {scanError}
                </div>
                <button
                  type="button"
                  onClick={() => setScanError(null)}
                  className="text-coral-600 hover:text-coral-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Action Buttons: Camera Capture, Upload File, Scan */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsCameraModalOpen(true)}
                  className="inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-white border border-sage-300 text-forest-800 font-bold text-xs hover:bg-cream-100 transition-colors shadow-sm"
                >
                  <Camera className="w-4 h-4 text-forest-700" />
                  <span>Use Live Camera</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-white border border-sage-300 text-forest-800 font-bold text-xs hover:bg-cream-100 transition-colors shadow-sm"
                >
                  <UploadCloud className="w-4 h-4 text-forest-700" />
                  <span>Upload From Device</span>
                </button>
              </div>

              {/* Primary Scan Button */}
              <button
                type="button"
                onClick={handleScanFridge}
                disabled={isScanning || !selectedImage}
                className="w-full inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-forest-700 text-white font-extrabold text-sm sm:text-base hover:bg-forest-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-soft-lg hover:-translate-y-0.5"
              >
                <ScanLine className="w-5 h-5 text-softYellow" />
                <span>{isScanning ? 'Analyzing Refrigerator...' : 'Scan My Fridge'}</span>
              </button>
            </div>
          </div>

          {/* Quick Benchmark Presets Carousel */}
          <div className="bg-white rounded-3xl p-5 border border-cream-300 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-textMuted">
                Or Test Sample Refrigerator Photos
              </span>
              <span className="text-[11px] text-forest-700 font-semibold">1-Click Evaluation</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {SAMPLE_FRIDGE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left rounded-2xl p-2 border transition-all text-xs overflow-hidden ${
                    selectedPresetId === preset.id
                      ? 'border-forest-700 bg-forest-50 ring-2 ring-forest-700/20 shadow-sm'
                      : 'border-cream-300 hover:border-sage-400 bg-cream-50/50'
                  }`}
                >
                  <img
                    src={preset.thumbnail}
                    alt={preset.name}
                    className="w-full h-16 object-cover rounded-xl mb-1.5"
                  />
                  <div className="font-bold text-textDark truncate">{preset.name}</div>
                  <div className="text-[10px] text-textMuted truncate">{preset.detectedItems.length} items</div>
                </button>
              ))}
            </div>
          </div>

          {/* FEATURE 5: SCAN QUALITY ASSISTANCE */}
          <div className="bg-forest-50/80 border border-forest-200 rounded-3xl p-5 space-y-2.5">
            <div className="flex items-center space-x-2 text-forest-900 font-bold text-xs uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-forest-700" />
              <span>Camera & Quality Assistance</span>
            </div>
            <ul className="text-xs text-forest-800 space-y-1.5 pl-1">
              <li className="flex items-start space-x-2">
                <span className="text-forest-700 font-bold">•</span>
                <span><strong>Keep ingredients visible:</strong> Avoid deeply stacking boxes in front of fresh vegetables.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-forest-700 font-bold">•</span>
                <span><strong>Ensure good lighting:</strong> Avoid very dark or back-lit angles for clearer segmentation.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-forest-700 font-bold">•</span>
                <span><strong>Avoid excessive blur:</strong> Hold camera steady for 1 second while capturing.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-forest-700 font-bold">•</span>
                <span><strong>Capture shelves clearly:</strong> Angle camera slightly down into the crisper drawer.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Right Column (6 cols): Detected Ingredients & Correction System */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-5">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cream-200">
              <div>
                <h3 className="text-xl font-extrabold text-forest-900">
                  Detected Ingredients
                </h3>
                <p className="text-xs text-textMuted">
                  {detectionList.length > 0
                    ? `${detectionList.length} items identified. Edit or correct detections.`
                    : 'Scan your fridge to generate ingredient chips.'}
                </p>
              </div>

              {scanResults && (
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                    scanResults.isDemo
                      ? 'bg-sage-100 text-forest-800 border-sage-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {scanResults.isDemo ? 'Demo Mode (Pre-API)' : 'Verified Vision API'}
                  </span>
                </div>
              )}
            </div>

            {/* Architecture Transparency Notice */}
            <div className="p-3.5 bg-cream-50 border border-cream-200 rounded-2xl flex items-start space-x-2.5 text-xs text-textMuted">
              <Info className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-textDark">Modular Service Integration:</span> Powered by <code className="bg-cream-200 px-1 py-0.5 rounded text-[11px] text-forest-900">src/services/visionService.js</code>. Ready to connect the organizer's Vision API endpoint via environment variables without hardcoded keys.
              </div>
            </div>

            {/* Category Filter Tabs */}
            {detectionList.length > 0 && (
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-b border-cream-200">
                {['All', ...SCANNER_CATEGORIES, 'Use Soon'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryTab(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeCategoryTab === cat
                        ? 'bg-forest-700 text-white font-bold'
                        : 'text-textMuted hover:text-textDark hover:bg-cream-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Selection Controls */}
            {detectionList.length > 0 && (
              <div className="flex items-center justify-between text-xs text-textMuted pt-1">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleSelectAll(true)}
                    className="font-bold text-forest-700 hover:underline"
                  >
                    Select All
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(false)}
                    className="font-bold text-textMuted hover:underline"
                  >
                    Deselect All
                  </button>
                </div>
                <span className="font-semibold text-textDark">
                  {selectedCount} of {detectionList.length} selected for pantry
                </span>
              </div>
            )}

            {/* Detection Cards / Chips List */}
            {filteredDetectionList.length > 0 ? (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {filteredDetectionList.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      item.isSelected
                        ? item.useSoon
                          ? 'bg-coral-50/70 border-coral-300 shadow-sm'
                          : 'bg-cream-50 border-cream-300 shadow-sm'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Checkbox for saving */}
                      <input
                        type="checkbox"
                        checked={item.isSelected}
                        onChange={() => handleToggleSelect(item.id)}
                        className="w-4 h-4 mt-1 rounded border-sage-300 text-forest-700 focus:ring-forest-600 cursor-pointer shrink-0"
                      />

                      {/* Ingredient Details / Editing Fields */}
                      <div className="min-w-0 flex-1 space-y-2">
                        {/* Name (Inline Editable) */}
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                            className="font-bold text-sm text-forest-900 bg-transparent border-b border-dashed border-sage-300 hover:border-forest-700 focus:border-forest-700 focus:outline-none w-full"
                            title="Click to rename ingredient (e.g. spinach to coriander)"
                          />
                        </div>

                        {/* Category Dropdown, Quantity, and Unit */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {/* Category Selector */}
                          <select
                            value={item.category}
                            onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                            className="px-2 py-1 rounded-lg border border-sage-300 bg-white text-textDark font-medium text-xs focus:outline-none focus:ring-1 focus:ring-forest-600"
                          >
                            {SCANNER_CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>

                          {/* Quantity & Unit */}
                          <div className="flex items-center space-x-1 bg-white border border-sage-300 rounded-lg px-2 py-0.5">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                              className="w-14 text-xs font-bold text-textDark text-right focus:outline-none"
                            />
                            <select
                              value={item.unit}
                              onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                              className="text-[11px] font-semibold text-textMuted bg-transparent focus:outline-none"
                            >
                              <option value="g">g</option>
                              <option value="kg">kg</option>
                              <option value="ml">ml</option>
                              <option value="L">L</option>
                              <option value="pcs">pcs</option>
                              <option value="tbsp">tbsp</option>
                            </select>
                          </div>

                          {/* Confidence score (if returned by API) */}
                          {item.confidence && (
                            <span className="text-[10px] font-bold text-forest-700 bg-sage-200/60 px-2 py-0.5 rounded-md">
                              {item.confidence}% Match
                            </span>
                          )}
                        </div>

                        {/* Condition Note */}
                        {item.condition && (
                          <div className="text-[10px] text-textMuted italic">
                            {item.condition}
                          </div>
                        )}
                      </div>

                      {/* Right Actions: Use Soon toggle & Remove */}
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleUseSoon(item.id)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors ${
                            item.useSoon
                              ? 'bg-coral-500 text-white border-coral-600 shadow-sm'
                              : 'bg-white text-textMuted border-cream-300 hover:border-coral-300 hover:text-coral-600'
                          }`}
                          title="Mark as Use Soon for priority rescue cooking"
                        >
                          {item.useSoon ? '🔥 Use Soon' : '+ Use Soon'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-textMuted hover:text-coral-600 transition-colors"
                          title="Remove incorrect detection"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty Results State */
              <div className="text-center py-10 px-4 space-y-3 bg-cream-50 rounded-2xl border border-cream-200">
                <div className="w-12 h-12 rounded-full bg-cream-200 text-forest-700 mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-textDark text-sm">No Ingredients Detected Yet</h4>
                <p className="text-xs text-textMuted max-w-xs mx-auto">
                  Click <strong>"Scan My Fridge"</strong> to run optical recognition, or use the camera to take a fresh photo.
                </p>
              </div>
            )}

            {/* FEATURE 4: INGREDIENT CORRECTION & MANUAL ADD */}
            {isAddingManual ? (
              <form onSubmit={handleAddManualIngredient} className="p-4 bg-sage-50/70 border border-sage-300 rounded-2xl space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-900 uppercase tracking-wider">
                    Add Missing Ingredient
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingManual(false)}
                    className="text-textMuted hover:text-textDark"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Ingredient name (e.g. Coriander, Lemon)..."
                    value={manualItem.name}
                    onChange={(e) => setManualItem({ ...manualItem, name: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-sage-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-forest-600 font-medium"
                  />

                  <select
                    value={manualItem.category}
                    onChange={(e) => setManualItem({ ...manualItem, category: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-sage-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-forest-600 font-medium"
                  >
                    {SCANNER_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-1.5 bg-white border border-sage-300 rounded-xl px-2.5 py-1">
                    <input
                      type="number"
                      min="1"
                      value={manualItem.quantity}
                      onChange={(e) => setManualItem({ ...manualItem, quantity: e.target.value })}
                      className="w-16 text-xs font-bold text-textDark text-right focus:outline-none"
                    />
                    <select
                      value={manualItem.unit}
                      onChange={(e) => setManualItem({ ...manualItem, unit: e.target.value })}
                      className="text-xs text-textMuted bg-transparent focus:outline-none"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="pcs">pcs</option>
                      <option value="tbsp">tbsp</option>
                    </select>
                  </div>

                  <label className="flex items-center space-x-1.5 text-xs text-coral-700 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={manualItem.useSoon}
                      onChange={(e) => setManualItem({ ...manualItem, useSoon: e.target.checked })}
                      className="w-3.5 h-3.5 text-coral-600 rounded border-coral-300"
                    />
                    <span>Flag Use Soon</span>
                  </label>

                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-800 transition-colors shadow-sm"
                  >
                    Add
                  </button>
                </div>
              </form>
            ) : (
              detectionList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsAddingManual(true)}
                  className="w-full py-2.5 rounded-xl border border-dashed border-sage-400 text-forest-800 font-bold text-xs hover:bg-cream-100 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Missing Ingredient Manually</span>
                </button>
              )
            )}

            {/* FEATURE 7: CONFIRM & SAVE TO PANTRY / RECIPES CTA */}
            {detectionList.length > 0 && (
              <div className="pt-4 border-t border-cream-200">
                <button
                  type="button"
                  onClick={handleSaveToPantry}
                  disabled={selectedCount === 0}
                  className="w-full inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-forest-700 text-white font-extrabold text-sm sm:text-base hover:bg-forest-800 disabled:opacity-40 transition-all shadow-soft hover:-translate-y-0.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-softYellow" />
                  <span>Save {selectedCount} Selected to Digital Pantry</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* 3. SUCCESS CONFIRMATION MODAL / ACTION DRAWER */}
      {saveSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-cream-300 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-700 mx-auto flex items-center justify-center border-2 border-forest-300 shadow-soft">
              <Check className="w-8 h-8 text-forest-700" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-forest-900">
                Pantry Updated!
              </h3>
              <p className="text-textMuted text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                <strong>{savedCount} ingredients</strong> have been synchronized to your kitchen inventory and are ready for smart food rescue recipe matching.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('/rescue-engine')}
                className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 transition-colors shadow-soft"
              >
                <Flame className="w-4 h-4 text-softYellow" />
                <span>Go to Flavor-Smart Rescue Engine</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/pantry')}
                className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-cream-100 border border-sage-300 text-forest-800 font-bold text-xs hover:bg-cream-200 transition-colors"
              >
                <UtensilsCrossed className="w-4 h-4 text-forest-700" />
                <span>View in Digital Pantry</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSaveSuccess(false);
                  handleRemoveImage();
                }}
                className="w-full py-2 text-xs font-semibold text-textMuted hover:text-textDark transition-colors"
              >
                Scan Another Shelf or Crisper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
      />

    </div>
  );
}
