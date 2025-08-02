"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

// Mathematical symbols component
const MathSymbol = ({ symbol, size = 16, className = "" }) => (
  <span className={`font-serif ${className}`} style={{ fontSize: `${size}px` }}>
    {symbol}
  </span>
);

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleMobileNavClick = (path) => {
    setIsMobileMenuOpen(false)
    navigate(path)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Enhanced backdrop with primary gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary to-secondary/90 backdrop-blur-md border-b border-white/20 shadow-2xl overflow-hidden" />
      
      {/* Floating mathematical symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-4 text-white/30 text-lg animate-float-1">∫</div>
        <div className="absolute top-3 right-20 text-white/30 text-sm animate-float-2">∑</div>
        <div className="absolute top-1 right-8 text-white/30 text-base animate-float-3">π</div>
        <div className="absolute top-2 left-1/3 text-white/30 text-sm animate-float-4">∞</div>
      </div>

      <nav className="relative z-10 py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Enhanced Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white hover:text-white/90 transition-colors duration-300 group"
            >
              <div className="relative">
                <MathSymbol symbol="∫" size={24} className="text-white/80 group-hover:text-white transition-colors duration-300" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/50 rounded-full animate-pulse" />
              </div>
              <span className="bg-gradient-to-r from-white via-white/90 to-white bg-clip-text text-transparent">
                The Integral Cup
              </span>
              <div className="relative">
                <MathSymbol symbol="∑" size={20} className="text-white/80 group-hover:text-white transition-colors duration-300" />
                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse animation-delay-1000" />
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex gap-3">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    asChild
                    className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-white/10"
                  >
                    <Link to="/" state={{ collegeName: user?.collegeName }}>
                      <MathSymbol symbol="π" size={14} className="mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="bg-red-500/20 backdrop-blur-sm border-red-400/50 text-red-200 hover:bg-red-500/30 hover:border-red-400/70 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/20"
                  >
                    <MathSymbol symbol="∞" size={14} className="mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  asChild
                  className="bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-white/10"
                >
                  <Link to="/login">
                    <MathSymbol symbol="∂" size={14} className="mr-2" />
                    Login
                  </Link>
                </Button>
              )}
            </div>

            {/* Enhanced Mobile Menu Toggle */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-300 hover:scale-110"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          {isMobileMenuOpen && (
            <div 
              id="mobile-menu" 
              className="md:hidden mt-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl animate-fade-in"
            >
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    asChild 
                    className="justify-center bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                  >
                    <Link
                      to="/"
                      state={{ collegeName: user?.collegeName }}
                      onClick={() => handleMobileNavClick("/")}
                    >
                      <MathSymbol symbol="π" size={14} className="mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="justify-center bg-red-500/20 backdrop-blur-sm border-red-400/50 text-red-200 hover:bg-red-500/30 hover:border-red-400/70 transition-all duration-300"
                  >
                    <MathSymbol symbol="∞" size={14} className="mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  asChild 
                  className="w-full justify-center bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 text-white transition-all duration-300"
                >
                  <Link to="/login" onClick={() => handleMobileNavClick("/login")}>
                    <MathSymbol symbol="∂" size={14} className="mr-2" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar