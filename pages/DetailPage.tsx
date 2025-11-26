import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { circleService } from '../services/circleService';
import { MapPin, Calendar, Users, Clock, DollarSign, Instagram, Mail, ChevronLeft, Info, PieChart, HelpCircle, Send } from 'lucide-react';
import ShinkanCalendar from '../components/ShinkanCalendar';
import Modal from '../components/Modal';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const circle = id ? circleService.getCircleById(id) : undefined;
  
  // Contact Form State
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    body: ''
  });
  const [isSending, setIsSending] = useState(false);

  if (!circle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">サークルが見つかりませんでした</h2>
        <Link to="/" className="text-primary-400 mt-4 inline-block hover:underline">TOPへ戻る</Link>
      </div>
    );
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Mock sending email
    setTimeout(() => {
      const targetEmail = circle.contactEmail || circle.representativeEmail || "責任者";
      alert(`送信完了！\n宛先: ${targetEmail}\n\nお問い合わせありがとうございます。担当者より折り返しご連絡いたします。`);
      setIsSending(false);
      setIsContactModalOpen(false);
      setContactForm({ name: '', email: '', subject: '', body: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-12 bg-dark-900 text-gray-100">
      {/* Mobile Back Button */}
      <div className="lg:hidden sticky top-16 z-40 bg-dark-900/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <Link to="/" className="inline-flex items-center text-gray-300 font-medium hover:text-white">
          <ChevronLeft className="w-5 h-5 mr-1" />
          一覧に戻る
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header Info */}
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-primary-900/40 text-primary-300 border border-primary-500/30 rounded-full text-sm font-semibold mb-3">
                {circle.category}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2">
                {circle.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-gray-500" />
                  {circle.university} / {circle.campus.join('・')}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-gray-500" />
                  創立 {circle.foundedYear}年
                </div>
              </div>
            </div>

            {/* Image Gallery (Main Image) */}
            <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 aspect-video sm:aspect-[21/9] bg-dark-800 border border-white/5">
              <img src={circle.imageUrl} alt={circle.name} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition duration-500" />
            </div>

            {/* About Section */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-white/10">
                サークル紹介
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-base sm:text-lg">
                {circle.description}
              </p>
            </section>

            {/* Gallery Grid (Sub images) */}
            {circle.images.length > 1 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-white/10">
                  活動風景
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {circle.images.slice(0, 3).map((img, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden aspect-[4/3] border border-white/5">
                      <img src={img} alt={`Activity ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 opacity-80 hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Welcome Schedule Calendar (New Section) */}
            <section className="mb-10">
              <div className="flex items-end justify-between mb-4 pb-2 border-b border-white/10">
                 <h2 className="text-xl font-bold text-white">
                  新歓スケジュール
                 </h2>
                 <span className="text-xs text-primary-400 font-medium">※日付をホバーして詳細を確認</span>
              </div>
              <div className="max-w-2xl">
                <ShinkanCalendar schedules={circle.schedules || []} />
              </div>
            </section>

            {/* Information Table */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-white/10">
                基本情報
              </h2>
              <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                <dl className="divide-y divide-white/10">
                  <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" /> 活動日
                    </dt>
                    <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2">{circle.activityDays.join('・')}</dd>
                  </div>
                  <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-400 flex items-center">
                      <Users className="w-4 h-4 mr-2" /> メンバー数
                    </dt>
                    <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2">{circle.memberCount}名</dd>
                  </div>
                  
                  {/* Member Breakdown (Conditional) */}
                  {circle.showMemberBreakdown && circle.memberBreakdown && (
                     <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white/5">
                      <dt className="text-sm font-medium text-gray-400 flex items-center self-start">
                        <PieChart className="w-4 h-4 mr-2" /> メンバー構成
                      </dt>
                      <dd className="mt-2 sm:mt-0 sm:col-span-2 space-y-4">
                        {/* Gender */}
                        <div className="flex items-center text-sm gap-4">
                           <div className="flex items-center gap-2">
                             <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500" style={{ width: `${(circle.memberBreakdown.gender.male / (circle.memberBreakdown.gender.male + circle.memberBreakdown.gender.female)) * 100}%` }}></div>
                             </div>
                             <span className="text-blue-400 font-medium">男性 {circle.memberBreakdown.gender.male}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                               <div className="h-full bg-pink-500" style={{ width: `${(circle.memberBreakdown.gender.female / (circle.memberBreakdown.gender.male + circle.memberBreakdown.gender.female)) * 100}%` }}></div>
                             </div>
                             <span className="text-pink-400 font-medium">女性 {circle.memberBreakdown.gender.female}</span>
                           </div>
                        </div>
                        {/* Grade Table */}
                        <div className="overflow-hidden rounded border border-white/10">
                          <table className="min-w-full text-center text-xs">
                            <thead className="bg-white/10 text-gray-300">
                              <tr>
                                <th className="py-1 border-r border-white/10">1年</th>
                                <th className="py-1 border-r border-white/10">2年</th>
                                <th className="py-1 border-r border-white/10">3年</th>
                                <th className="py-1 border-r border-white/10">4年</th>
                                <th className="py-1">他</th>
                              </tr>
                            </thead>
                            <tbody className="bg-dark-800 text-white">
                              <tr>
                                <td className="py-1 border-r border-white/10">{circle.memberBreakdown.grade.y1}</td>
                                <td className="py-1 border-r border-white/10">{circle.memberBreakdown.grade.y2}</td>
                                <td className="py-1 border-r border-white/10">{circle.memberBreakdown.grade.y3}</td>
                                <td className="py-1 border-r border-white/10">{circle.memberBreakdown.grade.y4}</td>
                                <td className="py-1">{circle.memberBreakdown.grade.other}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </dd>
                    </div>
                  )}

                  <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-400 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" /> 会費
                    </dt>
                    <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2">{circle.fee}</dd>
                  </div>
                  {/* Custom Fields */}
                  {circle.customFields && circle.customFields.map((field) => (
                    <div key={field.id} className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-400 flex items-center">
                        <Info className="w-4 h-4 mr-2" /> {field.label}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2">
                        {field.value.startsWith('http') ? (
                          <a href={field.value} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">
                            {field.value}
                          </a>
                        ) : (
                          field.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
            
            {/* FAQ Section (Below Basic Info) */}
            {circle.faqs && circle.faqs.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary-400" />
                  よくある質問
                </h2>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-8">
                  {circle.faqs.map((faq) => (
                    <div key={faq.id} className="group">
                      <h3 className="flex items-start gap-3 font-bold text-lg text-white mb-2">
                        <span className="text-primary-400 font-black">Q.</span>
                        {faq.question}
                      </h3>
                      <div className="flex items-start gap-3 text-gray-300 leading-relaxed ml-1 pl-3 border-l-2 border-white/10 group-hover:border-primary-500/50 transition-colors">
                        <span className="font-bold text-gray-500">A.</span>
                        <p className="whitespace-pre-wrap">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* RIGHT COLUMN: Contact Box (Sticky on Desktop) */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              
              {/* CTA Box */}
              <div className="glass-card rounded-2xl p-6 hidden lg:block shadow-xl">
                <h3 className="text-lg font-bold text-white mb-2">興味を持ったら連絡しよう</h3>
                <p className="text-sm text-gray-400 mb-6">
                  体験練習の参加希望や質問など、SNSのDMから気軽に送ってみましょう！
                </p>
                <div className="space-y-3">
                  {circle.instagramUrl && (
                    <a href={circle.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition shadow-lg shadow-purple-900/30">
                      <Instagram className="w-5 h-5 mr-2" /> Instagram
                    </a>
                  )}
                  {circle.twitterUrl && (
                    <a href={circle.twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full px-4 py-2.5 bg-black text-white border border-white/20 rounded-lg font-bold hover:bg-gray-900 transition shadow-lg">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      X
                    </a>
                  )}
                  <button 
                    onClick={() => setIsContactModalOpen(true)}
                    className="flex items-center justify-center w-full px-4 py-2.5 border border-white/20 text-gray-300 rounded-lg font-bold hover:bg-white/5 transition"
                  >
                    <Mail className="w-5 h-5 mr-2" /> お問い合わせフォーム
                  </button>
                </div>
              </div>

              {/* Tags Box */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">関連タグ</h4>
                <div className="flex flex-wrap gap-2">
                  {circle.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-dark-900 border border-white/10 rounded text-xs text-gray-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY FOOTER CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-white/10 p-4 pb-safe z-50">
        <div className="flex gap-2">
          {/* Always show SNS buttons if available in mobile too, or compact them */}
          {circle.twitterUrl && (
             <a href={circle.twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-lg border border-white/20">
               <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                 <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
               </svg>
             </a>
          )}
          {circle.instagramUrl && (
             <a href={circle.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-600 text-white rounded-lg">
                <Instagram className="w-5 h-5" />
             </a>
          )}
          
          <button 
             onClick={() => setIsContactModalOpen(true)}
             className="flex-1 flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg font-bold shadow-md active:scale-95 transition-transform"
           >
            <Mail className="w-5 h-5 mr-2" /> 問い合わせ
          </button>
        </div>
      </div>

      {/* Contact Form Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="お問い合わせ"
      >
         <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
               <label htmlFor="contactName" className="block text-sm font-medium text-gray-300 mb-1">お名前</label>
               <input 
                  type="text" 
                  id="contactName"
                  required
                  className="glass-input w-full p-2.5 rounded-md"
                  placeholder="山田 太郎"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
               />
            </div>
            <div>
               <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-300 mb-1">メールアドレス</label>
               <input 
                  type="email" 
                  id="contactEmail"
                  required
                  className="glass-input w-full p-2.5 rounded-md"
                  placeholder="email@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
               />
            </div>
            <div>
               <label htmlFor="contactSubject" className="block text-sm font-medium text-gray-300 mb-1">件名</label>
               <input 
                  type="text" 
                  id="contactSubject"
                  required
                  className="glass-input w-full p-2.5 rounded-md"
                  placeholder="入会希望です / 見学について"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
               />
            </div>
            <div>
               <label htmlFor="contactBody" className="block text-sm font-medium text-gray-300 mb-1">お問い合わせ内容</label>
               <textarea 
                  id="contactBody"
                  required
                  rows={4}
                  className="glass-input w-full p-2.5 rounded-md"
                  placeholder="具体的な質問や希望日時などを記入してください"
                  value={contactForm.body}
                  onChange={(e) => setContactForm({...contactForm, body: e.target.value})}
               />
            </div>
            <div className="pt-4 flex justify-end gap-3">
               <button 
                 type="button" 
                 onClick={() => setIsContactModalOpen(false)}
                 className="px-4 py-2 text-sm text-gray-300 hover:text-white"
               >
                 キャンセル
               </button>
               <button 
                 type="submit"
                 disabled={isSending}
                 className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 disabled:opacity-50"
               >
                 {isSending ? '送信中...' : <><Send className="w-4 h-4" /> 送信する</>}
               </button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default DetailPage;