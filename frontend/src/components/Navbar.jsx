import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';

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
      className={`transition-colors ${className}`}
    >
      {text}
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
    { text: "Tutorial Video", href: "/tutorials" },
    {
      text: "Contact Us",
      onClick: () => {
        scrollToSection('contact');
        closeMenu();
      }
    },
    { text: "Sathi Bot", href: "/chat" },
    { text: "Budget Planner", href: "/budgetplan" }
  ];

  return (
    <nav className={`
      ${isOpen ? 'flex opacity-100 translate-y-0' : 'hidden opacity-0 -translate-y-4'} 
      md:flex md:opacity-100 md:translate-y-0
      flex-col md:flex-row md:items-center md:space-x-6
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
            text={item.text}
            href={item.href}
            onClick={item.onClick}
            className="block w-full text-left md:text-center md:w-auto mb-3 md:mb-0 text-gray-200 hover:text-orange-300 font-medium text-base px-4 py-2 transition-colors"
            navigate={navigate}
          />
        </div>
      ))}

      {/* Clerk Authentication Buttons */}
      <div className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0 mt-4 md:mt-0">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="w-full md:w-auto  
                              text-orange-300 font-semibold px-6 py-3 rounded-lg transition-all duration-300 
                              transform shadow-sm hover:text-orange-400 hover:shadow-orange-500/25
                              border border-orange-300/20 hover:border-orange-300/40">
              Sign In
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
    <header className="bg-purple-900/96 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center group">
            <div className="relative">
              <h1
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-white 
                         hover:text-orange-300 transition-all duration-300 cursor-pointer
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

          {/* Desktop Navigation
          <nav className="hidden md:flex space-x-8">
            <NavButton text="Tutorial Video" href="/tutorials" className="text-white hover:text-orange-300" />
            <NavButton
              text="Contact Us"
              onClick={() => {
                scrollToSection('contact');
                closeMenu();
              }}
              className="text-white hover:text-orange-300"
            />
            <NavButton text="Sathi Bot" href="/chat" className="text-white hover:text-orange-300" />
            <NavButton text="Budget Planner" href="/budgetplan" className="text-white hover:text-orange-300" />
          </nav> */}

          {/* Authentication Section */}
          {/* <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-purple-500 to-orange-500 text-white px-6 py-2 rounded-full
                                hover:from-purple-600 hover:to-orange-600 transition-all transform hover:scale-105">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </SignedIn>
          </div> */}

          {/* Mobile Menu Button */}
          {/* <button
            className="md:hidden text-white hover:text-orange-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button> */}
        </div>

        {/* Mobile Menu */}
        {/* {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="py-4 space-y-2">
              <NavButton text="Tutorial Video" href="/tutorials" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 w-full text-left" />
              <NavButton
                text="Contact Us"
                onClick={() => {
                  scrollToSection('contact');
                  closeMenu();
                }}
                className="block px-4 py-2 text-gray-700 hover:bg-purple-50 w-full text-left"
              />
              <NavButton text="Sathi Bot" href="/chat" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 w-full text-left" />
              <NavButton text="Budget Planner" href="/budgetplan" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 w-full text-left" />

              <div className="px-4 py-2">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full bg-gradient-to-r from-purple-500 to-orange-500 text-white py-2 rounded-full">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-12 h-12"
                        }
                      }}
                    />
                  </div>
                </SignedIn>
              </div>
            </nav>
          </div>
        )} */}
      </div>
    </header>
  );
};

export default Navbar;