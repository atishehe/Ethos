import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import CompetitionBanner from "@/components/CompetitionBanner";
import {
  Trophy,
  Users,
  Target,
  Zap,
  Crown,
  Star,
  Code,
  Activity,
  Calculator,
  BookOpen,
} from "lucide-react";

// Mathematical symbols component
const MathSymbol = ({ symbol, size = 16, className = "" }) => (
  <span className={`font-serif ${className}`} style={{ fontSize: `${size}px` }}>
    {symbol}
  </span>
);

// Floating mathematical symbols background
const FloatingMathSymbols = () => (
  <div className="absolute inset-0 pointer-events-none z-0">
    <div className="absolute top-4 left-4 text-purple-400/20 text-2xl animate-float-1">
      ∫
    </div>
    <div className="absolute top-8 right-8 text-blue-400/20 text-xl animate-float-2">
      ∑
    </div>
    <div className="absolute bottom-8 left-8 text-pink-400/20 text-lg animate-float-3">
      π
    </div>
    <div className="absolute bottom-4 right-4 text-cyan-400/20 text-xl animate-float-4">
      ∞
    </div>
  </div>
);

// Floating symbol component for background
const FloatingSymbol = ({ symbol, delay, size = "text-2xl" }) => (
  <div
    className={`absolute ${size} text-gray-400/30 animate-bounce select-none pointer-events-none`}
    style={{
      animationDelay: `${delay}ms`,
      animationDuration: "3s",
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 60 + 20}%`,
    }}
  >
    {symbol}
  </div>
);

// Particle effect component
const ParticleEffect = ({ isHovered }) => (
  <div
    className={`absolute inset-0 overflow-hidden transition-opacity duration-300 ${
      isHovered ? "opacity-100" : "opacity-0"
    }`}
  >
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-ping"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${i * 200}ms`,
          animationDuration: "2s",
        }}
      />
    ))}
  </div>
);

// Gameified group card component
const GameifiedGroupCard = ({
  group,
  groupNumber,
  index,
  isSelected,
  onSelect,
  pulseAnimation,
  onLaunch,
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

  const mathSymbols = ["∫", "∑", "dx", "∂", "∇", "∆"];

  return (
    <div
      className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 animate-slide-in-right`}
      style={{ animationDelay: `${index * 200}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(index)}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-1000 ${
          glowEffect && isSelected ? "shadow-2xl shadow-purple-300/30" : ""
        }`}
      />

      <div
        className={`relative p-8 rounded-2xl bg-gradient-to-br text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 ${
          isSelected
            ? "from-purple-100 via-pink-100 to-blue-100 border-purple-300"
            : "from-gray-100 via-slate-100 to-zinc-100 border-gray-200 hover:border-gray-300"
        }`}
      >
        {/* Floating mathematical symbols */}
        {mathSymbols.map((symbol, i) => (
          <FloatingSymbol key={i} symbol={symbol} delay={i * 300} />
        ))}

        {/* Particle effects on hover */}
        <ParticleEffect isHovered={isHovered} />

        {/* Header section */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center relative transition-all duration-300 border border-white/40 ${
                isHovered ? "bg-white/80 scale-110" : ""
              }`}
            >
              <Users className="w-7 h-7" />
              {isSelected && (
                <div className="absolute -top-1 -right-1">
                  <Calculator className="w-4 h-4 text-purple-600 animate-pulse" />
                </div>
              )}
            </div>
            <div>
              <div className="text-3xl font-bold flex items-center gap-2">
                Team {groupNumber}
                {isSelected && <Trophy className="w-5 h-5 text-yellow-600" />}
              </div>
              <div className="text-gray-600 font-medium">
                {group.length} Members
              </div>
            </div>
          </div>
          <div
            className={`text-6xl font-bold transition-all duration-300 ${
              isHovered ? "opacity-40 scale-110" : "opacity-20"
            } text-gray-400`}
          >
            {groupNumber}
          </div>
        </div>

        {/* Selection indicator */}
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className={`relative ${isSelected ? "animate-pulse" : ""}`}>
            <Checkbox
              checked={isSelected}
              className={isSelected ? "border-purple-400" : ""}
            />
            {isSelected && (
              <div className="absolute -inset-1 bg-purple-500/30 rounded-full blur-sm"></div>
            )}
          </div>
          <h3
            className={`font-bold text-lg flex items-center gap-2 ${
              isSelected ? "text-purple-700" : "text-gray-700"
            }`}
          >
            <Users className="w-5 h-5" />
            Ready to Compete
          </h3>
        </div>

        {/* Team members */}
        <div className="space-y-2 mb-6 relative z-10">
          {group.map((user, userIndex) => (
            <div
              key={user._id}
              className={`flex items-center gap-2 p-2 rounded-md transition-all duration-200 ${
                isSelected
                  ? "bg-purple-500/20 text-purple-800"
                  : "bg-gray-100/50 text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isSelected ? "bg-purple-500" : "bg-gray-400"
                }`}
              ></div>
              <span className="font-medium">{user.name}</span>
              <span className="text-sm opacity-70">({user.rollNo})</span>
            </div>
          ))}
        </div>

        {/* Action button */}
        <div className="relative z-10">
          <button
            className={`w-full px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              isSelected
                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                : "bg-gray-200/50 border border-gray-300 text-gray-500"
            }`}
            disabled={!isSelected}
            onClick={(e) => {
              e.stopPropagation();
              if (!isSelected) return;
              onSelect(index);
              onLaunch && onLaunch(index);
            }}
          >
            {isSelected ? (
              <>
                <Zap className="w-5 h-5" />
                Launch Challenge
                <Star className="w-5 h-5" />
              </>
            ) : (
              <>
                <Target className="w-5 h-5" />
                Select Team
              </>
            )}
          </button>
        </div>

        {/* Team status indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-600 font-medium">Online</span>
        </div>

        {/* Mathematical decoration */}
        <div className="absolute top-4 right-4 opacity-10 text-8xl font-bold select-none transition-all duration-300 group-hover:opacity-20 text-gray-400">
          <BookOpen />
        </div>
      </div>
    </div>
  );
};

type User = {
  id: number;
  name: string;
  rollNo: string;
  _id: string;
  groupNumber: number;
};

type GroupWithNumber = {
  group: User[];
  groupNumber: number;
};

const LOCAL_STORAGE_KEY = "groupSelectionState";

const GroupSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const fallbackState = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY) || "{}"
  );

  const {
    groups: initialGroups,
    remainingGroups: storedRemainingGroups,
    studentsWithGroupNumbers,
    collegeName,
    roundNumber,
    totalParticipants,
    scoringSystem,
    scalingInfo,
  } = location.state || fallbackState || {};

  const [remainingGroups, setRemainingGroups] = useState<GroupWithNumber[]>([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(
    null
  );
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    if (location.state) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          groups: location.state.groups,
          remainingGroups: location.state.remainingGroups,
          studentsWithGroupNumbers,
          collegeName,
          roundNumber,
          totalParticipants,
          scoringSystem,
          scalingInfo,
        })
      );
    }
  }, [location.state]);

  useEffect(() => {
    // Use remainingGroups from state if available (coming back from exam)
    if (storedRemainingGroups && storedRemainingGroups.length > 0) {
      setRemainingGroups(storedRemainingGroups);
    }
    // Otherwise, initialize groups from initialGroups
    else if (Array.isArray(initialGroups) && initialGroups.length > 0) {
      const validGroups = initialGroups
        .map((group: User[], idx: number) => {
          const groupNumber = idx + 1;
          // Assign group number to each student
          const groupWithNumbers = group.map((student) => ({
            ...student,
            groupNumber,
          }));
          return { group: groupWithNumbers, groupNumber };
        })
        .filter(({ group }) => Array.isArray(group) && group.length > 0);

      setRemainingGroups(validGroups);
    }
  }, [initialGroups, storedRemainingGroups]);

  const handleGroupSelect = (index: number) => {
    setSelectedGroupIndex(index);
    setPulseAnimation(true);
    setTimeout(() => setPulseAnimation(false), 600);
  };

  const handleStartExam = () => {
    if (selectedGroupIndex === null) return;

    const selectedGroup = remainingGroups[selectedGroupIndex];
    // Remove the selected group from remaining groups
    const updatedGroups = remainingGroups.filter(
      (_, i) => i !== selectedGroupIndex
    );

    // Create students array with consistent group numbers for ExamContext
    const studentsWithCorrectGroupNumber = selectedGroup.group.map(
      (student) => ({
        name: student.name,
        roll: student.rollNo,
        groupNumber: selectedGroup.groupNumber,
      })
    );

    // Navigate to exam with the selected group and its original group number
    navigate("/exam", {
      state: {
        group: selectedGroup.group,
        collegeName,
        studentsWithGroupNumbers: studentsWithCorrectGroupNumber, // Modified to match ExamContext format
        roundNumber,
        groupIndex: selectedGroup.groupNumber, // Original group number
        totalParticipants,
        scoringSystem,
        scalingInfo,
        remainingGroups: updatedGroups, // Pass the updated remaining groups
      },
    });

    // Update localStorage with the new list of remaining groups
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        groups: initialGroups, // Keep the original full list
        remainingGroups: updatedGroups, // Store the updated remaining groups
        studentsWithGroupNumbers,
        collegeName,
        roundNumber,
        totalParticipants,
        scoringSystem,
        scalingInfo,
      })
    );

    setRemainingGroups(updatedGroups);
    setSelectedGroupIndex(null);
  };

  const isValidGroupData =
    Array.isArray(remainingGroups) && remainingGroups.length > 0;

  if (!isValidGroupData) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 600"
          >
            <defs>
              <linearGradient
                id="gradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
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
              style={{ animationDuration: "4s" }}
            />
            <path
              d="M0,200 Q250,400 500,200 T1000,200"
              stroke="url(#gradient1)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              style={{ animationDuration: "6s", animationDelay: "2s" }}
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full border border-green-200 mb-4 backdrop-blur-sm">
              <Trophy className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
                Round Complete
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              🎯 All Teams Completed!
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              All teams have completed their integration challenges
              successfully.
            </p>

            <Button
              onClick={() =>
                navigate("/round", {
                  state: {
                    collegeName,
                    previousRound: roundNumber,
                    totalParticipants: totalParticipants / 2,
                    scoringSystem,
                    scalingInfo,
                  },
                })
              }
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Target className="w-5 h-5 mr-2" />
              Launch Next Round
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
      {/* Animated background */}
      <Navbar />
      <CompetitionBanner hasTopMargin={false} />
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
            style={{ animationDuration: "4s" }}
          />
          <path
            d="M0,200 Q250,400 500,200 T1000,200"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Choose Your Team
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Select a team to begin their integration challenge. Each team will
            compete in mathematical excellence.
          </p>

          {/* Display college and round info */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
              <span className="text-gray-600">College:</span>
              <span className="text-gray-800 font-semibold">{collegeName}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
              <span className="text-gray-600">Round:</span>
              <span className="text-gray-800 font-semibold">{roundNumber}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
              <span className="text-gray-600">Teams:</span>
              <span className="text-gray-800 font-semibold">
                {remainingGroups.length}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {remainingGroups.map((item, index: number) => (
            <GameifiedGroupCard
              key={`group-${item.groupNumber}`}
              group={item.group}
              groupNumber={item.groupNumber}
              index={index}
              isSelected={selectedGroupIndex === index}
              onSelect={handleGroupSelect}
              pulseAnimation={pulseAnimation}
              onLaunch={(launchIndex: number) => {
                const selected = remainingGroups[launchIndex];
                const updated = remainingGroups.filter((_, i) => i !== launchIndex);
                const studentsWithCorrectGroupNumber = selected.group.map((student) => ({
                  name: student.name,
                  roll: student.rollNo,
                  groupNumber: selected.groupNumber,
                }));
                navigate("/exam", {
                  state: {
                    group: selected.group,
                    collegeName,
                    studentsWithGroupNumbers: studentsWithCorrectGroupNumber,
                    roundNumber,
                    groupIndex: selected.groupNumber,
                    totalParticipants,
                    scoringSystem,
                    scalingInfo,
                    remainingGroups: updated,
                  },
                });
                localStorage.setItem(
                  LOCAL_STORAGE_KEY,
                  JSON.stringify({
                    groups: initialGroups,
                    remainingGroups: updated,
                    studentsWithGroupNumbers,
                    collegeName,
                    roundNumber,
                    totalParticipants,
                    scoringSystem,
                    scalingInfo,
                  })
                );
                setRemainingGroups(updated);
                setSelectedGroupIndex(null);
              }}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate("/attendance")}
            className="bg-white/80 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-white hover:text-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            ⬅ Back to Attendance
          </Button>

          <div className="text-center">
            <Button
              disabled={selectedGroupIndex === null}
              onClick={handleStartExam}
              className={`font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 ${
                selectedGroupIndex !== null
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {selectedGroupIndex !== null
                  ? "Launch Challenge"
                  : "Select Team First"}
                <Star className="w-5 h-5" />
              </div>
            </Button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg">
            <span className="text-gray-600">Teams Remaining:</span>
            <div className="flex gap-2">
              {[...Array(remainingGroups.length)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                />
              ))}
            </div>
            <span className="text-gray-500 text-sm">
              {remainingGroups.length} Teams Ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroupSelection;
