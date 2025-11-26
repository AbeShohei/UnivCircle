import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, ChevronRight, Settings, LogOut, Edit2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { circleService } from '../services/circleService';
import Modal from '../components/Modal';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  
  // State for User Data
  const [user, setUser] = useState<UserData>({
    id: "guest",
    name: "早稲田 太郎",
    email: "taro.waseda@example.com",
    role: "サークル管理者"
  });

  // Load from local storage on mount (mock persistence)
  useEffect(() => {
    const storedUser = localStorage.getItem('univCircleUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      // Merge with default role if missing
      setUser(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<UserData>(user);

  // Get Managed Circles from Service
  const managedCircles = circleService.getMinagedCircles(user.id);

  const handleLogout = () => {
    localStorage.removeItem('univCircleUser');
    navigate('/');
  };

  const handleOpenEdit = () => {
    setEditFormData(user);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    // Save to state and local storage
    setUser(editFormData);
    const storedUser = JSON.parse(localStorage.getItem('univCircleUser') || '{}');
    const updatedUser = { ...storedUser, ...editFormData };
    localStorage.setItem('univCircleUser', JSON.stringify(updatedUser));
    
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">マイページ</h1>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1">
            <LogOut className="w-4 h-4" /> ログアウト
          </button>
        </div>

        {/* User Profile Card */}
        <div className="glass-card rounded-xl p-6 border border-white/10">
          <div className="flex items-start sm:items-center gap-6 flex-col sm:flex-row">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 p-[2px] flex-shrink-0">
              <div className="w-full h-full rounded-full bg-dark-900 overflow-hidden">
                <img src="https://picsum.photos/200" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1 min-w-0 w-full">
              <h2 className="text-xl font-bold text-white mb-1 truncate">{user.name}</h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 flex-shrink-0" /> {user.role}
                </div>
              </div>
            </div>
            <button 
              onClick={handleOpenEdit}
              className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition flex items-center justify-center gap-2 flex-shrink-0"
            >
              <Edit2 className="w-3.5 h-3.5" />
              プロフィール編集
            </button>
          </div>
        </div>

        {/* Managed Circles Section */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary-400" />
            管理中のサークル
          </h2>
          
          <div className="grid gap-4">
            {managedCircles.map(circle => (
              <div key={circle.id} className="glass-card rounded-xl p-4 border border-white/10 hover:border-primary-500/50 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Circle Info Wrapper */}
                  <div className="flex items-center gap-4 w-full sm:flex-1 min-w-0">
                    <img src={circle.imageUrl} alt={circle.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-dark-800 border border-white/10" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-900/50 text-primary-300 border border-primary-500/20 whitespace-nowrap flex-shrink-0">
                          {circle.category}
                        </span>
                        {/* ID hidden on extremely small screens if needed, otherwise truncated */}
                        <span className="text-[10px] text-gray-500 truncate hidden sm:inline">ID: {circle.id}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1 break-all pr-2">{circle.name}</h3>
                      <p className="text-xs text-gray-400 line-clamp-1 break-all">{circle.shortDescription}</p>
                    </div>
                  </div>

                  {/* Action Button - Full width on mobile, auto on desktop */}
                  <Link 
                    to="/admin" 
                    className="w-full sm:w-auto flex-shrink-0 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary-900/20 transition flex items-center justify-center gap-2 mt-2 sm:mt-0"
                  >
                    管理画面へ <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}

            {/* Add New Circle Button */}
            <Link to="/register-circle" className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition flex items-center justify-center gap-2">
              <span className="text-2xl font-light">+</span> 新しいサークルを登録
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="プロフィール編集"
        footer={
          <>
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition"
            >
              キャンセル
            </button>
            <button 
              onClick={handleSaveProfile}
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-900/20 transition"
            >
              保存する
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">お名前</label>
            <input 
              type="text" 
              value={editFormData.name}
              onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
              className="glass-input w-full px-3 py-2 rounded-md text-sm focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">メールアドレス</label>
            <input 
              type="email" 
              value={editFormData.email}
              onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
              className="glass-input w-full px-3 py-2 rounded-md text-sm focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">役割 (変更不可)</label>
            <input 
              type="text" 
              value={editFormData.role}
              disabled
              className="glass-input w-full px-3 py-2 rounded-md text-sm bg-white/5 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfilePage;