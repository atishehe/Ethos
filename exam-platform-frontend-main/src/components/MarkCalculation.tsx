import React from "react";

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

interface Student {
  id: string;
  name: string;
  rollNo?: string;
  groupNumber?: number;
}

interface MarkCalculationProps {
  questionIndex: number; // Current question index
  studentStatuses: Record<string, "correct" | "incorrect" | null>;
  groupSize: number; // Number of participants in the group (3 or 4)
  students: Student[]; // Student information
  roundNumber: number; // Competition round
}

const MarkCalculation: React.FC<MarkCalculationProps> = ({
  questionIndex,
  studentStatuses,
  groupSize,
  students,
  roundNumber,
}) => {
  // Calculate scores based on the Integral Cup scoring system
  const calculateScores = () => {
    // Count correct answers
    const correctCount = Object.values(studentStatuses).filter(
      (status) => status === "correct"
    ).length;
    
    // For Round 1, use the specific scoring system shown in the PDF
    if (roundNumber === 1 ) {
      const results = Object.entries(studentStatuses).map(([studentId, status]) => {
        let score = 0;
        
        // Find student info
        const student = students.find(s => s.id === studentId);
        
        if (status === "correct") {
          // Apply scoring based on correct player count (from the table)
          if (correctCount === 1) {
            score = 3; // +3 for the one correct student
          } else if (correctCount === 2) {
            score = 2; // +2 for each correct student
          } else if (correctCount === 3) {
            score = 1; // +1 for each correct student
          } else if (correctCount === groupSize) {
            score = 0; // +0 if all are correct
          }
        } else if (status === "incorrect") {
          // Apply scoring based on correct player count (from the table)
          if (correctCount === 1) {
            score = -1; // -1 for incorrect students when one is correct
          } else if (correctCount === 2) {
            score = -2; // -2 for incorrect students when two are correct
          } else if (correctCount === 3 && groupSize === 4) {
            score = -3; // -3 for the one incorrect student when three are correct
          } else if (correctCount === 0) {
            score = 0; // If all are incorrect, everyone gets 0
          }
        }
        
        return {
          id: studentId,
          name: student?.name || studentId,
          rollNo: student?.rollNo,
          groupNumber: student?.groupNumber,
          status,
          rawScore: score, // Store the raw score for potential scaling
          score: score,    // This will be adjusted later for group size 3
        };
      });
      
      // For group size 3, adjust scores to ensure sum is zero
      if (groupSize === 3) {
        const totalRawScore = results.reduce((sum, r) => sum + r.rawScore, 0);
        
        // Only apply adjustment if the total isn't already zero
        if (totalRawScore !== 0) {
          // Calculate adjustment to make the sum zero
          const adjustment = totalRawScore / groupSize;
          
          // Apply adjustment to each score
          results.forEach(result => {
            result.score = result.rawScore - adjustment;
          });
        }
      }
      
      return results;
    } else {
      // For later rounds (quarterfinals, semifinals, finals), use simple +1/0 scoring
      const results = Object.entries(studentStatuses).map(([studentId, status]) => {
        const student = students.find(s => s.id === studentId);
        let score = 0;
        
        if (status === "correct") {
          score = 1; // Simple +1 for correct in head-to-head
        }
        
        
        return {
          id: studentId,
          name: student?.name || studentId,
          rollNo: student?.rollNo,
          groupNumber: student?.groupNumber,
          status,
          score,
          rawScore: score,
        };
      });
      
      return results;
    }
  };
  
  const results = calculateScores();
  const total = results.reduce((sum, r) => sum + r.score, 0);
  
  // Check if scores were adjusted based on the group size
  const needsScaling = () => {
    if (roundNumber > 1) return false;
    
    if (groupSize === 3) {
      // Check if there's a difference between raw and adjusted scores
      const hasAdjustment = results.some(r => r.rawScore !== r.score);
      
      if (hasAdjustment) {
        const totalParticipants = students.length;
        if (totalParticipants === 9 || totalParticipants === 15) {
          return "All scaled to /15";
        }
        return "3-player groups scaled";
      }
    }
    
    return false;
  };
  
  const scaling = needsScaling();

  return (
    <div className="relative mt-4">
      <FloatingMathSymbols />
      <div className="bg-white/10 border-0 rounded-2xl p-6 shadow-xl backdrop-blur-md relative z-10">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
          <MathSymbol symbol="∫" size={18} className="text-purple-400" />
          Question {questionIndex + 1} Results
          <MathSymbol symbol="∑" size={16} className="text-blue-400" />
        </h2>
        {scaling && (
          <div className="mb-2 text-sm bg-yellow-50/20 p-2 rounded border border-yellow-200/30 flex items-center gap-2">
            <MathSymbol symbol="π" size={14} className="text-pink-400" />
            Note: {scaling}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-t bg-white/5 rounded-xl">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="py-1">Student</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map(({ id, name, rollNo, status, score }) => (
                <tr key={id} className="border-b border-white/10">
                  <td className="py-1">
                    {name} {rollNo && <span className="text-gray-400 text-xs">({rollNo})</span>}
                  </td>
                  <td>
                    {status === "correct" ? (
                      <span className="text-green-400 font-semibold flex items-center gap-1"><MathSymbol symbol="∫" size={12} />Correct</span>
                    ) : status === "incorrect" ? (
                      <span className="text-red-400 font-semibold flex items-center gap-1"><MathSymbol symbol="∑" size={12} />Incorrect</span>
                    ) : (
                      <span className="text-gray-400">Not marked</span>
                    )}
                  </td>
                  <td className={score > 0 ? "text-green-400 font-bold" : score < 0 ? "text-red-400 font-bold" : "text-white/80"}>
                    {score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarkCalculation;