import { GameSession, UserProfile, Answer } from '../types';

const STORAGE_KEY = 'rfgf_sessions_v1';

export const saveSession = (profile: UserProfile, answers: Answer[], analysis: string): void => {
  const sessions = getSessions();
  
  const newSession: GameSession = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    timestamp: Date.now(),
    profile,
    answers,
    analysis
  };

  sessions.unshift(newSession); // Add to top
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const getSessions = (): GameSession[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse sessions", e);
    return [];
  }
};

export const clearSessions = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const exportSessionsToCSV = (): void => {
  const sessions = getSessions();
  if (sessions.length === 0) {
    alert("Нет данных для экспорта");
    return;
  }

  const headers = ['ID', 'Дата', 'Телефон', 'Возраст', 'Пол', 'Регион', 'Язык', 'Красные флаги', 'Зеленые флаги', 'Анализ'];
  
  const csvContent = [
    headers.join(','),
    ...sessions.map(s => {
      const redFlags = s.answers.filter(a => a.choice === 'RED').length;
      const greenFlags = s.answers.filter(a => a.choice === 'GREEN').length;
      const date = new Date(s.timestamp).toLocaleString('ru-RU');
      // Escape analysis text to avoid CSV breaking: quotes doubled, newlines replaced
      const safeAnalysis = `"${s.analysis.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      
      return [
        s.id,
        `"${date}"`,
        `"${s.profile.phone}"`,
        s.profile.age,
        s.profile.gender,
        `"${s.profile.region}"`,
        s.profile.language,
        redFlags,
        greenFlags,
        safeAnalysis
      ].join(',');
    })
  ].join('\n');

  // Add BOM (\uFEFF) so Excel opens it as UTF-8 correctly
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `redflag_data_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
};