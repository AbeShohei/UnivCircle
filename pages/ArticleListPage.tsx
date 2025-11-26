import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_ARTICLES } from '../constants';
import { Calendar, Clock, ArrowRight, Tag, BookOpen } from 'lucide-react';

const ArticleListPage: React.FC = () => {
  return (
    <div className="bg-dark-900 min-h-screen text-gray-100">
      {/* Hero Section */}
      <div className="relative py-20 bg-dark-800 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary-400 mb-6">
            <BookOpen className="w-4 h-4" /> UnivCircle メディア
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-6 text-white">
            記事一覧
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            サークル選びのコツから、新歓コンパの攻略法、先輩へのインタビューまで。<br />
            大学生活を充実させるための情報を発信しています。
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_ARTICLES.map((article) => (
            <Link key={article.id} to={`/article/${article.id}`} className="group block h-full">
              <div className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-primary-500/30 transition-all duration-300 h-full flex flex-col hover:transform hover:translate-y-[-4px] shadow-lg hover:shadow-primary-900/10">
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10 shadow-sm">
                    {article.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-gray-500">By {article.author}</span>
                    <span className="flex items-center text-sm font-bold text-primary-400 group-hover:text-primary-300 transition-colors">
                      記事を読む <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleListPage;