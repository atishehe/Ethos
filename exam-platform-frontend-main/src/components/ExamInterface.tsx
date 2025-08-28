import React, { useEffect, useState, useCallback } from "react";
import { useExam } from "@/contexts/ExamContext";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import MarkCalculation from "./MarkCalculation";
import CompetitionBanner from "@/components/CompetitionBanner";
import {
  Timer,
  Users,
  Trophy,
  Target,
  CheckCircle,
  XCircle,
  ArrowRight,
  Clock,
  Calculator,
  BookOpen,
  ChevronRight,
  Home,
  BarChart3,
  Users2,
  GraduationCap,
  Bell,
  AlertTriangle,
  Play,
  Pause,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  rollNo: string;
  _id: string;
  isSelected: boolean;
}

interface Props {
  group: Student[];
  remainingGroups: Student[][];
  collegeName: string;
  roundNumber: number;
  totalParticipants: number;
  scoringSystem: string;
  scalingInfo: string;
  groupNumber?: number;
}

const getTimePerQuestion = (round: number) => {
  switch (round) {
    case 1:
      return 5; // 5 seconds for round 1
    case 2:
      return 5; // 5 seconds for round 2
    case 3:
      return 5; // 5 seconds for round 3
    case 4:
      return 5; // 5 seconds for round 4
    default:
      return 5; // 5 seconds default
  }
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const ExamInterface: React.FC<Props> = ({
  group,
  remainingGroups,
  collegeName,
  roundNumber,
  totalParticipants,
  scoringSystem,
  scalingInfo,
  groupNumber,
}) => {
  const {
    questions,
    currentQuestionIndex,
    isExamStarted,
    isExamEnded,
    userAnswers,
    startExam,
    endExam,
    answerQuestion,
    nextQuestion,
  } = useExam();

  const [questionTimer, setQuestionTimer] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [optionsDisabled, setOptionsDisabled] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studentStatuses, setStudentStatuses] = useState<
    Record<string, "correct" | "incorrect" | null>
  >({});
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [timeWarningShown, setTimeWarningShown] = useState(false);
  const [criticalTimeWarningShown, setCriticalTimeWarningShown] =
    useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const navigate = useNavigate();
  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestionIndex];

  // Progress calculation
  const progress =
    totalQuestions > 0
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;

  // Initialize audio context for better quality sounds
  useEffect(() => {
    const initAudio = () => {
      try {
        const ctx = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
        setAudioContext(ctx);
      } catch (error) {
        console.log("Audio context not supported");
      }
    };

    // Initialize audio context on first user interaction
    const handleUserInteraction = () => {
      initAudio();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  // Create gentle notification sound
  const playGentleNotification = useCallback(
    (type: "warning" | "critical" | "timeup" | "start" | "question") => {
      if (!audioContext) return;

      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Gentle bell-like sound for warnings (5 seconds remaining)
        if (type === "warning") {
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            400,
            audioContext.currentTime + 0.4
          );
          filter.frequency.setValueAtTime(1500, audioContext.currentTime);
          filter.Q.setValueAtTime(8, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.6
          );
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.6);
        }
        // More urgent sound for critical time (3 seconds remaining)
        else if (type === "critical") {
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            600,
            audioContext.currentTime + 0.3
          );
          filter.frequency.setValueAtTime(1200, audioContext.currentTime);
          filter.Q.setValueAtTime(6, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.18, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.5
          );
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        }
        // Time up notification
        else if (type === "timeup") {
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            200,
            audioContext.currentTime + 0.8
          );
          filter.frequency.setValueAtTime(600, audioContext.currentTime);
          filter.Q.setValueAtTime(4, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 1.0
          );
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 1.0);
        }
        // Exam start notification
        else if (type === "start") {
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            600,
            audioContext.currentTime + 0.3
          );
          filter.frequency.setValueAtTime(1200, audioContext.currentTime);
          filter.Q.setValueAtTime(6, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.8
          );
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.8);
        }
        // Question start notification
        else if (type === "question") {
          oscillator.frequency.setValueAtTime(700, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            500,
            audioContext.currentTime + 0.4
          );
          filter.frequency.setValueAtTime(1000, audioContext.currentTime);
          filter.Q.setValueAtTime(5, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.6
          );
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.6);
        }
      } catch (error) {
        console.log("Could not play notification sound");
      }
    },
    [audioContext]
  );

  useEffect(() => {
    if (questions && questions.length > 0) {
      setTotalQuestions(questions.length);
      console.log(`Total questions loaded: ${questions.length}`);
    }
  }, [questions]);

  useEffect(() => {
    if (isExamStarted && !isExamEnded && currentQuestion) {
      const timePerQuestion = getTimePerQuestion(roundNumber);
      setQuestionTimer(timePerQuestion);
      setTimerStarted(false);
      setTimerPaused(false);
      setOptionsDisabled(false);
      setShowAnswer(false);
      setTimeUp(false);
      setPulseAnimation(false);
      setTimeWarningShown(false);
      setCriticalTimeWarningShown(false);

      // Reset student statuses for new question
      if (group && group.length > 0) {
        setStudentStatuses(
          Object.fromEntries(group.map((student) => [student.name, null]))
        );
      }

      console.log(
        `Question ${
          currentQuestionIndex + 1
        } of ${totalQuestions} loaded. Timer ready to start.`
      );
    }
  }, [
    currentQuestionIndex,
    isExamStarted,
    isExamEnded,
    currentQuestion,
    group,
    roundNumber,
    totalQuestions,
  ]);

  // Timer effect - runs when timer is started and not paused
  useEffect(() => {
    let timerId: number | null = null;

    if (
      isExamStarted &&
      !isExamEnded &&
      currentQuestion &&
      timerStarted &&
      !timerPaused
    ) {
      console.log(`Timer started for question ${currentQuestionIndex + 1}`);

      timerId = window.setInterval(() => {
        setQuestionTimer((prevTime) => {
          if (prevTime <= 1) {
            setOptionsDisabled(true);
            setShowAnswer(true);
            setTimeUp(true);
            setPulseAnimation(false);
            setTimerStarted(false);
            playGentleNotification("timeup");
            return 0;
          }

          // Play warning sound every second from 5 seconds down to 1 second
          if (prevTime <= 5 && prevTime > 1) {
            if (prevTime === 5) {
              playGentleNotification("warning");
            } else if (prevTime === 3) {
              playGentleNotification("critical");
            } else {
              // Play a gentle tick for other seconds
              playGentleNotification("warning");
            }
          }

          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [
    currentQuestionIndex,
    isExamStarted,
    isExamEnded,
    currentQuestion,
    timerStarted,
    timerPaused,
    playGentleNotification,
  ]);

  const handleStart = () => {
    console.log("Starting exam...");
    playGentleNotification("start");
    startExam();
  };

  const handleStartTimer = () => {
    if (!timerStarted || timeUp) {
      console.log("Starting timer for question", currentQuestionIndex + 1);
      setTimerStarted(true);
      setTimerPaused(false);
      setPulseAnimation(true);
      playGentleNotification("question");
    }
  };

  const handlePauseTimer = () => {
    if (timerStarted && !timerPaused && !timeUp) {
      console.log("Pausing timer for question", currentQuestionIndex + 1);
      setTimerPaused(true);
      setPulseAnimation(false);
    }
  };

  const handleContinueTimer = () => {
    if (timerStarted && timerPaused && !timeUp) {
      console.log("Continuing timer for question", currentQuestionIndex + 1);
      setTimerPaused(false);
      setPulseAnimation(true);
    }
  };

  const handleAnswer = (index: number) => {
    if (!optionsDisabled) {
      answerQuestion(currentQuestionIndex, index);
      setOptionsDisabled(true);
      setShowAnswer(true);
      setTimeUp(false);
      setPulseAnimation(false);
      setTimerStarted(false);
    }
  };

  const toggleStudentStatus = (
    name: string,
    status: "correct" | "incorrect"
  ) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [name]: prev[name] === status ? null : status,
    }));
  };

  const handleNext = () => {
    console.log(
      `Current question: ${
        currentQuestionIndex + 1
      }, Total questions: ${totalQuestions}`
    );

    if (currentQuestionIndex < totalQuestions - 1) {
      console.log("Moving to next question");
      nextQuestion();
    } else {
      console.log("This is the last question, ending exam");
      endExam();
      navigate("/results", {
        state: {
          roundNumber,
          collegeName,
          remainingGroups,
          groupNumber,
        },
      });
    }
  };

  const handleFinishExam = () => {
    console.log("Finishing exam early");
    endExam();
    navigate("/results", {
      state: {
        roundNumber,
        collegeName,
        remainingGroups,
        groupNumber,
      },
    });
  };

  const handleBackToSelection = () => {
    navigate("/groupselection", {
      state: {
        collegeName,
        roundNumber,
        remainingGroups,
        totalParticipants,
        scoringSystem,
        scalingInfo,
      },
    });
  };

  console.log("Rendering ExamInterface:", {
    isExamStarted,
    isExamEnded,
    currentQuestionIndex,
    totalQuestions,
    questionsLength: questions?.length,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto p-6">
        {/* Simple Header */}
        <CompetitionBanner hasTopMargin={false} />
        {!isExamStarted && (
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">
                <Calculator className="w-16 h-16 text-blue-600 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Start?
              </h2>
              <p className="text-gray-600 mb-8">Begin the integration exam</p>
              <Button
                onClick={handleStart}
                className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
              >
                Start Exam for Team {groupNumber || ""}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {isExamStarted && !isExamEnded && currentQuestion && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Question Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                {/* Question Header */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <BookOpen className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-bold text-xl">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Timer Control Buttons - Hide when time is up */}
                    {!timeUp && (
                      <div className="flex items-center gap-2">
                        {!timerStarted ? (
                          <Button
                            onClick={handleStartTimer}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
                          >
                            <Play className="w-4 h-4" />
                            Start
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            {!timerPaused ? (
                              <Button
                                onClick={handlePauseTimer}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
                              >
                                <Pause className="w-4 h-4" />
                                Pause
                              </Button>
                            ) : (
                              <Button
                                onClick={handleContinueTimer}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
                              >
                                <Play className="w-4 h-4" />
                                Continue
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Timer Display */}
                    <div
                      className={`flex items-center gap-3 px-6 py-4 rounded-lg border transition-all duration-300 ${
                        !timerStarted
                          ? "bg-gray-50 border-gray-200 text-gray-600"
                          : timerPaused
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : questionTimer > 3
                          ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                          : questionTimer > 1
                          ? "bg-orange-50 border-orange-200 text-orange-700"
                          : "bg-red-50 border-red-200 text-red-700"
                      } ${
                        questionTimer <= 2 && timerStarted && !timerPaused
                          ? "animate-pulse"
                          : ""
                      }`}
                    >
                      {!timerStarted ? (
                        <Clock className="w-6 h-6" />
                      ) : timerPaused ? (
                        <Pause className="w-6 h-6" />
                      ) : questionTimer <= 2 ? (
                        <AlertTriangle className="w-6 h-6" />
                      ) : questionTimer <= 5 ? (
                        <Bell className="w-6 h-6" />
                      ) : (
                        <Clock className="w-6 h-6" />
                      )}
                      <span className="font-bold text-2xl">
                        {formatTime(questionTimer)}
                      </span>
                      {timerPaused && (
                        <span className="text-sm font-medium ml-2">
                          (Paused)
                        </span>
                      )}
                      {!timerStarted && !timeUp && (
                        <span className="text-sm font-medium ml-2">
                          (Ready)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Time Warning Messages */}
                {timerStarted &&
                  !timerPaused &&
                  questionTimer <= 5 &&
                  questionTimer > 3 && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
                      <Bell className="w-5 h-5 text-yellow-600" />
                      <span className="text-yellow-800 font-medium">
                        Time is running out! {questionTimer} seconds remaining.
                      </span>
                    </div>
                  )}

                {timerStarted &&
                  !timerPaused &&
                  questionTimer <= 3 &&
                  questionTimer > 1 && (
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <span className="text-orange-800 font-medium">
                        Hurry up! Only {questionTimer} seconds left!
                      </span>
                    </div>
                  )}

                {timerStarted && !timerPaused && questionTimer === 1 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">
                      Last second! Submit your answer now!
                    </span>
                  </div>
                )}

                {!timerStarted && !timeUp && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                    <Play className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">
                      Click "Start" to begin the timer for this question.
                    </span>
                  </div>
                )}

                {timerPaused && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                    <Pause className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">
                      Timer is paused. Click "Continue" to resume.
                    </span>
                  </div>
                )}

                {/* Question Content */}
                <div className="bg-gray-50 rounded-lg p-8 mb-8 border">
                  <div className="text-gray-900 text-xl mb-6 font-semibold">
                    Solve this integration:
                  </div>
                  <div className="bg-white rounded-lg p-6 text-center border shadow-sm">
                    <BlockMath math={String(currentQuestion.text)} />
                  </div>
                </div>

                {/* Answer Options */}
                <div className="space-y-4 mb-8">
                  {currentQuestion.options &&
                    currentQuestion.options.length > 0 &&
                    currentQuestion.options.map((option, idx) => {
                      const isCorrect = idx === currentQuestion.correctAnswer;
                      const isSelected = userAnswer === idx;

                      let buttonClass =
                        "w-full text-left p-6 rounded-lg border-2 transition-all hover:shadow-md ";

                      if (showAnswer) {
                        if (isCorrect) {
                          buttonClass +=
                            "bg-green-50 border-green-300 text-green-800";
                        } else if (isSelected) {
                          buttonClass +=
                            "bg-red-50 border-red-300 text-red-800";
                        } else {
                          buttonClass +=
                            "bg-gray-50 border-gray-200 text-gray-600";
                        }
                      } else {
                        buttonClass +=
                          "bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-blue-300";
                      }

                      return (
                        <Button
                          key={idx}
                          variant="outline"
                          onClick={() => handleAnswer(idx)}
                          className={buttonClass}
                          disabled={optionsDisabled || !timerStarted}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-lg font-bold bg-gray-100 rounded-lg p-2 min-w-[3rem] text-center">
                              {String.fromCharCode(65 + idx)}.
                            </div>
                            <div className="flex-1">
                              <InlineMath math={String(option)} />
                            </div>
                            {showAnswer && isCorrect && (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            )}
                            {showAnswer && isSelected && !isCorrect && (
                              <XCircle className="w-6 h-6 text-red-600" />
                            )}
                          </div>
                        </Button>
                      );
                    })}
                </div>

                {/* Solution Display */}
                {showAnswer && currentQuestion.answer && (
                  <div className="bg-blue-50 rounded-lg p-8 border border-blue-200 mb-8">
                    <div className="text-blue-800 font-bold text-xl mb-4">
                      Solution:
                    </div>
                    <div className="bg-white rounded-lg p-6 border">
                      <BlockMath math={String(currentQuestion.answer)} />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="text-center space-y-4">
                  <Button
                    onClick={handleNext}
                    className="px-10 py-4 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-semibold"
                  >
                    {currentQuestionIndex === totalQuestions - 1 ? (
                      <>
                        <Trophy className="w-5 h-5 mr-2" />
                        Complete Exam
                      </>
                    ) : (
                      <>
                        Next Question
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  {currentQuestionIndex === totalQuestions - 1 && (
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="destructive"
                        onClick={handleFinishExam}
                        className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        End Exam
                      </Button>
                      <Button
                        onClick={handleBackToSelection}
                        className="px-8 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold"
                      >
                        <Home className="w-5 h-5 mr-2" />
                        Back to Selection
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Student Status Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                <div className="flex items-center gap-3 mb-6">
                  <Users2 className="w-6 h-6 text-gray-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Team Members
                  </h3>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {group && group.length > 0 ? (
                    group.map((student, idx) => {
                      const status = studentStatuses[student.name];
                      return (
                        <div
                          key={idx}
                          className="bg-gray-50 border border-gray-200 p-4 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-gray-900">
                              <div className="font-semibold">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" />#
                                {student.rollNo}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                toggleStudentStatus(student.name, "correct")
                              }
                              disabled={!showAnswer}
                              className={`flex-1 px-4 py-2 rounded-lg transition-all font-semibold ${
                                status === "correct"
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                              }`}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Correct
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                toggleStudentStatus(student.name, "incorrect")
                              }
                              disabled={!showAnswer}
                              className={`flex-1 px-4 py-2 rounded-lg transition-all font-semibold ${
                                status === "incorrect"
                                  ? "bg-red-600 hover:bg-red-700 text-white"
                                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                              }`}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Wrong
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No team members</p>
                    </div>
                  )}
                </div>

                {group &&
                  group.length > 0 &&
                  showAnswer &&
                  Object.values(studentStatuses).some((v) => v === null) && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-3 text-yellow-800">
                        <Target className="w-5 h-5" />
                        <p className="text-sm font-semibold">
                          Please mark all team members to continue
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        {isExamEnded && (
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">
                <Trophy className="w-16 h-16 text-blue-600 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                Exam Complete!
              </h2>
              <p className="text-gray-600">Processing results...</p>
            </div>
          </div>
        )}

        {showAnswer && (
          <MarkCalculation
            questionIndex={currentQuestionIndex}
            studentStatuses={studentStatuses}
            groupSize={group?.length || 0}
            students={group || []}
            roundNumber={roundNumber}
          />
        )}
      </div>
    </div>
  );
};

export default ExamInterface;
