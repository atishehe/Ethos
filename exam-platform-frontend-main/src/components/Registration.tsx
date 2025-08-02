import React from 'react';
import { Timer, Users, Award, MapPin, Trophy, BookOpen, Flame, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mathematical symbols component
const MathSymbol = ({ symbol, size = 16, className = "" }) => (
  <span className={`font-serif ${className}`} style={{ fontSize: `${size}px` }}>
    {symbol}
  </span>
);

// Floating mathematical symbols background
const FloatingMathSymbols = () => (
  <div className="absolute inset-0 pointer-events-none z-0">
    <div className="absolute top-4 left-4 text-purple-400/20 text-3xl animate-float-1">∫</div>
    <div className="absolute top-8 right-8 text-blue-400/20 text-2xl animate-float-2">∑</div>
    <div className="absolute bottom-8 left-8 text-pink-400/20 text-xl animate-float-3">π</div>
    <div className="absolute bottom-4 right-4 text-cyan-400/20 text-2xl animate-float-4">∞</div>
    <div className="absolute top-1/2 left-2 text-green-400/20 text-xl animate-float-slow">∂</div>
    <div className="absolute top-1/2 right-2 text-yellow-400/20 text-lg animate-float-1">dx</div>
  </div>
);

const RegistrationSection = ({ isAuthenticated = false }) => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/90 via-primary to-secondary/90 text-white relative overflow-hidden min-h-screen flex items-center">
      <FloatingMathSymbols />
      {/* Enhanced background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          {/* Large mathematical symbols */}
          <div className="text-white text-8xl font-bold absolute top-16 left-16 animate-pulse select-none">∫</div>
          <div className="text-white text-6xl font-bold absolute bottom-24 right-24 animate-bounce select-none">dx</div>
          <div className="text-white text-5xl font-bold absolute top-1/3 right-1/4 animate-ping select-none">∂</div>
          <div className="text-white text-7xl font-bold absolute bottom-1/3 left-1/3 animate-spin select-none">∑</div>
          {/* Enhanced integration visualization */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600">
            <path
              d="M100,400 Q250,200 400,350 Q550,500 700,300 Q850,150 950,400"
              stroke="white"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
              style={{ animationDuration: '6s' }}
            />
            {/* Enhanced Riemann rectangles animation */}
            {[...Array(12)].map((_, i) => (
              <rect
                key={i}
                x={120 + i * 65}
                y={320 + Math.sin(i * 0.5) * 60}
                width="55"
                height={90 + Math.cos(i * 0.7) * 40}
                fill="white"
                fillOpacity="0.12"
                className="animate-pulse"
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '4s'
                }}
              />
            ))}
          </svg>
        </div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image Section*/}
          <div className="order-2 lg:order-1">
            <div className="relative group">
              {/* Main image container with glassmorphism effect */}
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Placeholder for your image - replace src with your actual image */}
                <div className="relative">
                  <img 
                    src="/pic15.jpg" 
                    alt="Math Competition Illustration" 
                    className="w-full h-100 object-cover rounded-3xl"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-3xl"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Side - Registration Info */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6 animate-bounce">
              <Timer className="w-5 h-5" />
              <span className="text-sm font-semibold">REGISTRATION CLOSED</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight flex items-center gap-2">
              <MathSymbol symbol="∫" size={24} className="text-purple-400" />
              Ready for the Ultimate Math Battle?
              <MathSymbol symbol="∑" size={20} className="text-blue-400" />
            </h2>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <Users className="w-6 h-6 mt-1 text-white/80" />
                <div>
                  <h4 className="font-semibold mb-1">Who can participate?</h4>
                  <p className="text-white/80">All undergraduate students from IIT's. Only elite make it far.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Award className="w-6 h-6 mt-1 text-white/80" />
                <div>
                  <h4 className="font-semibold mb-1">Certificates & Recognition</h4>
                  <p className="text-white/80">Participants in Campus Finals and Grand Finale will receive certificates.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 mt-1 text-white/80" />
                <div>
                  <h4 className="font-semibold mb-1">Full Coverage for Finalists</h4>
                  <p className="text-white/80">Grand Finalists enjoy full coverage for flights, local transport, accommodation and catering.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                asChild 
                className="group relative bg-white text-primary hover:bg-gray-100 border-0 px-10 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-110"
              >
                <Link to="/registration">
                  <Trophy className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
                  {isAuthenticated ? "Join the Battle" : "Begin Registration"}
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                View Resources
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;