import React, { useState } from 'react';
import { Question, Answer, FlagType, Language } from '../types';
import { UI_TEXT } from '../constants';
import ScenarioVisuals from './ScenarioVisuals';
import { Flag, CheckCircle2 } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  onComplete: (answers: Answer[]) => void;
  language: Language;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [animating, setAnimating] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  const t = UI_TEXT[language];

  const handleChoice = (type: FlagType) => {
    if (animating) return;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      choice: type
    };
    
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setAnimating(true);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setAnimating(false);
      } else {
        onComplete(newAnswers);
      }
    }, 400); // Wait for exit animation
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 h-screen max-h-[800px] flex flex-col justify-center">
      
      {/* Progress Bar */}
      <div className="mb-6 relative h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={`transition-all duration-300 transform ${animating ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
        
        {/* Question Card */}
        <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-700 relative overflow-hidden">
          
          <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4 text-center">
            {t.situation} {currentIndex + 1} {t.of} {questions.length}
          </div>

          <ScenarioVisuals type={currentQuestion.animationType} />
          
          <div className="text-center mb-6">
            <h3 className="text-indigo-300 font-medium mb-2 text-sm">{currentQuestion.context}</h3>
            <p className="text-xl font-bold text-white leading-relaxed">
              {currentQuestion.text}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              onClick={() => handleChoice('RED')}
              className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 border-2 border-slate-700 hover:border-red-500 hover:bg-red-900/20 transition-all duration-200 active:scale-95"
            >
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-2 group-hover:bg-red-500 transition-colors">
                <Flag className="text-red-500 group-hover:text-white transition-colors fill-current" size={24} />
              </div>
              <span className="font-bold text-slate-300 group-hover:text-red-400">RED FLAG</span>
            </button>

            <button
              onClick={() => handleChoice('GREEN')}
              className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 border-2 border-slate-700 hover:border-green-500 hover:bg-green-900/20 transition-all duration-200 active:scale-95"
            >
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-500 transition-colors">
                <CheckCircle2 className="text-green-500 group-hover:text-white transition-colors" size={24} />
              </div>
              <span className="font-bold text-slate-300 group-hover:text-green-400">GREEN FLAG</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Quiz;