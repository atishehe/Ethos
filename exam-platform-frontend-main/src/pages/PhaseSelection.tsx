import React, { useState, useEffect } from 'react';
import { Target, Shield, Crown, Play, Lock, CheckCircle, Calculator, Trophy, BookOpen } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const FloatingSymbol = ({ symbol, delay, size = "text-2xl" }) => (
  <div 
    className={`absolute ${size} text-gray-400/30 animate-bounce select-none pointer-events-none`}
    style={{ 
      animationDelay: `${delay}ms`,
      animationDuration: '3s',
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 60 + 20}%`
    }}
  >
    {symbol}
  </div>
);

const ParticleEffect = ({ isHovered }) => (
  <div className={`absolute inset-0 overflow-hidden transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-ping"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${i * 200}ms`,
          animationDuration: '2s'
        }}
      />
    ))}
  </div>
);

const GameifiedPhaseCard = ({ 
  phase, 
  date, 
  title, 
  description, 
  icon: Icon, 
  color, 
  delay = 0, 
  isUnlocked = true,
  isCompleted = false,
  onNavigate
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [glowEffect, setGlowEffect] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowEffect(true);
      setTimeout(() => setGlowEffect(false), 1000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (!isUnlocked) return <Lock className="w-5 h-5 text-gray-400" />;
    return <Play className="w-5 h-5" />;
  };

  const getStatusText = () => {
    if (isCompleted) return "Completed";
    if (!isUnlocked) return "Locked";
    return "Start Phase";
  };

  const mathSymbols = phase === 1 ? ['∫', '∑', 'dx'] : phase === 2 ? ['∂', '∇', '∆'] : ['∞', '∏', '∮'];

  return (
    <div 
      className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 animate-slide-in-right ${!isUnlocked ? 'opacity-60' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => isUnlocked && onNavigate(phase)}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-1000 ${glowEffect && isUnlocked ? 'shadow-2xl shadow-blue-300/30' : ''}`} />
      
      <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${color} text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 ${isUnlocked ? 'border-opacity-60 hover:border-opacity-100' : 'border-opacity-30'}`}>
        
        {/* Floating mathematical symbols */}
        {mathSymbols.map((symbol, i) => (
          <FloatingSymbol key={i} symbol={symbol} delay={i * 500} />
        ))}
        
        {/* Particle effects on hover */}
        <ParticleEffect isHovered={isHovered} />
        
        {/* Header section */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center relative transition-all duration-300 border border-white/40 ${isHovered ? 'bg-white/80 scale-110' : ''}`}>
              <Icon className="w-7 h-7" />
              {isUnlocked && (
                <div className="absolute -top-1 -right-1">
                  <Calculator className="w-4 h-4 text-blue-600 animate-pulse" />
                </div>
              )}
            </div>
            <div>
              <div className="text-3xl font-bold flex items-center gap-2">
                Phase {phase}
                {isCompleted && <Trophy className="w-5 h-5 text-yellow-600" />}
              </div>
              <div className="text-gray-600 font-medium">{date}</div>
            </div>
          </div>
          <div className={`text-6xl font-bold transition-all duration-300 ${isHovered ? 'opacity-40 scale-110' : 'opacity-20'} text-gray-400`}>
            {phase}
          </div>
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-bold mb-3 relative z-10 text-gray-800">{title}</h3>
        <p className="text-gray-700 leading-relaxed mb-6 relative z-10">{description}</p>
        
        {/* Action button */}
        <div className="relative z-10">
          <button 
            className={`w-full px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              isUnlocked 
                ? 'bg-white/70 hover:bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 text-gray-800' 
                : 'bg-gray-200/50 border border-gray-300 cursor-not-allowed text-gray-500'
            }`}
            disabled={!isUnlocked}
          >
            {getStatusIcon()}
            {getStatusText()}
          </button>
        </div>
        
        {/* Level indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1">
          {[...Array(phase)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-gray-500/60 rounded-full" />
          ))}
        </div>
        
        {/* Mathematical decoration */}
        <div className="absolute top-4 right-4 opacity-10 text-8xl font-bold select-none transition-all duration-300 group-hover:opacity-20 text-gray-400">
          <BookOpen />
        </div>
      </div>
    </div>
  );
};

const PhaseSelection = () => {
  const [currentPhase, setCurrentPhase] = useState(null);
  const [completedPhases, setCompletedPhases] = useState([]);
  
  // Get college name from the previous page (login)
  const location = useLocation();
  const navigate = useNavigate();
  const collegeName = location.state?.collegeName || 'Default College';

  const handleNavigate = (phase) => {
    setCurrentPhase(phase);
    
    // Navigate to the round page and pass the college name
    navigate(`/round`, { 
      state: { 
        collegeName: collegeName,
        phase: phase,
        // You can add more data here if needed
        completedPhases: completedPhases
      } 
    });
  };

  const getPhaseDetails = (phase) => {
    const details = {
      1: "📊 Standard integration problems\n⏱️ 60 seconds per problem\n🎯 Score 80% to advance",
      2: "📈 Advanced integration techniques\n🏆 Campus-wide competition\n⚡ Top 10 advance to finals",
      3: "🏅 Final competition at IIT Bombay\n🎓 Face the top participants\n💎 Win prestigious prizes"
    };
    return details[phase] || "";
  };

  return (
    <section className="py-20 bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <Navbar />
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600">
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
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
            d="M0,200 Q250,400 500,200 T1000,200"
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border border-indigo-200 mb-4 backdrop-blur-sm">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700 uppercase tracking-wider">Competition Phases</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Choose Your Phase
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Progress through three structured phases of mathematical excellence. Each level presents increasing complexity and academic rigor.
          </p>
          {/* Display college name */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
            <span className="text-gray-600">College:</span>
            <span className="text-gray-800 font-semibold">{collegeName}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <GameifiedPhaseCard 
            phase={1}
            date="30 March 2025"
            title="📊 Preliminary Round"
            description="Begin your mathematical journey! Demonstrate solid fundamentals and quick problem-solving skills in this foundational integration challenge."
            icon={Target}
            color="from-emerald-100 via-green-100 to-teal-100 border-emerald-200"
            delay={0}
            isUnlocked={true}
            isCompleted={completedPhases.includes(1)}
            onNavigate={handleNavigate}
          />
          
          <GameifiedPhaseCard 
            phase={2}
            date="Throughout April 2025"
            title="📈 Campus Competition"
            description="Advance to complex challenges! Navigate advanced integration techniques and compete with your campus peers in this strategic mathematical assessment."
            icon={Shield}
            color="from-amber-100 via-orange-100 to-red-100 border-amber-200"
            delay={300}
            isUnlocked={true}
            isCompleted={completedPhases.includes(2)}
            onNavigate={handleNavigate}
          />
          
          <GameifiedPhaseCard 
            phase={3}
            date="August 2025"
            title="🏅 Final Championship"
            description="The ultimate academic challenge! Face the most complex integrals and compete among India's mathematical elite at IIT Bombay."
            icon={Crown}
            color="from-violet-100 via-purple-100 to-indigo-100 border-violet-200"
            delay={600}
            isUnlocked={true}
            isCompleted={completedPhases.includes(3)}
            onNavigate={handleNavigate}
          />
        </div>
        
        {/* Progress indicator */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg">
            <span className="text-gray-600">Progress:</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((phase) => (
                <div 
                  key={phase}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    completedPhases.includes(phase) 
                      ? 'bg-green-500 shadow-lg shadow-green-400/50' 
                      : phase === 1 || phase === 2 
                        ? 'bg-blue-500 animate-pulse' 
                        : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-500 text-sm">{completedPhases.length}/3 Complete</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhaseSelection;