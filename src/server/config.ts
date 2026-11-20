import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  APP_MODE: (process.env.APP_MODE === 'live' ? 'live' : 'demo') as 'demo' | 'live',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_TEXT_MODEL: process.env.GEMINI_TEXT_MODEL || 'gemini-4-hydrogen',
  GEMINI_TRANSCRIBE_MODEL: process.env.GEMINI_TRANSCRIBE_MODEL || 'gemini-3.5-transcribe',
};

// Jeju City and Seogwipo representative coordinates for weather fallback
export const JEJU_CITY_COORDS = { lat: 33.4996, lng: 126.5312 }; // 제주시청
export const SEOGWIPO_COORDS = { lat: 33.2541, lng: 126.5601 }; // 서귀포시청
