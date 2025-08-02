import React from 'react';
import { Mail, Phone, Instagram, Linkedin, Award, Users, Target, BookOpen } from 'lucide-react';

// Math Symbol Component
const MathSymbol = ({ symbol, size = 16, className = "" }) => (
  <span className={`font-serif ${className}`} style={{ fontSize: `${size}px` }}>
    {symbol}
  </span>
);

// Integration Symbol Component
const IntegrationSymbol = ({ size = 16, className = "" }) => (
  <MathSymbol symbol="∫" size={size} className={className} />
);

// Button Component
const Button = ({ children, size = "md", variant = "default", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    ghost: "bg-transparent text-current hover:bg-current/10 focus:ring-current"
  };
  
  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200/20 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <IntegrationSymbol size={32} className="text-blue-600" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              The Integral Cup
            </h2>
            <MathSymbol symbol="∑" size={32} className="text-purple-600" />
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Uniting mathematical minds across India through excellence, innovation, and education
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* About VGS */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mission Statement */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:bg-white/90 transition-all duration-300 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                VGS is an initiative of Vedant Samanavaya to promote mathematical excellence across India. 
                It unites bright minds from diverse backgrounds, inspiring innovation and elevating the standard of math education nationwide.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:bg-white/90 transition-all duration-300 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Excellence</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Promoting the highest standards in mathematical education and competition
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:bg-white/90 transition-all duration-300 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-green-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Unity</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Bringing together diverse mathematical minds from across the nation
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:bg-white/90 transition-all duration-300 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Innovation</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Inspiring creative approaches to mathematical problem-solving
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:bg-white/90 transition-all duration-300 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <MathSymbol symbol="π" size={20} className="text-orange-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Education</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Elevating mathematical education standards nationwide
                </p>
              </div>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:bg-white/90 transition-all duration-300 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-gray-800">
                <Mail className="w-6 h-6 text-blue-600" />
                Get In Touch
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200">
                  <Mail className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Info@vedantsamanvaya.com</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200">
                  <Phone className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">+91-9257282136</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200">
                  <Phone className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">+91-7015354736</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-300">
                <h4 className="font-semibold mb-4 text-center text-gray-800">Follow Us</h4>
                <div className="flex justify-center gap-4">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-gray-700 hover:bg-gray-200 p-3 rounded-full hover:scale-110 transition-all duration-200"
                  >
                    <Instagram className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-gray-700 hover:bg-gray-200 p-3 rounded-full hover:scale-110 transition-all duration-200"
                  >
                    <Linkedin className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Copyright Section */}
        <div className="text-center">
          <div className="text-gray-600 text-sm flex items-center justify-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-gray-200 max-w-lg mx-auto hover:bg-white/80 transition-all duration-300 shadow-md">
            <IntegrationSymbol size={16} className="text-gray-500" />
            <span>&copy; {currentYear} The Integral Cup. All rights reserved.</span>
            <MathSymbol symbol="∫" size={14} className="text-gray-500" />
          </div>
          
          <div className="mt-6 text-gray-500 text-xs">
            <p>Powered by Vedant Samanavaya | Inspiring Mathematical Excellence</p>
          </div>
        </div>
      </div>

      {/* Floating Mathematical Elements */}
      <div className="absolute top-20 left-10 text-gray-300/20 text-6xl font-serif animate-float">∫</div>
      <div className="absolute top-40 right-20 text-gray-300/20 text-4xl font-serif animate-float delay-1000">∑</div>
      <div className="absolute bottom-40 left-20 text-gray-300/20 text-5xl font-serif animate-float delay-500">π</div>
      <div className="absolute bottom-20 right-10 text-gray-300/20 text-3xl font-serif animate-float delay-1500">∞</div>
    </footer>
  );
};

export default Footer;