import { useTranslation } from 'react-i18next';

/**
 * Hook to get currency symbol based on current language
 * Returns ₹ for English and Hindi, $ for all others
 */
export const useCurrency = () => {
  const { i18n } = useTranslation();
  
  const getCurrency = () => {
    const language = i18n.language;
    // Rupees for English variants and Hindi
    if (language === 'en' || language === 'en-GB' || language === 'en-US' || language === 'hi') {
      return '₹';
    }
    // Dollar for all other languages
    return '$';
  };
  
  const isRupee = () => {
    const language = i18n.language;
    return language === 'en' || language === 'en-GB' || language === 'en-US' || language === 'hi';
  };
  
  return {
    currency: getCurrency(),
    isRupee: isRupee(),
    symbol: getCurrency()
  };
};

export default useCurrency;
