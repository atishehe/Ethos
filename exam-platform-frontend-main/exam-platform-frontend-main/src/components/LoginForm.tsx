import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Mathematical symbols component
const MathSymbol = ({ symbol, size = 16, className = "" }) => (
  <span className={`font-serif ${className}`} style={{ fontSize: `${size}px` }}>
    {symbol}
  </span>
);

// Floating mathematical symbols background
const FloatingMathSymbols = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-4 left-4 text-purple-400/30 text-2xl animate-float-1">∫</div>
    <div className="absolute top-8 right-8 text-blue-400/30 text-xl animate-float-2">∑</div>
    <div className="absolute bottom-8 left-8 text-pink-400/30 text-lg animate-float-3">π</div>
    <div className="absolute bottom-4 right-4 text-cyan-400/30 text-xl animate-float-4">∞</div>
    <div className="absolute top-1/2 left-2 text-green-400/30 text-lg animate-float-slow">∂</div>
    <div className="absolute top-1/2 right-2 text-yellow-400/30 text-base animate-float-1">dx</div>
  </div>
);

const LoginForm = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !password || !collegeName) {
      toast({
        title: "Error",
        description: "Please enter user ID, password, and college name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(userId, password, collegeName);
      if (success) {
        navigate("/", { state: { collegeName } });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Mathematical floating symbols background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-4 left-4 text-purple-400/30 text-2xl animate-float-1">∫</div>
        <div className="absolute top-8 right-8 text-blue-400/30 text-xl animate-float-2">∑</div>
        <div className="absolute bottom-8 left-8 text-pink-400/30 text-lg animate-float-3">π</div>
        <div className="absolute bottom-4 right-4 text-cyan-400/30 text-xl animate-float-4">∞</div>
      </div>
      <Card className="relative p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-md z-10 border border-gray-200">
        {/* Background with mathematical elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/95 via-white/90 to-gray-100/95 backdrop-blur-md rounded-lg" />
        <FloatingMathSymbols />
        
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 via-pink-200/30 to-blue-200/30 rounded-lg p-[1px]">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/95 via-white/90 to-gray-100/95 backdrop-blur-md rounded-lg" />
        </div>

        <div className="relative z-10">
          {/* Enhanced Header */}
          <div className="space-y-4 text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <MathSymbol symbol="∫" size={32} className="text-purple-600 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold font-poppins bg-gradient-to-r from-gray-800 via-purple-700 to-gray-800 bg-clip-text text-transparent">
                The Integral Cup
              </h1>
              <div className="relative">
                <MathSymbol symbol="∑" size={28} className="text-blue-600 animate-pulse animation-delay-1000" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse animation-delay-2000" />
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              Enter your credentials to access the exam
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <MathSymbol symbol="π" size={14} />
              <span>Mathematical Excellence Awaits</span>
              <MathSymbol symbol="∞" size={14} />
            </div>
          </div>

          {/* Enhanced Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="userId" className="text-gray-800 font-semibold flex items-center gap-2">
                <MathSymbol symbol="∂" size={16} className="text-purple-600" />
                User ID
              </Label>
              <Input
                id="userId"
                type="text"
                placeholder="Enter your user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={isLoading}
                required
                className="bg-white/90 backdrop-blur-sm border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/50 transition-all duration-300 hover:bg-white"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-gray-800 font-semibold flex items-center gap-2">
                <MathSymbol symbol="dx" size={16} className="text-blue-600" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="bg-white/90 backdrop-blur-sm border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/50 transition-all duration-300 hover:bg-white"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="collegeName" className="text-gray-800 font-semibold flex items-center gap-2">
                <MathSymbol symbol="∑" size={16} className="text-pink-600" />
                College Name
              </Label>
              <Select
                onValueChange={(value) => setCollegeName(value)}
                disabled={isLoading}
              >
                <SelectTrigger 
                  id="collegeName"
                  className="bg-white/90 backdrop-blur-sm border-gray-300 text-gray-800 focus:border-pink-500 focus:ring-pink-500/50 transition-all duration-300 hover:bg-white"
                >
                  <SelectValue placeholder="Select your college" className="text-gray-400" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-gray-200">
                  <SelectItem value="IIT Bombay">IIT Bombay</SelectItem>
                  <SelectItem value="IIT Delhi">IIT Delhi</SelectItem>
                  <SelectItem value="IIIT Delhi">IIIT Delhi</SelectItem>
                  <SelectItem value="IIT Madras">IIT Madras</SelectItem>
                  <SelectItem value="IIT Hyderabad">IIT Hyderabad</SelectItem>
                  <SelectItem value="IIT Roorkee">IIT Roorkee</SelectItem>
                  <SelectItem value="IIT Mandi">IIT Mandi</SelectItem>
                  <SelectItem value="IIT Jodhpur">IIT Jodhpur</SelectItem>
                  <SelectItem value="IIT Guwahati">IIT Guwahati</SelectItem>
                  <SelectItem value="IIT Kanpur">IIT Kanpur</SelectItem>
                  <SelectItem value="IIT BHU">IIT BHU</SelectItem>
                  <SelectItem value="IIT Ropar">IIT Ropar</SelectItem>
                  <SelectItem value="IIT ISM Dhanbad">IIT ISM Dhanbad</SelectItem>
                  <SelectItem value="IISc Bangalore">IISc Bangalore</SelectItem>
                  <SelectItem value="ISI Bangalore">ISI Bangalore</SelectItem>
                  <SelectItem value="IIIT Hyderabad">IIIT Hyderabad</SelectItem>
                  <SelectItem value="BITS Pilani">BITS Pilani</SelectItem>
                  <SelectItem value="IIT Bhubaneshwar">
                    IIT Bhubaneshwar
                  </SelectItem>
                  <SelectItem value="IIT Gandhinagar">IIT Gandhinagar</SelectItem>
                  <SelectItem value="IIT Bhilai">IIT Bhilai</SelectItem>
                  <SelectItem value="IIT Palakkad">IIT Palakkad</SelectItem>
                  <SelectItem value="IIT Patna">IIT Patna</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Enhanced Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-white font-semibold py-3 text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25 rounded-md" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MathSymbol symbol="∫" size={18} />
                  <span>Log In</span>
                  <MathSymbol symbol="∑" size={18} />
                </div>
              )}
            </Button>
          </form>

          {/* Enhanced Footer */}
          <div className="mt-8 text-center">
            <div className="bg-gray-100/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <p className="text-gray-600 text-sm">
                Ready to integrate?{" "}
                <a href="/login" className="text-blue-600 hover:text-blue-700 transition-colors duration-300 font-semibold">
                  Begin your mathematical journey
                </a>
                <MathSymbol symbol="∞" size={12} className="ml-1" />
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
