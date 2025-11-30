import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import BudgetPlanner from './pages/BudgetPlanner.jsx'
import SathiBot from './pages/SathiBot.jsx'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/budgetplan" element={
            <BudgetPlanner />
        } />
        <Route path="/chat" element={
            <SathiBot />} />
      </Routes>
    </Router>
  )
}

export default App
