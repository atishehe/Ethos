import React, { useEffect, useState } from 'react';
import { useDataCache } from '@/contexts/DataCacheContext';
import { useAuth } from '@/contexts/AuthContext';
import { Calculator, Database, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { clear } from 'console';

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

interface DataPreloaderProps {
  children: React.ReactNode;
}

const DataPreloader: React.FC<DataPreloaderProps> = ({ children }) => {
  const { isInitializing } = useAuth();
  const { cache, preloadAllData } = useDataCache();
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [preloadMessage, setPreloadMessage] = useState('Initializing...');

  useEffect(() => {
    const initializeData = async () => {
      // Wait for auth to initialize first
      if (isInitializing) return;

      // Check if we need to preload data
      const hasCachedData = Object.keys(cache.students).length > 0;
      let progressInterval = null;
      if (!hasCachedData) {
        setIsPreloading(true);
        setPreloadMessage('Preloading competition data...');
        
        try {
          // Simulate progress updates
          progressInterval = setInterval(() => {
            setPreloadProgress(prev => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return 90;
              }
              return prev + 10;
            });
          }, 200);

          await preloadAllData();
          
          clearInterval(progressInterval);
          setPreloadProgress(100);
          setPreloadMessage('Data loaded successfully!');
          
          // Show success for a moment before hiding
          setTimeout(() => {
            setIsPreloading(false);
          }, 1000);
          
        } catch (error) {
          console.error('Failed to preload data:', error);
          setPreloadMessage('Data loading completed with some issues');
          if(progressInterval) clearInterval(progressInterval);
          setTimeout(() => {
            setIsPreloading(false);
          }, 2000);
        }
      }
    };

    initializeData();
  }, [isInitializing, cache.students, preloadAllData]);

  // Show loading screen while auth is initializing or data is preloading
  if (isInitializing || isPreloading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden flex items-center justify-center">
        <FloatingMathSymbols />
        
        {/* Enhanced background mathematical symbols */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => {
            const symbols = ['∫', '∑', '∂', '∇', '∆', 'π', '∞', 'α', 'β', 'γ'];
            const symbol = symbols[i % symbols.length];
            return (
              <div
                key={i}
                className="absolute text-primary/10 font-bold animate-float select-none"
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

        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <MathSymbol symbol="∫" size={48} className="text-purple-400 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold font-poppins bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                The Integral Cup
              </h1>
              <div className="relative">
                <MathSymbol symbol="∑" size={40} className="text-blue-400 animate-pulse animation-delay-1000" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse animation-delay-2000" />
              </div>
            </div>
            <p className="text-purple-200 text-lg">
              {isInitializing ? 'Initializing application...' : 'Optimizing your experience'}
            </p>
          </div>

          {/* Loading Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="space-y-6">
              {/* Status Icon */}
              <div className="flex justify-center">
                {isInitializing ? (
                  <div className="relative">
                    <Database className="w-16 h-16 text-blue-400 animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-ping" />
                  </div>
                ) : preloadProgress === 100 ? (
                  <div className="relative">
                    <CheckCircle className="w-16 h-16 text-green-400 animate-bounce" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                  </div>
                ) : (
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-purple-400 animate-spin" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-ping" />
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">Progress</span>
                  <span className="text-white font-semibold">{preloadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden border border-white/20">
                  <div 
                    className="h-full bg-gradient-to-r from-primary via-purple-500 to-secondary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${preloadProgress}%` }}
                  />
                </div>
              </div>

              {/* Status Message */}
              <div className="text-center">
                <p className="text-white/90 font-medium">{preloadMessage}</p>
                {!isInitializing && preloadProgress < 100 && (
                  <p className="text-purple-300 text-sm mt-2">
                    Loading competition data for faster access...
                  </p>
                )}
              </div>

              {/* Loading Indicators */}
              <div className="flex justify-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      i === 0 ? 'bg-purple-400' : 
                      i === 1 ? 'bg-blue-400' : 'bg-pink-400'
                    }`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-purple-300">
                {isInitializing ? 'Setting up authentication...' : 'Preloading data for instant access'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DataPreloader; 