import React, { useState, useEffect } from 'react';
import { Flame, Zap, Shield, Crown, Target, Star, Calculator, BookOpen, Trophy } from 'lucide-react';

// Mathematical symbols component
const MathSymbol = ({ symbol, size = 16, className = "" }) => (
  <span className={`font-serif ${className}`} style={{ fontSize: `${size}px` }}>
    {symbol}
  </span>
);

// Floating mathematical symbols background
const FloatingMathSymbols = () => (
  <div className="absolute inset-0 pointer-events-none z-0">
    <div className="absolute top-4 left-4 text-purple-300/30 text-2xl animate-float-1">∫</div>
    <div className="absolute top-8 right-8 text-blue-300/30 text-xl animate-float-2">∑</div>
    <div className="absolute bottom-8 left-8 text-pink-300/30 text-lg animate-float-3">π</div>
    <div className="absolute bottom-4 right-4 text-cyan-300/30 text-xl animate-float-4">∞</div>
  </div>
);

const ExpectationCard = ({ title, description, level, icon, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level) => {
    switch(level) {
      case 'basic': return 'from-green-100 to-emerald-100 border-green-300 text-green-700';
      case 'intermediate': return 'from-yellow-100 to-orange-100 border-yellow-300 text-yellow-700';
      case 'advanced': return 'from-red-100 to-pink-100 border-red-300 text-red-700';
      case 'expert': return 'from-purple-100 to-violet-100 border-purple-300 text-purple-700';
      case 'master': return 'from-indigo-100 to-blue-100 border-indigo-300 text-indigo-700';
      default: return 'from-gray-100 to-gray-200 border-gray-300 text-gray-700';
    }
  };

  const getLevelIcon = (level) => {
    switch(level) {
      case 'basic': return <Target className="w-5 h-5" />;
      case 'intermediate': return <Shield className="w-5 h-5" />;
      case 'advanced': return <Flame className="w-5 h-5" />;
      case 'expert': return <Zap className="w-5 h-5" />;
      case 'master': return <Crown className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  return (
    <div 
      className={`group relative p-6 rounded-xl bg-white/90 backdrop-blur-md border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-slide-in-right`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating mathematical symbols */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-2 right-2 text-gray-200 text-2xl font-bold animate-float">∫</div>
        <div className="absolute bottom-2 left-2 text-gray-200 text-xl font-bold animate-float" style={{animationDelay: '1s'}}>∑</div>
        <div className="absolute top-1/2 right-4 text-gray-200 text-lg font-bold animate-float" style={{animationDelay: '2s'}}>∂</div>
      </div>

      {/* Pulse effect */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-1000 ${pulseEffect ? 'bg-gray-100/50 animate-pulse' : ''}`} />

      <div className="flex items-start gap-4 relative z-10">
        <div className={`text-3xl transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-lg font-bold text-gray-800">{title}</h4>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getLevelColor(level)} border backdrop-blur-sm flex items-center gap-1`}>
              {getLevelIcon(level)}
              {level.toUpperCase()}
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          
          {/* Progress bar for difficulty */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">Difficulty Level</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  level === 'basic' ? 'bg-green-500 w-1/5' :
                  level === 'intermediate' ? 'bg-yellow-500 w-2/5' :
                  level === 'advanced' ? 'bg-red-500 w-3/5' :
                  level === 'expert' ? 'bg-purple-500 w-4/5' :
                  'bg-indigo-500 w-full'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        level === 'basic' ? 'bg-green-500/10' :
        level === 'intermediate' ? 'bg-yellow-500/10' :
        level === 'advanced' ? 'bg-red-500/10' :
        level === 'expert' ? 'bg-purple-500/10' :
        'bg-indigo-500/10'
      }`} />
    </div>
  );
};

const ExpectSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
      <FloatingMathSymbols />
      
      {/* Enhanced background mathematical symbols */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-gray-400 text-6xl font-bold animate-float select-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          >
            {['∫', '∑', '∂', '∇', '∆', 'π', '∞', 'α', 'β', 'γ'][Math.floor(Math.random() * 10)]}
          </div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200 mb-4 backdrop-blur-sm">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700 uppercase tracking-wider">Difficulty Levels</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-poppins bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            What to Expect?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From fundamental integration concepts to advanced multidimensional problems. Challenge yourself with progressive difficulty levels.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <ExpectationCard 
            title="Basic Integration"
            description="Fundamental integration techniques and simple functions."
            level="basic"
            icon="📚"
            delay={0}
          />
          <ExpectationCard 
            title="Integration with Series"
            description="Integration problems involving mathematical series."
            level="intermediate"
            icon="📊"
            delay={200}
          />
          <ExpectationCard 
            title="Gaussian Integrations"
            description="Complex integration using Gaussian methods."
            level="advanced"
            icon="🧮"
            delay={400}
          />
          <ExpectationCard 
            title="Multidimensional Volume"
            description="Volume calculations under manifolds in n dimensions."
            level="expert"
            icon="📐"
            delay={600}
          />
          <ExpectationCard 
            title="Differential Integration"
            description="Advanced integrals derived from differential calculus."
            level="master"
            icon="🎓"
            delay={800}
          />
        </div>

        {/* Difficulty Legend */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg">
            <span className="text-gray-700 text-sm">Difficulty Scale:</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600">Basic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-yellow-600">Intermediate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-red-600">Advanced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-purple-600">Expert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <span className="text-xs text-indigo-600">Master</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpectSection;