import React, { useState, useEffect } from "react";
import { 
  Flame, 
  Moon, 
  Sun, 
  Brain, 
  Compass, 
  TrendingUp, 
  User, 
  Activity, 
  Plus, 
  Minus, 
  Check, 
  Clock, 
  Play, 
  RotateCcw, 
  Award, 
  Smile, 
  Coffee, 
  Sparkles, 
  BookOpen, 
  Send,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import MobileFrame from "./components/MobileFrame";
import Splash from "./components/Splash";
import Onboarding from "./components/Onboarding";
import { 
  UserProfile, 
  Routine, 
  ChatMessage, 
  MoodEntry, 
  DailyLog, 
  INITIAL_PROFILE, 
  DEFAULT_ROUTINES 
} from "./types";

export default function App() {
  // Navigation & Splash State
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(false);

  // Core User Profile and Onboarding
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("fitmantra_profile");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_PROFILE; }
    }
    return INITIAL_PROFILE;
  });

  // Daily tracker log state (persisted per day)
  const [dailyLog, setDailyLog] = useState<DailyLog>(() => {
    const saved = localStorage.getItem("fitmantra_daily_log_v1");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      waterMl: 1000,
      steps: 4200,
      meditationMin: 0,
      sleepHours: 6.5,
      completedRoutineIds: []
    };
  });

  // Mood logs for the progress trend screen
  const [moodTrend, setMoodTrend] = useState<MoodEntry[]>([
    { day: "Mon", mood: "focused", score: 4 },
    { day: "Tue", mood: "tired", score: 2 },
    { day: "Wed", mood: "stressed", score: 3 },
    { day: "Thu", mood: "calm", score: 5 },
    { day: "Fri", mood: "calm", score: 4 },
    { day: "Sat", mood: "happy", score: 5 },
    { day: "Sun", mood: "calm", score: 4 } // default
  ]);

  const [currentTodayMood, setCurrentTodayMood] = useState<MoodEntry["mood"]>("calm");

  // AI Chat list
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("fitmantra_chat_v1");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "welcome",
        role: "assistant",
        content: "Namaste! I am your supportive FitMantra friend coaching you toward a calm, healthy routine. Whether you are dealing with desk fatigue, work pressure, or fitful sleep, we will take slow steps together. Feel free to use a quick shortcut option below, or tell me how your energy is feeling right now.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Active playing routine modal
  const [activePlayRoutine, setActivePlayRoutine] = useState<Routine | null>(null);
  const [routineTimer, setRoutineTimer] = useState<number>(0);
  const [routineTimerRunning, setRoutineTimerRunning] = useState(false);
  const [routineStepIndex, setRoutineStepIndex] = useState(0);

  // Streak tracker
  const [streakCount, setStreakCount] = useState(4);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("fitmantra_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("fitmantra_daily_log_v1", JSON.stringify(dailyLog));
  }, [dailyLog]);

  useEffect(() => {
    localStorage.setItem("fitmantra_chat_v1", JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Routine execution tick
  useEffect(() => {
    let interval: any = null;
    if (routineTimerRunning && routineTimer > 0) {
      interval = setInterval(() => {
        setRoutineTimer(prev => prev - 1);
      }, 1000);
    } else if (routineTimer === 0 && routineTimerRunning) {
      setRoutineTimerRunning(false);
      // Auto advance step or complete
      if (activePlayRoutine && routineStepIndex < activePlayRoutine.instructions.length - 1) {
        setRoutineStepIndex(prev => prev + 1);
        setRoutineTimer(45); // 45 seconds per next step
        setRoutineTimerRunning(true);
      } else {
        // Complete routine
        handleCompleteRoutine();
      }
    }
    return () => clearInterval(interval);
  }, [routineTimer, routineTimerRunning]);

  // Quick Action triggers
  const handleCompleteRoutine = () => {
    if (!activePlayRoutine) return;
    const isAlreadyCompleted = dailyLog.completedRoutineIds.includes(activePlayRoutine.id);
    
    if (!isAlreadyCompleted) {
      setDailyLog(prev => ({
        ...prev,
        completedRoutineIds: [...prev.completedRoutineIds, activePlayRoutine.id],
        meditationMin: prev.meditationMin + activePlayRoutine.durationMin
      }));
      setStreakCount(prev => prev + 1);
    }
    
    // Smooth transition
    alert(`💐 Hearty wellness update! You completed "${activePlayRoutine.title}". Keep up the beautiful small steps!`);
    setActivePlayRoutine(null);
    setRoutineTimerRunning(false);
  };

  const startPlayingRoutine = (routine: Routine) => {
    setActivePlayRoutine(routine);
    setRoutineStepIndex(0);
    setRoutineTimer(45); // 45s per instructional step focus
    setRoutineTimerRunning(true);
  };

  const triggerResetAllProgress = () => {
    if (confirm("Would you like to reset your daily wellness counters and start fresh? Your age/goals profile remains intact.")) {
      setDailyLog({
        waterMl: 1000,
        steps: 3500,
        meditationMin: 0,
        sleepHours: 7,
        completedRoutineIds: []
      });
      setStreakCount(1);
      alert("Daily logs restored to morning baseline!");
    }
  };

  // Chat message submit to Express Backend Proxy targeting real server-side Gemini AI
  const handleChatSubmit = async (textToSend?: string) => {
    const rawContent = textToSend || chatInput;
    if (!rawContent.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: rawContent.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Local server failed to respond.");
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text || "Let's focus on a mindful breathing cycle. Deep breath in, look after yourself.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      // Friendly intuitive offline mode reply
      const assistantMsgOffline: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I'm fully here with you. Deep breath inside our quiet room. Let's practice simple abdominal balloon breathing or stand up for a relaxing shoulder joint twist. Which supportive step do you want to explore with me today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, assistantMsgOffline]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Helper score computation for emotional reward feedback loop
  const totalCompletedRoutines = dailyLog.completedRoutineIds.length;
  const rawWellnessProgress = Math.min(
    100,
    Math.round(
      (dailyLog.steps / 8000) * 35 +
      (dailyLog.waterMl / 3000) * 25 +
      (dailyLog.sleepHours / 8) * 20 +
      (totalCompletedRoutines > 0 ? 20 : 0)
    )
  );

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Handle splash completion
  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} darkMode={darkMode} />;
  }

  // Handle onboarding trigger
  if (!profile.onboardingCompleted) {
    return (
      <Onboarding 
        onComplete={(newProfile) => {
          setProfile(newProfile);
        }} 
        darkMode={darkMode} 
      />
    );
  }

  return (
    <MobileFrame
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onboardingCompleted={profile.onboardingCompleted}
    >
      {/* 1. Dashboard Tab */}
      {activeTab === "home" && (
        <div id="dashboard-screen" className="p-4 space-y-4 animate-fadeIn">
          {/* Greeting Hero */}
          <div className="flex justify-between items-center mt-1">
            <div>
              <p className={`text-xs ${darkMode ? "text-[#a0afc8]" : "text-emerald-800/80"} font-medium`}>
                Namaste, {profile.name} 🙏
              </p>
              <h2 className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-800"}`}>
                Your Balanced Self
              </h2>
            </div>
            
            {/* Meditative Circle Level Badge */}
            <div className={`p-2 rounded-xl flex items-center gap-1.5 border ${
              darkMode ? "bg-emerald-950/30 border-emerald-900 text-[#4ade80]" : "bg-[#eaf9f1] border-emerald-100 text-[#0c6a53]"
            }`}>
              <Flame size={15} className="text-brand-orange animate-bounce" />
              <span className="text-xs font-bold">{streakCount} Day Streak</span>
            </div>
          </div>

          {/* Supportive Mindful Friend message segment */}
          <div className={`p-4 rounded-2xl relative overflow-hidden shadow-sm border ${
            darkMode ? "bg-gradient-to-r from-[#1c2e4f] to-[#121c33] border-[#29426f]" : "bg-gradient-to-r from-emerald-50 to-white border-emerald-100/50"
          }`}>
            <span className="absolute -right-3 -bottom-3 text-7xl select-none opacity-10">🧘</span>
            <div className="flex gap-3">
              <span className="text-xl">🍵</span>
              <div className="space-y-1">
                <span className={`text-[10px] uppercase tracking-wider font-bold block ${
                  darkMode ? "text-emerald-400" : "text-brand-emerald"
                }`}>
                  Coach Affirmation
                </span>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                  &ldquo;A healthy life is not a race. Busy professional schedules are demanding, and you're already doing brilliantly by standing tall. Take a single gentle sip of water.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Radial Calming Health Progress Meter - Apple Health style but simplified */}
          <div className={`p-5 rounded-3xl text-center flex flex-col items-center justify-center border shadow-sm ${
            darkMode ? "bg-[#18203c]/90 border-[#263155]" : "bg-white border-emerald-100/40"
          }`}>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">TODAY'S HARMONY SCORE</span>
            
            <div className="relative w-36 h-36 flex items-center justify-center my-3">
              {/* SVG circular track */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="58"
                  className="stroke-current"
                  style={{ color: darkMode ? '#263458' : '#ECFDF5' }}
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="58"
                  className="stroke-current transition-all duration-1000 ease-out"
                  style={{ color: '#0F8B6D' }}
                  strokeWidth="10"
                  strokeDasharray={364}
                  strokeDashoffset={364 - (364 * rawWellnessProgress) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              {/* Internal metrics */}
              <div className="flex flex-col items-center select-none">
                <span className={`text-3xl font-extrabold ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {rawWellnessProgress}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Gentle Power</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 max-w-xs">
              Every small stride matters. Walk after meals, hydrate, and stretch at your desk to boost this baseline score!
            </p>
          </div>

          {/* Quick Counter Trackers - Interactive but calming */}
          <div className="grid grid-cols-2 gap-3">
            {/* Water Tracker */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              darkMode ? "bg-[#1d2746] border-[#2c3c6d]" : "bg-white border-emerald-50 shadow-sm"
            }`}>
              <div className="flex justify-between items-start">
                <span className="text-xl">💧</span>
                <span className="text-[9px] bg-[#e3faf2]/80 text-[#085a46] px-2 py-0.5 rounded-full font-bold">WATER</span>
              </div>
              <div className="mt-3">
                <span className="text-sm text-slate-400 block font-normal">Hydrated</span>
                <span className={`text-xl font-bold ${darkMode ? "text-white" : "text-brand-navy"}`}>
                  {dailyLog.waterMl} ml
                </span>
                <span className="text-[10px] text-slate-400 block">Target: 3,000ml</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  id="water-dec-btn"
                  onClick={() => setDailyLog(prev => ({ ...prev, waterMl: Math.max(0, prev.waterMl - 250) }))}
                  className={`p-1.5 rounded-xl border flex-1 flex justify-center items-center hover:bg-slate-100 ${
                    darkMode ? "border-[#324578] hover:bg-[#28365f]" : "border-slate-100"
                  }`}
                >
                  <Minus size={14} />
                </button>
                <button
                  id="water-inc-btn"
                  onClick={() => setDailyLog(prev => ({ ...prev, waterMl: prev.waterMl + 250 }))}
                  className="p-1.5 rounded-xl bg-brand-emerald text-white font-bold flex-1 flex justify-center items-center hover:bg-[#0c7058]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Step Milestones */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              darkMode ? "bg-[#1d2746] border-[#2c3c6d]" : "bg-white border-emerald-50 shadow-sm"
            }`}>
              <div className="flex justify-between items-start">
                <span className="text-xl">🏃‍♂️</span>
                <span className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold">WALKS</span>
              </div>
              <div className="mt-3">
                <span className="text-sm text-slate-400 block font-normal">Active Steps</span>
                <span className={`text-xl font-bold ${darkMode ? "text-white" : "text-brand-navy"}`}>
                  {dailyLog.steps.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block">Target: 8,000</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  id="steps-dec-btn"
                  onClick={() => setDailyLog(prev => ({ ...prev, steps: Math.max(0, prev.steps - 500) }))}
                  className={`p-1.5 rounded-xl border flex-1 flex justify-center items-center hover:bg-slate-100 ${
                    darkMode ? "border-[#324578] hover:bg-[#28365f]" : "border-slate-100"
                  }`}
                >
                  <Minus size={14} />
                </button>
                <button
                  id="steps-inc-btn"
                  onClick={() => setDailyLog(prev => ({ ...prev, steps: prev.steps + 500 }))}
                  className="p-1.5 rounded-xl bg-brand-emerald text-white font-bold flex-1 flex justify-center items-center hover:bg-[#0c7058]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Active Habit Routines to Launch */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold">Suggested Daily Resets</span>
              <button 
                id="view-all-resets"
                onClick={() => setActiveTab("routines")} 
                className="text-xs text-brand-emerald hover:underline font-medium"
              >
                View all ({DEFAULT_ROUTINES.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {DEFAULT_ROUTINES.slice(0, 2).map((routine) => {
                const isCompleted = dailyLog.completedRoutineIds.includes(routine.id);
                return (
                  <div
                    key={routine.id}
                    id={`routine-suggest-${routine.id}`}
                    className={`p-3.5 rounded-2xl border flex justify-between items-center transition-all ${
                      isCompleted 
                        ? darkMode ? "bg-[#18233f] border-emerald-900 opacity-80" : "bg-emerald-50/50 border-emerald-100 opacity-85"
                        : darkMode ? "bg-[#1d2746] border-[#2d3a60]" : "bg-white border-emerald-100/30"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center text-lg shadow-inner">
                        {routine.id.includes('breathing') ? '🌬️' : '🛋️'}
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                          {routine.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                          <span className="flex items-center gap-0.5">
                            <Clock size={10} /> {routine.durationMin} mins
                          </span>
                          <span>•</span>
                          <span className="text-brand-orange font-semibold">{routine.energyGain} Gain</span>
                        </div>
                      </div>
                    </div>

                    <button
                      id={`start-routine-btn-${routine.id}`}
                      onClick={() => startPlayingRoutine(routine)}
                      className={`p-2 rounded-xl transition-colors ${
                        isCompleted
                          ? "bg-brand-mint text-brand-emerald"
                          : "bg-brand-emerald text-white hover:bg-[#096a53]"
                      }`}
                    >
                      {isCompleted ? <Check size={14} /> : <Play size={14} fill="currentColor" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick mood checking tracker */}
          <div className="p-4 rounded-2xl border bg-[#fbfdfc] dark:bg-[#1a223e] dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">How are you feeling this hour?</h4>
            <div className="grid grid-cols-5 gap-1.5 mt-3">
              {[
                { mood: "calm", label: "Calm", emoji: "😌" },
                { mood: "focused", label: "Focused", emoji: "🧐" },
                { mood: "happy", label: "Happy", emoji: "😊" },
                { mood: "tired", label: "Tired", emoji: "🥱" },
                { mood: "stressed", label: "Stressed", emoji: "😰" }
              ].map((item) => {
                const isSelected = currentTodayMood === item.mood;
                return (
                  <button
                    key={item.mood}
                    id={`mood-today-${item.mood}`}
                    onClick={() => {
                      setCurrentTodayMood(item.mood as any);
                      alert(`Mood marked! Thank you for pausing to check in with your heart.`);
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      isSelected 
                        ? "border-brand-emerald bg-[#eaf9f1] text-brand-emerald font-semibold dark:bg-emerald-950/40" 
                        : "border-transparent bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-[9px] tracking-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clean metadata signature and reset option */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2">
            <span>Powered by FitMantra Assistant Offline-first</span>
            <button 
              id="reset-state-btn"
              onClick={triggerResetAllProgress}
              className="text-brand-orange hover:underline"
            >
              Reset Daily Counters
            </button>
          </div>
        </div>
      )}

      {/* 2. Daily Routines Tab */}
      {activeTab === "routines" && (
        <div id="routines-screen" className="p-4 space-y-4 animate-fadeIn">
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-800"}`}>
              Mindful routines
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any supportive low-pressure session. Feel healthier inside 5 minutes.
            </p>
          </div>

          {/* Informational helpful tip */}
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-900 text-xs border border-amber-100 flex gap-2.5 items-start">
            <span className="text-base">🛋️</span>
            <p className="leading-snug">
              <strong>Keep it simple:</strong> You don't have to overhaul your busy schedule. Even sipping cardamom chai mindfully counts toward a balanced, healthy mind!
            </p>
          </div>

          {/* List of default custom-curated routines */}
          <div className="space-y-3">
            {DEFAULT_ROUTINES.map((routine) => {
              const isCompleted = dailyLog.completedRoutineIds.includes(routine.id);
              return (
                <div
                  key={routine.id}
                  id={`routine-card-${routine.id}`}
                  className={`p-4 rounded-3xl border flex flex-col justify-between transition-all ${
                    isCompleted 
                      ? "border-emerald-600 bg-brand-emerald/5 opacity-90" 
                      : darkMode ? "bg-[#18213b] border-[#2a375a]" : "bg-white border-emerald-100/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                      routine.category === "breathing" 
                        ? "bg-sky-50 text-sky-800"
                        : routine.category === "stretching"
                        ? "bg-[#CFFFE2] text-[#0c6c51]"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {routine.category}
                    </span>
                    {isCompleted && (
                      <span className="text-xs bg-brand-emerald text-white px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Check size={11} /> Done Today
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <h3 className={`text-sm font-extrabold ${darkMode ? "text-white" : "text-slate-800"}`}>
                      {routine.title}
                    </h3>
                    <p className={`text-xs mt-1 leading-snug line-clamp-2 ${darkMode ? "text-slate-350" : "text-slate-500"}`}>
                      {routine.description}
                    </p>
                  </div>

                  {/* Highlights section */}
                  <div className="flex items-center gap-3 mt-3.5 pb-3 border-b border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
                    <span className="flex items-center gap-0.5">
                      ⏱️ {routine.durationMin} mins
                    </span>
                    <span>•</span>
                    <span>🌿 {routine.difficulty}</span>
                    <span>•</span>
                    <span className="text-brand-emerald font-bold">⚡ {routine.energyGain}</span>
                  </div>

                  {/* Play CTA trigger */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-slate-400 font-light italic">
                      Zero high-intensity stress
                    </span>
                    <button
                      id={`start-btn-${routine.id}`}
                      onClick={() => startPlayingRoutine(routine)}
                      className="py-2 px-4 rounded-xl bg-brand-emerald hover:bg-[#0c7058] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play size={12} fill="currentColor" />
                      <span>Start Exercise</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. AI Coach Tab */}
      {activeTab === "coach" && (
        <div id="coach-screen" className="flex-1 flex flex-col justify-between h-full bg-[#FAFCFA] dark:bg-[#131b31]">
          {/* Top disclaimer panel */}
          <div className="p-3 bg-[#e8f6ee]/80 dark:bg-emerald-950/20 text-[10px] text-[#0f6f58] dark:text-emerald-300 border-b border-emerald-100 flex gap-2 items-center">
            <span className="text-xs">🧘‍♂️</span>
            <div className="flex-1 leading-snug">
              Shanti AI is fully trained on stress-relief, home Ayurveda tea ideas, safe neck flexibility, sleep preparation.
            </div>
          </div>

          {/* Message List area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[480px]">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand-emerald text-white rounded-tr-none"
                    : darkMode 
                    ? "bg-[#1f2845] text-slate-100 rounded-tl-none border border-slate-800" 
                    : "bg-white text-slate-800 rounded-tl-none border border-emerald-50 shadow-sm"
                }`}>
                  {msg.content}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 select-none">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <span className="animate-spin text-brand-emerald">🌀</span>
                <span>Shanti Assistant is finding realistic recommendations...</span>
              </div>
            )}
          </div>

          {/* Fast recommendation shortcuts */}
          <div className="p-3 border-t bg-slate-50 dark:bg-[#19223c] border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">💡 Tap a stress-free question</p>
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
              <button
                id="shortcut-stress-desk"
                onClick={() => handleChatSubmit("My neck and back are extremely stiff from office desk work.")}
                className="py-1 px-3 bg-white dark:bg-slate-800 border dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-[10.5px] hover:border-brand-emerald whitespace-nowrap"
              >
                🖥️ Neck & shoulder stiffness
              </button>
              <button
                id="shortcut-sweet-tea"
                onClick={() => handleChatSubmit("Recommend an easy Indian home tea brew for stress and digest.")}
                className="py-1 px-3 bg-white dark:bg-slate-800 border dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-[10.5px] hover:border-brand-emerald whitespace-nowrap"
              >
                🍵 Cardamom herbal tea idea
              </button>
              <button
                id="shortcut-belly-fat"
                onClick={() => handleChatSubmit("Explain how to reduce persistent belly fat without extreme starving or diet scales.")}
                className="py-1 px-3 bg-white dark:bg-slate-800 border dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-[10.5px] hover:border-brand-emerald whitespace-nowrap"
              >
                🥗 Belly fat gentle tips
              </button>
              <button
                id="shortcut-stress-sleep"
                onClick={() => handleChatSubmit("I cannot fall asleep easily. My mind is overthinking work tasks.")}
                className="py-1 px-3 bg-white dark:bg-slate-800 border dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-[10.5px] hover:border-brand-emerald whitespace-nowrap"
              >
                🌙 Restless tonight
              </button>
            </div>

            {/* Input submission box */}
            <div className="flex gap-2 mt-2">
              <input
                id="chat-input-bar"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder="Ask Shanti Coach about routines or herbal choices..."
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-brand-emerald ${
                  darkMode 
                    ? "bg-[#252f4c] border-[#37446d] text-white" 
                    : "bg-white border-slate-200 text-slate-800"
                }`}
              />
              <button
                id="chat-send-btn"
                onClick={() => handleChatSubmit()}
                className="p-2.5 bg-brand-emerald text-white rounded-xl hover:bg-[#0c7058]"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Progress Screen */}
      {activeTab === "progress" && (
        <div id="progress-screen" className="p-4 space-y-4 animate-fadeIn">
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-800"}`}>
              Your Progress Journey
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Celebrating consistency and restorative moments, never intense targets.
            </p>
          </div>

          {/* Gamified dynamic progress ring highlights */}
          <div className={`p-4 rounded-3xl border ${
            darkMode ? "bg-[#18213b] border-slate-800" : "bg-white border-emerald-50 shadow-sm"
          }`}>
            <span className="text-[10px] uppercase font-bold text-slate-400">DAILY SUMMARY</span>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Total Exercises Done</span>
                <span className="text-2xl font-bold text-brand-emerald">{dailyLog.completedRoutineIds.length}</span>
                <span className="text-[9px] text-slate-500 block">Restorative minutes: {dailyLog.meditationMin} min</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Consistency Score</span>
                <span className="text-2xl font-bold text-amber-500">Excellent</span>
                <span className="text-[9px] text-slate-500 block">{streakCount} Days active</span>
              </div>
            </div>
          </div>

          {/* Chart representation of sleep quality (Custom styled bar charts in safe markup) */}
          <div className={`p-4 rounded-3xl border ${
            darkMode ? "bg-[#18213b] border-slate-800" : "bg-white border-emerald-50 shadow-sm"
          }`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Weekly Calm Levels</span>
              <span className="text-[10px] text-brand-emerald font-semibold">Self-Tracked</span>
            </div>

            {/* Custom Interactive Weekly Score Graph to show beauty without complex Recharts bundle issues */}
            <div className="h-32 flex items-end justify-between px-2 pt-4">
              {moodTrend.map((t, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  {/* Floating tooltip */}
                  <span className="text-[8px] bg-emerald-50 dark:bg-emerald-950 font-bold px-1 rounded text-brand-emerald mb-1 block">
                    {t.score === 5 ? '😌' : t.score === 4 ? '😊' : t.score === 3 ? '😐' : '🥱'}
                  </span>
                  {/* Rounded chart bar */}
                  <div 
                    className="w-4 rounded-t-full transition-all duration-1000 bg-gradient-to-t from-brand-emerald to-brand-mint" 
                    style={{ height: `${t.score * 18}px` }}
                  ></div>
                  <span className="text-[10px] mt-2 font-medium text-slate-400">{t.day}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-2 bg-[#eafbf2] dark:bg-emerald-950/20 text-[#0c6b52] dark:text-emerald-300 text-[10px] rounded-xl text-center">
              🌿 Calm index improved by <strong>15% over Tuesday's level</strong> following neck-stretching.
            </div>
          </div>

          {/* Milestone Awards celebrating gentle small habits */}
          <div className="space-y-2">
            <span className="text-xs font-bold block">Small Win Badges Completed</span>
            
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3.5 rounded-2xl border flex gap-3 items-center ${
                dailyLog.waterMl >= 2000 ? "border-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20" : "opacity-45"
              }`}>
                <span className="text-2xl">🐳</span>
                <div>
                  <span className="text-xs font-bold block">Hydrator Award</span>
                  <span className="text-[9px] text-slate-400">2L+ clean water logged</span>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border flex gap-3 items-center ${
                dailyLog.steps >= 5000 ? "border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20" : "opacity-45"
              }`}>
                <span className="text-2xl">👣</span>
                <div>
                  <span className="text-xs font-bold block">Striders Milestone</span>
                  <span className="text-[9px] text-slate-400">5,000+ daily steps hit</span>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border flex gap-3 items-center ${
                dailyLog.completedRoutineIds.length >= 1 ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20" : "opacity-45"
              }`}>
                <span className="text-2xl">🕉️</span>
                <div>
                  <span className="text-xs font-bold block">Shanti Seeker</span>
                  <span className="text-[9px] text-slate-400">1 routine done today</span>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border flex gap-3 items-center ${
                streakCount >= 3 ? "border-orange-500/30 bg-orange-50/50 dark:bg-orange-950/20" : "opacity-45"
              }`}>
                <span className="text-2xl">🕯️</span>
                <div>
                  <span className="text-xs font-bold block">Streak Champion</span>
                  <span className="text-[9px] text-slate-400">3 Days stable streaks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Profile Tab */}
      {activeTab === "profile" && (
        <div id="profile-screen" className="p-4 space-y-4 animate-fadeIn">
          {/* User Bio banner and customization details */}
          <div className={`p-5 rounded-3xl border text-center relative ${
            darkMode ? "bg-[#18213b] border-slate-800" : "bg-white border-emerald-100/50 shadow-sm"
          }`}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-emerald to-brand-mint text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
              {profile.name.charAt(0)}
            </div>
            <h3 className="text-lg font-extrabold mt-3">{profile.name}</h3>
            <span className="text-xs text-slate-400 block mt-0.5">Active Wellness Cohort</span>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
              <div className="p-1">
                <span className="text-[10px] text-slate-400 block">Biological Age</span>
                <span className="text-xs font-bold text-brand-emerald">{profile.age} yrs</span>
              </div>
              <div className="p-1">
                <span className="text-[10px] text-slate-400 block">Daily Stress</span>
                <span className="text-xs font-bold text-[#FF9F1C]">{profile.stressLevel}</span>
              </div>
              <div className="p-1">
                <span className="text-[10px] text-slate-400 block">Sleep Quality</span>
                <span className="text-xs font-bold text-blue-500">{profile.sleepQuality}</span>
              </div>
            </div>
          </div>

          {/* Goals Checklist Card */}
          <div className="p-4 rounded-2xl border dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">My Target Concerns</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.goals.map((goal, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-brand-mint/50 dark:bg-brand-emerald/10 text-[#0c6a51] dark:text-[#4ade80] rounded-full text-xs font-medium"
                >
                  🥗 {goal}
                </span>
              ))}
            </div>
          </div>

          {/* Quick preference sliders or toggles inside profile */}
          <div className="p-4 rounded-2xl border dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Preferences</span>
            
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold block">App Dark Aesthetic</span>
                <span className="text-[10px] text-slate-400">Easier on sensitive eyes at late nights</span>
              </div>
              <input
                id="pref-dark-toggle"
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="accent-brand-emerald w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center text-xs pt-3 border-t dark:border-slate-800">
              <div>
                <span className="font-bold block">Supportive Chimes</span>
                <span className="text-[10px] text-slate-400">Gentle sound notifications (under 45s)</span>
              </div>
              <input
                id="pref-sound-toggle"
                type="checkbox"
                defaultChecked={true}
                className="accent-brand-emerald w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center text-xs pt-3 border-t dark:border-slate-800">
              <div>
                <span className="font-bold block">Hydration Reminders</span>
                <span className="text-[10px] text-slate-400">Hourly soft prompt for room-temp water</span>
              </div>
              <input
                id="pref-hydrate-toggle"
                type="checkbox"
                defaultChecked={true}
                className="accent-brand-emerald w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          {/* Custom Re-Onboard triggers to change name/goals */}
          <button
            id="re-onboard-btn"
            onClick={() => {
              if (confirm("Reset current onboarding choices and customize your goals again? Your activity log stays clean.")) {
                setProfile(prev => ({ ...prev, onboardingCompleted: false }));
              }
            }}
            className="w-full py-3 border border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-emerald hover:text-brand-emerald rounded-2xl text-xs font-semibold text-slate-500 text-center transition-colors shadow-sm"
          >
            🔄 Edit Onboarding Goals & Health Values
          </button>
        </div>
      )}

      {/* Routine Active Playing modal backdrop overlay */}
      {activePlayRoutine && (
        <div className="absolute inset-0 bg-[#0c1325]/95 backdrop-blur-md z-50 p-6 flex flex-col justify-between text-white animate-fadeIn">
          {/* Top segment control */}
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-bold tracking-wider text-brand-mint">
              🕉️ {activePlayRoutine.category} reset in action
            </span>
            <button
              id="close-player-btn"
              onClick={() => {
                if (confirm("Are you sure you want to stop this calming routine early?")) {
                  setActivePlayRoutine(null);
                  setRoutineTimerRunning(false);
                }
              }}
              className="text-white hover:text-red-400 text-xs py-1 px-3.5 bg-slate-800/80 rounded-xl"
            >
              Exit Early
            </button>
          </div>

          {/* Middle step instructions */}
          <div className="text-center space-y-6 max-w-sm mx-auto">
            <div className="relative w-36 h-36 mx-auto rounded-full bg-emerald-950/40 flex items-center justify-center border border-brand-emerald">
              {/* Glowing breathing center icon */}
              <div className="w-16 h-16 rounded-full bg-brand-emerald flex items-center justify-center text-3xl animate-pulse" style={{ animationDuration: '4s' }}>
                {activePlayRoutine.title.includes('Stretch') ? '🛋️' : '🌬️'}
              </div>
              {/* Outer rhythmic ripple breathing indicator */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-brand-mint/20 animate-spin" style={{ animationDuration: '40s' }}></div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-[#4ade80] uppercase tracking-wider font-bold">
                Step {routineStepIndex + 1} of {activePlayRoutine.instructions.length}
              </span>
              <h3 className="text-lg font-bold">{activePlayRoutine.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed min-h-[90px]">
                {activePlayRoutine.instructions[routineStepIndex]}
              </p>
            </div>

            {/* Step advancement details */}
            <div className="flex justify-between items-center pt-2 max-w-xs mx-auto">
              {routineStepIndex > 0 ? (
                <button
                  id="routine-prev-step-btn"
                  onClick={() => {
                    setRoutineStepIndex(prev => prev - 1);
                    setRoutineTimer(45);
                  }}
                  className="py-1.5 px-3 bg-slate-850 hover:bg-slate-800 text-xs rounded-lg flex items-center gap-1"
                >
                  <ChevronLeft size={14} /> Back
                </button>
              ) : (
                <div />
              )}

              <div className="text-xl font-mono text-brand-orange">
                ⏱️ {formatTime(routineTimer)}
              </div>

              {routineStepIndex < activePlayRoutine.instructions.length - 1 ? (
                <button
                  id="routine-next-step-btn"
                  onClick={() => {
                    setRoutineStepIndex(prev => prev + 1);
                    setRoutineTimer(45);
                  }}
                  className="py-1.5 px-3 bg-brand-emerald hover:bg-[#0c7058] text-xs rounded-lg flex items-center gap-1 font-bold"
                >
                  Next <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  id="routine-complete-early-btn"
                  onClick={handleCompleteRoutine}
                  className="py-2 px-4 bg-brand-orange text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-500"
                >
                  Finish Routine 🎉
                </button>
              )}
            </div>
          </div>

          {/* Meditative footer advice */}
          <div className="text-center text-[10px] text-slate-400 italic">
            Focus heavily on biological expansion, relax your spine, and lower body weights.
          </div>
        </div>
      )}
    </MobileFrame>
  );
}
