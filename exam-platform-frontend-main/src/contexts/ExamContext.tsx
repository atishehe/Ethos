import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL;
interface Question {
  id: number;
  text: string;
  answer?: string;
  options: string[];
  correctAnswer: number;
}

interface Student {
  name: string;
  roll: string;
  groupNumber: number;
}
// Define the structure of questions coming from the API
interface ApiQuestion {
  questionLaTeX: string;
  answerLaTeX: string;
}

interface ApiResponse {
  stageName: string;
  stageId: number;
  questions: ApiQuestion[];
}

interface ExamContextType {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  isExamStarted: boolean;
  isExamEnded: boolean;
  score: number;
  timeRemaining: number;
  startExam: () => void;
  endExam: () => void;
  resetExam: () => void; // Added reset function
  answerQuestion: (questionIndex: number, answerIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitFeedback: (feedback: string, rating: number) => void;
  setExamConfiguration: (roundNumber: number) => void;
  nextRound: () => void;
  roundNumber: number;
  showNextButton: boolean;
  showAnswerBeforeNext: boolean;
  showFeedback: boolean;
  loadQuestions: (roundNumber: number, studentsWithGroupNumbers: Student[], directGroupNumber?: number) => Promise<void>;
  isLoading: boolean;
  currentAnswer: string | null;
}

// Map round number to stage name and id
const getStageInfo = (roundNumber: number): { stageName: string } => {
  switch (roundNumber) {
    case 1:
      return { stageName: "top 16" };
    case 2:
      return { stageName: "quarterfinal"};
    case 3:
      return { stageName: "semifinal" };
    case 4:
      return { stageName: "final"};
    default:
      return { stageName: "semifinal" };
  }
};

const getTimePerQuestion = (round: number) => {
  switch (round) {
    case 1: return 180; // 3 minutes
    case 2: return 180; // 3 minutes
    case 3: return 240; // 4 minutes
    case 4: return 300; // 5 minutes
    default: return 180;
  }
};

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamEnded, setIsExamEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showAnswerBeforeNext, setShowAnswerBeforeNext] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  
  
  // Updated loadQuestions to accept an optional directGroupNumber parameter
  const loadQuestions = async (roundNumber: number, studentsWithGroupNumbers: Student[], directGroupNumber?: number) => {
    // Use directGroupNumber if provided, otherwise get from students array
    const groupNumber = directGroupNumber || studentsWithGroupNumbers?.[0]?.groupNumber || 1; 
    
    console.log("Loading questions for group number:", groupNumber);
  
    setIsLoading(true);
    
    // Get stage info based on round number
    const { stageName } = getStageInfo(roundNumber);
    try {
      // Use groupNumber as stageId in API request
      const res = await fetch(`${API_BASE_URL}/api/competitionStages/${stageName}/${groupNumber}`);
      const data: ApiResponse = await res.json();
      
      if (res.ok) {
        // Map LaTeX questions into our Question structure
        const fetchedQuestions: Question[] = data.questions.map((q: ApiQuestion, index: number) => ({
          id: index + 1,
          text: q.questionLaTeX,  // Store LaTeX question text
          answer: q.answerLaTeX,  // Store LaTeX answer
          options: [],           // No multiple choices for LaTeX questions
          correctAnswer: -1      // Not applicable for LaTeX questions
        }));
        
        setQuestions(fetchedQuestions);
        setUserAnswers(Array(fetchedQuestions.length).fill(null));
        // Reset exam state when loading new questions
        resetExam();
        
        toast({
          title: "Questions Loaded",
          description: `Loaded ${fetchedQuestions.length} questions for ${stageName} (Round ${roundNumber}) - Group ${groupNumber}`,
        });
      } else {
        toast({
          title: "Fetch Failed",
          description:"Could not load questions",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      toast({
        title: "Error",
        description: "Failed to fetch questions from server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a reset function to completely reset the exam state
  const resetExam = () => {
    setCurrentQuestionIndex(0);
    setIsExamStarted(false);
    setIsExamEnded(false);
    setUserAnswers(Array(questions.length).fill(null));
    setScore(0);
    setTimeRemaining(getTimePerQuestion(roundNumber));
    setCurrentAnswer(null);
    setShowNextButton(false);
    setShowAnswerBeforeNext(false);
  };

  useEffect(() => {
    let timer: number | undefined;

    if (isExamStarted && !isExamEnded && !showNextButton) {
      timer = window.setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            // When time's up, show the answer if in a mode that reveals answers
            if (questions[currentQuestionIndex]?.answer) {
              setCurrentAnswer(questions[currentQuestionIndex].answer || null);
            }
            setShowAnswerBeforeNext(true);
            setShowNextButton(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isExamStarted, isExamEnded, currentQuestionIndex, showNextButton, questions]);

  const setExamConfiguration = (round: number) => {
    setRoundNumber(round);
    const timePerQ = getTimePerQuestion(round);
    setTimeRemaining(timePerQ);
    setShowFeedback(round === 4); // Only show feedback after round 4
  };

  const nextRound = () => {
    if (roundNumber < 4) {
      const nextRoundNumber = roundNumber + 1;
      setRoundNumber(nextRoundNumber);
      setExamConfiguration(nextRoundNumber); // Update exam configuration based on the new round
    } else {
      // If it's the last round, show feedback
      setShowFeedback(true);
    }
  };

  const startExam = () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to start the exam",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "No questions loaded. Please load questions first.",
        variant: "destructive",
      });
      return;
    }

    resetExam(); // Ensure clean state
    setIsExamStarted(true);
    setTimeRemaining(getTimePerQuestion(roundNumber));

    toast({
      title: "Exam Started",
      description: "Good luck!",
    });
  };

  const calculateScore = () => {
    // For LaTeX questions, we may need a different scoring mechanism
    // This is just a placeholder since we don't have a way to automatically check LaTeX answers
    return 0;
  };

  const endExam = () => {
    if (!isExamStarted) return;

    const finalScore = calculateScore();
    setScore(finalScore);
    setIsExamEnded(true);
    setIsExamStarted(false);

    toast({
      title: "Exam Completed",
      description: `You've completed the ${getStageInfo(roundNumber).stageName} round.`,
    });
  };

  const answerQuestion = (questionIndex: number, answerIndex: number) => {
    // For LaTeX questions, this might be used differently or not at all
    if (isExamEnded) return;

    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });
  };

  const nextQuestion = () => {
    setShowAnswerBeforeNext(false);
    setShowNextButton(false);
    setCurrentAnswer(null);
    
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setTimeRemaining(getTimePerQuestion(roundNumber));
    } else {
      endExam();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setCurrentAnswer(null);
    }
  };

  const submitFeedback = (feedback: string, rating: number) => {
    console.log("Feedback submitted:", { feedback, rating });
    toast({
      title: "Thank You!",
      description: "Your feedback has been submitted successfully",
    });
  };

  return (
    <ExamContext.Provider
      value={{
        questions,
        currentQuestionIndex,
        userAnswers,
        isExamStarted,
        isExamEnded,
        score,
        timeRemaining,
        startExam,
        endExam,
        resetExam,
        answerQuestion,
        nextQuestion,
        prevQuestion,
        submitFeedback,
        setExamConfiguration,
        nextRound,
        roundNumber,
        showNextButton,
        showAnswerBeforeNext,
        showFeedback,
        loadQuestions,
        isLoading,
        currentAnswer
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};
export const useExam = () => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};