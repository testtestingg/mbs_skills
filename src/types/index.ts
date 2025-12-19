export type Language = 'fr' | 'en' | 'ar';

export interface Translations {
  [key: string]: {
    fr: string | any[];
    en: string | any[];
    ar: string | any[];
  };
}