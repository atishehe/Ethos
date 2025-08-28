import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Sponsors";
import ExamResults from "@/components/ExamResults";
import CompetitionBanner from "@/components/CompetitionBanner";
import { useExam } from "@/contexts/ExamContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackForm from "@/components/FeedbackForm";
import {
  Trophy,
  Medal,
  Target,
  Zap,
  Star,
  Crown,
  Award,
  Flame,
} from "lucide-react";

// Round label formatter with gaming terminology
const getRoundLabel = (round?: number) => {
  switch (round) {
    case 1:
      return {
        name: "Preliminary Arena",
        icon: Target,
        color: "text-blue-600",
      };
    case 2:
      return { name: "Quarter Battle", icon: Zap, color: "text-purple-600" };
    case 3:
      return {
        name: "Semi Championship",
        icon: Medal,
        color: "text-orange-600",
      };
    case 4:
      return { name: "Grand Finale", icon: Crown, color: "text-yellow-600" };
    default:
      return { name: `Arena ${round}`, icon: Target, color: "text-gray-600" };
  }
};

// Integration symbol component
const IntegrationSymbol = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`inline-block ${className}`}
    fill="currentColor"
  >
    <path d="M12 2L8 6h3v4H7v3l-4-4 4-4v3h4V4h3l-4-4z" />
    <path d="M12 22l4-4h-3v-4h4v-3l4 4-4 4v-3h-4v4h-3l4 4z" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

// Animated background particles
const BackgroundParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: "3s",
          }}
        />
      ))}
    </div>
  );
};

const ResultsPage = () => {
  const { isAuthenticated } = useAuth();
  const { isExamEnded } = useExam();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("results");

  const {
    group,
    groups,
    remainingGroups,
    collegeName,
    roundNumber,
    totalParticipants,
    scoringSystem,
    scalingInfo,
    groupNumber,
  } = location.state || {};

  const roundInfo = getRoundLabel(roundNumber);
  const RoundIcon = roundInfo.icon;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden py-16 bg-gradient-to-b from-gray-100 to-white">
      <BackgroundParticles />

      <Navbar />
      <CompetitionBanner hasTopMargin={true} />

      <main className="flex-grow relative z-10 py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 mb-8 backdrop-blur-sm border border-gray-200 shadow-xl">
            <div className="absolute inset-0 bg-grid-gray-200/20 bg-[size:32px_32px] rounded-3xl" />

            {/* Floating integration symbols */}
            <div className="absolute top-4 right-4 text-gray-300">
              <IntegrationSymbol size={48} className="animate-spin-slow" />
            </div>
            <div className="absolute bottom-4 left-4 text-gray-200">
              <IntegrationSymbol size={32} className="animate-pulse" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/80 rounded-2xl backdrop-blur-sm shadow-lg border border-gray-200">
                  <RoundIcon className={`h-8 w-8 ${roundInfo.color}`} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 font-poppins tracking-tight">
                    {collegeName}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <IntegrationSymbol size={20} className="text-yellow-600" />
                    <span className="text-xl text-gray-700 font-semibold">
                      Integration Competition
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <RoundIcon className="h-5 w-5" />
                  <span className="font-semibold">{roundInfo.name}</span>
                </div>
                {groupNumber && (
                  <>
                    <div className="w-px h-6 bg-gray-300" />
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      <span>Group {groupNumber}</span>
                    </div>
                  </>
                )}
                <div className="w-px h-6 bg-gray-300" />
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span>{totalParticipants} Competitors</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gaming-style tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200 p-1 rounded-2xl shadow-lg">
                <TabsTrigger
                  value="results"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 flex items-center gap-2 text-gray-700"
                >
                  <Trophy className="h-4 w-4" />
                  Battle Results
                </TabsTrigger>
                <TabsTrigger
                  value="feedback"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 flex items-center gap-2 text-gray-700"
                >
                  <Flame className="h-4 w-4" />
                  Feedback Hub
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="results" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl shadow-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Competition Leaderboard
                  </h2>
                  <IntegrationSymbol
                    size={24}
                    className="text-blue-500 animate-pulse"
                  />
                </div>

                <ExamResults
                  group={group}
                  groups={groups}
                  remainingGroups={remainingGroups}
                  collegeName={collegeName}
                  roundNumber={roundNumber}
                  totalParticipants={totalParticipants}
                  scoringSystem={scoringSystem}
                  scalingInfo={scalingInfo}
                  groupNumber={groupNumber}
                />
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl shadow-lg">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Share Your Experience
                  </h2>
                  <IntegrationSymbol
                    size={24}
                    className="text-green-500 animate-spin-slow"
                  />
                </div>

                {/* Feedback form container with proper styling */}
                <div className="bg-gray-50/90 backdrop-blur-sm rounded-xl p-6 shadow-inner border border-gray-100">
                  <FeedbackForm />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Achievement showcase */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-xl">
            <div className="text-center">
              <div className="flex justify-center items-center gap-2 mb-4">
                <IntegrationSymbol size={32} className="text-yellow-500" />
                <h3 className="text-xl font-bold text-gray-800">
                  Integration Mastery Challenge
                </h3>
                <IntegrationSymbol size={32} className="text-yellow-500" />
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Compete in mathematical integration challenges and prove your
                calculus prowess. Every equation solved brings you closer to
                mathematical excellence!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default ResultsPage;
