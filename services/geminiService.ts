import { GoogleGenAI } from "@google/genai";
import { Answer, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeProfile = async (
  profile: UserProfile,
  answers: Answer[]
): Promise<string> => {
  const model = "gemini-2.5-flash";
  const lang = profile.language;
  
  const answersText = answers.map(a => `- ${a.questionText} -> ${a.choice} FLAG`).join("\n");

  const promptRu = `
    Ты опытный психолог и социолог с отличным чувством юмора и современным взглядом на отношения в Казахстане и СНГ.
    
    Проанализируй результаты теста "Red Flag / Green Flag" для следующего пользователя:
    - Пол: ${profile.gender === 'male' ? 'Мужской' : profile.gender === 'female' ? 'Женский' : 'Другой'}
    - Возраст: ${profile.age}
    - Регион: ${profile.region}

    Вот как пользователь оценил 10 ситуаций:
    ${answersText}

    Твоя задача:
    1. Дать общий психологический портрет (какой тип привязанности, какие ценности).
    2. Отметить интересные социологические наблюдения, учитывая менталитет Казахстана и выбранного региона.
    3. Дать 2-3 практических совета по отношениям.
    
    Стиль: Дружелюбный, немного ироничный, но профессиональный. Используй Markdown.
    ОТВЕЧАЙ НА РУССКОМ ЯЗЫКЕ.
  `;

  const promptKk = `
    Сіз Қазақстан мен ТМД-дағы қарым-қатынасқа заманауи көзқарасы бар және әзіл-қалжыңы жараскан тәжірибелі психолог және әлеуметтанушысыз.

    Келесі пайдаланушы үшін "Red Flag / Green Flag" сынағының нәтижелерін талдаңыз:
    - Жынысы: ${profile.gender === 'male' ? 'Ер' : profile.gender === 'female' ? 'Әйел' : 'Басқа'}
    - Жасы: ${profile.age}
    - Аймағы: ${profile.region}

    Пайдаланушы 10 жағдайды қалай бағалады:
    ${answersText}

    Сіздің тапсырмаңыз:
    1. Жалпы психологиялық портрет беріңіз (байланыс түрі қандай, қандай құндылықтар маңызды).
    2. Қазақстан мен таңдалған аймақтың менталитетін ескере отырып, қызықты әлеуметтанулық байқауларды атап өтіңіз.
    3. Қарым-қатынас бойынша 2-3 практикалық кеңес беріңіз.

    Стиль: Достық, аздап ирониялық, бірақ кәсіби. Markdown пайдаланыңыз.
    ҚАЗАҚ ТІЛІНДЕ ЖАУАП БЕРІҢІЗ.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: lang === 'kk' ? promptKk : promptRu,
    });
    return response.text || (lang === 'kk' ? "Талдау жасау мүмкін болмады." : "Не удалось сгенерировать анализ.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'kk' 
      ? "Психологпен байланыс орнатуда қате шықты." 
      : "Произошла ошибка при соединении с ИИ психологом.";
  }
};