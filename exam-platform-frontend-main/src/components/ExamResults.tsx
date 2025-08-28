import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mathematical symbols component
const MathSymbol = ({ symbol, size = 16, className = "" }) => (
  <span className={`font-serif ${className}`} style={{ fontSize: `${size}px` }}>
    {symbol}
  </span>
);

// Floating mathematical symbols background
const FloatingMathSymbols = () => (
  <div className="absolute inset-0 pointer-events-none z-0">
    <div className="absolute top-4 left-4 text-purple-400/20 text-2xl animate-float-1">∫</div>
    <div className="absolute top-8 right-8 text-blue-400/20 text-xl animate-float-2">∑</div>
    <div className="absolute bottom-8 left-8 text-pink-400/20 text-lg animate-float-3">π</div>
    <div className="absolute bottom-4 right-4 text-cyan-400/20 text-xl animate-float-4">∞</div>
  </div>
);

interface User {
  id: number;
  name: string;
  rollNo: string;
  _id: string;
  isSelected?: boolean;
  groupNumber?: number;
  score?: number;
  totalScore?: number;
}

interface GroupWithNumber {
  group: User[];
  groupNumber: number;
}

interface ExamResultsProps {
  collegeName?: string;
  roundNumber?: number;
  group?: User[]; // Current group that just finished
  groups?: User[][];
  totalParticipants?: number;
  scoringSystem?: string;
  scalingInfo?: string;
  remainingGroups?: GroupWithNumber[] | User[][]; // Could be either format
  groupNumber?: number; // The group number of the current group
}

const getRoundLabel = (round?: number) => {
  switch (round) {
    case 1: return "Preliminary Round";
    case 2: return "Quarter Final";
    case 3: return "Semi Final";
    case 4: return "Final";
    default: return `Round ${round}`;
  }
};

const ExamResults: React.FC<ExamResultsProps> = ({
  collegeName,
  roundNumber,
  group,
  groups = [],
  totalParticipants,
  scoringSystem,
  scalingInfo,
  remainingGroups = [],
  groupNumber,
}) => {
  const navigate = useNavigate();

  // Check if remainingGroups has the new format (with groupNumber)
  const hasNewFormatGroups = remainingGroups.length > 0 && 
    'groupNumber' in remainingGroups[0];

  const goToNextRound = () => {
    if (roundNumber && roundNumber < 4) {
      navigate("/round", {
        state: {
          collegeName,
          previousRound: roundNumber,
          roundNumber: roundNumber + 1,
          totalParticipants: totalParticipants ? totalParticipants / 2 : undefined,
          scoringSystem,
          scalingInfo,
        },
      });
    } else {
      navigate("/feedback");
    }
  };

  const goToGroupSelection = () => {
    navigate("/groupselection", { // Updated path to match component route
      state: {
        groups: hasNewFormatGroups 
          ? remainingGroups.map(g => g.group) // Extract groups from new format
          : remainingGroups, // Use as is for old format
        remainingGroups: remainingGroups, // Pass the full remaining groups data
        collegeName,
        roundNumber,
        totalParticipants,
        scoringSystem,
        scalingInfo,
      },
    });
  };

  const hasRemainingGroups = remainingGroups.length > 0;
  const roundLabel = getRoundLabel(roundNumber);
  const nextRoundLabel = getRoundLabel((roundNumber ?? 0) + 1);

  // Calculate progress
  const totalGroups = groups?.length || 
    (hasRemainingGroups ? remainingGroups.length + 1 : 1);
  const completedGroups = totalGroups - remainingGroups.length;

  return (
    <div className="relative">
      <FloatingMathSymbols />
      <Card className="w-full max-w-xl mx-auto text-center bg-white/10 backdrop-blur-md shadow-2xl border-0 relative z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <MathSymbol symbol="∫" size={22} className="text-purple-400" />
            {hasRemainingGroups
              ? `${roundLabel} is going on`
              : `${roundLabel} is completed`}
            <MathSymbol symbol="∑" size={20} className="text-blue-400" />
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {groupNumber && (
            <div className="bg-blue-50/20 p-3 rounded-md flex items-center gap-2 justify-center">
              <MathSymbol symbol="π" size={18} className="text-pink-400" />
              <h3 className="font-medium text-blue-800">Group {groupNumber} Exam Completed</h3>
            </div>
          )}

          {group && group.length > 0 && (
            <div className="border p-3 rounded-md bg-white/10">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <MathSymbol symbol="∂" size={16} className="text-purple-400" />
                Students in this Group:
              </h3>
              <ul className="text-sm text-left pl-5 list-disc">
                {group.map(student => (
                  <li key={student._id || student.id}>
                    {student.name} ({student.rollNo})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasRemainingGroups ? (
            <div>
              <p className="text-purple-300 text-lg mb-2">
                Completed Group {completedGroups} of {totalGroups}
              </p>
              <p className="text-sm text-purple-200">
                {remainingGroups.length} group{remainingGroups.length > 1 ? 's' : ''} remaining.
              </p>
            </div>
          ) : (
            <p className="text-green-300 text-lg">
              Great job! You've completed the {roundLabel}. Ready for the next step?
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
          {hasRemainingGroups && (
            <Button onClick={goToGroupSelection} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
              <MathSymbol symbol="π" size={16} className="mr-2" />
              Go to Next Group
            </Button>
          )}

          {!hasRemainingGroups && (
            roundNumber && roundNumber < 4 ? (
              <Button onClick={goToNextRound} className="mx-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
                <MathSymbol symbol="∫" size={16} className="mr-2" />
                Start {nextRoundLabel}
              </Button>
            ) : (
              <Button onClick={() => navigate("/feedback")} className="mx-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
                <MathSymbol symbol="∞" size={16} className="mr-2" />
                Provide Feedback
              </Button>
            )
          )}

          {roundNumber !== 1 && (
            <Button variant="outline" onClick={() => navigate("/")} className="border-white/20 text-white hover:bg-white/10 hover:border-purple-400 transition-all duration-300">
              <MathSymbol symbol="∑" size={14} className="mr-2" />
              Back to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExamResults;