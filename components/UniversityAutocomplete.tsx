import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { MOCK_UNIVERSITIES } from '../constants';

interface UniversityAutocompleteProps {
  value: string;
  onChange: (universityName: string) => void;
}

const UniversityAutocomplete: React.FC<UniversityAutocompleteProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync internal input state with prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter logic: Match name OR reading
  // Use a limit to prevent rendering thousands of items
  const getFilteredUniversities = () => {
    if (!inputValue) return [];
    
    const search = inputValue.toLowerCase();
    const matches = [];
    
    for (const uni of MOCK_UNIVERSITIES) {
      if (matches.length >= 20) break; // Limit results for performance
      
      const matchName = uni.name.toLowerCase().includes(search);
      const matchReading = uni.reading && uni.reading.toLowerCase().includes(search);
      
      if (matchName || matchReading) {
        matches.push(uni);
      }
    }
    return matches;
  };

  const filteredUniversities = getFilteredUniversities();

  const handleSelect = (name: string) => {
    setInputValue(name);
    onChange(name);
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
    // If input is cleared, clear parent state immediately
    if (e.target.value === '') {
      onChange('');
    }
  };

  const handleFocus = () => {
    // Show top universities or generic list if empty? 
    // Usually only show if typing, or show full list if small. 
    // Since we have 800 universities, only show if typing or show nothing initially.
    // Let's show filtered list if input exists, otherwise maybe nothing or top popular ones.
    if (inputValue) {
        setIsOpen(true);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          className="glass-input w-full pl-9 pr-8 py-2 rounded-md text-sm placeholder-gray-500 focus:ring-1 focus:ring-primary-500 transition-all"
          placeholder="大学名を検索 (例: 早稲田, わせだ)"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
        {value && (
             <Check className="absolute right-3 top-2.5 h-4 w-4 text-green-400 pointer-events-none" />
        )}
      </div>

      {isOpen && inputValue && (
        <div className="absolute z-50 w-full mt-1 bg-dark-800 border border-white/10 rounded-md shadow-xl max-h-60 overflow-y-auto scrollbar-hide">
          {filteredUniversities.length > 0 ? (
            <ul className="py-1">
              {filteredUniversities.map((uni) => (
                <li
                  key={uni.name}
                  onClick={() => handleSelect(uni.name)}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                    value === uni.name 
                      ? 'bg-primary-600/20 text-primary-300' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold">{uni.name}</span>
                    {uni.reading && <span className="text-xs text-gray-500">{uni.reading}</span>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              見つかりませんでした
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UniversityAutocomplete;