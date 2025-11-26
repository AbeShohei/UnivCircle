import React from 'react';
import { Sparkles, BarChart3, Palette, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateCirclePage: React.FC = () => {
  return (
    <div className="bg-dark-900 min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-600/20 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8">
            部員募集を、<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">もっとスマートに。</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            UnivCircleなら、AIマッチングであなたのサークルにぴったりの新入生が見つかります。<br/>
            ビラ配りやSNS運用だけではない、新しい勧誘のカタチ。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-900/30 transition-all active:scale-95 flex items-center justify-center gap-2">
              無料で掲載をはじめる <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center">
              機能を見る
            </a>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-24 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">UnivCircleが選ばれる理由</h2>
            <p className="text-gray-400">サークル運営に必要な機能を、シンプルに提供します</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 text-blue-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">AIマッチング</h3>
              <p className="text-gray-400 leading-relaxed">
                新入生の興味や性格に基づいて、相性の良いサークルとしてレコメンド。熱量の高い学生と出会えます。
              </p>
            </div>
            <div className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6 text-purple-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">閲覧データ分析</h3>
              <p className="text-gray-400 leading-relaxed">
                ページが見られた回数や、どのタグが効果的だったかを分析。勧誘活動の改善に役立ちます。
              </p>
            </div>
            <div className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-6 text-pink-400">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">魅力的なページ作成</h3>
              <p className="text-gray-400 leading-relaxed">
                活動風景のギャラリーや紹介文を直感的に編集。デザインの知識がなくても、美しい紹介ページが作れます。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-center">掲載までの3ステップ</h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center font-bold text-lg shadow-lg">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">アカウント登録</h3>
                <p className="text-gray-400">大学のメールアドレスで管理者アカウントを作成します。</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center font-bold text-lg shadow-lg">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">サークル情報の入力</h3>
                <p className="text-gray-400">活動内容、写真、SNSリンクなどを入力してページを作成します。</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center font-bold text-lg shadow-lg">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2">掲載スタート</h3>
                <p className="text-gray-400">審査完了後、すぐに学生への公開が始まります。</p>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link to="/signup" className="inline-block w-full sm:w-auto px-12 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition">
              今すぐアカウント作成
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCirclePage;