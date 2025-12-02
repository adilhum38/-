import React from 'react';
import { 
  Smartphone, 
  Utensils, 
  Gift, 
  MessageCircleWarning, 
  Wallet, 
  Sprout, 
  Ghost, 
  Clock, 
  Users, 
  Ear 
} from 'lucide-react';

interface ScenarioVisualsProps {
  type: string;
}

const ScenarioVisuals: React.FC<ScenarioVisualsProps> = ({ type }) => {
  const getIcon = () => {
    const iconClass = "w-24 h-24 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]";
    
    switch (type) {
      case 'phone':
        return (
          <div className="relative animate-pulse">
             <Smartphone className={iconClass} />
             <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full animate-bounce"></div>
          </div>
        );
      case 'restaurant':
        return <Utensils className={`${iconClass} animate-bounce`} />;
      case 'gift':
        return <Gift className={`${iconClass} animate-pulse`} />;
      case 'control':
        return <MessageCircleWarning className={`${iconClass} animate-pulse`} />;
      case 'money':
        return <Wallet className={`${iconClass} animate-bounce`} />;
      case 'growth':
        return <Sprout className={`${iconClass} animate-pulse`} />;
      case 'ex':
        return <Ghost className={`${iconClass} opacity-80 animate-pulse`} />;
      case 'time':
        return <Clock className={`${iconClass} animate-spin-slow`} style={{ animationDuration: '3s' }} />;
      case 'family':
        return <Users className={`${iconClass} animate-bounce`} />;
      case 'listening':
        return <Ear className={`${iconClass} animate-pulse`} />;
      default:
        return <Smartphone className={iconClass} />;
    }
  };

  return (
    <div className="h-48 w-full flex items-center justify-center bg-slate-800/50 rounded-xl mb-6 border border-slate-700 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80 pointer-events-none"></div>
      {/* Background Decorative Elements */}
      <div className="absolute top-2 left-4 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
      <div className="absolute bottom-4 right-10 w-3 h-3 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '0.5s'}}></div>
      
      {getIcon()}
    </div>
  );
};

export default ScenarioVisuals;