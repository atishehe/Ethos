import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useDataCache } from "@/contexts/DataCacheContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

type User = {
  id: number;
  name: string;
  rollNo: string;
  isSelected: boolean;
  _id: string;
  groupNumber?: number;
};

type StudentData = {
  name: string;
  rollNo: string;
  _id: string;
};

type ApiResponse = {
  [key: string]: StudentData[];
};

type GroupingPattern = {
  groups2?: number;
  groups3?: number;
  groups4?: number;
};

const getStageLabel = (round: number) => {
  switch (round) {
    case 2:
      return "Quarterfinal";
    case 3:
      return "Semifinal";
    case 4:
      return "Final";
    default:
      return "Round " + round;
  }
};

const AttendanceSheet = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<User[][]>([]);
  const [showGoButton, setShowGoButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentGroupNumber, setCurrentGroupNumber] = useState(1);
  const [currentGroupMembers, setCurrentGroupMembers] = useState<User[]>([]);
  const [isFormingGroups, setIsFormingGroups] = useState(false);
  
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { getCollegeStudents, preloadCollegeData, isDataLoading } = useDataCache();

  const collegeName = location.state?.collegeName;
  const roundNumber = location.state?.roundNumber || 1;
  const isTop16 = roundNumber === 1;

  useEffect(() => {
    if (!collegeName) {
      setIsLoading(false);
      setError("No college name provided");
      return;
    }

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        
        // First, try to get data from cache
        let studentData = getCollegeStudents(collegeName);
        
        if (!studentData) {
          // If not in cache, preload it
          console.log(`Data not cached for ${collegeName}, preloading...`);
          await preloadCollegeData(collegeName);
          studentData = getCollegeStudents(collegeName);
        }

        if (studentData && Array.isArray(studentData)) {
          const formatted = studentData.map(
            (s: StudentData, idx: number) => ({
              id: idx + 1,
              name: s.name,
              rollNo: s.rollNo,
              _id: s._id,
              isSelected: false,
            })
          );
          setUsers(formatted);
          console.log(`Loaded ${formatted.length} students for ${collegeName}`);
        } else {
          setError("No students found for this college");
        }
      } catch (err) {
        console.error("Failed to load students:", err);
        setError("Failed to load students. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [collegeName, getCollegeStudents, preloadCollegeData]);

  // Get grouping pattern based on total participants and round number
  const getGroupingPattern = (
    totalParticipants: number,
    round: number
  ): GroupingPattern => {
    // For round 1 (Top 16), use original grouping logic
    // For 8 or fewer participants, all qualify to next round
    if (totalParticipants <= 8) {
      return { groups3: 0, groups4: 0 };
    }

    // For specific participant counts 9-16, use predefined patterns
    if (totalParticipants === 16) return { groups3: 0, groups4: 4 }; // 4 groups of 4
    if (totalParticipants === 15) return { groups3: 1, groups4: 3 }; // 3 groups of 4, 1 group of 3
    if (totalParticipants === 14) return { groups3: 2, groups4: 2 }; // 2 groups of 4, 2 groups of 3
    if (totalParticipants === 13) return { groups3: 3, groups4: 1 }; // 1 group of 4, 3 groups of 3
    if (totalParticipants === 12) return { groups3: 0, groups4: 3 }; // 3 groups of 4
    if (totalParticipants === 11) return { groups3: 1, groups4: 2 }; // 2 groups of 4, 1 group of 3
    if (totalParticipants === 10) return { groups3: 2, groups4: 1 }; // 1 group of 4, 2 groups of 3
    if (totalParticipants === 9) return { groups3: 3, groups4: 0 }; // 3 groups of 3

    // For numbers above 16, try to maintain mostly groups of 4
    const groups4Count = Math.floor(totalParticipants / 4);
    const remainder = totalParticipants % 4;

    if (remainder === 0) return { groups3: 0, groups4: groups4Count };
    if (remainder === 3) return { groups3: 1, groups4: groups4Count };
    if (remainder === 2) return { groups3: 2, groups4: groups4Count - 1 };
    return { groups3: 3, groups4: groups4Count - 2 }; // remainder === 1
  };

  const createGroups = (selectedUsers: User[]) => {
    // Get total participants count
    const totalParticipants = selectedUsers.length;

    // If 8 or fewer participants in round 1, just put all in one group - they all qualify
    if (roundNumber === 1 && totalParticipants <= 8) {
      return [selectedUsers];
    }

    // For Top 16 only, auto-generate groups
    if (isTop16) {
      // Get grouping pattern based on total count
      const pattern = getGroupingPattern(totalParticipants, roundNumber);

      // Shuffle the selected users to randomize group formation
      const shuffledUsers = [...selectedUsers].sort(() => Math.random() - 0.5);

      const newGroups: User[][] = [];
      let currentIndex = 0;

      // Create groups of 4
      for (let i = 0; i < (pattern.groups4 || 0); i++) {
        newGroups.push(shuffledUsers.slice(currentIndex, currentIndex + 4));
        currentIndex += 4;
      }

      // Create groups of 3
      for (let i = 0; i < (pattern.groups3 || 0); i++) {
        newGroups.push(shuffledUsers.slice(currentIndex, currentIndex + 3));
        currentIndex += 3;
      }

      // Tag each user with group number
      const groupsWithNumbers = newGroups.map((group, idx) =>
        group.map((user) => ({ ...user, groupNumber: idx + 1 }))
      );
      return groupsWithNumbers;
    } else {
      // For other rounds, return current manually formed groups
      return groups;
    }
  };

  const handleCheck = (id: number) => {
    if (isTop16) {
      // For Top 16, just update selection status
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, isSelected: !user.isSelected } : user
      );
      setUsers(updatedUsers);

      const selected = updatedUsers.filter((u) => u.isSelected);
      const newGroups = createGroups(selected);
      setGroups(newGroups);
      setShowGoButton(selected.length > 0);
    } else if (isFormingGroups) {
      // For manual group formation, toggle user in/out of current group
      const user = users.find(u => u.id === id);
      if (!user) return;

      const isInCurrentGroup = currentGroupMembers.some(m => m.id === id);
      
      if (isInCurrentGroup) {
        // If user is in current group, remove them
        setCurrentGroupMembers(currentGroupMembers.filter(m => m.id !== id));
        
        // Update user's status if they're not in a finalized group
        if (!groups.some(group => group.some(g => g.id === id))) {
          const updatedUsers = users.map(u => 
            u.id === id ? { ...u, isSelected: false, groupNumber: undefined } : u
          );
          setUsers(updatedUsers);
        }
      } else if (user.groupNumber && groups.some(group => group.some(g => g.id === id))) {
        // If user is already in a finalized group, show warning
        toast({
          title: "∫ Student Already Assigned",
          description: `${user.name} is already in Group ${user.groupNumber}. Remove them from that group first.`,
          variant: "destructive",
        });
      } else {
        // If user is not in any group, add to current group
        const updatedUser = { ...user, isSelected: true, groupNumber: currentGroupNumber };
        setCurrentGroupMembers([...currentGroupMembers, updatedUser]);
        
        // Update user's status
        const updatedUsers = users.map(u => 
          u.id === id ? updatedUser : u
        );
        setUsers(updatedUsers);
      }
    }
  };

  const handleSelectAll = (select: boolean) => {
    if (!isTop16) {
      toast({
        title: "∫ Manual Group Formation",
        description: "For rounds after Top 16, please form groups manually by selecting students and using 'Add Group' button.",
      });
      return;
    }

    const updatedUsers = users.map((user) => ({
      ...user,
      isSelected: select,
    }));
    setUsers(updatedUsers);

    if (select) {
      const selected = updatedUsers.filter((u) => u.isSelected);
      const newGroups = createGroups(selected);
      setGroups(newGroups);
      setShowGoButton(true);
    } else {
      setGroups([]);
      setShowGoButton(false);
    }
  };

  const startFormingGroups = () => {
    setIsFormingGroups(true);
    setCurrentGroupNumber(1);
    setCurrentGroupMembers([]);
    
    // Reset any previous group selections
    const updatedUsers = users.map(user => ({
      ...user,
      isSelected: false,
      groupNumber: undefined
    }));
    setUsers(updatedUsers);
    setGroups([]);
  };

  const addCurrentGroup = () => {
    if (currentGroupMembers.length === 0) {
      toast({
        title: "∫ Empty Group",
        description: "Please select at least one student for this group.",
        variant: "destructive",
      });
      return;
    }

    // Add current group to groups
    setGroups([...groups, currentGroupMembers]);
    
    // Prepare for next group
    setCurrentGroupNumber(currentGroupNumber + 1);
    setCurrentGroupMembers([]);
    
    // Update the showGoButton status
    setShowGoButton(true);
  };

  const cancelGroupFormation = () => {
    setIsFormingGroups(false);
    
    // Reset current group selection
    setCurrentGroupMembers([]);
    
    // Reset any group number assignments from the users
    const updatedUsers = users.map(user => {
      if (user.groupNumber && !groups.some(group => group.some(g => g.id === user.id))) {
        return { ...user, isSelected: false, groupNumber: undefined };
      }
      return user;
    });
    
    setUsers(updatedUsers);
  };

  const finishGroupFormation = () => {
    // If there are students in current group, add them first
    if (currentGroupMembers.length > 0) {
      addCurrentGroup();
    }
    
    setIsFormingGroups(false);
    
    // Check if any groups were formed
    if (groups.length === 0) {
      toast({
        title: "∫ No Groups Formed",
        description: "Please form at least one group before proceeding.",
        variant: "destructive",
      });
      return;
    }
  };

  const getScoringSystem = (totalParticipants: number) => {
    if (roundNumber > 1) return "Head-to-head comparison";

    if (totalParticipants === 16) return "+3 to -3";
    if (totalParticipants === 12 || totalParticipants === 9) return "+2 to -2";
    return "Mixed";
  };

  const getScalingInfo = (totalParticipants: number) => {
    if (roundNumber > 1) return "No scaling needed";

    if (totalParticipants === 16 || totalParticipants === 12)
      return "No scaling needed";
    if (totalParticipants === 9) return "All scaled to /15";
    if (totalParticipants === 15) return "3-player group scaled to /15";
    return "3-player groups scaled";
  };

  const getFormatDescription = (totalParticipants: number) => {
    if (roundNumber > 1) {
      return "Participants compete in pairs or small groups";
    }

    if (totalParticipants <= 8) {
      return "All participants qualify to next round";
    }

    const pattern = getGroupingPattern(totalParticipants, roundNumber);
    const totalGroups = (pattern.groups3 || 0) + (pattern.groups4 || 0);
    const totalInGroups =
      (pattern.groups3 || 0) * 3 + (pattern.groups4 || 0) * 4;

    return `${totalInGroups} participants in ${totalGroups} groups`;
  };

  const getCompetitionRules = () => {
    switch (roundNumber) {
      case 1:
        return "Each group solves 5 integrals with 3 minutes per integral. Top 8 scorers across all groups and top 2 participants from each group will qualify for the next round.";
      case 2:
        return "Participants compete in pairs. Each pair solves 3 integrals with 3 minutes per integral. Winners advance to the next stage.";
      case 3:
        return "Participants compete in pairs. Each pair solves 5 integrals with 4 minutes per integral. Winners advance to the next stage.";
      case 4:
        return "Participants compete in pairs. Each pair solves 7 integrals with 5 minutes per integral. Winners will be crowned as final champions.";
      default:
        return "Competition rules not available for this round.";
    }
  };

  const navigateToExamCenter = () => {
    const flatGroups = groups.flat();
    navigate("/groupselection", {
      state: {
        groups,
        studentsWithGroupNumbers: flatGroups,
        collegeName,
        roundNumber,
        totalParticipants: flatGroups.length,
        scoringSystem: getScoringSystem(flatGroups.length),
        scalingInfo: getScalingInfo(flatGroups.length),
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-xl border-gray-200 shadow-2xl p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 animate-pulse">
                <span className="text-2xl font-bold text-white">∫</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Loading Competition Data...</h2>
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 w-full bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-xl border-red-200 shadow-2xl p-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
                <span className="text-2xl font-bold text-white">⚠</span>
              </div>
              <div className="bg-red-100 border border-red-300 text-red-800 px-6 py-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Competition Error</h3>
                <p>{error}</p>
              </div>
              <Button 
                onClick={() => navigate(-1)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2"
              >
                ← Return to Selection
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const totalSelected = users.filter((u) => u.isSelected).length;
  const getRoundColor = (round: number) => {
    switch (round) {
      case 1: return "from-green-500 to-blue-500";
      case 2: return "from-yellow-500 to-orange-500";
      case 3: return "from-orange-500 to-red-500";
      case 4: return "from-purple-500 to-pink-500";
      default: return "from-blue-500 to-indigo-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-4">
      {/* Floating mathematical symbols background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl text-gray-300/20 animate-pulse">∫</div>
        <div className="absolute top-20 right-20 text-4xl text-gray-300/20 animate-pulse delay-1000">dx</div>
        <div className="absolute bottom-20 left-20 text-5xl text-gray-300/20 animate-pulse delay-2000">∂</div>
        <div className="absolute bottom-10 right-10 text-3xl text-gray-300/20 animate-pulse delay-500">∑</div>
        <div className="absolute top-1/2 left-1/4 text-4xl text-gray-300/20 animate-pulse delay-1500">∞</div>
        <div className="absolute top-1/3 right-1/3 text-5xl text-gray-300/20 animate-pulse delay-3000">π</div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Card className="bg-white/90 backdrop-blur-xl border-gray-200 shadow-2xl p-8 space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${getRoundColor(roundNumber)} rounded-full mb-4 shadow-lg`}>
              <span className="text-3xl font-bold text-white">∫</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Integration Competition
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700">
              {collegeName && `${collegeName} Participants`}
            </h2>
            <div className={`inline-block px-6 py-3 bg-gradient-to-r ${getRoundColor(roundNumber)} rounded-full shadow-lg`}>
              <h3 className="text-xl font-bold text-white">
                {getStageLabel(roundNumber)} Round
              </h3>
            </div>
          </div>

          {/* Stats Bar */}
          {users.length > 0 && (
            <div className="flex justify-between items-center bg-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-800 font-medium">
                    {totalSelected} / {users.length} Participants Selected
                  </span>
                </div>
                <div className="text-gray-400">|</div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">∫</span>
                  <span className="text-gray-700">{groups.length} Groups</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                {isTop16 ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAll(true)}
                      className="bg-green-100 hover:bg-green-200 border-green-300 text-green-700"
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAll(false)}
                      className="bg-red-100 hover:bg-red-200 border-red-300 text-red-700"
                    >
                      Clear Selection
                    </Button>
                  </>
                ) : (
                  <>
                    {!isFormingGroups ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startFormingGroups}
                        className="bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-700"
                      >
                        Form Groups
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addCurrentGroup}
                          className="bg-green-100 hover:bg-green-200 border-green-300 text-green-700"
                        >
                          Add Group {currentGroupNumber}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={finishGroupFormation}
                          className="bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-700"
                        >
                          Complete Formation
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={cancelGroupFormation}
                          className="bg-red-100 hover:bg-red-200 border-red-300 text-red-700"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Competition Info Panel */}
          {totalSelected > 0 && (
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="flex items-center font-bold text-blue-700">
                    <span className="mr-2">📊</span>Competition Format
                  </h4>
                  <p className="text-gray-800">{getFormatDescription(totalSelected)}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="flex items-center font-bold text-purple-700">
                    <span className="mr-2">📈</span>Scoring System
                  </h4>
                  <p className="text-gray-800">
                    {getScoringSystem(totalSelected)} | Scaling: {getScalingInfo(totalSelected)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Group Formation Status */}
          {isFormingGroups && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="flex items-center font-bold text-yellow-700 text-lg">
                  <span className="mr-2">⚙️</span>Forming Group {currentGroupNumber}
                </h4>
                <Badge className="bg-yellow-200 text-yellow-800 border-yellow-300">
                  {currentGroupMembers.length} Students Selected
                </Badge>
              </div>
              {currentGroupMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {currentGroupMembers.map(member => (
                    <Badge 
                      key={member.id} 
                      className="bg-blue-200 text-blue-800 border-blue-300 px-3 py-2 text-sm hover:bg-blue-300 transition-colors cursor-pointer"
                      onClick={() => handleCheck(member.id)}
                    >
                      {member.name}
                      <button className="ml-2 text-red-600 hover:text-red-800 font-bold">
                        ✕
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Students Grid */}
          {users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => {
                const isInGroup = user.groupNumber !== undefined;
                const isInCurrentGroup = currentGroupMembers.some(m => m.id === user.id);
                
                let cardClass = "bg-white border-gray-200 hover:bg-gray-50";
                
                if (isInCurrentGroup) {
                  cardClass = "bg-blue-100 border-blue-300 shadow-blue-200 shadow-lg";
                } else if (isInGroup) {
                  cardClass = "bg-green-100 border-green-300 shadow-green-200 shadow-lg";
                } else if (user.isSelected) {
                  cardClass = "bg-green-100 border-green-300 shadow-green-200 shadow-lg";
                }
                
                return (
                  <Card
                    key={user.id}
                    className={`${cardClass} transition-all duration-300 hover:scale-105 cursor-pointer`}
                    onClick={() => handleCheck(user.id)}
                  >
                    <div className="p-4 flex items-center gap-3">
                      <Checkbox
                        id={`check-${user.id}`}
                        checked={user.isSelected || isInGroup || isInCurrentGroup}
                        onCheckedChange={() => handleCheck(user.id)}
                        disabled={isInGroup && !isFormingGroups}
                        className="border-gray-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">{user.name}</span>
                        </div>
                        <div className="text-sm text-gray-600">Roll: {user.rollNo}</div>
                      </div>
                      {isInGroup && !isInCurrentGroup && (
                        <Badge className="bg-purple-200 text-purple-800 border-purple-300">
                          Group {user.groupNumber}
                        </Badge>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl text-gray-600 mb-2">No Students Found</h3>
              <p className="text-gray-500">No participants found for this college</p>
            </div>
          )}
          
          {/* Navigation */}
          <div className="flex justify-between items-center pt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/round")}
              className="bg-gray-200 hover:bg-gray-300 border-gray-300 text-gray-700"
            >
              ← Back to Round Selection
            </Button>
            
            {showGoButton && (
              <Button 
                onClick={navigateToExamCenter}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Start Competition
              </Button>
            )}
          </div>
          
          {/* Groups Display */}
          {groups.length > 0 && groups[0].length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <span>📋</span>Competition Groups<span>📋</span>
                </h3>
                <p className="text-gray-600">Participants organized for competition</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group, idx) => (
                  <Card 
                    key={idx} 
                    className="bg-gradient-to-br from-purple-100 to-blue-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                          <span className="text-2xl">📊</span>
                          Group {idx + 1}
                        </h4>
                        <Badge className={`bg-gradient-to-r ${getRoundColor(roundNumber)} text-white border-none px-3 py-1`}>
                          {group.length} Students
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {group.map((user, userIdx) => (
                          <div 
                            key={user.id}
                            className="flex items-center gap-3 bg-white/80 rounded-lg p-3 border border-gray-200 hover:bg-white transition-colors"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                              {userIdx + 1}
                            </div>
                            <div className="flex-grow">
                              <div className="font-semibold text-gray-800">{user.name}</div>
                              <div className="text-sm text-gray-600">Roll: {user.rollNo}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Competition Rules */}
              {totalSelected > (roundNumber === 1 ? 8 : 0) && (
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-xl p-6">
                  <h4 className="flex items-center font-bold text-indigo-700 text-lg mb-3">
                    <span className="mr-2">📜</span>Competition Rules & Requirements
                  </h4>
                  <div className="bg-white/60 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-800 leading-relaxed">
                      <span className="font-semibold text-blue-700">∫ Integration Challenge:</span> {getCompetitionRules()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Mathematical decoration at bottom */}
          <div className="text-center pt-8 border-t border-gray-200">
            <div className="flex justify-center items-center gap-4 text-gray-300 text-2xl">
              <span>∫</span>
              <span>∂</span>
              <span>∑</span>
              <span>∞</span>
              <span>π</span>
              <span>∆</span>
              <span>∇</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">Excellence in Mathematical Competition</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AttendanceSheet