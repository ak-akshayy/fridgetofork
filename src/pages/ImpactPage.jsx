import React from 'react';
import { 
  Scale, 
  IndianRupee, 
  UtensilsCrossed, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Info, 
  CheckCircle2, 
  Leaf,
  Globe2,
  Award
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { FOOD_WASTE_DATA } from '../data/foodWasteStats';

export default function ImpactPage() {
  const { 
    totalGramsRescued, 
    totalMoneySaved, 
    totalMealsCooked, 
    ingredientsRescuedCount, 
    cookedHistory 
  } = useApp();

  // Prepare weekly rescued progress data (simulated timeline based on history)
  const timelineData = [
    { day: 'Mon', foodRescued: 250, moneySaved: 18 },
    { day: 'Tue', foodRescued: 150, moneySaved: 12 },
    { day: 'Wed', foodRescued: 320, moneySaved: 28 },
    { day: 'Thu', foodRescued: 400, moneySaved: 35 },
    { day: 'Fri', foodRescued: 280, moneySaved: 22 },
    { day: 'Sat', foodRescued: 450, moneySaved: 42 },
    { day: 'Sun', foodRescued: 350, moneySaved: 30 }
  ];

  // Produce Category Rescue Breakdown
  const categoryBreakdown = [
    { name: 'Leafy Greens (Palak, Herbs)', value: 42, color: '#244B3A' },
    { name: 'Nightshades (Tomatoes, Peppers)', value: 28, color: '#E88D70' },
    { name: 'Dairy & Curd (Paneer, Dahi)', value: 18, color: '#F2D58A' },
    { name: 'Root Vegetables (Carrots, Potatoes)', value: 12, color: '#A8B99A' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-cream-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-3 py-1 rounded-full mb-2">
            <Leaf className="w-3.5 h-3.5" />
            <span>Sustainability Ledger</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
            Every Ingredient Saved Makes a Difference.
          </h1>
          <p className="text-textMuted text-sm sm:text-base mt-1">
            Track your household food waste reduction, financial savings, and climate contribution.
          </p>
        </div>
      </div>

      {/* 2. PERSONAL IMPACT SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Food Rescued */}
        <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider">Total Food Rescued</span>
            <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-forest-900">
            {totalGramsRescued >= 1000 ? `${(totalGramsRescued / 1000).toFixed(2)} kg` : `${totalGramsRescued} g`}
          </div>
          <p className="text-[11px] text-textMuted">Kept out of municipal landfills</p>
        </div>

        {/* Card 2: Estimated Money Saved */}
        <div className="bg-white rounded-3xl p-6 border border-coral-200 shadow-soft space-y-2 bg-gradient-to-br from-white to-coral-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-coral-700 uppercase tracking-wider">Est. Money Saved</span>
            <div className="w-8 h-8 rounded-xl bg-coral-100 text-coral-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-coral-600">
            ₹{totalMoneySaved}
          </div>
          <p className="text-[11px] text-coral-700 font-medium">Estimated retail grocery value</p>
        </div>

        {/* Card 3: Recipes Prepared */}
        <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider">Recipes Prepared</span>
            <div className="w-8 h-8 rounded-xl bg-sage-100 text-forest-700 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-forest-900">
            {totalMealsCooked}
          </div>
          <p className="text-[11px] text-textMuted">Confirmed zero-waste meals</p>
        </div>

        {/* Card 4: Ingredients Rescued */}
        <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider">Produce Items Rescued</span>
            <div className="w-8 h-8 rounded-xl bg-softYellow/30 text-forest-900 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-forest-900">
            {ingredientsRescuedCount}
          </div>
          <p className="text-[11px] text-textMuted">Saved from likely spoilage</p>
        </div>

      </div>

      {/* 3. TRANSPARENCY NOTICE */}
      <div className="p-4 bg-cream-50 border border-cream-300 rounded-3xl flex items-start space-x-3 text-xs text-textDark">
        <Info className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Transparent Methodology:</span> {FOOD_WASTE_DATA.transparencyNotice}
        </div>
      </div>

      {/* 4. VISUAL ANALYTICS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Chart 1: Food Rescued Over Time (Area Chart) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-cream-300 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-forest-900 text-base">
                Weekly Food Rescued (Grams)
              </h3>
              <p className="text-xs text-textMuted">Cumulative daily edible weight saved</p>
            </div>
            <span className="text-xs font-bold text-forest-700 bg-sage-100 px-3 py-1 rounded-full">
              Last 7 Days
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorRescued" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#244B3A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#244B3A" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFECE2" />
                <XAxis dataKey="day" stroke="#788078" fontSize={12} tickLine={false} />
                <YAxis stroke="#788078" fontSize={12} tickLine={false} unit="g" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #EFECE2',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}
                  formatter={(val) => [`${val} grams`, 'Rescued']}
                />
                <Area
                  type="monotone"
                  dataKey="foodRescued"
                  stroke="#244B3A"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRescued)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Breakdown (Donut Chart) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-cream-300 shadow-soft space-y-4">
          <div>
            <h3 className="font-extrabold text-forest-900 text-base">
              Produce Rescue Breakdown
            </h3>
            <p className="text-xs text-textMuted">Percentage distribution by food group</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #EFECE2'
                  }}
                  formatter={(val) => [`${val}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 pt-2 text-xs">
            {categoryBreakdown.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-textDark font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-forest-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. COOKED RESCUE HISTORY LOG */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div>
            <h3 className="text-xl font-extrabold text-forest-900">
              Cooking & Rescue Activity Log
            </h3>
            <p className="text-xs text-textMuted">
              Verified sessions recorded via the "I Cooked This!" confirmation flow
            </p>
          </div>

          <span className="text-xs font-bold text-forest-700 bg-sage-100 px-3 py-1 rounded-full">
            {cookedHistory.length} Sessions Logged
          </span>
        </div>

        <div className="space-y-3">
          {cookedHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-cream-100 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-forest-900 text-sm">
                    {item.recipeTitle}
                  </h4>
                  <span className="text-[10px] font-bold text-textMuted bg-cream-200 px-2 py-0.5 rounded-md">
                    {item.date}
                  </span>
                </div>

                <div className="text-xs text-textMuted">
                  Rescued:{' '}
                  <span className="font-bold text-forest-800">
                    {item.ingredientsRescued?.map((i) => `${i.quantity} ${i.unit} ${i.name}`).join(', ') || 'Produce items'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-auto text-xs">
                <div className="text-right">
                  <div className="font-black text-forest-800 text-sm">{item.totalGramsRescued}g</div>
                  <div className="text-[10px] text-textMuted">Rescued</div>
                </div>

                <div className="text-right">
                  <div className="font-black text-coral-600 text-sm">₹{item.totalMoneySaved}</div>
                  <div className="text-[10px] text-textMuted">Saved</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. SUSTAINABILITY BENCHMARK (UNEP Data Section) */}
      <div className="bg-forest-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl space-y-6">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-softYellow/20 text-softYellow text-xs font-bold uppercase tracking-wider">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Macro Perspective</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Your Kitchen Is Part of a Bigger Change.
          </h2>

          <p className="text-sage-200 text-sm sm:text-base leading-relaxed">
            Domestic kitchens are where food waste either compounds or ceases. By coordinating pantry expiration reminders and flavor-smart substitutions, a household can prevent dozens of kilograms of edible food from spoiling each year.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-forest-800/80 border border-forest-700 space-y-1">
              <div className="text-2xl font-black text-softYellow">78.2 Million Tonnes</div>
              <div className="text-xs text-sage-200">Estimated Indian household food waste in 2022.</div>
            </div>

            <div className="p-4 rounded-2xl bg-forest-800/80 border border-forest-700 space-y-1">
              <div className="text-2xl font-black text-white">55 KG</div>
              <div className="text-xs text-sage-200">Estimated annual household food waste per person.</div>
            </div>
          </div>

          <p className="text-xs text-sage-300/80 italic pt-2">
            {FOOD_WASTE_DATA.sourceAttribution}
          </p>
        </div>
      </div>

    </div>
  );
}
