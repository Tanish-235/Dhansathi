import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../hooks/useAuth.js';

// Loader Component
const Loader = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-purple-800 via-purple-900 to-purple-800 flex justify-center items-center z-[2000]">
      <div className="relative">
        <div className="flex space-x-2">
          {['ध', 'न', 'सा', 'थी'].map((letter, index) => (
            <span
              key={index}
              className="text-6xl font-bold opacity-0 translate-y-10 text-white drop-shadow-lg"
              style={{
                animation: `fadeInUp 0.8s forwards`,
                animationDelay: `${index * 0.3}s`
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-1 bg-orange-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(40px) scale(0.8); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
      `}</style>
    </div>
  );
};

// Hero Section Component
const HeroSection = ({ scrollToSection }) => {
  const { isAuthenticated, fullName } = useAuth();
  
  return (
    <section className="h-screen relative bg-cover bg-center bg-no-repeat overflow-hidden" style={{
      backgroundImage: "url('https://princewilliamlivingweb.s3-accelerate.amazonaws.com/2022/01/shutterstock_1025314012-scaled.jpg')"
    }}>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/60 via-black/40 to-purple-900/60"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-20 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="relative z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white px-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-6xl md:text-7xl mb-4 font-extrabold bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
            Welcome to Dhansathi
          </h1>
          {isAuthenticated && (
            <p className="text-2xl md:text-3xl mb-4 font-semibold text-orange-300 drop-shadow-lg">
              Welcome back, {fullName}! 👋
            </p>
          )}
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full mb-6"></div>
        </div>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light leading-relaxed text-gray-100">
          Your trusted partner in financial advisory and literacy. Empowering communities through smart financial decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => scrollToSection('about')}
            className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none px-10 py-4 text-lg cursor-pointer rounded-full transition-all duration-300 text-white font-semibold shadow-2xl hover:shadow-orange-500/25 hover:scale-105 transform"
          >
            <span className="flex items-center">
              Learn More
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="border-2 border-white hover:border-orange-300 bg-transparent hover:bg-white/10 px-10 py-4 text-lg cursor-pointer rounded-full transition-all duration-300 text-white hover:text-orange-300 font-semibold backdrop-blur-sm"
          >
            Get Started
          </button>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

// Section Component
const Section = ({ id, children, isVisible, className = "" }) => {
  return (
    <section
      id={id}
      className={`py-20 px-6 max-w-6xl mx-auto my-16 relative ${className} transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:border-white/30">
        <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full blur-xl"></div>
        {children}
      </div>
    </section>
  );
};

// About Section Component
const AboutSection = ({ isVisible }) => {
  return (
    <Section id="about" isVisible={isVisible}>
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl mb-4 text-white font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
          About Us
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-gray-100 leading-relaxed text-lg">
          <p className="hover:text-white transition-colors duration-300">
            Dhansathi is a dedicated financial advisory platform designed to empower individuals, especially rural women, with financial literacy and tools for better money management.
          </p>
          <p className="hover:text-white transition-colors duration-300">
            Our mission is to bridge the financial knowledge gap and provide easy access to financial education, personalized budgeting tools, and banking solutions tailored to the needs of our users.
          </p>
          <p className="hover:text-white transition-colors duration-300">
            Through AI-driven mentorship, community support, and user-friendly interfaces, Dhansathi simplifies complex financial concepts and makes them accessible to everyone, regardless of background or education level.
          </p>
          <p className="hover:text-white transition-colors duration-300">
            We believe that financial empowerment leads to personal growth, independence, and stronger communities. That's why we continuously work towards making financial management seamless and effective for our users.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-orange-300 mb-2">10K+</div>
            <div className="text-sm text-gray-200">Users Empowered</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-purple-300 mb-2">95%</div>
            <div className="text-sm text-gray-200">Satisfaction Rate</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-blue-300 mb-2">24/7</div>
            <div className="text-sm text-gray-200">AI Support</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-green-300 mb-2">100+</div>
            <div className="text-sm text-gray-200">Financial Tools</div>
          </div>
        </div>
      </div>
    </Section>
  );
};

// Values Section Component
const ValuesSection = ({ isVisible }) => {
  const values = [
    { icon: "📢", title: "Transparency", desc: "We believe in complete honesty and clarity in all financial matters. No hidden costs, no complicated jargon.", gradient: "from-blue-500/20 to-blue-600/20" },
    { icon: "🤝", title: "Integrity", desc: "Trust is the foundation of any financial relationship. We are committed to ethical practices and user-first policies.", gradient: "from-green-500/20 to-green-600/20" },
    { icon: "💡", title: "Financial Literacy", desc: "Educating and empowering users with knowledge to make informed financial decisions is our top priority.", gradient: "from-yellow-500/20 to-yellow-600/20" },
    { icon: "📈", title: "Innovation", desc: "We leverage AI and technology to bring smart financial solutions tailored to individual needs.", gradient: "from-purple-500/20 to-purple-600/20" },
    { icon: "💜", title: "Community Support", desc: "We foster a supportive network where users can share experiences, learn from each other, and grow together.", gradient: "from-pink-500/20 to-pink-600/20" },
    { icon: "🌍", title: "Inclusion", desc: "Our platform is designed for everyone, ensuring financial access regardless of gender, location, or income level.", gradient: "from-teal-500/20 to-teal-600/20" }
  ];

  return (
    <Section id="values" isVisible={isVisible}>
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl mb-4 text-white font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
          Our Core Values
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-gray-200 max-w-3xl mx-auto">
          Our services are built on transparency, integrity, and innovation. We are committed to making financial decisions easier and more accessible for everyone.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((value, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${value.gradient} p-6 rounded-2xl hover:scale-105 transition-all duration-300 group cursor-pointer border border-white/10 hover:border-white/20`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {value.icon}
            </div>
            <h3 className="text-xl font-bold text-orange-300 mb-3 group-hover:text-orange-200 transition-colors">
              {value.title}
            </h3>
            <p className="text-gray-200 leading-relaxed group-hover:text-white transition-colors">
              {value.desc}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};

// Contact Section Component
const ContactSection = ({ isVisible }) => {
  const contactInfo = [
    { label: 'Email', value: 'contact@dhansathi.com', icon: '📧', gradient: 'from-blue-500/20 to-blue-600/20' },
    { label: 'Phone', value: '+91 9876543210', icon: '📞', gradient: 'from-green-500/20 to-green-600/20' },
    { label: 'Address', value: 'Dhansathi, Mumbai, India', icon: '📍', gradient: 'from-purple-500/20 to-purple-600/20' }
  ];

  return (
    <Section id="contact" isVisible={isVisible}>
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl mb-4 text-white font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
          Contact Us
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto">
          Ready to start your financial journey? Get in touch with us today and let's build your financial future together.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {contactInfo.map((info, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${info.gradient} p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 group cursor-pointer border border-white/10 hover:border-white/20`}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {info.icon}
            </div>
            <h3 className="text-xl font-bold text-orange-300 mb-3 group-hover:text-orange-200 transition-colors">
              {info.label}
            </h3>
            <p className="text-gray-200 text-lg group-hover:text-white transition-colors break-all">
              {info.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-4 rounded-full text-white font-semibold shadow-xl hover:shadow-orange-500/25 hover:scale-105 transition-all duration-300">
          Send us a Message
        </button>
      </div>
    </Section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 p-12">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 right-20 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-white mb-2">धनसाथी</h3>
            <div className="w-16 h-1 bg-white/50 mx-auto rounded-full"></div>
          </div>
          <p className="text-white text-xl font-medium mb-2">
            &copy; 2025 Dhansathi. All Rights Reserved.
          </p>
          <div className="text-white/90 text-lg mb-6">
            Empowering financial literacy for everyone
          </div>
          <div className="flex justify-center space-x-8 text-white/80">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const Home = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});

  // Hide loader after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for sections
  useEffect(() => {
    if (showLoader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.2 }
    );

    const timer = setTimeout(() => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => observer.observe(section));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [showLoader]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="font-sans text-white bg-gradient-to-br from-purple-800 via-purple-900 to-purple-800 overflow-x-hidden min-h-screen">
      <Loader isVisible={showLoader} />
      
      {!showLoader && (
        <div className="opacity-100 transition-opacity duration-1000 pt-20">
          <Navbar 
            isScrolled={isScrolled}
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            scrollToSection={scrollToSection}
          />
          
          <HeroSection scrollToSection={scrollToSection} />
          
          <AboutSection isVisible={visibleSections.about} />
          
          <ValuesSection isVisible={visibleSections.values} />
          
          <ContactSection isVisible={visibleSections.contact} />
          
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Home;