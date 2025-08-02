import { useState } from 'react';
import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

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

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitFeedback } = useExam();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback) {
      toast({
        title: "Missing Information",
        description: "Please provide your feedback before submitting",
        variant: "destructive",
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Missing Rating",
        description: "Please provide a rating before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      submitFeedback(feedback, rating);
      setFeedback('');
      setRating(0);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="relative">
      <FloatingMathSymbols />
      <Card className="w-full bg-white/10 backdrop-blur-md border-0 shadow-2xl relative z-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MathSymbol symbol="∫" size={18} className="text-purple-400" />
            Your Feedback
            <MathSymbol symbol="∑" size={16} className="text-blue-400" />
          </CardTitle>
          <CardDescription>
            Help us improve The Integral Cup by sharing your experience
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="feedback">What did you think about the exam?</Label>
                <Textarea
                  id="feedback"
                  placeholder="Share your thoughts about the questions, interface, or overall experience..."
                  rows={5}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-white/10 border-white/20 text-black placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300 hover:bg-white/15"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Rate your experience (1-5)</Label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={rating === value ? "default" : "outline"}
                      onClick={() => setRating(value)}
                      className={`w-10 h-10 rounded-full p-0 transition-all duration-200 ${rating === value ? 'scale-110 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-white/10 text-purple-300 border-white/20 hover:bg-white/20'}`}
                      disabled={isSubmitting}
                      aria-label={`Rate ${value}`}
                    >
                      <span className="font-bold text-lg">{value}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white font-semibold py-3 text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackForm;
