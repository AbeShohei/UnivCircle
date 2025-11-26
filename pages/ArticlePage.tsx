import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_ARTICLES } from '../constants';
import { Calendar, Clock, ArrowLeft, Tag, Share2, Instagram } from 'lucide-react';

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const article = MOCK_ARTICLES.find(a => a.id === id);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center text-white px-4">
        <h2 className="text-2xl font-bold mb-4">記事が見つかりませんでした</h2>
        <Link to="/" className="text-primary-400 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> トップページへ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 pb-20">
      {/* Header Image with Overlay */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <div className="absolute inset-0">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Link to="/" className="inline-flex items-center text-sm text-gray-300 hover:text-white mb-6 transition">
             <ArrowLeft className="w-4 h-4 mr-2" /> 記事一覧に戻る
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
             <span className="px-3 py-1 rounded-full bg-primary-600/80 text-white text-xs font-bold shadow-lg shadow-primary-900/20 backdrop-blur-md">
               {article.category}
             </span>
             <div className="flex items-center text-sm text-gray-300 font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
               <Calendar className="w-3.5 h-3.5 mr-1.5" /> {article.date}
             </div>
             <div className="flex items-center text-sm text-gray-300 font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
               <Clock className="w-3.5 h-3.5 mr-1.5" /> {article.readTime}
             </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6 drop-shadow-2xl">
            {article.title}
          </h1>

          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold text-primary-300 border border-white/10">
               {article.author.charAt(0)}
             </div>
             <div>
               <p className="text-sm font-bold text-white">{article.author}</p>
               <p className="text-xs text-gray-400">UnivCircle 公式ライター</p>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
           
           {/* Main Content */}
           <article className="flex-1 min-w-0">
             {/* Rich Text Content */}
             <div 
               className="prose prose-invert prose-lg max-w-none 
                 prose-headings:text-white prose-headings:font-bold prose-headings:scroll-mt-24
                 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-white/10
                 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-primary-400
                 prose-p:text-gray-300 prose-p:leading-8 prose-p:mb-6
                 prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
                 prose-strong:text-white prose-strong:font-bold
                 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:text-gray-300
                 prose-li:mb-2
                 prose-img:rounded-xl prose-img:shadow-xl prose-img:border prose-img:border-white/10
               "
               dangerouslySetInnerHTML={{ __html: article.content }}
             />

             {/* Tags */}
             <div className="mt-12 pt-8 border-t border-white/10">
               <div className="flex flex-wrap gap-2">
                 {article.tags.map(tag => (
                   <Link 
                     key={tag}
                     to={`/search?keyword=${encodeURIComponent(tag)}`}
                     className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
                   >
                     <Tag className="w-3.5 h-3.5 mr-2" /> #{tag}
                   </Link>
                 ))}
               </div>
             </div>
           </article>

           {/* Sidebar */}
           <aside className="lg:w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                {/* Share */}
                <div className="glass-card rounded-xl p-6 border border-white/10">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                     <Share2 className="w-4 h-4" /> この記事をシェア
                  </h3>
                  <div className="flex gap-2">
                     {/* X (Twitter) */}
                     <button className="flex-1 py-2 bg-black hover:bg-gray-900 text-white rounded-lg flex items-center justify-center transition border border-white/20 shadow-lg">
                       <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                     </button>
                     {/* Instagram */}
                     <button className="flex-1 py-2 bg-gradient-to-tr from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-lg flex items-center justify-center transition shadow-lg shadow-pink-900/20">
                       <Instagram className="w-5 h-5" />
                     </button>
                     {/* LINE */}
                     <button className="flex-1 py-2 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-lg flex items-center justify-center transition shadow-lg shadow-green-900/20">
                       <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                         <path d="M12 2.5C6.6 2.5 2.5 6.2 2.5 10.8c0 4.1 3.2 7.5 7.6 8.1.3 0 .8.1.8.3 0 .2-.1.8-.2 1.4-.1.3-.3 1.2 1 0.6 3.9-2.1 5.3-3.4 5.5-3.6 2.9-1.6 4.8-4.3 4.8-7.2C22 6.2 17.5 2.5 12 2.5z" />
                       </svg>
                     </button>
                  </div>
                </div>

                {/* Related/CTA */}
                <div className="glass-card rounded-xl p-6 border border-white/10 bg-gradient-to-br from-primary-900/20 to-purple-900/20">
                   <h3 className="font-bold text-white mb-2">サークルを探そう</h3>
                   <p className="text-sm text-gray-400 mb-4">
                     記事を読んだ後は、実際に自分に合うサークルを見つけに行こう！
                   </p>
                   <Link 
                     to="/search" 
                     className="block w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold text-center rounded-lg shadow-lg shadow-primary-900/20 transition"
                   >
                     サークル検索へ
                   </Link>
                </div>
              </div>
           </aside>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;