import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Tutorial from './pages/Tutorial.jsx'
import BudgetPlanner from './pages/BudgetPlanner.jsx'
import RegisterLoginPage from './pages/RegisterLoginPage.jsx'
import SathiBot from './pages/SathiBot.jsx'
import DhansathiResources from './pages/DhansathiResources.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/budgetplan" element={
          <ProtectedRoute>
            <BudgetPlanner />
          </ProtectedRoute>
        } />
        <Route path="/register" element={<RegisterLoginPage />} />
        <Route path="/chat" element={
          <ProtectedRoute>
            <SathiBot />
          </ProtectedRoute>
        } />
        <Route path="/resources" element={<DhansathiResources />} />
        <Route path="/tutorials" element={<Tutorial />} />
      </Routes>
    </Router>
  )
}

export default App
