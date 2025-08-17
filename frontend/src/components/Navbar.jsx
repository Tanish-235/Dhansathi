import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

// Navigation Button Component
const NavButton = ({ text, href, onClick, className = '', navigate }) => {
  const handleClick = () => {
    if (href) {
      if (href.startsWith('/')) {
        navigate(href);
      } else {
        window.location.href = href;
      }
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`relative text-white font-semibold text-sm md:text-base capitalize px-5 py-3 md:px-4 md:py-2 
                 transition-all duration-300 group hover:text-orange-300 hover:scale-105 active:scale-95
                 rounded-lg md:rounded-none hover:bg-white/10 md:hover:bg-transparent
                 border border-transparent hover:border-orange-300/30 md:hover:border-transparent ${className}`}
    >
      {text}
      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-orange-300 
                     transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
    </button>
  );
};

// Hamburger Menu Component
const HamburgerMenu = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden text-white focus:outline-none p-2 rounded-lg hover:bg-white/10 
                 transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Toggle menu"
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center relative">
        <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-full
                         ${isOpen ? 'rotate-45 translate-y-1 bg-orange-300' : '-translate-y-0.5'}`}></span>
        <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-full my-0.5
                         ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}></span>
        <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-full
                         ${isOpen ? '-rotate-45 -translate-y-1 bg-orange-300' : 'translate-y-0.5'}`}></span>
      </div>
    </button>
  );
};

// Navigation Menu Component
const NavigationMenu = ({ isOpen, scrollToSection, closeMenu, navigate }) => {
  const navigationItems = [
    { text: "Tutorial Video", href: "/tutorials", icon: "🎥" },
    { 
      text: "Contact Us", 
      onClick: () => {
        scrollToSection('contact');
        closeMenu();
      },
      icon: "📞"
    },
    { text: "Resources", href: "/resources", icon: "📚" },
    { text: "Sathi bot", href: "/chat", icon: "🤖" },
    { text: "Budget Planner", href: "/budgetplan", icon: "💰" }
  ];

  return (
    <nav className={`
      ${isOpen ? 'flex opacity-100 translate-y-0' : 'hidden opacity-0 -translate-y-4'} 
      md:flex md:opacity-100 md:translate-y-0
      flex-col md:flex-row md:space-x-4 
      absolute md:static top-full left-0 w-full md:w-auto 
      bg-purple-900/98 md:bg-transparent 
      backdrop-blur-lg md:backdrop-blur-none
      p-6 md:p-0 
      border-t md:border-none border-white/20
      shadow-xl md:shadow-none
      transition-all duration-500 ease-out
      rounded-b-xl md:rounded-none
      max-h-96 overflow-y-auto md:max-h-none md:overflow-visible
    `}>
      {navigationItems.map((item, index) => (
        <div 
          key={index}
          className={`transform transition-all duration-300 delay-${index * 50}
                     ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0 md:translate-x-0 md:opacity-100'}`}
        >
          <NavButton
            text={
              <span className="flex items-center gap-2">
                <span className="text-sm opacity-80">{item.icon}</span>
                {item.text}
              </span>
            }
            href={item.href}
            onClick={item.onClick}
            className="block w-full text-left md:text-center md:w-auto mb-3 md:mb-0"
            navigate={navigate}
          />
        </div>
      ))}
      
                    {/* Clerk Authentication Buttons */}
       <div className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0 mt-4 md:mt-0">
         <SignedOut>
           <SignInButton mode="modal">
             <button className="w-full md:w-auto bg-gradient-to-r from-orange-400 to-purple-600 hover:from-orange-500 hover:to-purple-700 
                              text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 
                              hover:scale-105 active:scale-95 transform shadow-lg hover:shadow-orange-500/25
                              border border-orange-300/20 hover:border-orange-300/40">
               <span className="flex items-center gap-2">
                 <span className="text-base">🔐</span>
                 Sign In
               </span>
             </button>
           </SignInButton>
         </SignedOut>
         <SignedIn>
           <div className="flex items-center justify-center md:justify-start">
             <UserButton 
               appearance={{
                 elements: {
                   avatarBox: "w-12 h-12 md:w-10 md:h-10"
                 }
               }}
             />
           </div>
         </SignedIn>
       </div>
    </nav>
  );
};

// Main Navbar Component
const Navbar = ({ isScrolled, isMenuOpen, toggleMenu, scrollToSection }) => {
  const navigate = useNavigate();
  const closeMenu = () => {
    if (window.innerWidth < 768 && isMenuOpen) {
      toggleMenu();
    }
  };

  return (
    <header className={`
      fixed top-0 left-0 w-full z-[1500] transition-all duration-500 ease-out
      ${isScrolled 
        ? 'bg-purple-900/96 backdrop-blur-xl shadow-2xl border-b border-white/10' 
        : 'bg-transparent'
      }
    `}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          {/* Logo/Brand */}
          <div className="flex items-center group">
            <div className="relative">
              <h1 
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-white 
                         hover:text-orange-300 transition-all duration-300 cursor-pointer
                         transform hover:scale-105 active:scale-95
                         bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent
                         hover:from-orange-300 hover:to-white drop-shadow-lg"
                onClick={() => navigate('/')}
              >
               धनसाथी
              </h1>
              {/* Decorative elements */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-300 rounded-full opacity-80 
                             animate-pulse group-hover:scale-125 transition-transform duration-300 shadow-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white/50 rounded-full 
                             group-hover:bg-orange-300/70 transition-colors duration-300 shadow-sm"></div>
            </div>
          </div>
          
          {/* Hamburger Menu */}
          <HamburgerMenu isOpen={isMenuOpen} onClick={toggleMenu} />
          
          {/* Navigation Menu */}
          <NavigationMenu 
            isOpen={isMenuOpen} 
            scrollToSection={scrollToSection} 
            closeMenu={closeMenu}
            navigate={navigate}
          />
        </div>
      </div>
      
      {/* Mobile menu backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden transition-opacity duration-300
                   ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMenu}
        style={{ top: '100%' }}
      />
    </header>
  );
};

export default Navbar;