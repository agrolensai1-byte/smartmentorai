import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Welcome(){
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg-card to-bg flex items-center justify-center">
      <div className="max-w-2xl w-full px-6">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">Master Tomorrow's Tech, Today.</h1>
          <p className="text-xl text-text-muted">Bridge the engineering skill gap. Get certified. Land your dream job in AI, Cloud, IoT & more.</p>
          <div className="flex gap-4 justify-center pt-4">
            <button onClick={()=>navigate('/login')} className="btn-primary">Get Started</button>
            <button onClick={()=>navigate('/login')} className="btn-secondary">Explore Courses</button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-800">
            <div className="text-center"><div className="text-2xl font-bold text-accent">85%</div><p className="text-text-muted">Career Placement</p></div>
            <div className="text-center"><div className="text-2xl font-bold text-accent">120+</div><p className="text-text-muted">Industry Partners</p></div>
            <div className="text-center"><div className="text-2xl font-bold text-accent">98%</div><p className="text-text-muted">Satisfaction</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}
