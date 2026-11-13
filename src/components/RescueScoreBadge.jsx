import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, AlertTriangle, Sparkles, ShoppingBag } from 'lucide-react';

export default function RescueScoreBadge({
  score = 0,
  breakdown = null,
  reasons = [],
  size = 'md', // 'sm', 'md', 'lg'
  showTooltip = true
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Determine stroke color based on score
  let strokeColor = '#244B3A';
  let badgeBg = 'bg-forest-50 text-forest-800 border-forest-200';
  if (score >= 85) {
    strokeColor = '#244B3A';
    badgeBg = 'bg-forest-100 text-forest-800 border-forest-300';
  } else if (score >= 70) {
    strokeColor = '#3D7A60';
    badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (score >= 50) {
    strokeColor = '#D97706';
    badgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
  } else {
    strokeColor = '#E88D70';
    badgeBg = 'bg-coral-50 text-coral-700 border-coral-200';
  }

  // SVG dimensions
  const dimensions = {
    sm: { size: 44, stroke: 4, radius: 18, font: 'text-xs' },
    md: { size: 64, stroke: 5, radius: 26, font: 'text-base font-bold' },
    lg: { size: 90, stroke: 7, radius: 36, font: 'text-xl font-bold' }
  }[size] || { size: 64, stroke: 5, radius: 26, font: 'text-base font-bold' };

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center">
      {/* Circular Progress Meter */}
      <div
        className="relative flex items-center justify-center cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
        title="Click to view Food Rescue Score breakdown"
      >
        <svg
          width={dimensions.size}
          height={dimensions.size}
          className="transform -rotate-90 transition-all duration-700"
        >
          {/* Background Track */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={dimensions.radius}
            stroke="#EFECE2"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          {/* Animated Value Stroke */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={dimensions.radius}
            stroke={strokeColor}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`${dimensions.font} text-textDark tracking-tight leading-none`}>
            {score}
          </span>
          {size === 'lg' && (
            <span className="text-[10px] text-textMuted uppercase font-semibold tracking-wider mt-0.5">
              Score
            </span>
          )}
        </div>
      </div>

      {/* Label and Explainer Icon */}
      {showTooltip && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-2.5 flex items-center text-xs font-medium text-textMuted hover:text-forest-700 transition-colors focus:outline-none"
        >
          <span className="font-semibold text-textDark hidden sm:inline">Rescue Score</span>
          <HelpCircle className="w-3.5 h-3.5 ml-1 text-sage-400 group-hover:text-forest-700" />
        </button>
      )}

      {/* Popover Breakdown Card */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-card-hover border border-sage-200 p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-forest-700"></span>
                <h4 className="font-bold text-textDark text-sm">Food Rescue Score Analysis</h4>
              </div>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${badgeBg}`}>
                {score}/100
              </span>
            </div>

            {/* Score Factors */}
            {breakdown && (
              <div className="grid grid-cols-3 gap-2 my-3 text-center">
                <div className="p-2 bg-cream-100 rounded-xl">
                  <div className="text-xs text-textMuted">Available</div>
                  <div className="font-bold text-sm text-forest-700">+{breakdown.availableScore} pts</div>
                </div>
                <div className="p-2 bg-cream-100 rounded-xl">
                  <div className="text-xs text-textMuted">Use Soon</div>
                  <div className="font-bold text-sm text-coral-600">+{breakdown.useSoonScore} pts</div>
                </div>
                <div className="p-2 bg-cream-100 rounded-xl">
                  <div className="text-xs text-textMuted">Substitutes</div>
                  <div className="font-bold text-sm text-forest-600">+{breakdown.subScore} pts</div>
                </div>
              </div>
            )}

            {/* Explanatory bullet points */}
            <div className="space-y-2 mt-3 text-xs text-textDark">
              {reasons && reasons.length > 0 ? (
                reasons.map((r, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))
              ) : (
                <p className="text-textMuted text-xs">Calculated based on ingredients currently present in your kitchen pantry.</p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-cream-200 flex justify-between items-center text-[11px] text-textMuted">
              <span>Deterministic Rule-Based Calculation</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-forest-700 font-semibold hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
