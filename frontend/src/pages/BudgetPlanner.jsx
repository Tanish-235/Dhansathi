import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calculator, DollarSign, PiggyBank, Home, BookOpen, Utensils, TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react';

const BudgetPlanner = () => {
  const [salary, setSalary] = useState('');
  const [hasLoan, setHasLoan] = useState(false);
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
  const [budgetGoals, setBudgetGoals] = useState({
    savingsGoal: 0,
    emergencyFund: 0
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currency, setCurrency] = useState('₹');
  const [budgetPeriod, setBudgetPeriod] = useState('monthly');

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
    if (savingsPercent >= 20) return { status: 'excellent', message: 'Excellent savings rate!' };
    if (savingsPercent >= 15) return { status: 'good', message: 'Good savings rate' };
    if (savingsPercent >= 10) return { status: 'fair', message: 'Consider increasing savings' };
    return { status: 'poor', message: 'Savings rate is too low' };
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p style={{ color: '#4b0082' }} className="font-bold">
            {currency}{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      {/* Navbar */}
      {/* <Navbar /> */}
      
      {/* Header */}
      <header style={{ background: '#4b0082' }} className="text-white py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <Calculator className="h-8 w-8" />
            Budget Planner - Dhansathi
          </h1>
          <p className="mt-2 opacity-90">Smart financial planning for your future</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Salary Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="h-6 w-6" style={{ color: '#4b0082' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#4b0082' }}>Monthly Income</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Salary
              </label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Enter your salary"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="₹">₹ (INR)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Period
              </label>
              <select
                value={budgetPeriod}
                onChange={(e) => setBudgetPeriod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
            {/* Loan & EMI Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#4b0082' }}>Loan & EMI Calculator</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={hasLoan}
                    onChange={(e) => setHasLoan(e.target.checked)}
                    className="h-4 w-4 rounded"
                    style={{ accentColor: '#4b0082' }}
                  />
                  <label className="text-gray-700">I have existing loans</label>
                </div>

                {hasLoan && (
                  <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loan Amount ({currency})
                      </label>
                      <input
                        type="number"
                        value={loanDetails.amount}
                        onChange={(e) => setLoanDetails({...loanDetails, amount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        value={loanDetails.interestRate}
                        onChange={(e) => setLoanDetails({...loanDetails, interestRate: e.target.value})}
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (Years)
                      </label>
                      <input
                        type="number"
                        value={loanDetails.duration}
                        onChange={(e) => setLoanDetails({...loanDetails, duration: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={calculateEMI}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Calculate EMI
                      </button>
                    </div>
                    
                    {emi > 0 && (
                      <div className="md:col-span-4 p-3 bg-purple-50 rounded-lg">
                        <p className="text-lg font-semibold text-purple-800">
                          Monthly EMI: {currency}{emi.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Budget Summary */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Total Income</h3>
                <p className="text-2xl font-bold">{currency}{parseFloat(salary || 0).toLocaleString()}</p>
              </div>
              
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">EMI</h3>
                <p className="text-2xl font-bold">{currency}{emi.toLocaleString()}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold">Available Budget</h3>
                <p className="text-2xl font-bold">{currency}{availableBudget.toLocaleString()}</p>
              </div>
              
              <div className={`text-white p-6 rounded-xl ${remainingBudget >= 0 ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
                <h3 className="text-lg font-semibold">Remaining</h3>
                <p className="text-2xl font-bold">{currency}{remainingBudget.toLocaleString()}</p>
              </div>
            </div>

            {/* Budget Allocation */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#4b0082' }}>Budget Allocation</h2>
                <div className="space-x-2">
                  <button
                    onClick={applyRecommendedBudget}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Apply Recommended
                  </button>
                  <button
                    onClick={resetBudget}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const maxValue = availableBudget;
                  const recommendedAmount = Math.round(availableBudget * (category.recommendedPercent / 100));
                  
                  return (
                    <div key={category.key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" style={{ color: category.color }} />
                          <label className="font-medium text-gray-700">
                            {category.label}
                          </label>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lg" style={{ color: category.color }}>
                            {currency}{budgetAllocations[category.key].toLocaleString()}
                          </span>
                          <div className="text-xs text-gray-500">
                            Recommended: {currency}{recommendedAmount.toLocaleString()}
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
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${category.color} 0%, ${category.color} ${(budgetAllocations[category.key] / maxValue) * 100}%, #e5e7eb ${(budgetAllocations[category.key] / maxValue) * 100}%, #e5e7eb 100%)`
                        }}
                      />
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>{Math.round((budgetAllocations[category.key] / availableBudget) * 100)}%</span>
                        <span>{currency}{maxValue.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#4b0082' }}>Budget Distribution</h3>
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
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#4b0082' }}>Allocated vs Recommended</h3>
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
            </div>

            {/* Financial Health Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#4b0082' }}>Financial Health Analysis</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2" style={{ color: '#4b0082' }}>Savings Rate</h4>
                  <div className="space-y-2">
                    <div className={`text-lg font-bold ${getSavingsAnalysis().status === 'excellent' ? 'text-green-600' : getSavingsAnalysis().status === 'good' ? 'text-blue-600' : getSavingsAnalysis().status === 'fair' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {availableBudget > 0 ? Math.round((budgetAllocations.savings / availableBudget) * 100) : 0}%
                    </div>
                    <p className="text-sm text-gray-600">{getSavingsAnalysis().message}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-orange-600">Budget Utilization</h4>
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-orange-600">
                      {availableBudget > 0 ? Math.round((totalAllocated / availableBudget) * 100) : 0}%
                    </div>
                    <p className="text-sm text-gray-600">
                      {totalAllocated > availableBudget ? 'Over budget!' : 'Within budget'}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2" style={{ color: '#4b0082' }}>Emergency Fund</h4>
                  <div className="space-y-2">
                    <div className="text-lg font-bold" style={{ color: '#4b0082' }}>
                      {Math.round(budgetAllocations.savings * 6)} {currency}
                    </div>
                    <p className="text-sm text-gray-600">6 months of savings</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#4b0082' }}>Smart Recommendations</h3>
              <div className="space-y-3">
                {budgetAllocations.savings / availableBudget < 0.2 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Increase Your Savings</p>
                      <p className="text-sm text-yellow-700">Aim to save at least 20% of your income for a secure financial future.</p>
                    </div>
                  </div>
                )}
                
                {budgetAllocations.housing / availableBudget > 0.3 && (
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                    <Home className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-800">High Housing Costs</p>
                      <p className="text-sm text-gray-700">Your housing costs exceed 30%. Consider finding more affordable housing options.</p>
                    </div>
                  </div>
                )}
                
                {remainingBudget > availableBudget * 0.1 && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">Great Job!</p>
                      <p className="text-sm text-green-700">You have unallocated budget. Consider increasing your savings or investments.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-purple-800 text-white py-6 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg font-medium">© 2025 Dhansathi - Empowering Financial Freedom</p>
          <p className="opacity-90 mt-1">Smart budgeting for a brighter future</p>
        </div>
      </footer>
    </div>
  );
};

export default BudgetPlanner;