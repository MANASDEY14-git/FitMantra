import React, { useState } from "react";
import { UserProfile } from "../types";
import { ArrowRight, ArrowLeft, Heart, Sparkles, Smile } from "lucide-react";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  darkMode: boolean;
}

export default function Onboarding({ onComplete, darkMode }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Amit");
  const [age, setAge] = useState("25-35");
  const [gender, setGender] = useState("Male");
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["Manage stress", "Better sleep"]);
  const [stressLevel, setStressLevel] = useState("High");
  const [sleepQuality, setSleepQuality] = useState("Poor");
  const [activityLevel, setActivityLevel] = useState("Sedentary");

  const totalSteps = 6;

  // Emojis and descriptions for goals
  const goalOptions = [
    { id: "stress", label: "Reduce Office & Work Stress", emoji: "🧘‍♂️", sub: "Learn easy 3-min breathing resets during hectic shifts" },
    { id: "sleep", label: "Better Sleep Quality", emoji: "😴", sub: "Wind down gently after busy days without blue light guilt" },
    { id: "energy", label: "Boost Sluggish Daily Energy", emoji: "⚡", sub: "Low pressure, beginner physical breaks that build focus" },
    { id: "belly", label: "Melt Belly Fat Naturally", emoji: "🥗", sub: "Gentle walks & sensible Indian diet habits, no toxic calorie tracking" },
    { id: "routine", label: "Create Consistent Routines", emoji: "🌱", sub: "Simple micro-habits that fit right into busy family schedules" },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const profile: UserProfile = {
        name: name.trim() || "Friend",
        age,
        gender,
        goals: selectedGoals,
        stressLevel,
        sleepQuality,
        activityLevel,
        onboardingCompleted: true,
      };
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const toggleGoal = (goalLabel: string) => {
    if (selectedGoals.includes(goalLabel)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goalLabel));
    } else {
      setSelectedGoals([...selectedGoals, goalLabel]);
    }
  };

  // Quick supportive copy for each onboarding step
  const getStepHintMessage = () => {
    switch (step) {
      case 0: return "We are so glad you are here. FitMantra is a relaxed, gentle space to feel better. Let's start with your name?";
      case 1: return `Welcome, ${name}! Your age helps us find practical stretching exercises safe for back health.`;
      case 2: return "Gender variables slightly impact metabolic pacing and customized daily tips.";
      case 3: return "Daily small wins are worth standard gym targets. Choose what matches your natural mood.";
      case 4: return "Stress isn't a failure — it is just feedback. Over 73% of Indian professionals relate.";
      case 5: return "Average sleep levels in adult metros hover near 6 hours. Let's fix that with simple night resets.";
      case 6: return "Most of us spend 8+ hours at a desk. Gentle, low-pressure changes are key!";
      default: return "";
    }
  };

  return (
    <div className={`flex-1 flex flex-col justify-between p-6 transition-all duration-300 ${
      darkMode ? "bg-[#1C2541]" : "bg-brand-offwhite"
    }`}>
      {/* Top Progress bar and back button */}
      <div>
        <div className="flex items-center justify-between gap-4 mt-2">
          {step > 0 ? (
            <button
              id="onboarding-back-btn"
              onClick={handleBack}
              className={`p-2 rounded-xl transition-all ${
                darkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-emerald-50"
              }`}
            >
              <ArrowLeft size={18} />
            </button>
          ) : (
            <div className="w-9 h-9 flex items-center justify-center text-slate-400">👋</div>
          )}

          {/* Calming progress bar segments */}
          <div className="flex-1 flex gap-1 h-1.5 justify-center items-center">
            {Array.from({ length: totalSteps + 1 }).map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-full rounded-full transition-all duration-500 ${
                  idx <= step 
                    ? "bg-brand-emerald" 
                    : darkMode ? "bg-slate-700" : "bg-emerald-100"
                }`}
              />
            ))}
          </div>

          <div className="text-xs font-semibold text-brand-emerald">
            {step}/{totalSteps}
          </div>
        </div>

        {/* Emotionally supportive friend helper prompt */}
        <div className={`mt-6 p-4 rounded-2xl flex gap-3 items-start border ${
          darkMode 
            ? "bg-[#252f4c] border-[#313c61] text-emerald-300" 
            : "bg-[#eaf9f1] border-emerald-100/50 text-[#0c6a53]"
        }`}>
          <div className="text-xl mt-0.5">💡</div>
          <p className="text-xs font-medium leading-relaxed">
            {getStepHintMessage()}
          </p>
        </div>
      </div>

      {/* Main Form content area */}
      <div className="my-auto py-4">
        {step === 0 && (
          <div className="animate-fadeIn">
            <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-brand-navy"}`}>
              What should we call you?
            </h2>
            <p className="text-slate-400 text-xs mt-1">We personalize your daily motivational and coaching guides.</p>
            
            <div className="mt-6">
              <input
                id="onboarding-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Amit, Priya, Sneha..."
                className={`w-full py-4 px-4 rounded-2xl text-base border-2 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all ${
                  darkMode 
                    ? "bg-[#252f4c] border-[#364267] text-white focus:border-brand-emerald focus:ring-emerald-950" 
                    : "bg-white border-emerald-100 text-[#1C2541] focus:border-brand-emerald"
                }`}
              />
            </div>
            
            <div className="mt-8 flex gap-3 text-[11px] text-slate-400">
              <Heart size={14} className="text-brand-emerald shrink-0" />
              <span>We never share your personal data. Everything is kept locally and secure.</span>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-brand-navy"}`}>
              Select your age bracket
            </h2>
            <p className="text-slate-400 text-xs mt-1">Exercises & stretch goals adapt to your skeletal age group.</p>
            
            <div className="mt-6 flex flex-col gap-3">
              {["18-24", "25-35", "36-45", "46+"].map((ageGroup) => (
                <button
                  key={ageGroup}
                  id={`age-btn-${ageGroup}`}
                  onClick={() => setAge(ageGroup)}
                  className={`w-full py-4 px-5 rounded-2xl text-left border-2 flex justify-between items-center transition-all ${
                    age === ageGroup
                      ? "border-brand-emerald bg-brand-emerald/10 text-brand-emerald font-semibold"
                      : darkMode 
                        ? "bg-[#252f4c] border-transparent text-slate-300 hover:border-slate-600" 
                        : "bg-white border-emerald-50 text-slate-700 hover:border-emerald-200"
                  }`}
                >
                  <span>{ageGroup} years old</span>
                  {age === ageGroup && <span className="text-brand-emerald text-sm">✔</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fadeIn">
            <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-brand-navy"}`}>
              Your biological gender
            </h2>
            <p className="text-slate-400 text-xs mt-1">Assists with general wellness estimates.</p>
            
            <div className="mt-6 flex flex-col gap-3">
              {["Male", "Female", "Non-binary / Other"].map((g) => (
                <button
                  key={g}
                  id={`gender-btn-${g.replace(/\s+/g, '')}`}
                  onClick={() => setGender(g)}
                  className={`w-full py-4 px-5 rounded-2xl text-left border-2 flex justify-between items-center transition-all ${
                    gender === g
                      ? "border-brand-emerald bg-brand-emerald/10 text-brand-emerald font-semibold"
                      : darkMode 
                        ? "bg-[#252f4c] border-transparent text-slate-300 hover:border-slate-600" 
                        : "bg-white border-emerald-50 text-slate-700 hover:border-emerald-200"
                  }`}
                >
                  <span>{g}</span>
                  {gender === g && <span className="text-brand-emerald text-sm">✔</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fadeIn">
            <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-brand-navy"}`}>
              What are your key goals?
            </h2>
            <p className="text-slate-400 text-xs mt-1">Select all details you want your AI coach and tab tracker to focus on.</p>
            
            <div className="mt-5 flex flex-col gap-3 max-h-[290px] overflow-y-auto pr-1">
              {goalOptions.map((goal) => {
                const isSelected = selectedGoals.includes(goal.label);
                return (
                  <button
                    key={goal.id}
                    id={`goal-chk-${goal.id}`}
                    onClick={() => toggleGoal(goal.label)}
                    className={`w-full p-4 rounded-2xl text-left border-2 flex gap-3 items-start transition-all ${
                      isSelected
                        ? "border-brand-emerald bg-brand-emerald/5 text-brand-emerald"
                        : darkMode 
                          ? "bg-[#252f4c] border-transparent text-slate-300 hover:border-slate-600" 
                          : "bg-white border-emerald-50 text-slate-700 hover:border-slate-200"
                    }`}
                  >
                    <span className="text-2xl mt-1">{goal.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm leading-tight">{goal.label}</div>
                      <div className="text-[10px] text-slate-400 font-light mt-0.5 leading-tight">{goal.sub}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                      isSelected ? "bg-brand-emerald border-brand-emerald text-white" : "border-slate-300"
                    }`}>
                      {isSelected && <span className="text-[10px]">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fadeIn">
            <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-brand-navy"}`}>
              How is your stress level?
            </h2>
            <p className="text-slate-400 text-xs mt-1">No medical assessments — just how your head and neck feel on weekdays.</p>
            
            <div className="mt-6 flex flex-col gap-3">
              {[
                { level: "High", sub: "Frequent work pressure, tight shoulder knots, racing thoughts", emoji: "😰" },
                { level: "Medium", sub: "Busy days, managed but slightly fatigued by 6:00 PM", emoji: "😐" },
                { level: "Low", sub: "Relaxed daily schedule, clear calm boundaries", emoji: "😌" }
              ].map((item) => (
                <button
                  key={item.level}
                  id={`stress-level-btn-${item.level}`}
                  onClick={() => setStressLevel(item.level)}
                  className={`w-full p-4 rounded-2xl text-left border-2 flex gap-3 items-center transition-all ${
                    stressLevel === item.level
                      ? "border-brand-emerald bg-brand-emerald/10 text-brand-emerald"
                      : darkMode 
                        ? "bg-[#252f4c] border-transparent text-slate-300 hover:border-slate-650" 
                        : "bg-white border-emerald-50 text-slate-700 hover:border-emerald-200"
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <div className="font-bold text-sm">{item.level}</div>
                    <div className="text-[10px] text-slate-400 font-light leading-snug">{item.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fadeIn">
            <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-brand-navy"}`}>
              What is your sleep quality like?
            </h2>
            <p className="text-slate-400 text-xs mt-1">We offer quiet 5-min bedtime stretches and counting routines.</p>
            
            <div className="mt-6 flex flex-col gap-3">
              {[
                { level: "Poor", sub: "Wake up tired, toss and turn, late night thoughts", emoji: "🥱" },
                { level: "Average", sub: "Sleeps okay, but occasionally sluggish around 3:00 PM", emoji: "😴" },
                { level: "Good", sub: "Deep rest, energetic and refreshing early mornings", emoji: "✨" }
              ].map((item) => (
                <button
                  key={item.level}
                  id={`sleep-btn-${item.level}`}
                  onClick={() => setSleepQuality(item.level)}
                  className={`w-full p-4 rounded-2xl text-left border-2 flex gap-3 items-center transition-all ${
                    sleepQuality === item.level
                      ? "border-brand-emerald bg-brand-emerald/10 text-brand-emerald"
                      : darkMode 
                        ? "bg-[#252f4c] border-transparent text-slate-300 hover:border-slate-650" 
                        : "bg-white border-emerald-50 text-slate-700 hover:border-emerald-200"
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <div className="font-bold text-sm">{item.level}</div>
                    <div className="text-[10px] text-slate-400 font-light leading-snug">{item.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="animate-fadeIn">
            <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-brand-navy"}`}>
              Finally, what is your active lifestyle like?
            </h2>
            <p className="text-slate-400 text-xs mt-1">Sedentary patterns can cause sluggishness and belly fat storage.</p>
            
            <div className="mt-6 flex flex-col gap-3">
              {[
                { level: "Sedentary", sub: "8-10 hours sitting at keyboard, minimal daily steps", emoji: "🖥️" },
                { level: "Moderate", sub: "Some moving, occasional chores, light irregular walking", emoji: "🚶‍♂️" },
                { level: "Active", sub: "Consistent exercise or yoga, walking 7k+ steps daily", emoji: "🚴‍♂️" }
              ].map((item) => (
                <button
                  key={item.level}
                  id={`activity-btn-${item.level}`}
                  onClick={() => setActivityLevel(item.level)}
                  className={`w-full p-4 rounded-2xl text-left border-2 flex gap-3 items-center transition-all ${
                    activityLevel === item.level
                      ? "border-brand-emerald bg-brand-emerald/10 text-brand-emerald"
                      : darkMode 
                        ? "bg-[#252f4c] border-transparent text-slate-300 hover:border-slate-650" 
                        : "bg-white border-emerald-50 text-slate-700 hover:border-emerald-200"
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <div className="font-bold text-sm">{item.level}</div>
                    <div className="text-[10px] text-slate-400 font-light leading-snug">{item.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom slide action controllers */}
      <div className="mt-4">
        <button
          id="onboarding-next-btn"
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-2xl bg-brand-emerald hover:bg-[#0c7058] active:scale-95 text-white font-medium flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <span>{step === totalSteps ? "Create My Calm Profile" : "Continue"}</span>
          <ArrowRight size={16} />
        </button>
        
        <div className="text-center mt-3 text-[10px] text-slate-400">
          Step {step} of {totalSteps} • Designed by real wellness professionals to fit Indian corporate life.
        </div>
      </div>
    </div>
  );
}
