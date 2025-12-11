import React, { useState, useEffect } from 'react';
import { UserProfile, Gender, Language } from '../types';
import { REGIONS, UI_TEXT } from '../constants';
import { User, MapPin, Phone, Calendar, ShieldCheck } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  onLanguageChange: (lang: Language) => void;
  onAdminRequest: () => void;
  currentLang: Language;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onLanguageChange, onAdminRequest, currentLang }) => {
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Gender>('female');
  const [region, setRegion] = useState(REGIONS[currentLang][0]);
  
  const t = UI_TEXT[currentLang];

  // Update default region when language changes
  useEffect(() => {
    setRegion(REGIONS[currentLang][0]);
  }, [currentLang]);

  const handleAdminAuth = () => {
    // Password protection removed for user access request
    onAdminRequest();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10 || !age) return;
    
    onComplete({
      phone,
      age: Number(age),
      gender,
      region,
      language: currentLang
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 animate-[fadeIn_0.5s_ease-out] relative">
      <div className="flex justify-between items-center mb-4">
        {/* Admin Button */}
        <button 
          onClick={handleAdminAuth}
          className="text-slate-600 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-slate-800"
          title="Admin Panel"
        >
          <ShieldCheck size={20} />
        </button>

        {/* Language Switcher */}
        <div className="bg-slate-800 rounded-full p-1 flex border border-slate-700">
          <button 
            onClick={() => onLanguageChange('ru')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${currentLang === 'ru' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            RU
          </button>
          <button 
            onClick={() => onLanguageChange('kk')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${currentLang === 'kk' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            KZ
          </button>
        </div>
      </div>

      <div className="text-center mb-8 select-none cursor-default">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-red-400 to-green-400 bg-clip-text text-transparent mb-2">
          {t.title}
        </h1>
        <p className="text-slate-400">{t.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 flex flex-col gap-6">
        
        {/* Phone Simulation */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
            <Phone size={16} /> {t.phoneLabel}
          </label>
          <input 
            type="tel" 
            placeholder="+7 (7xx) xxx-xx-xx"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <p className="text-xs text-slate-500 mt-1">{t.phoneHint}</p>
        </div>

        {/* Age */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
            <Calendar size={16} /> {t.ageLabel}
          </label>
          <input 
            type="number" 
            min="16" 
            max="99"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
            <User size={16} /> {t.genderLabel}
          </label>
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-600">
            {(['male', 'female', 'other'] as Gender[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  gender === g 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g === 'male' ? t.male : g === 'female' ? t.female : t.other}
              </button>
            ))}
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
            <MapPin size={16} /> {t.regionLabel}
          </label>
          <select 
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {REGIONS[currentLang].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <button 
          type="submit"
          disabled={phone.length < 5 || !age}
          className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.startBtn}
        </button>
      </form>
    </div>
  );
};

export default Onboarding;