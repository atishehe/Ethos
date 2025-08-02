import React, { useState, useEffect } from 'react';
import { Target, Shield, Crown, Zap, Star, Trophy, Calculator, BookOpen } from 'lucide-react';

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

const PhaseCard = ({ phase, date, title, description, icon: Icon, color, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [glowEffect, setGlowEffect] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowEffect(true);
      setTimeout(() => setGlowEffect(false), 1000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const mathSymbols = phase === 1 ? ['∫', '∑', 'dx'] : phase === 2 ? ['∂', '∇', '∆'] : ['∞', '∏', '∮'];

  return (
    <div 
      className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 animate-slide-in-right`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-1000 ${glowEffect ? 'shadow-2xl shadow-purple-500/30' : ''}`} />
      
      <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${color} text-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-white/20 hover:border-white/40`}>
        
        {/* Floating mathematical symbols */}
        {mathSymbols.map((symbol, i) => (
          <div
            key={i}
            className={`absolute text-white/20 font-bold animate-float select-none pointer-events-none`}
            style={{
              left: `${20 + i * 20}%`,
              top: `${15 + (i % 3) * 25}%`,
              fontSize: `${16 + (i % 3) * 8}px`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          >
            {symbol}
          </div>
        ))}
        
        {/* Particle effects on hover */}
        <div className={`absolute inset-0 overflow-hidden transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
        
        {/* Header section */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center relative transition-all duration-300 ${isHovered ? 'bg-white/30 scale-110' : ''}`}>
              <Icon className="w-7 h-7" />
              <div className="absolute -top-1 -right-1">
                <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold flex items-center gap-2">
                Phase {phase}
                <Trophy className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="text-white/80 font-medium">{date}</div>
            </div>
          </div>
          <div className={`text-6xl font-bold transition-all duration-300 ${isHovered ? 'opacity-40 scale-110' : 'opacity-20'}`}>
            {phase}
          </div>
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-bold mb-3 relative z-10">{title}</h3>
        <p className="text-white/90 leading-relaxed mb-6 relative z-10">{description}</p>
        
        {/* Action button */}
        <div className="relative z-10">
          <button 
            className="w-full px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 hover:border-white/50"
          >
            <BookOpen className="w-5 h-5" />
            Learn More
          </button>
        </div>
        
        {/* Level indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1">
          {[...Array(phase)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-white/60 rounded-full" />
          ))}
        </div>
        
        {/* Mathematical decoration */}
        <div className="absolute top-4 right-4 opacity-10 text-8xl font-bold select-none transition-all duration-300 group-hover:opacity-20">
          <Calculator />
        </div>
      </div>
    </div>
  );
};

const PhaseSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 via-purple-900/30 to-slate-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600">
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <path
            d="M0,300 Q250,100 500,300 T1000,300"
            stroke="url(#gradient1)"
            strokeWidth="3"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <path
            d="M100,200 Q350,400 600,200 T1100,200"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '2s' }}
          />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-4 backdrop-blur-sm">
            <Crown className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Integration Arena</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Choose Your Challenge
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Battle through three epic phases of mathematical mastery. Each victory unlocks greater challenges and legendary rewards.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PhaseCard 
            phase={1}
            date="30 March 2025"
            title="🎯 Preliminary Arena"
            description="Enter the mathematical battleground! Quick reflexes and solid fundamentals are your weapons in this fast-paced integration duel."
            icon={Target}
            color="from-emerald-500 via-green-500 to-teal-500"
            delay={0}
          />
          
          <PhaseCard 
            phase={2}
            date="Throughout April 2025"
            title="⚔️ Campus Conquest"
            description="The stakes rise! Navigate complex integration labyrinths and outsmart your campus rivals in this strategic mathematical warfare."
            icon={Shield}
            color="from-amber-500 via-orange-500 to-red-500"
            delay={300}
          />
          
          <PhaseCard 
            phase={3}
            date="August 2025"
            title="👑 Legendary Finale"
            description="The ultimate test awaits! Face impossible integrals and claim your throne among the mathematical elite at IIT Bombay."
            icon={Crown}
            color="from-violet-500 via-purple-500 to-indigo-500"
            delay={600}
          />
        </div>
      </div>
    </section>
  );
};

export default PhaseSection;