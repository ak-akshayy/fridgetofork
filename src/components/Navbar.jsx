import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  ScanLine, 
  UtensilsCrossed, 
  Layers, 
  BarChart3, 
  AlertCircle, 
  Menu, 
  X, 
  Leaf, 
  ArrowRight,
  Flame,
  Shuffle,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { pantry } = useApp();

  const useSoonCount = pantry.filter((p) => p.useSoon && p.status !== 'Out of Stock').length;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Layers },
    { name: 'AI Scanner', path: '/scanner', icon: ScanLine, highlight: true },
    { name: 'Pantry', path: '/pantry', icon: UtensilsCrossed, badge: useSoonCount > 0 ? useSoonCount : null },
    { name: 'Rescue Engine', path: '/rescue-engine', icon: Flame },
    { name: 'Recipes', path: '/recipes', icon: Sparkles },
    { name: 'Substitutions', path: '/substitutions', icon: Shuffle },
    { name: 'Food Impact', path: '/impact', icon: BarChart3 },
  ];

  const isLanding = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-md border-b border-cream-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Leaf / Fork motif */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-forest-700 text-cream-100 flex items-center justify-center shadow-soft group-hover:bg-forest-800 transition-all duration-300">
              <div className="relative flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-softYellow transition-transform group-hover:rotate-12 duration-300" />
                <Leaf className="w-3.5 h-3.5 text-sage-300 absolute -top-1 -right-1.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-forest-800">Fridge<span className="text-coral-500">2</span>Fork</span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-sage-200 text-forest-800 px-1.5 py-0.5 rounded-md">
                  AI Beta
                </span>
              </div>
              <p className="text-[10px] text-textMuted tracking-tight -mt-0.5 hidden sm:block">Smart Food Rescue Engine</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-forest-700 text-white shadow-soft'
                      : 'text-textDark hover:bg-cream-200/70 hover:text-forest-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-softYellow' : 'text-forest-700/70'}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-coral-500 text-white animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            {useSoonCount > 0 && (
              <Link
                to="/pantry"
                className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 bg-coral-50 border border-coral-200 rounded-xl text-xs font-semibold text-coral-700 hover:bg-coral-100 transition-colors"
                title="Ingredients requiring rapid use"
              >
                <AlertCircle className="w-3.5 h-3.5 text-coral-500" />
                <span>{useSoonCount} expiring soon</span>
              </Link>
            )}

            <Link
              to="/scanner"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-forest-700 text-white hover:bg-forest-800 shadow-soft transition-all duration-200 hover:-translate-y-0.5"
            >
              <ScanLine className="w-4 h-4 text-softYellow" />
              <span>Scan Fridge</span>
            </Link>

            <Link
              to="/profile"
              className="w-10 h-10 rounded-xl border border-cream-200 bg-white flex items-center justify-center text-forest-700 hover:border-forest-600 transition-colors"
              title="User Profile & Settings"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              to="/scanner"
              className="p-2 rounded-xl bg-forest-700 text-white"
            >
              <ScanLine className="w-5 h-5 text-softYellow" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-textDark hover:bg-cream-200 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream-50 border-b border-cream-200 px-4 pt-3 pb-6 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-forest-700 text-white'
                    : 'text-textDark hover:bg-cream-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-softYellow' : 'text-forest-700'}`} />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-coral-500 text-white">
                    {link.badge} soon
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-cream-200 mt-2 flex flex-col space-y-2">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold text-textDark hover:bg-cream-200"
            >
              <User className="w-4 h-4 text-forest-700" />
              <span>Kitchen Preferences & Settings</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
