import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Sponsors';
import FeedbackForm from '@/components/FeedbackForm';
import { Trophy, Star, Calculator, BookOpen, Flame } from 'lucide-react';

// Mathematical symbols component
const MathSymbol = ({ symbol, size = 16, className = "" }) => (
  <span className={`font-serif ${className}`} style={{ fontSize: `${size}px` }}>
    {symbol}
  </span>
);

// Floating mathematical symbols background
const FloatingMathSymbols = () => (
  <div className="absolute inset-0 pointer-events-none z-0">
    <div className="absolute top-4 left-4 text-purple-400/20 text-2xl animate-float-1">∫</div>
    <div className="absolute top-8 right-8 text-blue-400/20 text-xl animate-float-2">∑</div>
    <div className="absolute bottom-8 left-8 text-pink-400/20 text-lg animate-float-3">π</div>
    <div className="absolute bottom-4 right-4 text-cyan-400/20 text-xl animate-float-4">∞</div>
  </div>
);

const FeedbackPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Prevent rendering until redirect
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-blue-900/20">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-purple-500/5 to-blue-500/10 -z-10" />
      <FloatingMathSymbols />
      
      <Navbar />
      
      <main className="flex-grow relative z-10 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Enhanced Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-6 backdrop-blur-sm">
              <Flame className="w-5 h-5 text-purple-300" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Feedback Hub</span>
              <Trophy className="w-5 h-5 text-yellow-300" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-poppins">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Share Your Experience
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              We value your opinion! Help us improve The Integral Cup by sharing your thoughts about the competition experience.
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm text-purple-300">
              <MathSymbol symbol="∫" size={16} />
              <span>Your feedback shapes the future of mathematical excellence</span>
              <MathSymbol symbol="∑" size={16} />
            </div>
          </div>

          {/* Enhanced Feedback Form Container */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Competition Feedback</h2>
              <MathSymbol symbol="π" size={24} className="text-pink-400 animate-pulse" />
            </div>
            
            <FeedbackForm />
          </div>

          {/* Additional Information Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Your Voice Matters</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Every piece of feedback helps us create a better competition experience for future participants.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Continuous Improvement</h3>
              </div>
              <p className="text-gray-300 text-sm">
                We analyze all feedback to enhance problem difficulty, interface design, and overall experience.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Future Champions</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Your insights help shape the next generation of mathematical talent and competition excellence.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FeedbackPage;
