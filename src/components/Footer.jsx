import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Leaf, Heart, ShieldCheck, Sparkles, ArrowUpRight } from 'lucide-react';
import { FOOD_WASTE_DATA } from '../data/foodWasteStats';

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-cream-100/90 pt-16 pb-12 border-t border-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-800/80">
          
          {/* Brand Identity Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-700 text-cream-100 flex items-center justify-center border border-forest-600">
                <div className="relative flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-softYellow" />
                  <Leaf className="w-3 h-3 text-sage-300 absolute -top-1 -right-1" />
                </div>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Fridge<span className="text-coral-400">2</span>Fork
              </span>
            </div>

            <p className="text-sage-200/90 text-sm leading-relaxed max-w-sm">
              An AI-powered Smart Kitchen Assistant with a Flavor-Smart Food Rescue Engine. Turn forgotten ingredients into meaningful meals and eliminate domestic food waste.
            </p>

            <div className="flex items-center space-x-2 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-forest-800 text-sage-300 border border-forest-700">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-sage-400" />
                100% Client-Side Privacy
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-forest-800 text-softYellow border border-forest-700">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-softYellow" />
                Deterministic Scoring
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-sage-300">Platform</h4>
            <ul className="space-y-2 text-sm text-sage-100/80">
              <li>
                <Link to="/scanner" className="hover:text-white transition-colors flex items-center">
                  AI Fridge Scanner
                </Link>
              </li>
              <li>
                <Link to="/pantry" className="hover:text-white transition-colors flex items-center">
                  Digital Pantry Hub
                </Link>
              </li>
              <li>
                <Link to="/rescue-engine" className="hover:text-white transition-colors flex items-center">
                  Flavor-Smart Rescue
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="hover:text-white transition-colors flex items-center">
                  Smart Recipe Matcher
                </Link>
              </li>
              <li>
                <Link to="/substitutions" className="hover:text-white transition-colors flex items-center">
                  Flavor Compound Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Sustainability & Science */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-sage-300">Impact & Research</h4>
            <ul className="space-y-2 text-sm text-sage-100/80">
              <li>
                <Link to="/impact" className="hover:text-white transition-colors flex items-center">
                  Food Waste Tracker
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.unep.org/resources/publication/food-waste-index-report-2024" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors flex items-center"
                >
                  UNEP Index 2024 <ArrowUpRight className="w-3 h-3 ml-1 text-sage-400" />
                </a>
              </li>
              <li>
                <span className="text-sage-400/80 text-xs">FlavorDB Relational Chemistry</span>
              </li>
              <li>
                <span className="text-sage-400/80 text-xs">RecipeDB Structured Graph</span>
              </li>
            </ul>
          </div>

          {/* Quick Mission Statement */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-sage-300">Kitchen Promise</h4>
            <p className="text-xs text-sage-200/80 leading-relaxed">
              We never promote artificial waste statistics or fake live numbers. Every rescue score and rupee saved is calculated transparently from ingredients you confirm cooking in real life.
            </p>
            <div className="pt-2 text-xs text-softYellow/90 font-medium">
              Turn Forgotten Ingredients into Meaningful Meals.
            </div>
          </div>
        </div>

        {/* Bottom Attribution & Source Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-sage-300/70 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-1">
            <span>Built with passion for mindful cooking & zero food waste.</span>
          </div>

          <div className="text-center md:text-right max-w-xl text-[11px] text-sage-400/75">
            {FOOD_WASTE_DATA.sourceAttribution}
          </div>
        </div>
      </div>
    </footer>
  );
}
