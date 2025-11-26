import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, MapPin, School } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ALL_TAGS, MOCK_UNIVERSITIES } from '../constants';
import { CircleCategory, FilterState } from '../types';
import CircleCard from '../components/CircleCard';
import UniversityAutocomplete from '../components/UniversityAutocomplete';
import { circleService } from '../services/circleService';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    university: '',
    category: null,
    campus: null,
    tags: []
  });

  const [aiReasoning, setAiReasoning] = useState<string | null>(null);

  // Initialize filters from URL and State
  useEffect(() => {
    // 1. Check for AI Match results in location.state
    if (location.state && location.state.aiFilters) {
      const { university, category, campus, tags } = location.state.aiFilters;
      // Note: AI usually returns generic campus names, we might need mapping in a real app.
      // For now, we keep generic logic.
      setFilters(prev => ({
        ...prev,
        category: category || null,
        campus: campus || null,
        tags: tags || [],
        keyword: '',
        university: university || '' // Use AI inferred university or blank
      }));
      if (location.state.aiReasoning) {
        setAiReasoning(location.state.aiReasoning);
      }
    } 
    // 2. Check URL Params if no AI state
    else {
      const keywordParam = searchParams.get('keyword');
      const universityParam = searchParams.get('university');
      const categoryParam = searchParams.get('category');
      const campusParam = searchParams.get('campus');
      const tagsParam = searchParams.get('tags');

      setFilters(prev => ({
        ...prev,
        keyword: keywordParam || '',
        university: universityParam || '',
        category: (categoryParam as CircleCategory) || null,
        campus: campusParam || null,
        tags: tagsParam ? [tagsParam] : []
      }));
    }
  }, [location.state, searchParams]);

  // Derived State: Available Campuses based on selected University
  const availableCampuses = useMemo(() => {
    if (!filters.university) return [];
    const uni = MOCK_UNIVERSITIES.find(u => u.name === filters.university);
    return uni ? uni.campuses : [];
  }, [filters.university]);

  // Derived State: Filtered Circles via Service
  const filteredCircles = useMemo(() => {
    return circleService.searchCircles({
      keyword: filters.keyword,
      university: filters.university,
      category: filters.category,
      campus: filters.campus,
      tags: filters.tags
    });
  }, [filters]);

  // Handlers
  const updateFilters = (newFilters: Partial<FilterState>) => {
    const nextFilters = { ...filters, ...newFilters };
    
    // If university changes, reset campus
    if (newFilters.university !== undefined && newFilters.university !== filters.university) {
      nextFilters.campus = null;
    }

    setFilters(nextFilters);
    
    // Update URL params
    const params: any = {};
    if (nextFilters.keyword) params.keyword = nextFilters.keyword;
    if (nextFilters.university) params.university = nextFilters.university;
    if (nextFilters.category) params.category = nextFilters.category;
    if (nextFilters.campus) params.campus = nextFilters.campus;
    if (nextFilters.tags.length > 0) params.tags = nextFilters.tags[0]; // Simple single tag for URL
    setSearchParams(params);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag) 
        ? filters.tags.filter(t => t !== tag)
        : [...filters.tags, tag];
    updateFilters({ tags: newTags });
  };

  const clearFilters = () => {
    setFilters({ keyword: '', university: '', category: null, campus: null, tags: [] });
    setAiReasoning(null);
    setSearchParams({});
  };

  return (
    <div className="pb-20 md:pb-10 min-h-screen bg-dark-900">
      <div className="bg-dark-900 border-b border-white/10 shadow-lg mb-6 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-primary-400" />
            サークル検索
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AI Reason Display */}
        {aiReasoning && (
          <div className="mb-6 bg-primary-900/20 border border-primary-500/30 rounded-lg p-4 flex justify-between items-start gap-3 backdrop-blur-sm animate-pulse-glow">
             <div>
                <span className="inline-block text-xs font-bold text-primary-200 bg-primary-900/50 px-2 py-0.5 rounded mb-1 border border-primary-500/30">AIマッチング結果</span>
                <p className="text-sm text-primary-100">{aiReasoning}</p>
             </div>
             <button onClick={() => setAiReasoning(null)} className="text-primary-400 hover:text-primary-200">
               <X className="w-4 h-4" />
             </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR (Desktop Only) */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28 space-y-8">
              <div className="glass-card rounded-lg p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                  <Filter className="w-4 h-4" />
                  条件で絞り込む
                </h3>
                
                {/* Keyword */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">キーワード</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="glass-input w-full pl-9 pr-3 py-2 rounded-md text-sm"
                      placeholder="サークル名など"
                      value={filters.keyword}
                      onChange={(e) => updateFilters({ keyword: e.target.value })}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  </div>
                </div>

                {/* University Search (Autocomplete) */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase flex items-center gap-1">
                    <School className="w-3 h-3" /> 大学
                  </label>
                  <UniversityAutocomplete 
                    value={filters.university} 
                    onChange={(val) => updateFilters({ university: val })} 
                  />
                </div>

                 {/* Campus (Dependent on University) */}
                 <div className={`mb-6 transition-opacity duration-300 ${filters.university ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> キャンパス
                  </label>
                  <select 
                    className="glass-input w-full rounded-md text-sm py-2 px-2 disabled:bg-white/5 disabled:text-gray-600"
                    value={filters.campus || ''}
                    onChange={(e) => updateFilters({ campus: e.target.value || null })}
                    disabled={!filters.university}
                  >
                    <option value="" className="bg-dark-800">
                      {filters.university ? 'すべてのキャンパス' : '大学を選択してください'}
                    </option>
                    {availableCampuses.map(c => (
                      <option key={c} value={c} className="bg-dark-800">{c}</option>
                    ))}
                  </select>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">カテゴリ</label>
                  <select 
                    className="glass-input w-full rounded-md text-sm py-2 px-2"
                    value={filters.category || ''}
                    onChange={(e) => updateFilters({ category: (e.target.value as CircleCategory) || null })}
                  >
                    <option value="" className="bg-dark-800">すべて</option>
                    {Object.values(CircleCategory).map(c => (
                      <option key={c} value={c} className="bg-dark-800">{c}</option>
                    ))}
                  </select>
                </div>

                {/* Tags Sidebar */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">タグ</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`text-xs px-2 py-1 rounded border transition-colors ${
                          filters.tags.includes(tag)
                            ? 'bg-primary-600 border-primary-500 text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={clearFilters}
                  className="w-full mt-6 text-sm text-gray-500 hover:text-white underline transition-colors"
                >
                  条件をクリア
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1">
            
            {/* Mobile Filters (Horizontal Scroll) */}
            <div className="lg:hidden mb-6 space-y-3">
              {/* Mobile Search Input */}
              <div className="relative">
                 <input 
                    type="text" 
                    className="glass-input w-full pl-10 pr-4 py-3 rounded-xl shadow-sm text-sm"
                    placeholder="サークル名・キーワード"
                    value={filters.keyword}
                    onChange={(e) => updateFilters({ keyword: e.target.value })}
                  />
                  <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              </div>

               {/* Mobile University & Campus Select (Stacked for easier touch) */}
               <div className="grid grid-cols-1 gap-2">
                 <UniversityAutocomplete 
                    value={filters.university} 
                    onChange={(val) => updateFilters({ university: val })} 
                  />
                  
                  {filters.university && (
                    <select 
                      className="glass-input w-full rounded-md text-sm py-2 px-3"
                      value={filters.campus || ''}
                      onChange={(e) => updateFilters({ campus: e.target.value || null })}
                    >
                      <option value="" className="bg-dark-800">すべてのキャンパス</option>
                      {availableCampuses.map(c => <option key={c} value={c} className="bg-dark-800">{c}</option>)}
                    </select>
                  )}
               </div>

              {/* Tag/Category Chips */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                <select 
                  className="glass-input flex-shrink-0 py-1.5 px-3 pr-8 rounded-full text-sm focus:outline-none"
                  value={filters.category || ''}
                  onChange={(e) => updateFilters({ category: (e.target.value as CircleCategory) || null })}
                >
                  <option value="" className="bg-dark-800">カテゴリ: すべて</option>
                  {Object.values(CircleCategory).map(c => <option key={c} value={c} className="bg-dark-800">{c}</option>)}
                </select>

                {ALL_TAGS.map(tag => (
                   <button
                   key={tag}
                   onClick={() => handleTagToggle(tag)}
                   className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                     filters.tags.includes(tag)
                       ? 'bg-primary-600 border-primary-500 text-white'
                       : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                   }`}
                 >
                   #{tag}
                 </button>
                ))}
              </div>
            </div>

            {/* Results Count & Current Filter Display */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-white">
                検索結果 <span className="text-primary-400 ml-1">{filteredCircles.length}</span> 件
              </h2>
              {filters.university && (
                <div className="px-3 py-1 rounded-full bg-primary-900/40 border border-primary-500/30 text-primary-200 text-sm flex items-center">
                  <School className="w-3.5 h-3.5 mr-2" />
                  {filters.university}
                  {filters.campus && <span className="mx-1 text-gray-500">/</span>}
                  {filters.campus}
                </div>
              )}
            </div>

            {/* Circle Grid */}
            {filteredCircles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredCircles.map(circle => (
                  <CircleCard key={circle.id} circle={circle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-xl border border-dashed border-white/10">
                <p className="text-gray-400">条件に一致するサークルが見つかりませんでした。</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 text-primary-400 font-medium hover:underline"
                >
                  条件をリセットする
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;