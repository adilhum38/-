import React, { useState } from 'react';
import { UserProfile, Answer, AppState, Language } from './types';
import { getQuestions, UI_TEXT } from './constants';
import { analyzeProfile } from './services/geminiService';
import Onboarding from './components/Onboarding';
import Quiz from './components/Quiz';
import Results from './components/Results';
import { Sparkles } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<AppState>(AppState.ONBOARDING);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [language, setLanguage] = useState<Language>('ru');

  const t = UI_TEXT[language];

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setGameState(AppState.QUIZ);
  };

  const handleQuizComplete = async (completedAnswers: Answer[]) => {
    setAnswers(completedAnswers);
    setGameState(AppState.ANALYZING);
    
    if (profile) {
      const resultText = await analyzeProfile(profile, completedAnswers);
      setAnalysis(resultText);
      setGameState(AppState.RESULTS);
    }
  };

  const handleRestart = () => {
    setAnswers([]);
    setAnalysis('');
    setGameState(AppState.ONBOARDING);
    setProfile(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center">
      {/* Background ambient light */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full flex-grow flex flex-col">
        {gameState === AppState.ONBOARDING && (
          <div className="flex items-center justify-center min-h-screen">
            <Onboarding 
              onComplete={handleOnboardingComplete} 
              onLanguageChange={setLanguage}
              currentLang={language}
            />
          </div>
        )}

        {gameState === AppState.QUIZ && (
          <Quiz 
            questions={getQuestions(language)} 
            onComplete={handleQuizComplete} 
            language={language}
          />
        )}

        {gameState === AppState.ANALYZING && (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center animate-pulse">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-50 rounded-full animate-ping"></div>
              <Sparkles className="relative z-10 text-white w-16 h-16 animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t.analyzing}</h2>
            <p className="text-slate-400">{t.analyzingSub}</p>
          </div>
        )}

        {gameState === AppState.RESULTS && (
          <Results 
            answers={answers} 
            analysis={analysis} 
            onRestart={handleRestart}
            language={language}
          />
        )}
      </div>
    </div>
  );
}

export default App;