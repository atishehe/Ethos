import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Star, Camera, Heart, Eye } from 'lucide-react';

// Mathematical symbols component
const MathSymbol = ({ symbol, size = 16, className = "" }) => (
  <span className={`font-serif ${className}`} style={{ fontSize: `${size}px` }}>
    {symbol}
  </span>
);

// Floating mathematical symbols background
const FloatingMathSymbols = () => (
  <div className="absolute inset-0 pointer-events-none z-0">
    <div className="absolute top-4 left-4 text-purple-300/30 text-3xl animate-float-1">∫</div>
    <div className="absolute top-8 right-8 text-blue-300/30 text-2xl animate-float-2">∑</div>
    <div className="absolute bottom-8 left-8 text-pink-300/30 text-xl animate-float-3">π</div>
    <div className="absolute bottom-4 right-4 text-cyan-300/30 text-2xl animate-float-4">∞</div>
    <div className="absolute top-1/2 left-2 text-green-300/30 text-xl animate-float-slow">∂</div>
    <div className="absolute top-1/2 right-2 text-yellow-300/30 text-lg animate-float-1">dx</div>
  </div>
);

const IntegralCupCarousel = () => {
  // Generate photo data for pic1.jpg to pic17.jpg
  const generatePhotoData = () => {
    const titles = [
      'Grand Finale Opening Ceremony',
      'Campus Finals - Intense Problem Solving', 
      'Victory Moment - Preliminary Round'
    ];

    return Array.from({ length: 3 }, (_, index) => ({
      filename: `pic${index + 1}.jpg`,
      title: titles[index] || `Competition Moment ${index + 1}`,
      likes: Math.floor(Math.random() * 300) + 50,
      views: Math.floor(Math.random() * 1000) + 200
    }));
  };

  const [photos, setPhotos] = useState(
    generatePhotoData().map((photo, index) => ({
      id: index + 1,
      url: `/collagePhotos/${photo.filename}`,
      title: photo.title,
      likes: photo.likes,
      views: photo.views
    }))
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [likedPhotos, setLikedPhotos] = useState(new Set());
  const [achievements, setAchievements] = useState([]);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [photos.length]);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    setScore(prev => prev + 5);
    setStreak(prev => prev + 1);
    checkAchievements();
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setScore(prev => prev + 3);
  };

  const handleLike = (photoId) => {
    if (!likedPhotos.has(photoId)) {
      setLikedPhotos(prev => new Set([...prev, photoId]));
      setPhotos(prev => prev.map(photo => 
        photo.id === photoId 
          ? { ...photo, likes: photo.likes + 1 }
          : photo
      ));
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      checkAchievements();
    }
  };

  const checkAchievements = () => {
    const newAchievements = [];
    
    if (score >= 100 && !achievements.includes('Century Club')) {
      newAchievements.push('Century Club');
    }
    if (streak >= 5 && !achievements.includes('Streak Master')) {
      newAchievements.push('Streak Master');
    }
    if (likedPhotos.size >= 3 && !achievements.includes('Photo Enthusiast')) {
      newAchievements.push('Photo Enthusiast');
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      setTimeout(() => {
        setAchievements(prev => prev.filter(a => !newAchievements.includes(a)));
      }, 3000);
    }
  };

  const currentPhoto = photos[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
      <FloatingMathSymbols />
      {/* Enhanced background mathematical symbols */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => {
          const symbols = ['∫', '∑', '∂', '∇', '∆', 'π', '∞', 'α', 'β', 'γ'];
          const symbol = symbols[i % symbols.length];
          return (
            <div
              key={i}
              className="absolute text-gray-400 font-bold animate-float select-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${30 + Math.random() * 40}px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            >
              {symbol}
            </div>
          );
        })}
      </div>
      {/* Animated mathematical curves */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1200 800">
          <path
            d="M0,400 Q300,200 600,400 T1200,400"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-purple-400 animate-pulse"
            style={{ animationDuration: '6s' }}
          />
          <path
            d="M100,300 Q400,500 700,300 T1100,300"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-blue-400 animate-pulse"
            style={{ animationDuration: '8s', animationDelay: '2s' }}
          />
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200 mb-6 animate-fade-in shadow-xl backdrop-blur-md">
            <Camera className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">Competition Gallery</span>
            <Trophy className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-poppins">
            <span className="bg-gradient-to-r from-purple-600 via-gray-800 to-blue-600 bg-clip-text text-transparent animate-title-glow">
              Moments of Mathematical Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Witness the dedication, celebrate the achievements, and be part of India's most prestigious integration competition. 
            Every photo captures a story of excellence, brilliance, and mathematical achievement.
          </p>
        </div>
        {/* Main Carousel */}
        <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-200 mb-8">
          {photos.length > 0 && (
            <>
              <div className="relative h-[500px] overflow-hidden">
                <img 
                  src={currentPhoto.url} 
                  alt={currentPhoto.title}
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-110 rounded-3xl"
                />
                {/* Enhanced navigation buttons */}
                <button 
                  onClick={prevPhoto}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 rounded-full transition-all duration-300 hover:scale-125 shadow-xl backdrop-blur-sm border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextPhoto}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full transition-all duration-300 hover:scale-125 shadow-xl backdrop-blur-sm border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                {/* Photo info overlay - minimal */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6 rounded-b-3xl">
                  <h3 className="text-xl font-bold text-white mb-3 font-poppins flex items-center gap-2">
                    <MathSymbol symbol="∫" size={18} className="text-purple-300" />
                    {currentPhoto.title}
                    <MathSymbol symbol="∑" size={16} className="text-blue-300" />
                  </h3>
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => handleLike(currentPhoto.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400/50 shadow-md backdrop-blur-sm border border-white/30 ${
                        likedPhotos.has(currentPhoto.id) 
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105' 
                          : 'bg-white/20 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500'
                      }`}
                      aria-pressed={likedPhotos.has(currentPhoto.id)}
                    >
                      <Heart className={`w-5 h-5 ${likedPhotos.has(currentPhoto.id) ? 'fill-current animate-pulse' : ''}`} />
                      <span>{currentPhoto.likes}</span>
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                      <Eye className="w-5 h-5 text-gray-300" />
                      <span className="text-white font-semibold">{currentPhoto.views}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Enhanced thumbnail navigation */}
              <div className="flex justify-center gap-3 p-6 bg-gradient-to-r from-gray-50 to-white">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 ${
                      index === currentIndex 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 scale-150 shadow-lg' 
                        : 'bg-gray-300 hover:bg-gray-500 hover:scale-125'
                    }`}
                    aria-label={`Go to photo ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {/* Gallery Statistics */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-white/80 to-gray-50/80 rounded-full border border-gray-200 backdrop-blur-sm shadow-lg">
            <Trophy className="w-5 h-5 text-purple-600" />
            <span className="text-gray-700 font-semibold">
              Showcasing {photos.length} incredible moments from India's premier integration competition
            </span>
            <Star className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegralCupCarousel;