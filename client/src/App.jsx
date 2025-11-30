import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { setAuthToken } from './lib/api'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Assessment from './pages/Assessment'
import Dashboard from './pages/Dashboard'
import Course from './pages/Course'
import Lab from './pages/Lab'
import Projects from './pages/Projects'
import Career from './pages/Career'
import MockInterview from './pages/MockInterview'

export default function App(){
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if(savedToken && savedUser){ 
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      setAuthToken(savedToken)
    }
  },[])

  const handleLogout = ()=>{
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthToken(null)
    navigate('/')
  }

  const handleLogin = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', authToken)
    setAuthToken(authToken)
    navigate('/dashboard')
  }

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  if(!token) return <Routes>
    <Route path="/" element={<Welcome/>} />
    <Route path="/login" element={<Login onLogin={handleLogin} />} />
    <Route path="*" element={<Welcome/>} />
  </Routes>

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg-card to-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-bg-card/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent hover:opacity-80 transition">
            SkillEdge
          </Link>
          <nav className="hidden md:flex gap-6 text-text-muted">
            <Link to="/dashboard" className="hover:text-accent transition">Dashboard</Link>
            <Link to="/assessment" className="hover:text-accent transition">Assessment</Link>
            <Link to="/courses" className="hover:text-accent transition">Courses</Link>
            <Link to="/lab" className="hover:text-accent transition">Lab</Link>
            <Link to="/projects" className="hover:text-accent transition">Projects</Link>
            <Link to="/career" className="hover:text-accent transition">Career</Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-text-primary font-semibold text-sm">👤 {user?.name}</p>
              <p className="text-accent text-xs">{user?.points || 0} pts</p>
            </div>
            <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
          </div>
        </div>
      </header>

      {/* Main Routes */}
      <main>
        <Routes>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/assessment" element={<Assessment user={user} onUpdateUser={handleUpdateUser} />} />
          <Route path="/courses/:slug" element={<Course user={user} onUpdateUser={handleUpdateUser} />} />
          <Route path="/courses" element={<Dashboard user={user} />} />
          <Route path="/lab" element={<Lab user={user} onUpdateUser={handleUpdateUser} />} />
          <Route path="/projects" element={<Projects user={user} />} />
          <Route path="/career" element={<Career user={user} />} />
          <Route path="/interview" element={<MockInterview user={user} onUpdateUser={handleUpdateUser} />} />
          <Route path="*" element={<Dashboard user={user} />} />
        </Routes>
      </main>
    </div>
  )
}
