import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Sponsors';
import ExamInterface from '@/components/ExamInterface';
import { useExam } from '@/contexts/ExamContext';
import { Trophy, Users, Target, Zap, Award, Crown, Calculator, Brain, Star } from 'lucide-react';

// Floating Integration Symbols Component
const FloatingIntegrationSymbols = () => {
  const symbols = ['∫', '∂', '∑', '∏', '∆', '∇', '∞', 'π', 'φ', 'λ'];
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className={`absolute text-6xl font-bold text-purple-200/20 animate-float-${i % 4 + 1}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 4}s`
          }}
        >
          {symbols[i % symbols.length]}
        </div>
      ))}
    </div>
  );
};

// Convert round number to descriptive label with enhanced gaming theme
const getRoundLabel = (round) => {
  switch (round) {
    case 1: return 'INTEGRATION INITIATION';
    case 2: return 'CALCULUS CHAMPIONSHIP';
    case 3: return 'DERIVATIVE DUEL';
    case 4: return 'ULTIMATE INTEGRATION';
    default: return `MATHEMATICAL CHALLENGE ${round}`;
  }
};

// Enhanced round colors with light gaming aesthetics
const getRoundColors = (round) => {
  switch (round) {
    case 1: return { 
      bg: 'from-indigo-100 via-purple-100 to-blue-200', 
      accent: 'border-indigo-300', 
      glow: 'shadow-indigo-300/50',
      particle: 'text-indigo-400/30'
    };
    case 2: return { 
      bg: 'from-emerald-100 via-teal-100 to-cyan-200', 
      accent: 'border-emerald-300', 
      glow: 'shadow-emerald-300/50',
      particle: 'text-emerald-400/30'
    };
    case 3: return { 
      bg: 'from-rose-100 via-pink-100 to-red-200', 
      accent: 'border-rose-300', 
      glow: 'shadow-rose-300/50',
      particle: 'text-rose-400/30'
    };
    case 4: return { 
      bg: 'from-amber-100 via-yellow-100 to-orange-200', 
      accent: 'border-amber-300', 
      glow: 'shadow-amber-300/50',
      particle: 'text-amber-400/30'
    };
    default: return { 
      bg: 'from-gray-100 to-gray-200', 
      accent: 'border-gray-300', 
      glow: 'shadow-gray-300/50',
      particle: 'text-gray-400/30'
    };
  }
};

const ExamPage = () => {
  const { isAuthenticated } = useAuth();
  const { isExamEnded, setExamConfiguration, loadQuestions, isLoading } = useExam();
  const navigate = useNavigate();
  const location = useLocation();
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(true);

  const {
    group = [],
    remainingGroups,
    studentsWithGroupNumbers,
    collegeName = 'Default College',
    roundNumber: passedRoundNumber = 1,
    groupIndex,
    totalParticipants,
    scoringSystem,
    scalingInfo,
  } = location.state || {};

  const roundColors = getRoundColors(passedRoundNumber);

  // Countdown effect for dramatic entrance
  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setTimeout(() => setShowCountdown(false), 1000);
    }
  }, [countdown, showCountdown]);

  // First, set exam configuration based on round number
  useEffect(() => {
    if (passedRoundNumber) {
      setExamConfiguration(passedRoundNumber);
    }
  }, [passedRoundNumber, setExamConfiguration]);

  // Then load questions for the configured round and group
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        await loadQuestions(passedRoundNumber, studentsWithGroupNumbers, groupIndex);
        console.log(`Loaded questions for Round ${passedRoundNumber}, Group ${groupIndex}`);
        setQuestionsLoaded(true);
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
    };

    if (passedRoundNumber && studentsWithGroupNumbers && !questionsLoaded) {
      fetchQuestions();
    }
  }, [passedRoundNumber, studentsWithGroupNumbers, groupIndex, loadQuestions, questionsLoaded]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Handle redirection after exam ends
  useEffect(() => {
    if (isExamEnded && passedRoundNumber === 4) {
      navigate('/results', { 
        state: { 
          collegeName,
          roundNumber: passedRoundNumber,
          group,
          groupNumber: groupIndex
        } 
      });
    }
  }, [isExamEnded, passedRoundNumber, navigate, collegeName, group, groupIndex]);

  // Return null during loading states or when conditions aren't met
  if (!isAuthenticated) {
    return null;
  }

  // Enhanced countdown overlay with integration theme
  if (showCountdown && countdown > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
        <FloatingIntegrationSymbols />
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-500 flex items-center justify-center animate-pulse shadow-2xl shadow-purple-300/50">
              <div className="text-7xl font-bold text-white">{countdown}</div>
            </div>
            <div className="absolute inset-0 w-40 h-40 mx-auto rounded-full border-4 border-purple-300/30 animate-spin"></div>
            <div className="absolute -top-4 -right-4 text-4xl animate-bounce text-purple-500">∫</div>
            <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce text-pink-500" style={{ animationDelay: '0.5s' }}>∂</div>
          </div>
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 mb-4 animate-pulse">
            Integration Challenge Starting...
          </h2>
          <p className="text-2xl text-gray-600 mb-6">Prepare for Mathematical Combat!</p>
          <div className="flex justify-center space-x-4 text-5xl">
            <span className="text-purple-500 animate-bounce">∫</span>
            <span className="text-pink-500 animate-bounce" style={{ animationDelay: '0.2s' }}>∂</span>
            <span className="text-indigo-500 animate-bounce" style={{ animationDelay: '0.4s' }}>∑</span>
          </div>
        </div>
      </div>
    );
  }

  if (showCountdown && countdown === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
        <FloatingIntegrationSymbols />
        <div className="text-center relative z-10">
          <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center mb-8 animate-bounce shadow-2xl shadow-green-300/50">
            <Zap className="w-20 h-20 text-white" />
          </div>
          <h2 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-6 animate-pulse">
            INTEGRATE!
          </h2>
          <div className="flex justify-center space-x-6 text-6xl">
            <span className="text-green-500 animate-pulse">∫</span>
            <span className="text-emerald-500 animate-pulse" style={{ animationDelay: '0.3s' }}>f(x)dx</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col py-16 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
      <Navbar />

      {/* Enhanced floating integration symbols background */}
      <FloatingIntegrationSymbols />

      <main className="flex-grow relative z-10 py-8">
        <div className="container mx-auto px-4">
          {/* Enhanced Header Section with Integration Gaming Theme */}
          

          {/* Enhanced Loading State with Integration Theme */}
          {isLoading ? (
            <div className="text-center py-20 relative">
              <div className="relative mb-12">
                <div className="w-32 h-32 mx-auto relative">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-200/50 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-purple-400 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-pink-400 border-r-transparent animate-spin" style={{ animationDirection: 'reverse' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl font-bold text-purple-500 animate-pulse">∫</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 text-3xl text-pink-500 animate-bounce">∂</div>
                <div className="absolute -bottom-4 -left-4 text-3xl text-indigo-500 animate-bounce" style={{ animationDelay: '0.5s' }}>∑</div>
              </div>
              
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 mb-6">
                Loading Integration Challenges...
              </h2>
              <p className="text-2xl text-gray-600 mb-8">Preparing Your Mathematical Arsenal</p>
              
              <div className="flex justify-center space-x-3 mb-6">
                {['∫', '∂', '∑', '∏', '∆'].map((symbol, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce flex items-center justify-center text-xs text-white font-bold"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {symbol}
                  </div>
                ))}
              </div>
              
              <div className="text-6xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
                ∫ f(x) dx = Challenge Loading...
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl overflow-hidden relative">
              {/* Integration symbol watermark */}
              <div className="absolute top-4 right-4 text-6xl text-gray-100 font-bold">∫</div>
              <ExamInterface
                group={group}
                groupNumber={groupIndex}
                remainingGroups={remainingGroups}
                collegeName={collegeName}
                roundNumber={passedRoundNumber}
                totalParticipants={totalParticipants}
                scoringSystem={scoringSystem}
                scalingInfo={scalingInfo}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExamPage;