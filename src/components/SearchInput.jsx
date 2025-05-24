import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';

const SearchInput = ({ value, onChange }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('common.search')}
        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      />
      <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
};

export default SearchInput; 