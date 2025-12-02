import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Flag, CheckCircle2, RotateCcw, Share2 } from 'lucide-react';
import { Answer, Language } from '../types';
import { UI_TEXT } from '../constants';

interface ResultsProps {
  answers: Answer[];
  analysis: string;
  onRestart: () => void;
  language: Language;
}

const Results: React.FC<ResultsProps> = ({ answers, analysis, onRestart, language }) => {
  const redFlags = answers.filter(a => a.choice === 'RED').length;
  const greenFlags = answers.filter(a => a.choice === 'GREEN').length;
  const t = UI_TEXT[language];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 pb-20 animate-[fadeIn_0.8s_ease-out]">
      
      {/* Header Stats */}
      <div className="bg-slate-800 rounded-3xl p-8 mb-8 text-center shadow-2xl border border-slate-700">
        <h2 className="text-3xl font-extrabold text-white mb-6">{t.yourResult}</h2>
        
        <div className="flex justify-center gap-8 mb-6">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-red-500">{redFlags}</span>
            <span className="text-sm font-semibold text-slate-400 flex items-center gap-1 mt-1">
              <Flag size={14} className="fill-red-500 text-red-500" /> Red Flags
            </span>
          </div>
          <div className="w-px bg-slate-700"></div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-green-500">{greenFlags}</span>
            <span className="text-sm font-semibold text-slate-400 flex items-center gap-1 mt-1">
              <CheckCircle2 size={14} className="text-green-500" /> Green Flags
            </span>
          </div>
        </div>
        
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex">
          <div style={{ width: `${(redFlags / 10) * 100}%` }} className="bg-red-500 h-full"></div>
          <div style={{ width: `${(greenFlags / 10) * 100}%` }} className="bg-green-500 h-full"></div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="prose prose-invert prose-slate bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-8">
        <h3 className="text-indigo-400 font-bold text-lg mb-4 flex items-center gap-2">
          <span className="bg-indigo-500/20 p-1 rounded text-2xl">🤖</span> {t.aiAnalysis}
        </h3>
        <ReactMarkdown
           components={{
            h1: ({node, ...props}) => <h3 className="text-xl font-bold text-indigo-300 mt-4 mb-2" {...props} />,
            h2: ({node, ...props}) => <h4 className="text-lg font-semibold text-indigo-200 mt-3 mb-2" {...props} />,
            h3: ({node, ...props}) => <h5 className="text-base font-semibold text-white mt-2 mb-1" {...props} />,
            strong: ({node, ...props}) => <strong className="text-indigo-300 font-bold" {...props} />,
            p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-4 text-sm md:text-base" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-2 mb-4 text-slate-300" {...props} />,
          }}
        >
          {analysis}
        </ReactMarkdown>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button 
          onClick={onRestart}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          {t.restart}
        </button>
        <button 
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          onClick={() => alert(t.shareAlert)}
        >
          <Share2 size={20} />
          {t.share}
        </button>
      </div>

    </div>
  );
};

export default Results;