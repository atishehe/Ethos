import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Trophy, Crown, Target, BookOpen, Users, Star, ChevronRight, Home, Calculator, Lock } from "lucide-react";

const RoundSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const collegeName = location.state?.collegeName;
  const [selectedRound, setSelectedRound] = useState(null);

  const rounds = [
    {
      label: "Preliminary Round",
      number: 1,
      icon: Target,
      color: "from-green-100 to-emerald-200",
      hoverColor: "hover:from-green-200 hover:to-emerald-300",
      difficulty: "BASIC",
      description: "Foundation level problems",
      unlocked: true,
      participants: 16,
    },
    {
      label: "Quarter Final",
      number: 2,
      icon: BookOpen,
      color: "from-blue-100 to-cyan-200",
      hoverColor: "hover:from-blue-200 hover:to-cyan-300",
      difficulty: "INTERMEDIATE",
      description: "Advanced problem solving",
      unlocked: true,
      participants: 8,
    },
    {
      label: "Semi Final",
      number: 3,
      icon: Users,
      color: "from-purple-100 to-violet-200",
      hoverColor: "hover:from-purple-200 hover:to-violet-300",
      difficulty: "ADVANCED",
      description: "Complex challenges",
      unlocked: true,
      participants: 4,
    },
    {
      label: "Final",
      number: 4,
      icon: Crown,
      color: "from-yellow-100 to-orange-200",
      hoverColor: "hover:from-yellow-200 hover:to-orange-300",
      difficulty: "EXPERT",
      description: "Championship level",
      unlocked: true,
      participants: 2,
    },
  ];

  const goToRound = (roundNumber: number) => {
    if (!collegeName) {
      toast({
        title: "⚠️ Access Denied",
        description: "College name is missing. Please log in again.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setSelectedRound(roundNumber);

    setTimeout(() => {
      navigate("/attendance", {
        state: {
          collegeName,
          roundNumber,
        },
      });
    }, 800);
  };

  const handleBackHome = () => {
    navigate("/");
  };

  const RoundCard = ({ round, index }) => {
    const Icon = round.icon;
    const isSelected = selectedRound === round.number;

    return (
      <div
        key={round.number}
        className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 animate-slide-in-right ${
          isSelected ? "scale-110 z-10" : ""
        }`}
        style={{ animationDelay: `${index * 200}ms` }}
        onClick={() => goToRound(round.number)}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${round.color} ${round.hoverColor} transition-all duration-300 border border-gray-200`} />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-2 right-2 text-gray-400/30 text-4xl font-bold animate-spin" style={{ animationDuration: "8s" }}>∫</div>
          <div className="absolute bottom-2 left-2 text-gray-400/30 text-3xl font-bold animate-pulse">∑</div>
          <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-gray-300/20 rounded-full animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-gray-300/30 rounded-full animate-bounce" />
        </div>

        {!round.unlocked && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
            <Lock className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {isSelected && <div className="absolute inset-0 bg-white/40 animate-pulse" />}

        <div className="relative z-10 p-6 text-gray-800 h-full flex flex-col justify-between min-h-[200px]">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full bg-white/60 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 border border-gray-200 ${isSelected ? "animate-bounce" : ""}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                round.difficulty === "BASIC" ? "bg-green-200 text-green-800" :
                round.difficulty === "INTERMEDIATE" ? "bg-blue-200 text-blue-800" :
                round.difficulty === "ADVANCED" ? "bg-purple-200 text-purple-800" :
                "bg-yellow-200 text-yellow-800"
              }`}>
                {round.difficulty}
              </div>
            </div>
          </div>

          <div className="flex-grow">
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-700 transition-colors">{round.label}</h3>
            <p className="text-gray-600 text-sm mb-3">{round.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold">{round.participants} Participants</span>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isSelected ? "translate-x-2" : "group-hover:translate-x-1"}`} />
          </div>
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/30 to-transparent transition-opacity duration-300 pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const symbols = ["∫", "∑", "∂", "∇", "∆", "π", "∞", "α", "β"];
          const symbol = symbols[i % symbols.length];
          return (
            <div
              key={`symbol-${i}`}
              className="absolute text-gray-300/20 font-bold animate-float select-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${20 + Math.random() * 30}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            >
              {symbol}
            </div>
          );
        })}

        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 1000">
          <path
            d="M100,500 Q300,200 500,500 T900,500"
            stroke="gray"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <path
            d="M200,600 Q400,300 600,600 T1000,600"
            stroke="gray"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6 animate-bounce shadow-lg">
            <Calculator className="w-5 h-5 text-blue-600" />
            <span className="text-gray-800 font-semibold text-sm">ROUND SELECTION</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-poppins animate-title-glow">
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Competition Round</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-2">
            Select your competition level and prepare for mathematical challenges. Each round presents increasing complexity and academic rigor.
          </p>

          {collegeName && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 backdrop-blur-sm rounded-full border border-blue-200 mt-4">
              <Trophy className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-semibold text-sm">
                Representing: {collegeName}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {rounds.map((round, index) => (
            <RoundCard key={round.number} round={round} index={index} />
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleBackHome}
            className="group bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Home className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Return to Home
          </Button>
        </div>

        {selectedRound && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center text-gray-800 bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-gray-200 shadow-2xl">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-2xl font-bold mb-2">Entering Competition...</h3>
              <p className="text-gray-600">Preparing your session!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoundSelectionPage;