import React, { useState,useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegistrationSection from '@/components/Registration';
import Sponsors from '@/components/Sponsors';
import ExpectSection from '@/components/Expect';
import PhaseSection from '@/components/Phase';
import { useAuth } from '@/contexts/AuthContext';
import IntegralCupCarousel from '@/components/Photo';
import { Trophy, Target, Zap, Star, Gamepad2, Users, Timer, Award, Calendar, MapPin, Mail, Phone, Instagram, Linkedin, BookOpen, Flame, Shield, Crown } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const [particlesVisible, setParticlesVisible] = useState(false);
  const [statsCount, setStatsCount] = useState({ players: 0, problems: 0, competitions: 0 });

  // Animated counter effect
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setStatsCount({ players: 2847, problems: 563, competitions: 3 });
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  // Particle animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setParticlesVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const GameCard = ({ icon: Icon, title, description, delay = 0 }) => (
    <div 
      className={`group relative p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer animate-fade-in game-card`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-center group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-center leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>
    </div>
  );

  const StatCard = ({ icon: Icon, number, label, delay = 0 }) => (
    <div 
      className={`text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon className="w-8 h-8 mx-auto mb-3 text-white/80" />
      <div className="text-3xl font-bold text-white mb-1">
        {number.toLocaleString()}+
      </div>
      <div className="text-white/80 text-sm uppercase tracking-wider">
        {label}
      </div>
    </div>
  );

  // Animation wrapper component
const AnimateOnScroll = ({ children, className = "", delay = 0, duration = "0.5s" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transitionDuration: duration,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      {children}
    </div>
  );
};

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Fixed Navbar */}
        <Navbar />
       {/* Enhanced floating mathematical symbols background */}
      {particlesVisible && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Sliding symbols from right to left */}
          {[...Array(25)].map((_, i) => {
            const symbols = ['∫', '∑', '∂', 'π', '∞', 'α', 'β', 'γ', 'δ', 'ε', '∇', '∆', '∴', '∵', '≈', '≤', '≥', '∈', '∉', '⊂', '⊃', '∪', '∩', '∀', '∃'];
            const symbol = symbols[i % symbols.length];
            return (
              <div
                key={i}
                className="absolute text-primary/10 font-bold text-3xl animate-slide-right select-none"
                style={{
                  right: `-100px`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${15 + Math.random() * 10}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  fontSize: `${20 + Math.random() * 20}px`
                }}
              >
                {symbol}
              </div>
            );
          })}
          
          {/* Enhanced animated integral curves */}
          <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 1200 800">
            <path
              d="M100,400 Q300,200 500,400 T900,400"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-primary animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            <path
              d="M200,300 Q400,500 600,300 T1000,300"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-secondary animate-pulse"
              style={{ animationDuration: '5s', animationDelay: '1s' }}
            />
            <path
              d="M50,600 Q250,100 450,600 T850,600"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-primary/50 animate-pulse"
              style={{ animationDuration: '6s', animationDelay: '2s' }}
            />
          </svg>
        </div>
      )}
      
      {/* Main content with top padding to account for fixed navbar */}
      <main className="flex-grow relative z-10 pt-16">
        {/* Enhanced Hero Section - No animation needed as it's initially visible */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary py-20 text-white overflow-hidden">
          {/* Enhanced animated background elements */}
          <div className="absolute inset-0">
            {/* Multiple mathematical symbols with different animations */}
            <div className="absolute top-20 left-20 text-white/10 text-9xl font-bold animate-pulse select-none">∫</div>
            <div className="absolute bottom-32 right-32 text-white/10 text-7xl font-bold animate-bounce select-none">∑</div>
            <div className="absolute top-1/2 left-10 text-white/5 text-6xl font-bold animate-ping select-none">∂</div>
            <div className="absolute top-32 right-64 text-white/8 text-5xl font-bold animate-spin select-none">∇</div>
            <div className="absolute bottom-48 left-48 text-white/6 text-8xl font-bold animate-pulse select-none">π</div>
            <div className="absolute top-16 left-1/2 text-white/8 text-4xl font-bold animate-bounce select-none">∞</div>
            
            {/* Enhanced mathematical curve animations */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 600">
              <path
                d="M0,300 Q200,150 400,300 T800,300"
                stroke="white"
                strokeWidth="4"
                fill="none"
                className="animate-pulse"
                style={{ animationDuration: '4s' }}
              />
              <path
                d="M100,300 Q200,200 300,300 L300,350 L100,350 Z"
                fill="white"
                fillOpacity="0.15"
                className="animate-pulse"
                style={{ animationDuration: '3s', animationDelay: '1s' }}
              />
              {/* Additional Riemann sum rectangles */}
              {[...Array(6)].map((_, i) => (
                <rect
                  key={i}
                  x={120 + i * 30}
                  y={280 + Math.sin(i) * 20}
                  width="25"
                  height={40 + Math.cos(i) * 15}
                  fill="white"
                  fillOpacity="0.1"
                  className="animate-pulse"
                  style={{ 
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </svg>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6 animate-fade-in">
                  <span className="text-2xl">∫</span>
                  <span className="text-sm font-semibold">INDIA'S PREMIER INTEGRATION CUP</span>
                </div>
                
               
                
                <p className="text-xl md:text-2xl mb-4 text-white/90 animate-fade-in-up">
                  Welcome to India's premier integration cup showdown, where the nation's top minds tackle challenging integrals with speed and creativity.
                </p>
                
                <p className="text-lg mb-8 text-white/80 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  This contest transforms traditional calculus into a dynamic arena of rapid problem-solving. More than a contest, it celebrates excellence and passion in mathematics.
                </p>
                
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 mb-10">
                  <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 animate-slide-up">
                    <Users className="w-6 h-6 mx-auto mb-2 text-white/80" />
                    <div className="text-2xl font-bold text-white mb-1">2847+</div>
                    <div className="text-white/80 text-xs uppercase tracking-wider">Registered</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <Target className="w-6 h-6 mx-auto mb-2 text-white/80" />
                    <div className="text-2xl font-bold text-white mb-1">563+</div>
                    <div className="text-white/80 text-xs uppercase tracking-wider">Integrals</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <Award className="w-6 h-6 mx-auto mb-2 text-white/80" />
                    <div className="text-2xl font-bold text-white mb-1">3+</div>
                    <div className="text-white/80 text-xs uppercase tracking-wider">Phases</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  {isAuthenticated ? (
                    <Button size="lg" asChild className="group relative bg-gradient-to-r from-secondary to-secondary/80 text-white hover:from-secondary/90 hover:to-secondary border-0 px-8 py-3 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <Link to="/phaseselection" state={{ collegeName: user?.collegeName }}>
                        <Gamepad2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                        Enter Arena
                      </Link>
                    </Button>
                  ) : (
                    <Button size="lg" asChild className="group relative bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 border-0 px-8 py-3 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <Link to="/registration">
                        <Star className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                        Begin Registration
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Side - Image Section */}
              <div className="order-first lg:order-last">
                <div className="relative group">
                  {/* Main image container with glassmorphism effect */}
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                    <div className="relative">
                      <img 
                        src="/pic7.jpg" 
                        alt="Indian students in mathematics competition setting" 
                        className="w-full h-110 object-cover"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    </div>
                  </div>
                  
                  {/* Additional floating elements */}
                  <div className="absolute top-10 -right-8 text-white/30 text-4xl font-bold animate-spin" style={{ animationDuration: '10s' }}>
                    ∆
                  </div>
                  <div className="absolute bottom-16 -left-8 text-white/30 text-3xl font-bold animate-bounce">
                    ∝
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animated sections - Each component animates when it comes into view */}
        <AnimateOnScroll delay={0}>
          <ExpectSection />
        </AnimateOnScroll>

        <AnimateOnScroll delay={50}>
          <PhaseSection />
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <IntegralCupCarousel/>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0}>
          <Sponsors/>
        </AnimateOnScroll>

        <AnimateOnScroll delay={50}>
          <RegistrationSection />
        </AnimateOnScroll>
      </main>
      
      <AnimateOnScroll delay={0}>
        <Footer />
      </AnimateOnScroll>
    </div>
  )
}

export default Index;