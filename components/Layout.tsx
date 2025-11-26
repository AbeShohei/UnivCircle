import React, { useState, useEffect } from 'react';
import { Menu, X, Search, User, LogIn, LogOut, PlusCircle, Settings, Building2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock login check
  useEffect(() => {
    const user = localStorage.getItem('univCircleUser');
    setIsLoggedIn(!!user);
  }, [location]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const handleLogout = () => {
    localStorage.removeItem('univCircleUser');
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-gray-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-xl">U</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary-400 transition-colors">UnivCircle</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link to="/search" className={`text-sm font-medium transition-colors ${location.pathname === '/search' ? 'text-primary-400' : 'text-gray-400 hover:text-white'}`}>
                サークルを探す
              </Link>
              <Link to="/create-circle" className={`text-sm font-medium transition-colors ${location.pathname === '/create-circle' ? 'text-primary-400' : 'text-gray-400 hover:text-white'}`}>
                サークルを掲載する
              </Link>
              <Link to="/ads-info" className={`text-sm font-medium transition-colors ${location.pathname === '/ads-info' ? 'text-primary-400' : 'text-gray-400 hover:text-white'}`}>
                企業・広告掲載
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/search" className="text-gray-400 hover:text-white transition p-2">
                <Search className="w-5 h-5" />
              </Link>
              
              {isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[1px]">
                      <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center overflow-hidden">
                        <img src="https://picsum.photos/200" alt="User" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-md shadow-lg py-1 border border-white/10 z-20">
                        <Link 
                          to="/profile" 
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            マイページ
                          </div>
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300"
                        >
                          <div className="flex items-center gap-2">
                            <LogOut className="w-4 h-4" />
                            ログアウト
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/login" className="bg-primary-600/90 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-500 transition shadow-lg shadow-primary-900/20 border border-primary-500/50 flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  ログイン
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-dark-800 absolute w-full left-0 shadow-2xl z-40">
            <div className="pt-2 pb-3 space-y-1 px-4">
              <Link 
                to="/search" 
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="w-5 h-5 text-gray-500" />
                サークルを探す
              </Link>
              <Link 
                to="/create-circle" 
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <PlusCircle className="w-5 h-5 text-gray-500" />
                サークルを掲載する
              </Link>
              <Link 
                to="/ads-info" 
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Building2 className="w-5 h-5 text-gray-500" />
                企業・広告掲載
              </Link>
              
              <div className="border-t border-white/10 my-2 pt-2">
                {isLoggedIn ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-3"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5 text-gray-500" />
                      マイページ
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-red-400 hover:bg-white/5 flex items-center gap-3"
                    >
                      <LogOut className="w-5 h-5" />
                      ログアウト
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="block w-full text-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ログイン
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow relative z-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-white/10 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">サービス</h3>
              <ul className="mt-4 space-y-4">
                <li><Link to="/search" className="text-base text-gray-400 hover:text-white transition">サークル検索</Link></li>
                <li><Link to="/create-circle" className="text-base text-gray-400 hover:text-white transition">サークル掲載</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">ビジネス</h3>
              <ul className="mt-4 space-y-4">
                <li><Link to="/ads-info" className="text-base text-gray-400 hover:text-white transition">広告掲載について</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">UnivCircle Connect</h3>
              <p className="mt-4 text-base text-gray-400 leading-relaxed">
                大学生活をより豊かに。<br/>
                あなたにぴったりのコミュニティが見つかります。
              </p>
            </div>
          </div>
          <p className="text-center text-gray-600 text-sm border-t border-white/5 pt-8">
            &copy; 2024 UnivCircle Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;