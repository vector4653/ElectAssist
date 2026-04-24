import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import mr from './locales/mr.json';
import gu from './locales/gu.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
];

/** Maps Indian states/UTs to their primary language code */
export const STATE_LANGUAGE_MAP: Record<string, string> = {
  'Andhra Pradesh': 'te',
  'Arunachal Pradesh': 'en',
  'Assam': 'en',
  'Bihar': 'hi',
  'Chhattisgarh': 'hi',
  'Goa': 'mr',
  'Gujarat': 'gu',
  'Haryana': 'hi',
  'Himachal Pradesh': 'hi',
  'Jharkhand': 'hi',
  'Karnataka': 'kn',
  'Kerala': 'ml',
  'Madhya Pradesh': 'hi',
  'Maharashtra': 'mr',
  'Manipur': 'en',
  'Meghalaya': 'en',
  'Mizoram': 'en',
  'Nagaland': 'en',
  'Odisha': 'en',
  'Punjab': 'hi',
  'Rajasthan': 'hi',
  'Sikkim': 'en',
  'Tamil Nadu': 'ta',
  'Telangana': 'te',
  'Tripura': 'bn',
  'Uttar Pradesh': 'hi',
  'Uttarakhand': 'hi',
  'West Bengal': 'bn',
  // Union Territories
  'Andaman and Nicobar Islands': 'en',
  'Chandigarh': 'hi',
  'Dadra and Nagar Haveli and Daman and Diu': 'gu',
  'Delhi': 'hi',
  'Jammu and Kashmir': 'hi',
  'Ladakh': 'hi',
  'Lakshadweep': 'ml',
  'Puducherry': 'ta',
};

export const INDIAN_STATES = Object.keys(STATE_LANGUAGE_MAP);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      bn: { translation: bn },
      ta: { translation: ta },
      te: { translation: te },
      mr: { translation: mr },
      gu: { translation: gu },
      kn: { translation: kn },
      ml: { translation: ml },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
