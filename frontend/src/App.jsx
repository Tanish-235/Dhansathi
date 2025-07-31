import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import BudgetPlanner from './pages/BudgetPlanner.jsx'
import RegisterLoginPage from './pages/RegisterLoginPage.jsx'
import SathiBot from './pages/SathiBot.jsx'
import DhansathiResources from './pages/DhansathiResources.jsx'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/budgetplan" element={<BudgetPlanner />} />
        <Route path="/register" element={<RegisterLoginPage />} />
        <Route path="/chat" element={<SathiBot />} />
        <Route path="/resources" element={<DhansathiResources />} />
      </Routes>
    </Router>

  )
}

export default App
