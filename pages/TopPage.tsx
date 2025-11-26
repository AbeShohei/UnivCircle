import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, ArrowRight, Activity, Music, Palette, BookOpen, Heart, Users, Gamepad2, Dumbbell, Globe, FlaskConical, Laptop, PlusCircle, Calendar, Clock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { CircleCategory } from '../types';
import CircleCard from '../components/CircleCard';
import { getSmartSearchFilters } from '../services/geminiService';
import { circleService } from '../services/circleService';
import { MOCK_ARTICLES } from '../constants';

const TopPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- FEATURED ARTICLES SCROLL STATE ---
  const articleScrollContainerRef = useRef<HTMLDivElement>(null);
  const [isArticlePaused, setIsArticlePaused] = useState(false);
  const articleScrollPos = useRef(0); // Use Ref for float precision

  // --- FEATURED CIRCLES SCROLL STATE ---
  const circleScrollContainerRef = useRef<HTMLDivElement>(null);
  const [isCirclePaused, setIsCirclePaused] = useState(false);
  const circleScrollPos = useRef(-1); // Use Ref for float precision, -1 means uninitialized

  // Get featured circles (Get more to fill the carousel)
  const baseFeaturedCircles = circleService.getAllCircles().slice(0, 8);
  // Triplicate for infinite loop buffer
  const carouselCircles = [...baseFeaturedCircles, ...baseFeaturedCircles, ...baseFeaturedCircles];
  // Triple items for smoother infinite loop simulation with manual scrolling
  const carouselArticles = [...MOCK_ARTICLES, ...MOCK_ARTICLES, ...MOCK_ARTICLES];

  // Infinite Auto-Scroll Logic (Articles: Standard Flow -> Right)
  useEffect(() => {
    const el = articleScrollContainerRef.current;
    if (!el) return;

    let animationId: number;
    const speed = 0.8; // px per frame

    const step = () => {
      if (!el) return;

      if (!isArticlePaused) {
        // Increment float position
        articleScrollPos.current += speed;
        
        // Calculate the width of one set of items (1/3 of total because we triplicated)
        const totalWidth = el.scrollWidth;
        const singleSetWidth = totalWidth / 3;

        // Reset Logic: If we scrolled past the first set, jump back to start
        if (articleScrollPos.current >= singleSetWidth) {
           articleScrollPos.current = 0;
           // If it feels jumpy, we can do: articleScrollPos.current -= singleSetWidth;
           // But setting to 0 is safer for drift.
        }

        el.scrollLeft = articleScrollPos.current;
      } else {
        // Sync Ref with DOM if user is manually scrolling
        articleScrollPos.current = el.scrollLeft;
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isArticlePaused]); // Re-bind if pause state changes


  // Infinite Auto-Scroll Logic (Circles: Reverse Flow <- Left)
  useEffect(() => {
    const el = circleScrollContainerRef.current;
    if (!el) return;

    let animationId: number;
    const speed = 0.8; 

    const step = () => {
      if (!el) return;
      
      const totalWidth = el.scrollWidth;
      const singleSetWidth = totalWidth / 3;

      // Initialization: If ref is -1, jump to the middle set (start of 2nd set)
      if (circleScrollPos.current === -1 && singleSetWidth > 0) {
        circleScrollPos.current = singleSetWidth;
        el.scrollLeft = circleScrollPos.current;
      }

      if (!isCirclePaused && singleSetWidth > 0) {
        // Decrement position (Move Left)
        circleScrollPos.current -= speed;

        // Reset Logic: If we hit the left edge (0), jump to the start of 2nd set
        if (circleScrollPos.current <= 0) {
           circleScrollPos.current = singleSetWidth;
        }

        el.scrollLeft = circleScrollPos.current;
      } else {
        // Sync Ref with DOM if user is manually scrolling
        circleScrollPos.current = el.scrollLeft;
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isCirclePaused, carouselCircles.length]); // Dependency on data length

  // Handlers
  const handleKeywordSearch = () => {
    if (!searchKeyword.trim()) return;
    navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
  };

  const handleAiSearch = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    
    try {
      const result = await getSmartSearchFilters(aiPrompt);
      navigate('/search', { 
        state: { 
          aiFilters: {
            university: result.university,
            category: result.category,
            campus: result.campus,
            tags: result.tags
          },
          aiReasoning: result.reasoning 
        } 
      });
    } catch (e) {
      console.error(e);
      alert("AI検索に失敗しました");
    } finally {
      setIsAiLoading(false);
    }
  };

  const categories = [
    { name: CircleCategory.SPORTS, icon: Activity, color: 'text-blue-400', gradient: 'from-blue-500/20 to-cyan-500/20' },
    { name: CircleCategory.CULTURE, icon: Palette, color: 'text-pink-400', gradient: 'from-pink-500/20 to-rose-500/20' },
    { name: CircleCategory.MUSIC, icon: Music, color: 'text-purple-400', gradient: 'from-purple-500/20 to-indigo-500/20' },
    { name: CircleCategory.ACADEMIC, icon: BookOpen, color: 'text-green-400', gradient: 'from-green-500/20 to-emerald-500/20' },
    { name: CircleCategory.VOLUNTEER, icon: Heart, color: 'text-red-400', gradient: 'from-red-500/20 to-orange-500/20' },
    { name: CircleCategory.OTHER, icon: Users, color: 'text-yellow-400', gradient: 'from-yellow-500/20 to-amber-500/20' },
  ];

  return (
    <div className="bg-dark-900 min-h-screen text-white overflow-hidden relative selection:bg-primary-500 selection:text-white">
      
      {/* 
        =============================================
        3D FLOATING BACKGROUND ELEMENTS 
        =============================================
      */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow"></div>
        <div className="absolute bottom-[0%] right-[-5%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        
        {/* Floating Icons - simulating 3D depth with blur and size */}
        <div className="absolute top-[15%] left-[10%] opacity-20 animate-float-slow">
           <Gamepad2 size={120} className="text-cyan-400 transform -rotate-12 blur-[2px]" />
        </div>
        <div className="absolute top-[20%] right-[15%] opacity-20 animate-float-medium" style={{ animationDelay: '1s' }}>
           <Music size={140} className="text-pink-500 transform rotate-12 blur-[1px]" />
        </div>
        <div className="absolute bottom-[20%] left-[20%] opacity-10 animate-float-fast" style={{ animationDelay: '2s' }}>
           <Dumbbell size={180} className="text-emerald-400 transform -rotate-45 blur-[4px]" />
        </div>
        <div className="absolute top-[40%] right-[5%] opacity-15 animate-float-slow" style={{ animationDelay: '3s' }}>
           <Palette size={100} className="text-yellow-400 transform rotate-6 blur-[3px]" />
        </div>
        <div className="absolute bottom-[10%] right-[30%] opacity-10 animate-float-medium" style={{ animationDelay: '0.5s' }}>
           <Laptop size={160} className="text-indigo-400 transform -rotate-12 blur-[5px]" />
        </div>
         <div className="absolute top-[10%] left-[40%] opacity-10 animate-float-fast" style={{ animationDelay: '1.5s' }}>
           <Globe size={90} className="text-blue-400 transform rotate-45 blur-[2px]" />
        </div>
         <div className="absolute bottom-[30%] left-[-5%] opacity-10 animate-float-slow" style={{ animationDelay: '4s' }}>
           <FlaskConical size={200} className="text-teal-300 transform rotate-12 blur-[6px]" />
        </div>
      </div>

      <div className="relative z-10">
        
        {/* 1. HERO SECTION */}
        <div className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-float-slow">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-300 tracking-wider">2026年度 新歓スタート</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-2xl">
              最大限に楽しめ<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400 text-4xl sm:text-6xl md:text-7xl block mt-2">GO BEYOND THE LIMITS</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              大学生活は、想像よりもっと自由だ。<br/>
              最新のAIマッチングで、あなただけの居場所を見つけよう。
            </p>

            {/* Glass Search Bar */}
            <div className="max-w-2xl mx-auto mb-16 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-2 transition-all group-hover:bg-black/50">
                <Search className="ml-4 w-6 h-6 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="キーワード検索（例: ダンス, プログラミング）" 
                  className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 text-lg h-12 px-4"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleKeywordSearch()}
                />
                <button 
                  onClick={handleKeywordSearch}
                  className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition active:scale-95 flex-shrink-0"
                >
                  検索
                </button>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {['起業', 'テニス', '軽音', '国際交流', 'ハッカソン'].map(tag => (
                <button 
                  key={tag} 
                  onClick={() => navigate(`/search?tags=${tag}`)}
                  className="px-4 py-1.5 rounded-full border border-white/5 bg-white/5 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. AI NEURAL MATCH */}
        <div className="py-20 bg-dark-800/50 backdrop-blur-sm border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="glass-card p-1 rounded-2xl shadow-2xl shadow-primary-900/20">
                  <div className="bg-dark-900/80 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <textarea 
                      className="w-full bg-transparent text-gray-300 font-sans text-sm leading-relaxed resize-none focus:outline-none h-32"
                      placeholder="あなたの理想のサークルを教えてください。&#13;&#10;例: 「プログラミングを学びながら、友達も作りたい。ガチすぎず、でも成長できるような場所がいい。」"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    ></textarea>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                      <span className="text-xs text-gray-600 font-mono">AI_MODEL: GEMINI-2.5-FLASH</span>
                      <button 
                        onClick={handleAiSearch}
                        disabled={isAiLoading}
                        className="group flex items-center gap-2 bg-primary-600/20 hover:bg-primary-600/40 text-primary-400 px-4 py-2 rounded-lg text-sm font-bold transition border border-primary-500/30"
                      >
                        {isAiLoading ? (
                          <Activity className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 group-hover:text-primary-300" />
                            <span>AIマッチング開始</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 text-primary-400 font-bold mb-4 tracking-wider text-sm">
                  <Sparkles className="w-4 h-4" />
                  NEURAL MATCHING
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  探すのではない。<br/>
                  AIが提案する。
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  言語化できない「なんとなく」の希望も、AIが解析します。<br/>
                  あなたの性格やライフスタイルに合ったサークルを、<br/>
                  膨大なデータベースから瞬時に提案。
                </p>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white">98%</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">マッチング精度</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white">0.5s</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">解析速度</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. EXPLORE CATEGORIES */}
        <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">カテゴリから探す</h2>
              <p className="text-gray-400">興味のある分野から直感的に選ぼう</p>
            </div>
            <Link to="/search" className="hidden sm:flex items-center text-sm font-bold text-white hover:text-primary-400 transition">
              すべて見る <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                to={`/search?category=${encodeURIComponent(cat.name)}`}
                className="group relative h-40 rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition duration-500`}></div>
                <div className="absolute inset-0 glass bg-white/5 group-hover:bg-transparent transition"></div>
                
                <div className="relative h-full flex flex-col items-center justify-center p-4 z-10">
                  <div className={`p-3 rounded-xl bg-black/20 backdrop-blur-sm mb-3 group-hover:scale-110 transition duration-300 ${cat.color}`}>
                    <cat.icon size={28} />
                  </div>
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white text-center">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 3.5 FEATURED ARTICLES CAROUSEL (Infinite Scroll with Manual Override) */}
        <div className="py-12 bg-dark-800/30 border-y border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">特集記事</h2>
                <p className="text-gray-400">先輩の体験談や新歓攻略情報をお届け</p>
              </div>
            </div>
          </div>

          {/* Infinite Scroll Container (Interactive) */}
          <div className="w-full relative [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
            <div 
              ref={articleScrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide gap-6 px-4 py-4 cursor-grab active:cursor-grabbing"
              onMouseEnter={() => setIsArticlePaused(true)}
              onMouseLeave={() => setIsArticlePaused(false)}
              onTouchStart={() => setIsArticlePaused(true)}
              onTouchEnd={() => setIsArticlePaused(false)}
            >
              {carouselArticles.map((article, index) => (
                <div 
                  key={`${article.id}-${index}`} 
                  className="w-[280px] sm:w-[320px] flex-shrink-0 group select-none"
                >
                  <Link to={`/article/${article.id}`} className="block h-full">
                    <div className="rounded-xl overflow-hidden glass-card border border-white/10 hover:border-primary-500/30 transition-all duration-300 h-full flex flex-col hover:transform hover:translate-y-[-4px] shadow-lg">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          draggable="false"
                        />
                        <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white border border-white/10">
                          {article.category}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                          {article.title}
                        </h3>
                        <div className="mt-auto pt-4 flex items-center text-sm font-bold text-gray-400 group-hover:text-white transition-colors">
                          記事を読む <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. FEATURED CIRCLES (Infinite Scroll - Reverse Direction) */}
        <div className="py-24 bg-gradient-to-t from-black to-dark-900 relative">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-white">注目のサークル</h2>
               <Link to="/search" className="sm:hidden text-sm font-bold text-primary-400">
                すべて見る
              </Link>
            </div>
            
            {/* Scroll Container (Reverse Infinite Scroll) */}
            <div className="w-full relative [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
              <div 
                ref={circleScrollContainerRef}
                className="flex overflow-x-auto scrollbar-hide gap-6 px-4 py-8 cursor-grab active:cursor-grabbing"
                onMouseEnter={() => setIsCirclePaused(true)}
                onMouseLeave={() => setIsCirclePaused(false)}
                onTouchStart={() => setIsCirclePaused(true)}
                onTouchEnd={() => setIsCirclePaused(false)}
              >
                {carouselCircles.map((circle, idx) => (
                  <div key={`${circle.id}-${idx}`} className="w-[300px] sm:w-[350px] flex-shrink-0 select-none transform transition-transform">
                     <CircleCard circle={circle} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. LIST YOUR CIRCLE CTA */}
        <div className="py-20 border-t border-white/5 relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none"></div>

           <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                あなたのサークルも掲載しませんか？
              </h2>
              <p className="text-gray-300 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
                UnivCircleなら、AIマッチングで相性の良い新入生と出会えます。<br/>
                登録は完全無料。最短3分でサークルページを作成可能です。
              </p>
              
              <Link 
                to="/create-circle"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-900/40 transition-all transform hover:scale-105 hover:-translate-y-1"
              >
                <PlusCircle className="w-5 h-5" />
                無料で掲載をはじめる
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
};

export default TopPage;