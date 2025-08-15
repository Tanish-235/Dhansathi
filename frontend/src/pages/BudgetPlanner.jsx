import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Calculator, DollarSign, PiggyBank, Home, BookOpen, Utensils, TrendingUp, AlertTriangle, CheckCircle, Target, Download, Moon, Sun, Plus, Minus, Eye, EyeOff, Settings, Award } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun } from 'docx'; // Added for docx export

const BudgetPlanner = () => {
  const navigate = useNavigate();
  const [salary, setSalary] = useState('');
  const [hasLoan, setHasLoan] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [activeTab, setActiveTab] = useState('budget');
  const [loanDetails, setLoanDetails] = useState({
    amount: '',
    interestRate: '',
    duration: ''
  });
  const [emi, setEmi] = useState(0);
  const [budgetAllocations, setBudgetAllocations] = useState({
    food: 0,
    housing: 0,
    education: 0,
    savings: 0,
    entertainment: 0,
    healthcare: 0,
    transportation: 0,
    utilities: 0
  });
  const [goals, setGoals] = useState({
    emergencyFund: '',
    savingsGoal: '',
    targetDate: ''
  });
  const [currency, setCurrency] = useState('₹');
  const [budgetPeriod, setBudgetPeriod] = useState('monthly');

  // Automatically recalculate EMI when loan details change and hasLoan is true
  useEffect(() => {
    if (hasLoan && loanDetails.amount && loanDetails.interestRate && loanDetails.duration) {
      const principal = parseFloat(loanDetails.amount);
      const monthlyRate = parseFloat(loanDetails.interestRate) / 100 / 12;
      const months = parseFloat(loanDetails.duration) * 12;
      if (monthlyRate === 0) {
        setEmi(principal / months);
      } else {
        const emiValue = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
        setEmi(Math.round(emiValue));
      }
    } else {
      setEmi(0);
    }
  }, [hasLoan, loanDetails.amount, loanDetails.interestRate, loanDetails.duration]);
  const availableBudget = parseFloat(salary || 0) - emi;
  const totalAllocated = Object.values(budgetAllocations).reduce((sum, value) => sum + value, 0);
  const remainingBudget = availableBudget - totalAllocated;

  const categories = [
    { key: 'food', label: 'Food & Groceries', icon: Utensils, recommendedPercent: 15, color: '#FF6B6B' },
    { key: 'housing', label: 'Housing & Rent', icon: Home, recommendedPercent: 30, color: '#4ECDC4' },
    { key: 'education', label: 'Education', icon: BookOpen, recommendedPercent: 10, color: '#45B7D1' },
    { key: 'savings', label: 'Savings', icon: PiggyBank, recommendedPercent: 20, color: '#96CEB4' },
    { key: 'entertainment', label: 'Entertainment', icon: TrendingUp, recommendedPercent: 5, color: '#FFEAA7' },
    { key: 'healthcare', label: 'Healthcare', icon: CheckCircle, recommendedPercent: 8, color: '#DDA0DD' },
    { key: 'transportation', label: 'Transportation', icon: Target, recommendedPercent: 7, color: '#98D8C8' },
    { key: 'utilities', label: 'Utilities', icon: AlertTriangle, recommendedPercent: 5, color: '#F7DC6F' }
  ];

  // Mock data for charts
  const savingsProjection = [
    { month: 'Jan', savings: budgetAllocations.savings },
    { month: 'Feb', savings: budgetAllocations.savings * 2 },
    { month: 'Mar', savings: budgetAllocations.savings * 3 },
    { month: 'Apr', savings: budgetAllocations.savings * 4 },
    { month: 'May', savings: budgetAllocations.savings * 5 },
    { month: 'Jun', savings: budgetAllocations.savings * 6 },
  ];

  const calculateEMI = () => {
    const { amount, interestRate, duration } = loanDetails;
    if (!amount || !interestRate || !duration) return;

    const principal = parseFloat(amount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(duration) * 12;

    if (monthlyRate === 0) {
      setEmi(principal / months);
    } else {
      const emiValue = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                      (Math.pow(1 + monthlyRate, months) - 1);
      setEmi(Math.round(emiValue));
    }
  };

  const applyRecommendedBudget = () => {
    const newAllocations = {};
    categories.forEach(category => {
      newAllocations[category.key] = Math.round(availableBudget * (category.recommendedPercent / 100));
    });
    setBudgetAllocations(newAllocations);
  };

  const resetBudget = () => {
    setBudgetAllocations({
      food: 0,
      housing: 0,
      education: 0,
      savings: 0,
      entertainment: 0,
      healthcare: 0,
      transportation: 0,
      utilities: 0
    });
  };

  const exportBudget = () => {
    // Prepare data for docx
    const lines = [
      `Salary: ${currency}${salary}`,
      `EMI: ${currency}${emi}`,
      `Available Budget: ${currency}${availableBudget}`,
      `Remaining Budget: ${currency}${remainingBudget}`,
      `Currency: ${currency}`,
      `Period: ${budgetPeriod}`,
      '',
      'Budget Allocations:',
      ...Object.entries(budgetAllocations).map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${currency}${value}`)
    ];

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Budget Plan', bold: true, size: 32 }),
              ],
              spacing: { after: 300 },
            }),
            ...lines.map(line => new Paragraph(line)),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'budget-plan.docx';
      link.click();
    });
  };

  const pieData = categories.map(category => ({
    name: category.label,
    value: budgetAllocations[category.key],
    color: category.color
  })).filter(item => item.value > 0);

  if (remainingBudget > 0) {
    pieData.push({
      name: 'Remaining',
      value: remainingBudget,
      color: '#E0E0E0'
    });
  }

  const barData = categories.map(category => ({
    name: category.label.split(' ')[0],
    allocated: budgetAllocations[category.key],
    recommended: Math.round(availableBudget * (category.recommendedPercent / 100)),
    color: category.color
  }));

  const getSavingsAnalysis = () => {
    const savingsPercent = availableBudget > 0 ? (budgetAllocations.savings / availableBudget) * 100 : 0;
    if (savingsPercent >= 20) return { status: 'excellent', message: 'Excellent savings rate!', color: 'text-green-600' };
    if (savingsPercent >= 15) return { status: 'good', message: 'Good savings rate', color: 'text-blue-600' };
    if (savingsPercent >= 10) return { status: 'fair', message: 'Consider increasing savings', color: 'text-yellow-600' };
    return { status: 'poor', message: 'Savings rate is too low', color: 'text-red-600' };
  };

  const getFinancialScore = () => {
    let score = 0;
    const savingsRate = availableBudget > 0 ? (budgetAllocations.savings / availableBudget) * 100 : 0;
    
    if (savingsRate >= 20) score += 30;
    else if (savingsRate >= 15) score += 25;
    else if (savingsRate >= 10) score += 15;
    
    if (budgetAllocations.housing / availableBudget <= 0.3) score += 25;
    else if (budgetAllocations.housing / availableBudget <= 0.35) score += 15;
    
    if (remainingBudget >= 0) score += 20;
    
    if (budgetAllocations.healthcare > 0) score += 10;
    if (budgetAllocations.education > 0) score += 15;
    
    return Math.min(score, 100);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 border rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200'}`}>
          <p className="font-semibold">{payload[0].name}</p>
          <p style={{ color: '#4b0082' }} className="font-bold">
            {currency}{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const themeClasses = darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100';
  const cardClasses = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white';

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      {/* Back to Home Page Button - Top Left */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold bg-white bg-opacity-80 px-4 py-2 rounded-xl shadow"
        >
          ← Back to Home Page
        </button>
      </div>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white py-8 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold flex items-center justify-center gap-3 mb-2">
                <Calculator className="h-10 w-10" />
                Budget Planner - Dhansathi
              </h1>
              <p className="text-purple-100 text-lg">Smart financial planning for your future</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-purple-600 transition-colors"
              >
                {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
              
              {salary && (
                <button
                  onClick={exportBudget}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Salary Input Section */}
        <div className={`${cardClasses} rounded-2xl shadow-xl p-8 border transition-all duration-300 hover:shadow-2xl`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-purple-700">Monthly Income</h2>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Monthly Salary
              </label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Enter your salary"
                className={`w-full px-4 py-4 border-2 rounded-xl text-lg font-medium transition-all focus:ring-4 focus:ring-purple-200 focus:border-purple-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={`w-full px-4 py-4 border-2 rounded-xl transition-all focus:ring-4 focus:ring-purple-200 focus:border-purple-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              >
                <option value="₹">₹ (INR)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Budget Period
              </label>
              <select
                value={budgetPeriod}
                onChange={(e) => setBudgetPeriod(e.target.value)}
                className={`w-full px-4 py-4 border-2 rounded-xl transition-all focus:ring-4 focus:ring-purple-200 focus:border-purple-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        </div>

        {salary && (
          <>
            {/* Financial Score */}
            <div className={`${cardClasses} rounded-2xl shadow-xl p-8 border bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900 dark:to-indigo-900`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">Financial Health Score</h2>
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-500" />
                  <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">{getFinancialScore()}/100</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 h-4 rounded-full transition-all duration-1000" 
                  style={{ width: `${getFinancialScore()}%` }}
                ></div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400">
                {getFinancialScore() >= 80 ? 'Excellent financial health!' : 
                 getFinancialScore() >= 60 ? 'Good financial management' : 
                 getFinancialScore() >= 40 ? 'Room for improvement' : 'Needs attention'}
              </p>
            </div>

            {/* Loan & EMI Section */}
            <div className={`${cardClasses} rounded-2xl shadow-xl p-8 border transition-all duration-300`}>
              <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-300">Loan & EMI Calculator</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={hasLoan}
                    onChange={(e) => setHasLoan(e.target.checked)}
                    className="h-5 w-5 rounded text-purple-600"
                    style={{ accentColor: '#4b0082' }}
                  />
                  <label className="text-gray-700 dark:text-gray-300 font-medium">I have existing loans</label>
                </div>

                {hasLoan && (
                  <div className={`grid md:grid-cols-4 gap-4 p-6 rounded-xl transition-all ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Loan Amount ({currency})
                      </label>
                      <input
                        type="number"
                        value={loanDetails.amount}
                        onChange={(e) => setLoanDetails({...loanDetails, amount: e.target.value})}
                        className={`w-full px-3 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-purple-200 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        value={loanDetails.interestRate}
                        onChange={(e) => setLoanDetails({...loanDetails, interestRate: e.target.value})}
                        step="0.1"
                        className={`w-full px-3 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-purple-200 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration (Years)
                      </label>
                      <input
                        type="number"
                        value={loanDetails.duration}
                        onChange={(e) => setLoanDetails({...loanDetails, duration: e.target.value})}
                        className={`w-full px-3 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-purple-200 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'}`}
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={calculateEMI}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                      >
                        Calculate EMI
                      </button>
                    </div>
                    
                    {emi > 0 && (
                      <div className="md:col-span-4 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-800 dark:to-indigo-800 rounded-xl">
                        <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                          Monthly EMI: {currency}{emi.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Budget Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold opacity-90">Total Income</h3>
                    <p className="text-2xl font-bold">{currency}{parseFloat(salary || 0).toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold opacity-90">EMI</h3>
                    <p className="text-2xl font-bold">{currency}{emi.toLocaleString()}</p>
                  </div>
                  <Home className="h-8 w-8 opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold opacity-90">Available Budget</h3>
                    <p className="text-2xl font-bold">{currency}{availableBudget.toLocaleString()}</p>
                  </div>
                  <Calculator className="h-8 w-8 opacity-80" />
                </div>
              </div>
              
              <div className={`text-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all ${remainingBudget >= 0 ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold opacity-90">Remaining</h3>
                    <p className="text-2xl font-bold">{currency}{remainingBudget.toLocaleString()}</p>
                  </div>
                  <PiggyBank className="h-8 w-8 opacity-80" />
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className={`${cardClasses} rounded-2xl shadow-xl border overflow-hidden`}>
              <div className="flex border-b dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('budget')}
                  className={`flex-1 py-4 px-6 font-semibold transition-all ${
                    activeTab === 'budget' 
                      ? 'bg-purple-600 text-white' 
                      : 'hover:bg-purple-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Budget Allocation
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex-1 py-4 px-6 font-semibold transition-all ${
                    activeTab === 'analytics' 
                      ? 'bg-purple-600 text-white' 
                      : 'hover:bg-purple-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab('goals')}
                  className={`flex-1 py-4 px-6 font-semibold transition-all ${
                    activeTab === 'goals' 
                      ? 'bg-purple-600 text-white' 
                      : 'hover:bg-purple-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Goals
                </button>
              </div>

              {/* Budget Allocation Tab */}
              {activeTab === 'budget' && (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">Budget Allocation</h2>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {showDetails ? 'Hide Details' : 'Show Details'}
                      </button>
                      <button
                        onClick={applyRecommendedBudget}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105"
                      >
                        Apply Recommended
                      </button>
                      <button
                        onClick={resetBudget}
                        className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const maxValue = availableBudget;
                      const recommendedAmount = Math.round(availableBudget * (category.recommendedPercent / 100));
                      const currentPercent = availableBudget > 0 ? Math.round((budgetAllocations[category.key] / availableBudget) * 100) : 0;
                      
                      return (
                        <div key={category.key} className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200 hover:border-purple-200'}`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 rounded-xl" style={{ backgroundColor: category.color + '20' }}>
                                <Icon className="h-6 w-6" style={{ color: category.color }} />
                              </div>
                              <div>
                                <label className="font-semibold text-gray-700 dark:text-gray-300">
                                  {category.label}
                                </label>
                                {showDetails && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Recommended: {category.recommendedPercent}%
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-xl" style={{ color: category.color }}>
                                {currency}{budgetAllocations[category.key].toLocaleString()}
                              </span>
                              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {currentPercent}%
                              </div>
                            </div>
                          </div>
                          
                          <input
                            type="range"
                            min="0"
                            max={maxValue}
                            value={budgetAllocations[category.key]}
                            onChange={(e) => setBudgetAllocations({
                              ...budgetAllocations,
                              [category.key]: parseInt(e.target.value)
                            })}
                            className="w-full h-3 rounded-lg appearance-none cursor-pointer transition-all"
                            style={{
                              background: `linear-gradient(to right, ${category.color} 0%, ${category.color} ${(budgetAllocations[category.key] / maxValue) * 100}%, #e5e7eb ${(budgetAllocations[category.key] / maxValue) * 100}%, #e5e7eb 100%)`
                            }}
                          />
                          
                          {showDetails && (
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">0</span>
                              <span className="text-xs font-medium" style={{ color: category.color }}>
                                Target: {currency}{recommendedAmount.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500">{currency}{maxValue.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Pie Chart */}
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">Budget Distribution</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">Allocated vs Recommended</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="allocated" fill="#4b0082" name="Allocated" />
                            <Bar dataKey="recommended" fill="orange" name="Recommended" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Savings Projection */}
                    <div className={`lg:col-span-2 p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">6-Month Savings Projection</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={savingsProjection}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="savings" stroke="#4b0082" fill="rgba(75, 0, 130, 0.3)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Financial Health Analysis */}
                  <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl">
                      <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">Savings Rate</h4>
                      <div className="space-y-2">
                        <div className={`text-2xl font-bold ${getSavingsAnalysis().color}`}>
                          {availableBudget > 0 ? Math.round((budgetAllocations.savings / availableBudget) * 100) : 0}%
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{getSavingsAnalysis().message}</p>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-xl">
                      <h4 className="font-semibold mb-2 text-orange-600">Budget Utilization</h4>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-orange-600">
                          {availableBudget > 0 ? Math.round((totalAllocated / availableBudget) * 100) : 0}%
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {totalAllocated > availableBudget ? 'Over budget!' : 'Within budget'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl">
                      <h4 className="font-semibold mb-2 text-green-600">Emergency Fund</h4>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(budgetAllocations.savings * 6)} {currency}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">6 months of savings</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Goals Tab */}
              {activeTab === 'goals' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-6">Financial Goals</h2>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Goal Setting */}
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">Set Your Goals</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Emergency Fund Target ({currency})
                          </label>
                          <input
                            type="number"
                            value={goals.emergencyFund}
                            onChange={(e) => setGoals({...goals, emergencyFund: e.target.value})}
                            placeholder="6 months of expenses"
                            className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-purple-200 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'}`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Savings Goal ({currency})
                          </label>
                          <input
                            type="number"
                            value={goals.savingsGoal}
                            onChange={(e) => setGoals({...goals, savingsGoal: e.target.value})}
                            placeholder="Your target savings"
                            className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-purple-200 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'}`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Target Date
                          </label>
                          <input
                            type="date"
                            value={goals.targetDate}
                            onChange={(e) => setGoals({...goals, targetDate: e.target.value})}
                            className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-purple-200 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Goal Progress */}
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">Goal Progress</h3>
                      
                      <div className="space-y-6">
                        {/* Emergency Fund Progress */}
                        {goals.emergencyFund && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-700 dark:text-gray-300">Emergency Fund</span>
                              <span className="text-sm text-gray-500">
                                {currency}{(budgetAllocations.savings * 6).toLocaleString()} / {currency}{parseFloat(goals.emergencyFund || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000" 
                                style={{ 
                                  width: `${Math.min((budgetAllocations.savings * 6 / parseFloat(goals.emergencyFund || 1)) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.min(Math.round((budgetAllocations.savings * 6 / parseFloat(goals.emergencyFund || 1)) * 100), 100)}% Complete
                            </p>
                          </div>
                        )}

                        {/* Savings Goal Progress */}
                        {goals.savingsGoal && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-700 dark:text-gray-300">Savings Goal</span>
                              <span className="text-sm text-gray-500">
                                {currency}{budgetAllocations.savings.toLocaleString()} / {currency}{parseFloat(goals.savingsGoal || 0).toLocaleString()} monthly
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-1000" 
                                style={{ 
                                  width: `${Math.min((budgetAllocations.savings / parseFloat(goals.savingsGoal || 1)) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.min(Math.round((budgetAllocations.savings / parseFloat(goals.savingsGoal || 1)) * 100), 100)}% of monthly target
                            </p>
                          </div>
                        )}

                        {/* Time to Goal */}
                        {goals.savingsGoal && budgetAllocations.savings > 0 && (
                          <div className="p-4 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-800 dark:to-indigo-800 rounded-lg">
                            <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                              Time to reach goal: {Math.ceil(parseFloat(goals.savingsGoal || 0) / budgetAllocations.savings)} months
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Smart Recommendations */}
            <div className={`${cardClasses} rounded-2xl shadow-xl p-8 border bg-gradient-to-br from-purple-50 to-orange-50 dark:from-purple-900 dark:to-orange-900`}>
              <h3 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-300">Smart Recommendations</h3>
              <div className="grid lg:grid-cols-2 gap-6">
                {budgetAllocations.savings / availableBudget < 0.2 && (
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-xl border-l-4 border-yellow-400">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-800 dark:text-yellow-200">Increase Your Savings</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">Aim to save at least 20% of your income for a secure financial future.</p>
                    </div>
                  </div>
                )}
                
                {budgetAllocations.housing / availableBudget > 0.3 && (
                  <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900 rounded-xl border-l-4 border-orange-400">
                    <Home className="h-6 w-6 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-800 dark:text-orange-200">High Housing Costs</p>
                      <p className="text-sm text-orange-700 dark:text-orange-300">Your housing costs exceed 30%. Consider finding more affordable housing options.</p>
                    </div>
                  </div>
                )}
                
                {remainingBudget > availableBudget * 0.1 && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900 rounded-xl border-l-4 border-green-400">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-200">Great Job!</p>
                      <p className="text-sm text-green-700 dark:text-green-300">You have unallocated budget. Consider increasing your savings or investments.</p>
                    </div>
                  </div>
                )}

                {budgetAllocations.healthcare === 0 && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900 rounded-xl border-l-4 border-red-400">
                    <CheckCircle className="h-6 w-6 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800 dark:text-red-200">Healthcare Budget Missing</p>
                      <p className="text-sm text-red-700 dark:text-red-300">Consider allocating funds for healthcare and medical emergencies.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BudgetPlanner;