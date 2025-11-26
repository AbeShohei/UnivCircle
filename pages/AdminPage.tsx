import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, MapPin, Sparkles, Trash2, Plus, Users, LayoutDashboard, Loader2, MoreVertical, X, AlertTriangle, HelpCircle, Calendar, Clock, Edit, Mail } from 'lucide-react';
import { CircleCategory, Circle, CustomField, FAQ, ScheduleEvent } from '../types';
import { MOCK_UNIVERSITIES, ALL_TAGS } from '../constants';
import { refineDescription } from '../services/geminiService';
import { circleService } from '../services/circleService';
import Modal from '../components/Modal';

// Mock Member Data Type
interface Member {
  id: string;
  name: string;
  grade: string;
  role: string;
  department: string;
}

const MOCK_MEMBERS: Member[] = [
  { id: '1', name: '早稲田 太郎', grade: '3年', role: '幹事長', department: '政治経済学部' },
  { id: '2', name: '大隈 花子', grade: '3年', role: '副幹事長', department: '文学部' },
  { id: '3', name: '佐藤 健太', grade: '2年', role: '会計', department: '商学部' },
  { id: '4', name: '鈴木 一郎', grade: '2年', role: '企画', department: '法学部' },
  { id: '5', name: '田中 美咲', grade: '2年', role: '広報', department: '国際教養学部' },
];

type Tab = 'basic' | 'gallery' | 'members' | 'schedules';

// Deletion Target State
type DeleteTarget = 
  | { type: 'image'; index: number }
  | { type: 'member'; id: string; name: string }
  | { type: 'schedule'; id: string; title: string }
  | null;

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('basic');
  
  // State for Circle Data
  const [circleData, setCircleData] = useState<Circle | null>(null);
  
  // Local UI State
  const [description, setDescription] = useState('');
  const [representativeEmail, setRepresentativeEmail] = useState('');
  const [contactEmail, setContactEmail] = useState(''); // New State for contact email
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  
  // Schedule Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<Partial<ScheduleEvent>>({});

  // Member Breakdown State
  const [breakdown, setBreakdown] = useState<{
    show: boolean;
    male: number;
    female: number;
    y1: number;
    y2: number;
    y3: number;
    y4: number;
    other: number;
  }>({ show: false, male: 0, female: 0, y1: 0, y2: 0, y3: 0, y4: 0, other: 0 });

  useEffect(() => {
    // Load the user's circle
    const user = JSON.parse(localStorage.getItem('univCircleUser') || '{}');
    const managedCircles = circleService.getManagedCircles(user.id);
    
    // For demo, just pick the first one
    if (managedCircles.length > 0) {
      const targetCircle = managedCircles[0];
      setCircleData(targetCircle);
      setDescription(targetCircle.description);
      setRepresentativeEmail(targetCircle.representativeEmail || '');
      setContactEmail(targetCircle.contactEmail || targetCircle.representativeEmail || '');
      setImages(targetCircle.images);
      setCustomFields(targetCircle.customFields || []);
      setFaqs(targetCircle.faqs || []);
      setSchedules(targetCircle.schedules || []);
      
      // Initialize breakdown state
      if (targetCircle.memberBreakdown) {
        setBreakdown({
            show: targetCircle.showMemberBreakdown || false,
            male: targetCircle.memberBreakdown.gender.male,
            female: targetCircle.memberBreakdown.gender.female,
            y1: targetCircle.memberBreakdown.grade.y1,
            y2: targetCircle.memberBreakdown.grade.y2,
            y3: targetCircle.memberBreakdown.grade.y3,
            y4: targetCircle.memberBreakdown.grade.y4,
            other: targetCircle.memberBreakdown.grade.other,
        });
      }
    }
  }, []);

  const universityInfo = circleData ? MOCK_UNIVERSITIES.find(u => u.name === circleData.university) : null;

  // AI Refine Handler
  const handleAiRefine = async () => {
    if (!description) return;
    setIsAiLoading(true);
    try {
      const refinedText = await refineDescription(description);
      setDescription(refinedText);
    } catch (error) {
      alert('AIによる生成に失敗しました。');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Delete Initiation Handlers
  const confirmRemoveImage = (index: number) => {
    setDeleteTarget({ type: 'image', index });
  };

  const confirmRemoveMember = (member: Member) => {
    setDeleteTarget({ type: 'member', id: member.id, name: member.name });
  };
  
  const confirmRemoveSchedule = (schedule: ScheduleEvent) => {
    setDeleteTarget({ type: 'schedule', id: schedule.id, title: schedule.title });
  };

  // Actual Delete Execution
  const executeDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'image') {
      setImages(images.filter((_, idx) => idx !== deleteTarget.index));
    } else if (deleteTarget.type === 'member') {
      setMembers(members.filter(m => m.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'schedule') {
      setSchedules(schedules.filter(s => s.id !== deleteTarget.id));
    }
    
    setDeleteTarget(null);
  };
  
  const handleAddImageMock = () => {
    // Mock upload by adding a random placeholder
    const randomId = Math.floor(Math.random() * 100);
    setImages([...images, `https://picsum.photos/800/600?random=${randomId}`]);
  };

  const handleAddMemberMock = () => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: '新規 メンバー',
      grade: '1年',
      role: 'メンバー',
      department: '未設定'
    };
    setMembers([...members, newMember]);
  };

  // Custom Field Handlers
  const handleAddCustomField = () => {
    setCustomFields([
      ...customFields, 
      { id: Date.now().toString(), label: '', value: '' }
    ]);
  };

  const handleUpdateCustomField = (id: string, field: keyof CustomField, value: string) => {
    setCustomFields(customFields.map(cf => 
      cf.id === id ? { ...cf, [field]: value } : cf
    ));
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(customFields.filter(cf => cf.id !== id));
  };

  // FAQ Handlers
  const handleAddFAQ = () => {
    setFaqs([...faqs, { id: Date.now().toString(), question: '', answer: '' }]);
  };

  const handleUpdateFAQ = (id: string, field: keyof FAQ, value: string) => {
    setFaqs(faqs.map(faq => faq.id === id ? { ...faq, [field]: value } : faq));
  };

  const handleRemoveFAQ = (id: string) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  const handleTagToggle = (tag: string) => {
    if (!circleData) return;
    const newTags = circleData.tags.includes(tag)
        ? circleData.tags.filter(t => t !== tag)
        : [...circleData.tags, tag];
    setCircleData({ ...circleData, tags: newTags });
  };
  
  const handleBreakdownChange = (field: string, value: any) => {
      setBreakdown(prev => ({ ...prev, [field]: value }));
  };

  // Schedule Handlers
  const handleOpenScheduleModal = (schedule?: ScheduleEvent) => {
    if (schedule) {
      setCurrentSchedule(schedule);
    } else {
      setCurrentSchedule({
        date: '',
        title: '',
        content: '',
        location: '',
        capacity: '',
        startTime: '',
        endTime: ''
      });
    }
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = () => {
    if (!currentSchedule.date || !currentSchedule.title) {
      alert('日付とタイトルは必須です');
      return;
    }

    if (currentSchedule.id) {
      // Update
      setSchedules(schedules.map(s => s.id === currentSchedule.id ? { ...s, ...currentSchedule } as ScheduleEvent : s));
    } else {
      // Add
      setSchedules([...schedules, { ...currentSchedule, id: `sch-${Date.now()}` } as ScheduleEvent]);
    }
    setIsScheduleModalOpen(false);
  };

  // Save to Local via Service
  const handleSaveAll = () => {
     if (!circleData) return;
     const updated: Circle = {
        ...circleData,
        description,
        representativeEmail,
        contactEmail: contactEmail || representativeEmail, // Save contact email
        images,
        customFields,
        faqs,
        schedules,
        showMemberBreakdown: breakdown.show,
        memberBreakdown: breakdown.show ? {
            gender: { male: Number(breakdown.male), female: Number(breakdown.female) },
            grade: { 
                y1: Number(breakdown.y1), 
                y2: Number(breakdown.y2), 
                y3: Number(breakdown.y3), 
                y4: Number(breakdown.y4), 
                other: Number(breakdown.other) 
            }
        } : undefined
        // members would go here too if in circleData
     };
     
     // Update state and persist
     setCircleData(updated);
     circleService.updateCircle(updated);
     
     alert('変更を保存しました');
  };

  const tabs = [
    { id: 'basic', label: '基本情報', icon: LayoutDashboard },
    { id: 'schedules', label: '新歓日程', icon: Calendar },
    { id: 'gallery', label: '画像・ギャラリー', icon: ImageIcon },
    { id: 'members', label: 'メンバー管理', icon: Users },
  ];

  if (!circleData) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="bg-dark-900 min-h-screen text-gray-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">サークル管理画面</h1>
            <p className="text-sm text-gray-400 mt-1">「{circleData.name}」の情報を編集しています</p>
          </div>
          <button 
            onClick={handleSaveAll}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg shadow-primary-900/30 transition-all active:scale-95"
          >
            <Save className="w-4 h-4 mr-2" />
            変更を保存
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <nav className="hidden lg:block w-64 flex-shrink-0">
            <ul className="space-y-1">
              {tabs.map(tab => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`w-full flex items-center px-3 py-3 rounded-md text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-900/20 text-primary-400 border-l-4 border-primary-500 shadow-sm'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-primary-400' : 'text-gray-500'}`} />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Tab Navigation */}
          <div className="lg:hidden flex overflow-x-auto pb-4 gap-2 scrollbar-hide">
             {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex-shrink-0 flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white border-primary-500'
                      : 'bg-white/5 text-gray-400 border-white/10'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 glass-card rounded-xl shadow-sm border border-white/10 overflow-hidden min-h-[600px]">
            
            {/* TAB: BASIC INFO */}
            {activeTab === 'basic' && (
              <div className="p-6 space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-lg font-bold leading-6 text-white border-b border-white/10 pb-4 mb-6 flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-primary-400" />
                    基本情報編集
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-400">サークル名</label>
                      <div className="mt-1">
                        <input type="text" name="name" id="name" defaultValue={circleData.name} className="glass-input block w-full sm:text-sm rounded-md p-2.5" />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="university" className="block text-sm font-medium text-gray-400">大学 (変更不可)</label>
                      <div className="mt-1">
                        <input type="text" name="university" id="university" defaultValue={circleData.university} disabled className="glass-input block w-full sm:text-sm rounded-md p-2.5 bg-white/5 text-gray-500 cursor-not-allowed" />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="category" className="block text-sm font-medium text-gray-400">カテゴリ</label>
                      <div className="mt-1">
                        <select id="category" name="category" defaultValue={circleData.category} className="glass-input block w-full sm:text-sm rounded-md p-2.5">
                          {Object.values(CircleCategory).map(c => <option key={c} value={c} className="bg-dark-800">{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="founded" className="block text-sm font-medium text-gray-400">創立年</label>
                      <div className="mt-1">
                         <input type="number" name="founded" id="founded" defaultValue={circleData.foundedYear} className="glass-input block w-full sm:text-sm rounded-md p-2.5" />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="representativeEmail" className="block text-sm font-medium text-gray-400">責任者メールアドレス</label>
                      <div className="mt-1">
                         <input 
                           type="email" 
                           name="representativeEmail" 
                           id="representativeEmail" 
                           value={representativeEmail}
                           onChange={(e) => setRepresentativeEmail(e.target.value)}
                           className="glass-input block w-full sm:text-sm rounded-md p-2.5" 
                         />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="short-desc" className="block text-sm font-medium text-gray-400">短い紹介文 (一覧表示用)</label>
                      <div className="mt-1">
                        <input type="text" name="short-desc" id="short-desc" defaultValue={circleData.shortDescription} className="glass-input block w-full sm:text-sm rounded-md p-2.5" />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">スマホで表示された際に2行以内で収まるようにしてください。</p>
                    </div>

                    {/* AI Powered Description */}
                    <div className="sm:col-span-6">
                      <div className="flex justify-between items-end mb-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-400">詳細説明</label>
                        <button 
                          type="button"
                          onClick={handleAiRefine}
                          disabled={isAiLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-purple-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                          AIで推敲・魅力アップ
                        </button>
                      </div>
                      <div className="relative">
                        <textarea 
                          id="description" 
                          name="description" 
                          rows={8} 
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="glass-input block w-full sm:text-sm rounded-md p-3 leading-relaxed"
                        ></textarea>
                        {isAiLoading && (
                          <div className="absolute inset-0 bg-dark-900/50 backdrop-blur-[1px] flex items-center justify-center rounded-md">
                            <div className="flex flex-col items-center">
                              <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-2" />
                              <span className="text-xs text-primary-200 font-medium">AIが文章を生成中...</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">Gemini AIが、新入生に響く魅力的な文章を提案します。</p>
                    </div>

                    {/* Campus Selection */}
                    <div className="sm:col-span-6">
                       <label className="block text-sm font-medium text-gray-400 mb-2">活動場所 (キャンパス)</label>
                       <div className="bg-white/5 rounded-md p-4 border border-white/10">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                             {universityInfo ? (
                               universityInfo.campuses.map(campus => (
                                 <label key={campus} className="inline-flex items-center p-2 rounded hover:bg-white/5 transition cursor-pointer">
                                   <input 
                                     type="checkbox" 
                                     defaultChecked={circleData.campus.includes(campus)}
                                     className="rounded border-gray-600 bg-dark-800 text-primary-600 focus:ring-primary-500 w-4 h-4"
                                   />
                                   <span className="ml-2 text-sm text-gray-300">{campus}</span>
                                 </label>
                               ))
                             ) : (
                               <p className="text-sm text-gray-500">大学情報が取得できません</p>
                             )}
                          </div>
                       </div>
                    </div>
                    
                    {/* Tags Selection */}
                    <div className="sm:col-span-6">
                       <label className="block text-sm font-medium text-gray-400 mb-2">タグ</label>
                       <div className="flex flex-wrap gap-2">
                         {ALL_TAGS.map(tag => (
                           <button
                             key={tag}
                             type="button"
                             onClick={() => handleTagToggle(tag)}
                             className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                               circleData.tags.includes(tag)
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
                    
                    {/* Member Breakdown Section */}
                    <div className="sm:col-span-6 p-4 rounded-lg bg-white/5 border border-white/10">
                       <div className="flex items-center justify-between mb-4">
                         <label className="text-sm font-medium text-white flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary-400" /> メンバー構成の内訳
                         </label>
                         <label className="inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={breakdown.show}
                              onChange={(e) => handleBreakdownChange('show', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-300">公開する</span>
                         </label>
                       </div>
                       
                       <div className={`space-y-4 transition-all duration-300 ${breakdown.show ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                               <label className="block text-xs text-gray-400 mb-1">男性</label>
                               <input type="number" value={breakdown.male} onChange={(e) => handleBreakdownChange('male', e.target.value)} className="glass-input w-full p-2 text-sm rounded-md" />
                             </div>
                             <div>
                               <label className="block text-xs text-gray-400 mb-1">女性</label>
                               <input type="number" value={breakdown.female} onChange={(e) => handleBreakdownChange('female', e.target.value)} className="glass-input w-full p-2 text-sm rounded-md" />
                             </div>
                          </div>
                          <div className="grid grid-cols-5 gap-2">
                             <div>
                               <label className="block text-xs text-center text-gray-400 mb-1">1年</label>
                               <input type="number" value={breakdown.y1} onChange={(e) => handleBreakdownChange('y1', e.target.value)} className="glass-input w-full p-2 text-sm rounded-md text-center" />
                             </div>
                             <div>
                               <label className="block text-xs text-center text-gray-400 mb-1">2年</label>
                               <input type="number" value={breakdown.y2} onChange={(e) => handleBreakdownChange('y2', e.target.value)} className="glass-input w-full p-2 text-sm rounded-md text-center" />
                             </div>
                             <div>
                               <label className="block text-xs text-center text-gray-400 mb-1">3年</label>
                               <input type="number" value={breakdown.y3} onChange={(e) => handleBreakdownChange('y3', e.target.value)} className="glass-input w-full p-2 text-sm rounded-md text-center" />
                             </div>
                             <div>
                               <label className="block text-xs text-center text-gray-400 mb-1">4年</label>
                               <input type="number" value={breakdown.y4} onChange={(e) => handleBreakdownChange('y4', e.target.value)} className="glass-input w-full p-2 text-sm rounded-md text-center" />
                             </div>
                             <div>
                               <label className="block text-xs text-center text-gray-400 mb-1">その他</label>
                               <input type="number" value={breakdown.other} onChange={(e) => handleBreakdownChange('other', e.target.value)} className="glass-input w-full p-2 text-sm rounded-md text-center" />
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* SNS Links */}
                     <div className="sm:col-span-3">
                      <label htmlFor="instagram" className="block text-sm font-medium text-gray-400">Instagram URL</label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-white/10 bg-white/5 text-gray-500 text-sm">http://</span>
                        <input type="text" name="instagram" id="instagram" defaultValue={circleData.instagramUrl} className="glass-input flex-1 block w-full rounded-none rounded-r-md sm:text-sm p-2.5" placeholder="instagram.com/..." />
                      </div>
                    </div>
                     <div className="sm:col-span-3">
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-400">X URL</label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-white/10 bg-white/5 text-gray-500 text-sm">http://</span>
                        <input type="text" name="twitter" id="twitter" defaultValue={circleData.twitterUrl} className="glass-input flex-1 block w-full rounded-none rounded-r-md sm:text-sm p-2.5" placeholder="x.com/..." />
                      </div>
                    </div>
                    
                    {/* Contact Email */}
                    <div className="sm:col-span-6">
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-400">お問い合わせ通知先メールアドレス</label>
                      <div className="mt-1">
                         <input 
                           type="email" 
                           name="contactEmail" 
                           id="contactEmail" 
                           value={contactEmail}
                           onChange={(e) => setContactEmail(e.target.value)}
                           className="glass-input block w-full sm:text-sm rounded-md p-2.5" 
                           placeholder="未設定の場合は責任者メールアドレスに通知されます"
                         />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">「お問い合わせフォーム」からの連絡を受け取るアドレスです。</p>
                    </div>

                     {/* Custom Fields Section */}
                     <div className="sm:col-span-6 pt-6 border-t border-white/10">
                       <div className="flex items-center justify-between mb-4">
                         <label className="block text-sm font-medium text-gray-400">その他の情報 (任意)</label>
                         <button 
                           onClick={handleAddCustomField}
                           className="text-xs flex items-center gap-1 text-primary-400 hover:text-primary-300"
                         >
                           <Plus className="w-3 h-3" /> 項目を追加
                         </button>
                       </div>
                       
                       <div className="space-y-3">
                         {customFields.map((field) => (
                           <div key={field.id} className="flex gap-2 items-start">
                              <div className="w-1/3">
                                <input 
                                  type="text" 
                                  value={field.label}
                                  onChange={(e) => handleUpdateCustomField(field.id, 'label', e.target.value)}
                                  placeholder="項目名" 
                                  className="glass-input block w-full sm:text-sm rounded-md p-2.5"
                                />
                              </div>
                              <div className="flex-1">
                                <input 
                                  type="text" 
                                  value={field.value}
                                  onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
                                  placeholder="内容を入力" 
                                  className="glass-input block w-full sm:text-sm rounded-md p-2.5"
                                />
                              </div>
                              <button 
                                onClick={() => handleRemoveCustomField(field.id)}
                                className="p-2.5 text-gray-500 hover:text-red-400 transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                           </div>
                         ))}
                         {customFields.length === 0 && (
                            <p className="text-xs text-gray-500 italic">追加された情報はありません</p>
                         )}
                       </div>
                     </div>
                     
                     {/* FAQs Section */}
                     <div className="sm:col-span-6 pt-6 border-t border-white/10">
                       <div className="flex items-center justify-between mb-4">
                         <label className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                           <HelpCircle className="w-4 h-4 text-primary-400" /> よくある質問 (任意)
                         </label>
                         <button 
                           onClick={handleAddFAQ}
                           className="text-xs flex items-center gap-1 text-primary-400 hover:text-primary-300"
                         >
                           <Plus className="w-3 h-3" /> 質問を追加
                         </button>
                       </div>
                       
                       <div className="space-y-4">
                         {faqs.map((faq) => (
                           <div key={faq.id} className="p-4 bg-white/5 rounded-lg border border-white/10 relative group">
                              <button 
                                onClick={() => handleRemoveFAQ(faq.id)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition"
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
                         {faqs.length === 0 && (
                            <p className="text-xs text-gray-500 italic">よくある質問は登録されていません</p>
                         )}
                       </div>
                     </div>

                  </div>
                </div>
              </div>
            )}
            
            {/* TAB: SCHEDULES (New) */}
            {activeTab === 'schedules' && (
              <div className="p-6 space-y-8 animate-in fade-in duration-300">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                      <h3 className="text-lg font-bold leading-6 text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-400" />
                        新歓日程管理
                      </h3>
                      <button 
                        onClick={() => handleOpenScheduleModal()}
                        className="inline-flex items-center px-3 py-1.5 bg-primary-600/20 text-primary-400 text-xs font-bold rounded-md hover:bg-primary-600/30 border border-primary-500/30 transition"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        日程を追加
                      </button>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    {schedules.map((schedule) => (
                      <div key={schedule.id} className="p-4 bg-white/5 rounded-lg border border-white/10 relative group">
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                           <button 
                             onClick={() => handleOpenScheduleModal(schedule)}
                             className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded"
                             title="編集"
                           >
                             <Edit className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => confirmRemoveSchedule(schedule)}
                             className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded"
                             title="削除"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>

                        <div className="flex items-center gap-2 text-primary-400 font-bold mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>{schedule.date}</span>
                        </div>
                        <h3 className="font-bold text-white mb-2">{schedule.title}</h3>
                        
                        <div className="text-xs text-gray-400 space-y-1 mb-2">
                           <div className="flex items-center gap-1">
                             <Clock className="w-3 h-3" /> {schedule.startTime} - {schedule.endTime}
                           </div>
                           <div className="flex items-center gap-1">
                             <MapPin className="w-3 h-3" /> {schedule.location}
                           </div>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 border-t border-white/5 pt-2 mt-2">{schedule.content}</p>
                      </div>
                    ))}
                    {schedules.length === 0 && (
                      <div className="col-span-full text-center py-10 bg-white/5 rounded-lg border border-dashed border-white/10 text-gray-500">
                        新歓スケジュールはまだ登録されていません
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GALLERY */}
            {activeTab === 'gallery' && (
              <div className="p-6 space-y-8 animate-in fade-in duration-300">
                <div>
                   <h3 className="text-lg font-bold leading-6 text-white border-b border-white/10 pb-4 mb-6 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary-400" />
                    画像・ギャラリー設定
                  </h3>

                  {/* Main Image */}
                  <div className="mb-8">
                     <label className="block text-sm font-medium text-gray-400 mb-3">メイン画像 (検索結果・ヘッダー用)</label>
                     <div className="relative aspect-video w-full max-w-lg rounded-lg overflow-hidden border border-white/10 group bg-black/40">
                        <img src={circleData.imageUrl} alt="Main" className="w-full h-full object-cover group-hover:opacity-75 transition" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                           <button className="bg-black/60 text-white px-4 py-2 rounded-full font-medium hover:bg-black/80 backdrop-blur-sm border border-white/20">
                             変更する
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Sub Images Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                       <label className="block text-sm font-medium text-gray-400">活動風景ギャラリー</label>
                       <button 
                          onClick={handleAddImageMock}
                          className="text-xs flex items-center gap-1 text-primary-400 hover:text-primary-300"
                        >
                          <Plus className="w-3 h-3" /> 画像を追加
                       </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {images.map((img, idx) => (
                         <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10 group bg-white/5">
                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            {/* Delete Button Overlay */}
                            <button 
                              onClick={() => confirmRemoveImage(idx)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 shadow-lg"
                              title="画像を削除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                       ))}
                       
                       {/* Upload Placeholder */}
                       <div 
                          onClick={handleAddImageMock}
                          className="aspect-[4/3] rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition cursor-pointer"
                        >
                          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-xs font-medium">クリックして追加</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MEMBERS */}
            {activeTab === 'members' && (
              <div className="p-6 space-y-8 animate-in fade-in duration-300">
                <div>
                   <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                      <h3 className="text-lg font-bold leading-6 text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary-400" />
                        メンバー管理
                      </h3>
                      <button 
                        onClick={handleAddMemberMock}
                        className="inline-flex items-center px-3 py-1.5 bg-primary-600/20 text-primary-400 text-xs font-bold rounded-md hover:bg-primary-600/30 border border-primary-500/30 transition"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        メンバーを追加
                      </button>
                   </div>

                   {/* Member List Table */}
                   <div className="overflow-x-auto rounded-lg border border-white/10">
                     <table className="min-w-full divide-y divide-white/10">
                       <thead className="bg-white/5">
                         <tr>
                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">名前</th>
                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">役職</th>
                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">学年</th>
                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">学部</th>
                           <th scope="col" className="relative px-6 py-3"><span className="sr-only">操作</span></th>
                         </tr>
                       </thead>
                       <tbody className="bg-transparent divide-y divide-white/10">
                         {members.map((member) => (
                           <tr key={member.id} className="hover:bg-white/5 transition">
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{member.name}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${member.role.includes('長') ? 'bg-primary-900/40 text-primary-300 border border-primary-500/20' : 'bg-gray-800 text-gray-400'}`}>
                                  {member.role}
                                </span>
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{member.grade}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{member.department}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                               <button onClick={() => confirmRemoveMember(member)} className="text-gray-500 hover:text-red-400 transition mx-2">
                                  <Trash2 className="w-4 h-4" />
                               </button>
                               <button className="text-gray-500 hover:text-white transition">
                                  <MoreVertical className="w-4 h-4" />
                               </button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                     {members.length === 0 && (
                       <div className="text-center py-8 text-sm text-gray-500">
                         メンバーが登録されていません
                       </div>
                     )}
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="削除の確認"
        variant="danger"
        footer={
           <>
              <button 
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition"
              >
                キャンセル
              </button>
              <button 
                onClick={executeDelete}
                className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20 transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                削除する
              </button>
           </>
        }
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {deleteTarget?.type === 'image' && 'この画像を削除してもよろしいですか？この操作は取り消せません。'}
              {deleteTarget?.type === 'member' && `「${deleteTarget.name}」をメンバーから削除してもよろしいですか？`}
              {deleteTarget?.type === 'schedule' && `「${deleteTarget.title}」を日程から削除してもよろしいですか？`}
            </p>
          </div>
        </div>
      </Modal>

      {/* Schedule Edit Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title={currentSchedule.id ? "日程を編集" : "日程を追加"}
        footer={
           <>
              <button onClick={() => setIsScheduleModalOpen(false)} className="px-4 py-2 text-sm text-gray-300 hover:text-white">キャンセル</button>
              <button onClick={handleSaveSchedule} className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-500">保存する</button>
           </>
        }
      >
         <div className="space-y-4">
            <div>
               <label className="block text-xs font-medium text-gray-400 mb-1">日付 <span className="text-red-500">*</span></label>
               <input 
                 type="date" 
                 value={currentSchedule.date || ''}
                 onChange={(e) => setCurrentSchedule({...currentSchedule, date: e.target.value})}
                 className="glass-input w-full p-2 rounded-md"
               />
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-400 mb-1">イベント名 <span className="text-red-500">*</span></label>
               <input 
                 type="text" 
                 value={currentSchedule.title || ''}
                 onChange={(e) => setCurrentSchedule({...currentSchedule, title: e.target.value})}
                 placeholder="例: 体験練習会"
                 className="glass-input w-full p-2 rounded-md"
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-medium text-gray-400 mb-1">開始時間</label>
                 <input 
                   type="time" 
                   value={currentSchedule.startTime || ''}
                   onChange={(e) => setCurrentSchedule({...currentSchedule, startTime: e.target.value})}
                   className="glass-input w-full p-2 rounded-md"
                 />
               </div>
               <div>
                 <label className="block text-xs font-medium text-gray-400 mb-1">終了時間</label>
                 <input 
                   type="time" 
                   value={currentSchedule.endTime || ''}
                   onChange={(e) => setCurrentSchedule({...currentSchedule, endTime: e.target.value})}
                   className="glass-input w-full p-2 rounded-md"
                 />
               </div>
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-400 mb-1">場所</label>
               <input 
                 type="text" 
                 value={currentSchedule.location || ''}
                 onChange={(e) => setCurrentSchedule({...currentSchedule, location: e.target.value})}
                 placeholder="例: 学生会館302"
                 className="glass-input w-full p-2 rounded-md"
               />
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-400 mb-1">定員</label>
               <input 
                 type="text" 
                 value={currentSchedule.capacity || ''}
                 onChange={(e) => setCurrentSchedule({...currentSchedule, capacity: e.target.value})}
                 placeholder="例: 20名"
                 className="glass-input w-full p-2 rounded-md"
               />
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-400 mb-1">詳細内容</label>
               <textarea 
                 rows={3}
                 value={currentSchedule.content || ''}
                 onChange={(e) => setCurrentSchedule({...currentSchedule, content: e.target.value})}
                 placeholder="イベントの内容を詳しく..."
                 className="glass-input w-full p-2 rounded-md"
               />
            </div>
         </div>
      </Modal>
    </div>
  );
};

export default AdminPage;