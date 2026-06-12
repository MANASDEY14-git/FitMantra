import React from "react";
import { Layout, Smartphone, Moon, Sun, ShieldCheck } from "lucide-react";

interface MobileFrameProps {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onboardingCompleted: boolean;
}

export default function MobileFrame({
  children,
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
  onboardingCompleted
}: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-[#F0F4F2] flex flex-col items-center justify-center p-0 md:p-6 transition-colors duration-500">
      {/* Desktop Helper Info Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col mb-4 max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          🍏 FitMantra <span className="text-xs bg-brand-mint text-brand-emerald px-2 py-0.5 rounded-full font-medium">Wellness Platform</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Designed for Indian professionals with stress, poor sleep & busy desks.
        </p>
      </div>

      {/* Main Chassis Device Wrapper */}
      <div 
        id="fitmantra-mobile-mock"
        className={`w-full max-w-md h-screen md:h-[820px] md:rounded-3xl md:shadow-2xl overflow-hidden flex flex-col border-0 md:border-8 ${
          darkMode ? "bg-brand-navy border-[#2d3a5e] text-white" : "bg-brand-offwhite border-white text-slate-900"
        } relative transition-all duration-300`}
      >
        {/* Top Simulated Speaker/Camera Notch (Only on Desktop mockup) */}
        <div className="hidden md:flex justify-between items-center px-6 py-2.5 bg-opacity-40 backdrop-blur-md text-[11px] font-medium z-40 select-none">
          <span className="opacity-80">FitMantra App</span>
          <div className="w-16 h-4 bg-slate-800 bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
            <span className="w-1.5 h-1.5 bg-black rounded-full opacity-60"></span>
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              id="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              className="p-1 rounded-full hover:bg-slate-300 hover:bg-opacity-20 transition-colors"
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? (
                <Sun size={12} className="text-brand-orange animate-pulse" />
              ) : (
                <Moon size={12} className="text-slate-600" />
              )}
            </button>
            <span className="opacity-85">9:41 AM</span>
          </div>
        </div>

        {/* Mobile Header (For screens that aren't fullscreen splash or onboarding) */}
        {onboardingCompleted && (
          <header className={`px-5 py-3 border-b flex justify-between items-center z-30 ${
            darkMode ? "border-[#2b395b] bg-[#1a233d]" : "border-emerald-100/50 bg-white"
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-emerald to-brand-mint flex items-center justify-center text-white font-bold text-sm shadow-md">
                🕉️
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-normal leading-none">FitMantra</span>
                <span className="text-sm font-bold tracking-tight">
                  {activeTab === "home" && "Daily Calm"}
                  {activeTab === "routines" && "My Routines"}
                  {activeTab === "coach" && "AI Shanti Coach"}
                  {activeTab === "progress" && "My Achievements"}
                  {activeTab === "profile" && "My Profile"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Dark mode button for small screens directly inside the header */}
              <button
                id="header-theme-toggle"
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1.5 rounded-xl block md:hidden hover:bg-opacity-20 ${
                  darkMode ? "text-brand-orange hover:bg-slate-700" : "text-brand-emerald hover:bg-slate-100"
                }`}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              
              <div className={`text-[10px] px-2 py-1 rounded-full flex items-center gap-1 ${
                darkMode ? "bg-emerald-950/40 text-[#4ade80]" : "bg-[#CFFFE2] text-brand-emerald"
              }`}>
                <ShieldCheck size={10} />
                <span>Habit Mode</span>
              </div>
            </div>
          </header>
        )}

        {/* Scrolling Inner Content Frame */}
        <main className="flex-1 overflow-y-auto relative flex flex-col">
          {children}
        </main>

        {/* Bottom Tab Navigation Bar (Triggered if onboarding complete) */}
        {onboardingCompleted && (
          <nav className={`py-2 px-3 border-t flex justify-around items-center z-40 ${
            darkMode ? "bg-[#161d36] border-[#293656] text-slate-300" : "bg-white border-emerald-100/50 text-slate-600"
          }`}>
            <button
              id="nav-tab-home"
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all duration-300 ${
                activeTab === "home" 
                  ? darkMode ? "text-brand-mint bg-[#1e2947]" : "text-brand-emerald bg-[#eafbf2] font-semibold"
                  : "hover:scale-105"
              }`}
            >
              <span className="text-lg">🏕️</span>
              <span className="text-[10px] mt-0.5">Calm</span>
            </button>

            <button
              id="nav-tab-routines"
              onClick={() => setActiveTab("routines")}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all duration-300 ${
                activeTab === "routines"
                  ? darkMode ? "text-brand-mint bg-[#1e2947]" : "text-brand-emerald bg-[#eafbf2] font-semibold"
                  : "hover:scale-105"
              }`}
            >
              <span className="text-lg">⚡</span>
              <span className="text-[10px] mt-0.5">Routines</span>
            </button>

            <button
              id="nav-tab-coach"
              onClick={() => setActiveTab("coach")}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all duration-300 relative ${
                activeTab === "coach"
                  ? darkMode ? "text-brand-mint bg-[#1e2947]" : "text-brand-emerald bg-[#eafbf2] font-semibold"
                  : "hover:scale-105"
              }`}
            >
              <span className="text-lg">🧘‍♂️</span>
              <span className="text-[10px] mt-0.5">AI Coach</span>
              <span className="absolute top-0 right-2 w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping"></span>
            </button>

            <button
              id="nav-tab-progress"
              onClick={() => setActiveTab("progress")}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all duration-300 ${
                activeTab === "progress"
                  ? darkMode ? "text-brand-mint bg-[#1e2947]" : "text-brand-emerald bg-[#eafbf2] font-semibold"
                  : "hover:scale-105"
              }`}
            >
              <span className="text-lg">📈</span>
              <span className="text-[10px] mt-0.5">Progress</span>
            </button>

            <button
              id="nav-tab-profile"
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all duration-300 ${
                activeTab === "profile"
                  ? darkMode ? "text-brand-mint bg-[#1e2947]" : "text-brand-emerald bg-[#eafbf2] font-semibold"
                  : "hover:scale-105"
              }`}
            >
              <span className="text-lg">👤</span>
              <span className="text-[10px] mt-0.5">Profile</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
