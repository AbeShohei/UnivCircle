import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Image as ImageIcon, School, AlertTriangle, Loader2, Users, Plus, X, HelpCircle, Sparkles, Mail, Calendar, Upload } from 'lucide-react';
import { MOCK_UNIVERSITIES, ALL_TAGS } from '../constants';
import { CircleCategory, CustomField, FAQ, ScheduleEvent } from '../types';
import UniversityAutocomplete from '../components/UniversityAutocomplete';
import { circleService } from '../services/circleService';
import { refineDescription } from '../services/geminiService';
import Modal from '../components/Modal';

const CircleRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    category: CircleCategory.OTHER,
    campus: [] as string[],
    activityDays: [] as string[],
    memberCount: 10,
    fee: '',
    shortDescription: '',
    description: '',
    representativeEmail: '',
    contactEmail: '', // New field for notification email
    imageUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    foundedYear: new Date().getFullYear(),
    tags: [] as string[],
    customFields: [] as CustomField[],
    faqs: [] as FAQ[],
    schedules: [] as ScheduleEvent[],
    // Member Breakdown
    showMemberBreakdown: false,
    maleCount: 0,
    femaleCount: 0,
    gradeY1: 0,
    gradeY2: 0,
    gradeY3: 0,
    gradeY4: 0,
    gradeOther: 0
  });

  // Schedule Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Omit<ScheduleEvent, 'id'>>({
    date: '',
    title: '',
    content: '',
    location: '',
    capacity: '',
    startTime: '',
    endTime: ''
  });

  // Available Campuses based on University
  const availableCampuses = useMemo(() => {
    if (!formData.university) return [];
    const uni = MOCK_UNIVERSITIES.find(u => u.name === formData.university);
    return uni ? uni.campuses : [];
  }, [formData.university]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Checkbox handling for boolean
    if (type === 'checkbox' && name === 'showMemberBreakdown') {
       setFormData(prev => ({ ...prev, showMemberBreakdown: (e.target as HTMLInputElement).checked }));
       return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCampusChange = (campus: string) => {
    setFormData(prev => {
      const newCampuses = prev.campus.includes(campus)
        ? prev.campus.filter(c => c !== campus)
        : [...prev.campus, campus];
      return { ...prev, campus: newCampuses };
    });
  };

  const handleDayChange = (day: string) => {
     setFormData(prev => {
      const newDays = prev.activityDays.includes(day)
        ? prev.activityDays.filter(d => d !== day)
        : [...prev.activityDays, day];
      return { ...prev, activityDays: newDays };
    });
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  // AI Refine Handler
  const handleAiRefine = async () => {
    if (!formData.description) return;
    setIsAiLoading(true);
    try {
      const refinedText = await refineDescription(formData.description);
      setFormData(prev => ({ ...prev, description: refinedText }));
    } catch (error) {
      alert('AIによる生成に失敗しました。');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Image Upload Mock
  const handleImageUploadMock = () => {
    // Simulate upload delay
    setTimeout(() => {
      const randomId = Math.floor(Math.random() * 1000);
      setFormData(prev => ({ ...prev, imageUrl: `https://picsum.photos/800/600?random=${randomId}` }));
    }, 500);
  };

  // FAQ Handlers
  const handleAddFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { id: Date.now().toString(), question: '', answer: '' }]
    }));
  };

  const handleUpdateFAQ = (id: string, field: keyof FAQ, value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map(faq => faq.id === id ? { ...faq, [field]: value } : faq)
    }));
  };

  const handleRemoveFAQ = (id: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter(faq => faq.id !== id)
    }));
  };

  // Schedule Handlers
  const handleAddSchedule = () => {
    if (!newSchedule.date || !newSchedule.title) {
      alert('日付とタイトルは必須です');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      schedules: [...prev.schedules, { ...newSchedule, id: `sch-${Date.now()}` }]
    }));
    
    setNewSchedule({
      date: '',
      title: '',
      content: '',
      location: '',
      capacity: '',
      startTime: '',
      endTime: ''
    });
    setIsScheduleModalOpen(false);
  };

  const handleRemoveSchedule = (id: string) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.filter(s => s.id !== id)
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'サークル名は必須です';
    if (!formData.university) newErrors.university = '大学名は必須です';
    if (formData.campus.length === 0) newErrors.campus = '活動キャンパスを選択してください';
    if (!formData.description) newErrors.description = '紹介文は必須です';
    if (!formData.representativeEmail) newErrors.representativeEmail = '責任者のメールアドレスは必須です';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // Get current user ID (mock)
      const user = JSON.parse(localStorage.getItem('univCircleUser') || '{}');
      const adminId = user.id || 'guest';

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const memberBreakdown = formData.showMemberBreakdown ? {
        gender: { male: Number(formData.maleCount), female: Number(formData.femaleCount) },
        grade: { 
          y1: Number(formData.gradeY1), 
          y2: Number(formData.gradeY2), 
          y3: Number(formData.gradeY3), 
          y4: Number(formData.gradeY4), 
          other: Number(formData.gradeOther) 
        }
      } : undefined;

      // If contactEmail is empty, default to representativeEmail
      const finalContactEmail = formData.contactEmail || formData.representativeEmail;

      circleService.registerCircle({
        ...formData,
        contactEmail: finalContactEmail,
        memberCount: Number(formData.memberCount),
        imageUrl: formData.imageUrl || `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
        images: formData.imageUrl ? [formData.imageUrl] : [`https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`],
        adminId,
        memberBreakdown,
      });

      // Redirect to Admin page to see the new circle
      navigate('/admin');
    } catch (error) {
      alert('登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日'];

  return (
    <div className="bg-dark-900 min-h-screen text-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">サークル新規登録</h1>
          <p className="text-gray-400 mt-2">あなたのサークルの魅力を伝えましょう</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 sm:p-8 space-y-8 border border-white/10">
          
          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">基本情報</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">サークル名 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className={`glass-input w-full rounded-md p-3 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="正式名称を入力してください"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">大学 <span className="text-red-500">*</span></label>
                <UniversityAutocomplete 
                  value={formData.university}
                  onChange={(val) => setFormData(prev => ({ ...prev, university: val, campus: [] }))}
                />
                {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">カテゴリ</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="glass-input w-full rounded-md p-3"
                >
                  {Object.values(CircleCategory).map(c => (
                    <option key={c} value={c} className="bg-dark-800">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">活動キャンパス <span className="text-red-500">*</span></label>
              {formData.university ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableCampuses.map(campus => (
                    <label key={campus} className="inline-flex items-center p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
                      <input 
                        type="checkbox"
                        checked={formData.campus.includes(campus)}
                        onChange={() => handleCampusChange(campus)}
                        className="rounded border-gray-600 bg-dark-900 text-primary-500 focus:ring-primary-500 w-4 h-4"
                      />
                      <span className="ml-2 text-sm text-gray-300">{campus}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-white/5 border border-dashed border-white/20 text-gray-500 text-sm flex items-center gap-2">
                  <School className="w-4 h-4" /> 大学を選択するとキャンパスが表示されます
                </div>
              )}
               {errors.campus && <p className="text-red-500 text-xs mt-1">{errors.campus}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">責任者メールアドレス <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input 
                  type="email" 
                  name="representativeEmail" 
                  value={formData.representativeEmail} 
                  onChange={handleChange}
                  className={`glass-input w-full rounded-md pl-10 p-3 ${errors.representativeEmail ? 'border-red-500' : ''}`}
                  placeholder="contact@circle.com"
                />
              </div>
              {errors.representativeEmail && <p className="text-red-500 text-xs mt-1">{errors.representativeEmail}</p>}
            </div>
          </div>

          {/* Activity Details */}
           <div className="space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">活動詳細</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">活動曜日</label>
              <div className="flex flex-wrap gap-2">
                 {daysOfWeek.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayChange(day)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        formData.activityDays.includes(day)
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40 scale-110'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {day}
                    </button>
                 ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
               <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">人数</label>
                <input 
                  type="number" 
                  name="memberCount" 
                  value={formData.memberCount} 
                  onChange={handleChange}
                  className="glass-input w-full rounded-md p-3"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">会費・部費 (目安)</label>
                <input 
                  type="text" 
                  name="fee" 
                  value={formData.fee} 
                  onChange={handleChange}
                  placeholder="例: 年間5000円"
                  className="glass-input w-full rounded-md p-3"
                />
              </div>
            </div>

            {/* Member Breakdown Section */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
               <div className="flex items-center justify-between mb-4">
                 <label className="text-sm font-medium text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-400" /> メンバー構成の内訳
                 </label>
                 <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="showMemberBreakdown"
                      checked={formData.showMemberBreakdown}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-300">公開する</span>
                 </label>
               </div>
               
               <div className={`space-y-4 transition-all duration-300 ${formData.showMemberBreakdown ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs text-gray-400 mb-1">男性</label>
                       <input type="number" name="maleCount" value={formData.maleCount} onChange={handleChange} className="glass-input w-full p-2 text-sm rounded-md" />
                     </div>
                     <div>
                       <label className="block text-xs text-gray-400 mb-1">女性</label>
                       <input type="number" name="femaleCount" value={formData.femaleCount} onChange={handleChange} className="glass-input w-full p-2 text-sm rounded-md" />
                     </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                     <div>
                       <label className="block text-xs text-center text-gray-400 mb-1">1年</label>
                       <input type="number" name="gradeY1" value={formData.gradeY1} onChange={handleChange} className="glass-input w-full p-2 text-sm rounded-md text-center" />
                     </div>
                     <div>
                       <label className="block text-xs text-center text-gray-400 mb-1">2年</label>
                       <input type="number" name="gradeY2" value={formData.gradeY2} onChange={handleChange} className="glass-input w-full p-2 text-sm rounded-md text-center" />
                     </div>
                     <div>
                       <label className="block text-xs text-center text-gray-400 mb-1">3年</label>
                       <input type="number" name="gradeY3" value={formData.gradeY3} onChange={handleChange} className="glass-input w-full p-2 text-sm rounded-md text-center" />
                     </div>
                     <div>
                       <label className="block text-xs text-center text-gray-400 mb-1">4年</label>
                       <input type="number" name="gradeY4" value={formData.gradeY4} onChange={handleChange} className="glass-input w-full p-2 text-sm rounded-md text-center" />
                     </div>
                     <div>
                       <label className="block text-xs text-center text-gray-400 mb-1">その他</label>
                       <input type="number" name="gradeOther" value={formData.gradeOther} onChange={handleChange} className="glass-input w-full p-2 text-sm rounded-md text-center" />
                     </div>
                  </div>
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">短い紹介文 (一覧用)</label>
              <input 
                type="text" 
                name="shortDescription" 
                value={formData.shortDescription} 
                onChange={handleChange}
                placeholder="サークルのキャッチコピーを一言で"
                className="glass-input w-full rounded-md p-3"
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                 <label className="block text-sm font-medium text-gray-300">詳細紹介文 <span className="text-red-500">*</span></label>
                 <button 
                    type="button"
                    onClick={handleAiRefine}
                    disabled={isAiLoading || !formData.description}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-purple-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    AIで推敲・魅力アップ
                 </button>
              </div>
              <div className="relative">
                <textarea 
                  name="description" 
                  rows={8}
                  value={formData.description} 
                  onChange={handleChange}
                  placeholder="活動内容、雰囲気、イベントなどを詳しく書いてください"
                  className={`glass-input w-full rounded-md p-3 leading-relaxed ${errors.description ? 'border-red-500' : ''}`}
                />
                {isAiLoading && (
                  <div className="absolute inset-0 bg-dark-900/50 backdrop-blur-[1px] flex items-center justify-center rounded-md">
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-2" />
                      <span className="text-xs text-primary-200 font-medium">AIが文章を生成中...</span>
                    </div>
                  </div>
                )}
              </div>
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

             {/* Tags Selector */}
             <div>
               <label className="block text-sm font-medium text-gray-300 mb-2">タグ</label>
               <div className="flex flex-wrap gap-2">
                 {ALL_TAGS.map(tag => (
                   <button
                     key={tag}
                     type="button"
                     onClick={() => handleTagToggle(tag)}
                     className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                       formData.tags.includes(tag)
                         ? 'bg-primary-600 border-primary-500 text-white shadow-md'
                         : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                     }`}
                   >
                     #{tag}
                   </button>
                 ))}
               </div>
               <p className="text-xs text-gray-500 mt-2">※適切なタグを選択することで、検索されやすくなります。</p>
             </div>
           </div>

           {/* Schedule Section */}
           <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h2 className="text-xl font-bold text-white">新歓スケジュール</h2>
                <button 
                  type="button"
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="text-sm flex items-center gap-1 text-primary-400 hover:text-primary-300"
                >
                  <Plus className="w-4 h-4" /> 日程を追加
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.schedules.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {formData.schedules.map((schedule) => (
                      <div key={schedule.id} className="p-4 bg-white/5 rounded-lg border border-white/10 relative group">
                        <button 
                          type="button"
                          onClick={() => handleRemoveSchedule(schedule.id)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 text-primary-400 font-bold mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>{schedule.date}</span>
                        </div>
                        <h3 className="font-bold text-white mb-2">{schedule.title}</h3>
                        <p className="text-xs text-gray-400 line-clamp-2">{schedule.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                   <div className="text-center py-6 text-gray-500 border border-dashed border-white/10 rounded-lg">
                     <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                     <p className="text-sm">新歓イベントを登録して新入生を集めましょう</p>
                   </div>
                )}
              </div>
           </div>

           {/* FAQ Section */}
           <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h2 className="text-xl font-bold text-white">よくある質問 (任意)</h2>
                <button 
                  type="button"
                  onClick={handleAddFAQ}
                  className="text-sm flex items-center gap-1 text-primary-400 hover:text-primary-300"
                >
                  <Plus className="w-4 h-4" /> 質問を追加
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.faqs.map((faq) => (
                  <div key={faq.id} className="p-4 bg-white/5 rounded-lg border border-white/10 relative">
                     <button 
                       type="button"
                       onClick={() => handleRemoveFAQ(faq.id)}
                       className="absolute top-2 right-2 text-gray-500 hover:text-red-400 p-1"
                     >
                       <X className="w-4 h-4" />
                     </button>
                     <div className="space-y-3">
                       <div>
                         <label className="block text-xs font-medium text-gray-400 mb-1">質問 (Q)</label>
                         <input 
                           type="text" 
                           value={faq.question}
                           onChange={(e) => handleUpdateFAQ(faq.id, 'question', e.target.value)}
                           className="glass-input w-full rounded-md p-2 text-sm"
                           placeholder="例: 初心者でも大丈夫ですか？"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-medium text-gray-400 mb-1">回答 (A)</label>
                         <textarea 
                           rows={2}
                           value={faq.answer}
                           onChange={(e) => handleUpdateFAQ(faq.id, 'answer', e.target.value)}
                           className="glass-input w-full rounded-md p-2 text-sm leading-relaxed"
                           placeholder="回答を入力"
                         />
                       </div>
                     </div>
                  </div>
                ))}
                {formData.faqs.length === 0 && (
                   <div className="text-center py-6 text-gray-500 border border-dashed border-white/10 rounded-lg">
                     <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                     <p className="text-sm">よくある質問を追加して、新入生の不安を解消しましょう</p>
                   </div>
                )}
              </div>
           </div>

           {/* Media & Links */}
           <div className="space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">メディア・リンク</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">メイン画像</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                 <div className="flex-1 w-full">
                    <div className="flex gap-2 mb-2">
                       <input 
                          type="text" 
                          name="imageUrl" 
                          value={formData.imageUrl} 
                          onChange={handleChange}
                          placeholder="画像URL (https://...)"
                          className="glass-input w-full rounded-md p-3"
                        />
                    </div>
                    <button 
                       type="button"
                       onClick={handleImageUploadMock}
                       className="text-xs flex items-center gap-1 px-3 py-2 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-gray-300 transition"
                    >
                       <Upload className="w-3 h-3" /> 画像をアップロード (ファイル選択)
                    </button>
                 </div>
                 
                 <div className="w-full sm:w-40 aspect-video bg-white/5 border border-white/10 rounded-md flex items-center justify-center overflow-hidden relative">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-500">
                         <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                         <span className="text-xs">プレビュー</span>
                      </div>
                    )}
                 </div>
              </div>
            </div>

             <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Instagram URL</label>
                  <input type="text" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} className="glass-input w-full rounded-md p-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">X URL</label>
                  <input type="text" name="twitterUrl" value={formData.twitterUrl} onChange={handleChange} className="glass-input w-full rounded-md p-3" placeholder="x.com/..." />
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">お問い合わせ通知先メールアドレス</label>
                <input 
                  type="email" 
                  name="contactEmail" 
                  value={formData.contactEmail} 
                  onChange={handleChange} 
                  className="glass-input w-full rounded-md p-3"
                  placeholder="未入力の場合は責任者メールアドレスに通知されます"
                />
                <p className="text-xs text-gray-500 mt-1">「お問い合わせフォーム」からの連絡を受け取るアドレスです。</p>
             </div>
           </div>

           {/* Actions */}
           <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
             <button 
               type="button" 
               onClick={() => navigate('/profile')}
               className="px-6 py-3 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition"
             >
               キャンセル
             </button>
             <button 
               type="submit"
               disabled={isSubmitting}
               className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-lg font-bold shadow-lg shadow-primary-900/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isSubmitting ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin" />
                   登録中...
                 </>
               ) : (
                 <>
                   <Save className="w-5 h-5" />
                   サークルを登録する
                 </>
               )}
             </button>
           </div>
        </form>
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="新歓日程を追加"
        footer={
           <>
              <button onClick={() => setIsScheduleModalOpen(false)} className="px-4 py-2 text-sm text-gray-300 hover:text-white">キャンセル</button>
              <button onClick={handleAddSchedule} className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-500">追加する</button>
           </>
        }
      >
         <div className="space-y-4">
            <div>
               <label className="block text-xs font-medium text-gray-400 mb-1">日付 <span className="text-red-500">*</span></label>
               <input 
                 type="date" 
                 value={newSchedule.date}
                 onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                 className="glass-input w-full p-2 rounded-md"
               />
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-400 mb-1">イベント名 <span className="text-red-500">*</span></label>
               <input 
                 type="text" 
                 value={newSchedule.title}
                 onChange={(e) => setNewSchedule({...newSchedule, title: e.target.value})}
                 placeholder="例: 体験練習会"
                 className="glass-input w-full p-2 rounded-md"
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-medium text-gray-400 mb-1">開始時間</label>
                 <input 
                   type="time" 
                   value={newSchedule.startTime}
                   onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
                   className="glass-input w-full p-2 rounded-md"
                 />
               </div>
               <div>
                 <label className="block text-xs font-medium text-gray-400 mb-1">終了時間</label>
                 <input 
                   type="time" 
                   value={newSchedule.endTime}
                   onChange={(e) => setNewSchedule({...newSchedule, endTime: e.target.value})}
                   className="glass-input w-full p-2 rounded-md"
                 />
               </div>
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-400 mb-1">場所</label>
               <input 
                 type="text" 
                 value={newSchedule.location}
                 onChange={(e) => setNewSchedule({...newSchedule, location: e.target.value})}
                 placeholder="例: 学生会館302"
                 className="glass-input w-full p-2 rounded-md"
               />
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-400 mb-1">定員</label>
               <input 
                 type="text" 
                 value={newSchedule.capacity}
                 onChange={(e) => setNewSchedule({...newSchedule, capacity: e.target.value})}
                 placeholder="例: 20名"
                 className="glass-input w-full p-2 rounded-md"
               />
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-400 mb-1">詳細内容</label>
               <textarea 
                 rows={3}
                 value={newSchedule.content}
                 onChange={(e) => setNewSchedule({...newSchedule, content: e.target.value})}
                 placeholder="イベントの内容を詳しく..."
                 className="glass-input w-full p-2 rounded-md"
               />
            </div>
         </div>
      </Modal>
    </div>
  );
};

export default CircleRegisterPage;