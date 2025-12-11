import React, { useState, useEffect } from 'react';
import { GameSession } from '../types';
import { getSessions, clearSessions, exportSessionsToCSV } from '../services/storageService';
import { Download, Trash2, X, Search, ChevronDown, ChevronUp, Database } from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const handleClear = () => {
    if (confirm('Вы уверены, что хотите удалить ВСЕ данные? Это действие необратимо.')) {
      clearSessions();
      setSessions([]);
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.profile.phone.includes(filter) || 
    s.profile.region.toLowerCase().includes(filter.toLowerCase()) ||
    new Date(s.timestamp).toLocaleString().includes(filter)
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 overflow-auto text-slate-200">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Database className="text-indigo-500" />
              Панель Администратора
            </h1>
            <p className="text-slate-400 text-sm mt-1">Всего записей: {sessions.length}</p>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <button 
              onClick={exportSessionsToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition-colors shadow-lg hover:shadow-green-500/20"
            >
              <Download size={18} /> Скачать Excel
            </button>
            <button 
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800/50 rounded-lg text-red-300 font-medium transition-colors"
            >
              <Trash2 size={18} /> Очистить
            </button>
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors"
            >
              <X size={18} /> Закрыть
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Поиск по телефону, региону или дате..." 
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Дата</th>
                  <th className="p-4 font-semibold">Пользователь</th>
                  <th className="p-4 font-semibold">Результат</th>
                  <th className="p-4 font-semibold">Регион</th>
                  <th className="p-4 font-semibold text-right">Детали</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredSessions.map(session => {
                  const redFlags = session.answers.filter(a => a.choice === 'RED').length;
                  const greenFlags = session.answers.filter(a => a.choice === 'GREEN').length;
                  
                  return (
                    <React.Fragment key={session.id}>
                      <tr className="hover:bg-slate-700/50 transition-colors group">
                        <td className="p-4 text-slate-300 whitespace-nowrap">
                          <div className="font-medium text-white">{new Date(session.timestamp).toLocaleDateString('ru-RU')}</div>
                          <div className="text-xs text-slate-500">{new Date(session.timestamp).toLocaleTimeString('ru-RU')}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white text-lg">{session.profile.phone}</div>
                          <div className="text-sm text-slate-400 flex items-center gap-2">
                            <span>{session.profile.age} лет</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                            <span>{session.profile.gender === 'male' ? 'Муж' : session.profile.gender === 'female' ? 'Жен' : 'Другой'}</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px] uppercase">{session.profile.language}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-3 text-sm font-bold items-center">
                            <span className="flex items-center gap-1 text-red-400 bg-red-900/20 px-2 py-1 rounded">
                               {redFlags} 🚩
                            </span>
                            <span className="flex items-center gap-1 text-green-400 bg-green-900/20 px-2 py-1 rounded">
                               {greenFlags} 🌿
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-block px-2 py-1 rounded bg-slate-700/50 border border-slate-600 text-sm text-slate-300">
                            {session.profile.region}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => toggleExpand(session.id)}
                            className="text-indigo-400 hover:text-white hover:bg-indigo-600 p-2 rounded-lg transition-all"
                          >
                            {expandedId === session.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </td>
                      </tr>
                      
                      {expandedId === session.id && (
                        <tr className="bg-slate-900/80 animate-[fadeIn_0.2s_ease-out]">
                          <td colSpan={5} className="p-0">
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-700">
                              
                              {/* Answers Column */}
                              <div>
                                <h4 className="font-bold text-slate-400 mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
                                  История ответов
                                  <span className="bg-slate-700 text-white text-[10px] px-1.5 py-0.5 rounded-full">{session.answers.length}</span>
                                </h4>
                                <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                  {session.answers.map((a, idx) => (
                                    <li key={idx} className="flex justify-between items-start text-sm border-b border-slate-800 pb-2 last:border-0">
                                      <span className="text-slate-300 pr-4 leading-relaxed">
                                        <span className="text-slate-500 mr-2">{idx + 1}.</span>
                                        {a.questionText}
                                      </span>
                                      <span className={`font-bold whitespace-nowrap px-2 py-1 rounded text-xs ${
                                        a.choice === 'RED' ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'
                                      }`}>
                                        {a.choice === 'RED' ? 'RED FLAG' : 'GREEN FLAG'}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Analysis Column */}
                              <div>
                                <h4 className="font-bold text-slate-400 mb-4 text-xs uppercase tracking-wider">Анализ Искусственного Интеллекта</h4>
                                <div className="bg-slate-950 p-5 rounded-xl text-sm text-slate-300 leading-relaxed whitespace-pre-wrap h-full max-h-[300px] overflow-y-auto border border-slate-800 font-mono shadow-inner">
                                  {session.analysis}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
            
            {filteredSessions.length === 0 && (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                <Database size={48} className="mb-4 opacity-20" />
                <p>База данных пуста или по вашему запросу ничего не найдено.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;