import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const DhansathiResources = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const resourceCategories = [
    {
      id: 'financial-planning',
      icon: '📊',
      title: 'Financial Planning Guides',
      color: 'emerald',
      items: [
        'Personal Financial Assessment',
        'Goal Setting & Priority Framework',
        'Emergency Fund Planning',
        'Debt Management Strategies',
        'Financial Health Checkup'
      ]
    },
    {
      id: 'investment',
      icon: '📈',
      title: 'Investment Education',
      color: 'blue',
      items: [
        'Mutual Funds Basics',
        'SIP vs Lump Sum Guide',
        'Risk Assessment Tools',
        'Portfolio Diversification',
        'Market Analysis Reports'
      ]
    },
    {
      id: 'budgeting',
      icon: '💰',
      title: 'Budgeting & Savings',
      color: 'amber',
      items: [
        '50/30/20 Budget Rule',
        'Expense Tracking Templates',
        'Smart Saving Strategies',
        'Cost Reduction Tips',
        'Savings Account Comparison'
      ]
    },
    {
      id: 'insurance',
      icon: '🛡️',
      title: 'Insurance Planning',
      color: 'red',
      items: [
        'Life Insurance Calculator',
        'Health Insurance Guide',
        'Term vs Endowment Plans',
        'Insurance Need Analysis',
        'Claim Process Guide'
      ]
    },
    {
      id: 'tax',
      icon: '📋',
      title: 'Tax Planning',
      color: 'purple',
      items: [
        'Tax Saving Instruments',
        'Section 80C Optimization',
        'ITR Filing Guide',
        'TDS & Advance Tax',
        'Tax Calculator Tools'
      ]
    },
    {
      id: 'retirement',
      icon: '🏖️',
      title: 'Retirement Planning',
      color: 'cyan',
      items: [
        'Retirement Corpus Calculator',
        'EPF & PPF Strategies',
        'NPS Investment Guide',
        'Post-retirement Income',
        'Pension Plan Comparison'
      ]
    }
  ];

  const tools = [
    {
      icon: '🧮',
      title: 'SIP Calculator',
      description: 'Calculate your mutual fund SIP returns and plan your investments effectively'
    },
    {
      icon: '🏠',
      title: 'EMI Calculator',
      description: 'Calculate loan EMIs for home, car, or personal loans with detailed amortization'
    },
    {
      icon: '💎',
      title: 'Goal Planner',
      description: 'Plan and track your financial goals with personalized investment strategies'
    },
    {
      icon: '📊',
      title: 'Portfolio Tracker',
      description: 'Monitor your investments across different asset classes in one dashboard'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      emerald: {
        border: 'border-l-emerald-500',
        icon: 'bg-emerald-50 text-emerald-600',
        button: 'bg-emerald-600 hover:bg-emerald-700'
      },
      blue: {
        border: 'border-l-blue-500',
        icon: 'bg-blue-50 text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      amber: {
        border: 'border-l-amber-500',
        icon: 'bg-amber-50 text-amber-600',
        button: 'bg-amber-600 hover:bg-amber-700'
      },
      red: {
        border: 'border-l-red-500',
        icon: 'bg-red-50 text-red-600',
        button: 'bg-red-600 hover:bg-red-700'
      },
      purple: {
        border: 'border-l-purple-500',
        icon: 'bg-purple-50 text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      cyan: {
        border: 'border-l-cyan-500',
        icon: 'bg-cyan-50 text-cyan-600',
        button: 'bg-cyan-600 hover:bg-cyan-700'
      }
    };
    return colorMap[color];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gradient-to-r from-purple-700/95 to-purple-600/95 backdrop-blur-lg' 
          : 'bg-gradient-to-r from-purple-700 to-purple-600'
      }`}>
       <Navbar />
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-32 left-40 w-28 h-28 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-white rounded-full"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Financial Resources Hub</h1>
          <p className="text-xl opacity-90">Comprehensive guides, tools, and educational materials to empower your financial journey</p>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Educational Resources</h2>
            <p className="text-xl text-gray-600">Expert-curated content to build your financial knowledge</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourceCategories.map((category) => {
              const colors = getColorClasses(category.color);
              return (
                <div
                  key={category.id}
                  className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-l-4 ${colors.border} transform cursor-pointer`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6 ${colors.icon}`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h3>
                  <ul className="space-y-3 mb-6">
                    {category.items.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <span className="text-purple-600 font-bold mr-3">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-all duration-300 transform hover:-translate-y-1 ${colors.button}`}>
                    {category.id === 'financial-planning' && 'Access Guides'}
                    {category.id === 'investment' && 'Learn Investing'}
                    {category.id === 'budgeting' && 'Start Budgeting'}
                    {category.id === 'insurance' && 'Plan Coverage'}
                    {category.id === 'tax' && 'Save on Taxes'}
                    {category.id === 'retirement' && 'Plan Retirement'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Financial Calculators & Tools</h2>
            <p className="text-xl text-gray-600">Interactive tools to make informed financial decisions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 text-white text-center transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-bold mb-4">{tool.title}</h3>
                <p className="text-purple-100 mb-6 text-sm leading-relaxed">{tool.description}</p>
                <button className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-full">
                  {tool.title.includes('Calculator') && 'Calculate'}
                  {tool.title === 'Goal Planner' && 'Plan Goals'}
                  {tool.title === 'Portfolio Tracker' && 'Track Portfolio'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>&copy; 2025 Dhansathi. Empowering communities through smart financial decisions.</p>
        </div>
      </footer>
    </div>
  );
};

export default DhansathiResources;