import { useState, useEffect } from "react";
import { Trophy, Star, Zap, Award, Target, Crown, Sparkles, Rocket, Gift, Medal, Flame, Diamond, Calculator, BookOpen, Infinity, Users, GraduationCap, ExternalLink, TrendingUp, Layers } from "lucide-react";

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

const Sponsors = () => {
  const [particles, setParticles] = useState([]);
  const [hoveredSponsor, setHoveredSponsor] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const sponsors = [
    { 
      name: "Optiver", 
      logo: "/Optiver.png", 
      url: "https://www.optiver.com",
      specialty: "Derivatives & Integration",
      description: "Leading market maker specializing in mathematical derivatives and complex integration solutions."
    },
    { 
      name: "QRT", 
      logo: "/QRT.png", 
      url: "https://www.qrt.com",
      specialty: "Mathematical Modeling",
      description: "We are Qube Research & Technologies (QRT), a global quantitative and systematic investment manager operating across all asset classes worldwide."
    },
    { 
      name: "Jane Street", 
      logo: "/Jane_Street_Capital_Logo.svg.png", 
      url: "https://www.janestreet.com",
      specialty: "Calculus Excellence",
      description: "Premier quantitative trading firm known for exceptional calculus and mathematical excellence."
    },
  ];

  // Triple the sponsors array for seamless infinite scroll
  const tripleSponsors = [...sponsors, ...sponsors, ...sponsors];

  // Mathematical symbols for floating animations
  const mathSymbols = ['∫', '∂', 'dx', '∑', '∏', 'π', '∞', 'α', 'β', 'γ', 'δ', 'θ'];

  const createParticle = (x, y, type = 'score') => {
    const newParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      type,
      vx: (Math.random() - 0.5) * 4,
      vy: -Math.random() * 3 - 2,
      life: 40,
      maxLife: 40,
      size: Math.random() * 4 + 2,
      symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)]
    };
    setParticles(prev => [...prev.slice(-15), newParticle]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.2,
        life: p.life - 1
      })).filter(p => p.life > 0));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const handleSponsorClick = (sponsor, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    for (let i = 0; i < 3; i++) {
      createParticle(
        rect.left + rect.width / 2 + (Math.random() - 0.5) * 50,
        rect.top + rect.height / 2 + (Math.random() - 0.5) * 30,
        'score'
      );
    }
  };

  const getCardStyle = (sponsorName) => {
    switch(sponsorName) {
      case 'Optiver':
        return 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg shadow-orange-100/50 hover:shadow-xl hover:shadow-orange-200/50';
      case 'QRT':
        return 'border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg shadow-purple-100/50 hover:shadow-xl hover:shadow-purple-200/50';
      case 'Jane Street':
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg shadow-blue-100/50 hover:shadow-xl hover:shadow-blue-200/50';
      default:
        return 'border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-gray-200/50';
    }
  };

  const getCornerAccentColor = (sponsorName) => {
    switch(sponsorName) {
      case 'Optiver':
        return 'text-orange-400';
      case 'QRT':
        return 'text-purple-400';
      case 'Jane Street':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getSpecialtyBadgeStyle = (sponsorName) => {
    switch(sponsorName) {
      case 'Optiver':
        return 'bg-orange-100 border-orange-200 text-orange-700';
      case 'QRT':
        return 'bg-purple-100 border-purple-200 text-purple-700';
      case 'Jane Street':
        return 'bg-blue-100 border-blue-200 text-blue-700';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-700';
    }
  };

  const getSpecialtyIconColor = (sponsorName) => {
    switch(sponsorName) {
      case 'Optiver':
        return 'text-orange-600';
      case 'QRT':
        return 'text-purple-600';
      case 'Jane Street':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getButtonStyle = (sponsorName) => {
    switch(sponsorName) {
      case 'Optiver':
        return 'text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200 hover:border-orange-300 focus:ring-orange-500/50';
      case 'QRT':
        return 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-300 focus:ring-purple-500/50';
      case 'Jane Street':
        return 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 focus:ring-blue-500/50';
      default:
        return 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 focus:ring-blue-500/50';
    }
  };

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <FloatingMathSymbols />
        {/* Simplified Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300BFFF' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12zm12 0c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        {/* Simplified Floating Mathematical Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {mathSymbols.slice(0, 8).map((symbol, i) => (
            <div
              key={i}
              className="absolute text-blue-300/30 font-bold animate-float"
              style={{
                left: `${5 + i * 12}%`,
                top: `${10 + (i % 4) * 20}%`,
                fontSize: `${18 + (i % 3) * 6}px`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: `${8 + i * 0.6}s`,
              }}
            >
              {symbol}
            </div>
          ))}
          {/* Corner accents */}
          <div className="absolute top-12 left-12">
            <MathSymbol symbol="∫" size={32} className="text-blue-300/20 animate-spin-slow" />
          </div>
          <div className="absolute bottom-12 right-12">
            <MathSymbol symbol="∑" size={28} className="text-purple-300/20 animate-pulse" />
          </div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          {/* Enhanced Header Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h2 className="text-5xl font-bold text-gray-800 mb-4 flex items-center gap-3 justify-center">
                <MathSymbol symbol="∫" size={40} className="text-blue-500" />
                Integration Competition Sponsors
                <MathSymbol symbol="∑" size={36} className="text-purple-500" />
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Elite quantitative finance firms dedicated to fostering the next generation of mathematical excellence 
              and calculus mastery through cutting-edge research and innovation.
            </p>
          </div>
          {/* Enhanced Sponsor Carousel */}
          <div className="mb-20 relative overflow-hidden py-8">
            {/* Infinite Scrolling Container */}
            <div className={`${isPlaying ? 'animate-infinite-scroll' : ''} flex gap-8`} style={{ width: 'max-content' }}>
              {tripleSponsors.map((sponsor, index) => (
                <div
                  key={`${sponsor.name}-${index}`}
                  className="group cursor-pointer flex-shrink-0 w-80"
                  onMouseEnter={() => setHoveredSponsor(index)}
                  onMouseLeave={() => setHoveredSponsor(null)}
                  onClick={(e) => handleSponsorClick(sponsor, e)}
                >
                  <div className={`relative rounded-2xl border-2 transition-all duration-500 hover:scale-105 hover:-translate-y-2 p-6 h-full ${getCardStyle(sponsor.name)}`}>
                    {/* Mathematical Corner Accent */}
                    <div className="absolute top-4 right-4 opacity-20">
                      <MathSymbol symbol="∫" size={24} className={getCornerAccentColor(sponsor.name)} />
                    </div>

                    <div className="h-full flex flex-col">
                      {/* Logo Section */}
                      <div className="mb-6 flex items-center justify-center">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
                          <img
                            src={sponsor.logo}
                            alt={`${sponsor.name} logo`}
                            className="h-12 w-auto object-contain transition-all duration-300"
                          />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 flex flex-col">
                        {/* Company Name */}
                        <div className="text-center mb-4">
                          <h3 className="font-bold text-gray-800 mb-2 text-xl flex items-center gap-2 justify-center">
                            <MathSymbol symbol="∑" size={18} className="text-blue-500" />
                            {sponsor.name}
                            <MathSymbol symbol="π" size={16} className="text-purple-500" />
                          </h3>
                        </div>

                        {/* Specialty Badge */}
                        <div className="flex justify-center mb-4">
                          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 border ${getSpecialtyBadgeStyle(sponsor.name)}`}>
                            <Calculator size={16} className={getSpecialtyIconColor(sponsor.name)} />
                            <span className="text-sm font-medium">{sponsor.specialty}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="flex-1 flex items-center mb-4">
                          <p className="text-gray-600 text-sm leading-relaxed text-center px-2">
                            {sponsor.description}
                          </p>
                        </div>

                        {/* Visit Website Button */}
                        <div className="flex justify-center">
                          <a
                            href={sponsor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 text-sm rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 ${getButtonStyle(sponsor.name)}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={14} />
                            <span>Visit Website</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Clean Particles with Math Symbols */}
        <div className="fixed inset-0 pointer-events-none z-30">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute text-blue-500 font-bold text-lg pointer-events-none select-none flex items-center gap-1"
              style={{
                left: particle.x,
                top: particle.y,
                opacity: particle.life / particle.maxLife,
                transform: `scale(${particle.life / particle.maxLife * 1.2 + 0.3})`
              }}
            >
              <span className="text-purple-500 text-xl">{particle.symbol}</span>
              <span className="text-blue-600">∫</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Sponsors;