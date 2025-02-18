import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'de' | 'en' | 'fr';

interface TranslationStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const translations = {
  de: {
    dashboard: 'Dashboard',
    totalRevenue: 'Gesamtumsatz',
    totalBookings: 'Buchungen',
    totalCustomers: 'Kunden',
    averageBooking: 'Durchschnittswert',
    revenueChart: 'Umsatzentwicklung',
    recentBookings: 'Aktuelle Buchungen',
    retry: 'Erneut versuchen',
    settings: 'Einstellungen',
    language: 'Sprache',
    german: 'Deutsch',
    english: 'Englisch',
    french: 'Französisch',
    save: 'Speichern',
    cancel: 'Abbrechen'
  },
  en: {
    dashboard: 'Dashboard',
    totalRevenue: 'Total Revenue',
    totalBookings: 'Bookings',
    totalCustomers: 'Customers',
    averageBooking: 'Average Booking',
    revenueChart: 'Revenue Trend',
    recentBookings: 'Recent Bookings',
    retry: 'Retry',
    settings: 'Settings',
    language: 'Language',
    german: 'German',
    english: 'English',
    french: 'French',
    save: 'Save',
    cancel: 'Cancel'
  },
  fr: {
    dashboard: 'Tableau de bord',
    totalRevenue: 'Revenu total',
    totalBookings: 'Réservations',
    totalCustomers: 'Clients',
    averageBooking: 'Moyenne par réservation',
    revenueChart: 'Évolution du revenu',
    recentBookings: 'Réservations récentes',
    retry: 'Réessayer',
    settings: 'Paramètres',
    language: 'Langue',
    german: 'Allemand',
    english: 'Anglais',
    french: 'Français',
    save: 'Enregistrer',
    cancel: 'Annuler'
  }
};

const useLanguageStore = create<TranslationStore>()(
  persist(
    (set) => ({
      language: 'de',
      setLanguage: (lang) => set({ language: lang })
    }),
    {
      name: 'language-store'
    }
  )
);

export function useTranslation() {
  const { language, setLanguage } = useLanguageStore();
  
  const t = (key: keyof typeof translations.de) => {
    return translations[language][key] || key;
  };

  return { t, language, setLanguage };
}