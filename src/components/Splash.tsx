import React, { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface SplashProps {
  onComplete: () => void;
  darkMode: boolean;
}

export default function Splash({ onComplete, darkMode }: SplashProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation classes
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex-1 flex flex-col items-center justify-between p-8 text-center transition-all duration-1000 ${
      darkMode 
        ? "bg-gradient-to-b from-[#111827] via-[#1c2541] to-[#0f172a]" 
        : "bg-gradient-to-b from-[#eaf6f1] via-[#F8FAF8] to-[#ffffff]"
    }`}>
      {/* Top spacing */}
      <div className="w-full"></div>

      {/* Main Core branding */}
      <div className="flex flex-col items-center max-w-xs transition-all duration-1000 transform translate-y-0">
        {/* Glowing concentric meditative circles */}
        <div className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-1000 ${
          animate ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}>
          {/* Outermost ring */}
          <div className="absolute inset-0 rounded-full border-2 border-brand-mint/40 opacity-40 animate-ping" style={{ animationDuration: '6s' }}></div>
          {/* Middle ring */}
          <div className="absolute w-32 h-32 rounded-full border border-brand-emerald/30 opacity-30 animate-pulse"></div>
          {/* Center lotus badge */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-emerald to-brand-mint text-white flex items-center justify-center shadow-xl text-4xl animate-bounce" style={{ animationDuration: '3s' }}>
            🕉️
          </div>
        </div>

        <h1 className={`text-4xl font-bold mt-8 tracking-tight transition-all duration-1000 ${
          animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        } ${darkMode ? "text-white" : "text-brand-navy"}`}>
          Fit<span className="text-brand-emerald pr-1 font-semibold">Mantra</span>
        </h1>
        
        <p className={`text-xs mt-3 leading-relaxed transition-all duration-1000 delay-300 ${
          animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        } ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
          Warm, realistic wellness and stress-free daily routines designed for your busy lifestyle.
        </p>

        {/* Small badge with tagline */}
        <div className={`mt-5 inline-flex items-center gap-1 text-[11px] px-3 py-1 rounded-full border font-medium ${
          darkMode 
            ? "bg-emerald-950/40 text-[#4ade80] border-[#29423c]" 
            : "bg-emerald-50 text-brand-emerald border-emerald-100"
        } transition-all duration-1000 delay-500 ${
          animate ? "opacity-100" : "opacity-0"
        }`}>
          <Sparkles size={11} className="text-brand-orange animate-spin" style={{ animationDuration: '4s' }} />
          <span>Made for Middle-Class Balanced Lifestyles</span>
        </div>
      </div>

      {/* Interactive Bottom action button */}
      <div className={`w-full max-w-xs transition-all duration-1000 delay-700 ${
        animate ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}>
        <button
          id="splash-enter-btn"
          onClick={onComplete}
          className="w-full py-4 px-6 rounded-2xl bg-brand-emerald hover:bg-[#0c7058] active:scale-95 text-white font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-900/10 hover:shadow-xl smooth-transition group cursor-pointer"
        >
          <span>Begin Your Journey</span>
          <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
        </button>
        
        <p className="text-[10px] text-slate-400 mt-3 font-light">
          Take a deep breath. No pressure. One step at a time.
        </p>
      </div>
    </div>
  );
}
