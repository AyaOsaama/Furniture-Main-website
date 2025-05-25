import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSort } from 'react-icons/fa';

const SortDropdown = ({ value, onChange, selectedRatings, onRatingChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-4">
      {/* Sort Options */}
      <div className="flex items-center space-x-2">
        <FaSort className="text-gray-500" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="form-select rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        >
          <option value="default">{t('sort.default')}</option>
          <option value="price-asc">{t('sort.priceAsc')}</option>
          <option value="price-desc">{t('sort.priceDesc')}</option>
          <option value="name-asc">{t('sort.nameAsc')}</option>
          <option value="name-desc">{t('sort.nameDesc')}</option>
        </select>
      </div>

      {/* Rating Filter */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => onRatingChange(rating)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedRatings.includes(rating)
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {rating} {rating === 1 ? t('sort.star') : t('sort.stars')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortDropdown; 