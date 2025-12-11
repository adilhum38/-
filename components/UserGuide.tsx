import React from 'react';
import { X, HelpCircle, BookOpen } from 'lucide-react';
import { GUIDE_CONTENT } from '../constants';
import { Language } from '../types';

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const UserGuide: React.FC<UserGuideProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const content = GUIDE_CONTENT[language];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-[card-stack-enter_0.3s_ease-out] relative">
        
        {/* Header */}
        <div className="bg-slate-800 p-6 flex justify-between items-center border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-indigo-500" />
            {content.title}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid gap-8">
            {content.sections.map((section, index) => (
              <div key={index} className="bg-slate-800/50 p-5 rounded-2xl border border-slate-800/50">
                <h3 className="text-lg font-bold text-indigo-300 mb-3">{section.title}</h3>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900">
          <button 
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-all"
          >
            {content.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;