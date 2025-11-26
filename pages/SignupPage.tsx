import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for registration
    setTimeout(() => {
      // Create mock user data
      const newUser = { name: '新規ユーザー', id: 'new-user', role: 'admin' };
      localStorage.setItem('univCircleUser', JSON.stringify(newUser));
      
      setIsLoading(false);
      // Redirect to profile or admin page after signup
      navigate('/profile');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none"></div>
       <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8 group">
           <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-bold text-2xl">U</span>
           </div>
           <span className="font-bold text-2xl tracking-tight text-white">UnivCircle</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          アカウント作成
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          サークル管理のためのアカウントを作成します
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-white/10">
          <form className="space-y-6" onSubmit={handleSignup}>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                お名前
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="glass-input appearance-none block w-full px-3 py-2 border border-white/10 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="山田 太郎"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                メールアドレス
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="glass-input appearance-none block w-full px-3 py-2 border border-white/10 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                パスワード
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="glass-input appearance-none block w-full px-3 py-2 border border-white/10 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="8文字以上"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-900/30"
              >
                {isLoading ? 'アカウント作成中...' : 'アカウントを作成して始める'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-800 text-gray-500 rounded glass">
                  すでにアカウントをお持ちの方
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2.5 px-4 border border-white/10 rounded-md shadow-sm text-sm font-medium text-white bg-white/5 hover:bg-white/10 transition"
              >
                ログインはこちら
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;