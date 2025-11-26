import React, { useState } from 'react';
import { Send, CheckCircle, TrendingUp, Users, Target, Building2, Calendar, Crown } from 'lucide-react';

const AdsInfoPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    plan: 'monthly',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submission
    setTimeout(() => {
      alert('お問い合わせありがとうございます。\n担当者より3営業日以内にご連絡いたします。');
      setIsSubmitting(false);
      setForm({ companyName: '', contactPerson: '', email: '', plan: 'monthly', message: '' });
    }, 1500);
  };

  return (
    <div className="bg-dark-900 min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 sm:py-32 bg-dark-800">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary-400 mb-6">
            <Building2 className="w-4 h-4" /> 企業・店舗様向け
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-8 leading-tight">
            熱量の高い大学生に、<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">ダイレクトに届ける。</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            UnivCircle Connectは、AIマッチングを活用した新しいサークルプラットフォームです。<br />
            特定の大学、興味関心を持つ学生層へ、効果的にアプローチできます。
          </p>
          <a href="#plans" className="px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition shadow-lg">
            料金プランを見る
          </a>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">UnivCircle広告の強み</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 text-blue-400">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">精度の高いターゲティング</h3>
            <p className="text-gray-400 leading-relaxed">
              「早稲田大学」「テニス」「プログラミング」など、大学や興味タグに基づいたピンポイントな広告配信が可能です。
            </p>
          </div>
          <div className="glass-card p-8 rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-6 text-pink-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">新入生への早期接触</h3>
            <p className="text-gray-400 leading-relaxed">
              サークル選びが活発化する3月〜5月の新歓期に、最もアクティブな新入生層へアプローチできます。
            </p>
          </div>
          <div className="glass-card p-8 rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6 text-green-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">高いエンゲージメント</h3>
            <p className="text-gray-400 leading-relaxed">
              自分に合ったコミュニティを探している能動的なユーザーが多いため、広告への反応率が高い傾向にあります。
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div id="plans" className="py-24 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">選べる掲載プラン</h2>
            <p className="text-gray-400">ニーズに合わせて柔軟なプランをご用意しています</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <div className="glass-card rounded-2xl p-8 border border-white/10 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Calendar className="w-24 h-24" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">マンスリープラン</h3>
              <p className="text-gray-400 mb-6">短期集中でのプロモーションに最適</p>
              
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-black text-white">¥50,000</span>
                <span className="text-gray-400 ml-2">/ 月 (税別)</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                  トップページへのバナー掲載
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                  検索結果一覧へのインフィード広告
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                  月次レポートの提出
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                  最短1ヶ月から契約可能
                </li>
              </ul>

              <a href="#contact" className="block w-full py-4 rounded-xl border border-white/20 text-center font-bold hover:bg-white/5 transition">
                申し込む
              </a>
            </div>

            {/* Yearly Plan */}
            <div className="glass-card rounded-2xl p-8 border-2 border-primary-500 relative overflow-hidden flex flex-col transform md:-translate-y-4 shadow-2xl shadow-primary-900/20">
              <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                人気No.1
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Crown className="w-24 h-24" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">年間パスポート</h3>
              <p className="text-primary-200 mb-6">通年でのブランディングにおすすめ</p>
              
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-black text-white">¥500,000</span>
                <span className="text-gray-400 ml-2">/ 年 (税別)</span>
              </div>
              <p className="text-sm text-green-400 font-bold mb-8">月額プランより ¥100,000 お得！</p>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-white font-medium">
                  <CheckCircle className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                  マンスリープランの全機能
                </li>
                <li className="flex items-center text-white font-medium">
                  <CheckCircle className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                  <span className="border-b border-primary-400/50">優先的な表示枠の確保</span>
                </li>
                <li className="flex items-center text-white font-medium">
                  <CheckCircle className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                  特集記事の作成・掲載 (年2回)
                </li>
                <li className="flex items-center text-white font-medium">
                  <CheckCircle className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                  サークル代表者向けメルマガ配信
                </li>
              </ul>

              <a href="#contact" className="block w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-center font-bold hover:from-primary-500 hover:to-primary-400 transition shadow-lg">
                今すぐ申し込む
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div id="contact" className="py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-8 sm:p-12 border border-white/10">
          <h2 className="text-2xl font-bold mb-8 text-center">お問い合わせ・お申し込み</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">貴社名</label>
                <input 
                  type="text" 
                  required
                  value={form.companyName}
                  onChange={(e) => setForm({...form, companyName: e.target.value})}
                  className="glass-input w-full p-3 rounded-lg"
                  placeholder="株式会社○○"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">ご担当者名</label>
                <input 
                  type="text" 
                  required
                  value={form.contactPerson}
                  onChange={(e) => setForm({...form, contactPerson: e.target.value})}
                  className="glass-input w-full p-3 rounded-lg"
                  placeholder="山田 太郎"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">メールアドレス</label>
              <input 
                type="email" 
                required
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="glass-input w-full p-3 rounded-lg"
                placeholder="info@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">ご検討中のプラン</label>
              <select 
                value={form.plan}
                onChange={(e) => setForm({...form, plan: e.target.value})}
                className="glass-input w-full p-3 rounded-lg"
              >
                <option value="monthly" className="bg-dark-800">マンスリープラン (月額)</option>
                <option value="yearly" className="bg-dark-800">年間パスポート (年額)</option>
                <option value="other" className="bg-dark-800">その他・相談したい</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">お問い合わせ内容</label>
              <textarea 
                rows={4}
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                className="glass-input w-full p-3 rounded-lg"
                placeholder="ご質問やご要望があればご記入ください"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? '送信中...' : <><Send className="w-5 h-5" /> 送信する</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdsInfoPage;