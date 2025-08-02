import Navbar from '@/components/Navbar';
import Footer from '@/components/Sponsors';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Zap, Target, Crown, Star, Award, Calculator, BookOpen, Infinity } from 'lucide-react';

// Integration symbol component
const IntegrationSymbol = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={`inline-block ${className}`}
    fill="currentColor"
  >
    <path d="M12 2L8 6h3v4H7v3l-4-4 4-4v3h4V4h3l-4-4z"/>
    <path d="M12 22l4-4h-3v-4h4v-3l4 4-4 4v-3h-4v4h-3l4 4z"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
);

// Floating mathematical symbols background
const FloatingMathSymbols = () => {
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    const mathSymbols = ['∫', '∂', 'dx', '∑', '∏', 'π', '∞', 'α', 'β', 'γ'];
    const newSymbols = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 15,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 5,
    }));
    setSymbols(newSymbols);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {symbols.map((symbol) => (
        <div
          key={symbol.id}
          className="absolute text-white/10 font-bold animate-float"
          style={{
            left: `${symbol.x}%`,
            top: `${symbol.y}%`,
            fontSize: `${symbol.size}px`,
            animationDuration: `${symbol.duration}s`,
            animationDelay: `${symbol.delay}s`,
          }}
        >
          {symbol.symbol}
        </div>
      ))}
    </div>
  );
};

// Animated background particles
const BackgroundParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 8,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '4s',
          }}
        />
      ))}
    </div>
  );
};

// Gaming stats display
const GameStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <span className="text-sm font-semibold text-white/90">Competitions</span>
        </div>
        <div className="text-2xl font-bold text-white">4</div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-5 w-5 text-purple-400" />
          <span className="text-sm font-semibold text-white/90">Rounds</span>
        </div>
        <div className="text-2xl font-bold text-white">∞</div>
      </div>
      
      <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="h-5 w-5 text-green-400" />
          <span className="text-sm font-semibold text-white/90">Problems</span>
        </div>
        <div className="text-2xl font-bold text-white">1K+</div>
      </div>
      
      <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-4 border border-orange-400/30">
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-5 w-5 text-orange-400" />
          <span className="text-sm font-semibold text-white/90">Players</span>
        </div>
        <div className="text-2xl font-bold text-white">500+</div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/round', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/30 to-purple-900/30">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-purple-500/5 to-blue-500/10 -z-10" />
      <FloatingMathSymbols />
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 relative z-10">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default LoginPage;