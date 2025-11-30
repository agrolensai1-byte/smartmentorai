import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Projects({ user }){
  const navigate = useNavigate()
  const [projects] = useState([
    { id: 1, title: 'Build a Chat App', status: 'in-progress', progress: 65, tech: ['React', 'Node.js', 'Socket.IO'] },
    { id: 2, title: 'E-commerce Platform', status: 'completed', progress: 100, tech: ['MERN', 'Stripe'] },
    { id: 3, title: 'AI Resume Parser', status: 'not-started', progress: 0, tech: ['Python', 'ML', 'NLP'] },
    { id: 4, title: 'Mobile Weather App', status: 'in-progress', progress: 40, tech: ['React Native', 'API'] }
  ])

  const getStatusColor = (status) => {
    if (status === 'completed') return 'text-green-400'
    if (status === 'in-progress') return 'text-accent'
    return 'text-text-muted'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-bg-card py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={()=>navigate('/dashboard')} className="text-accent mb-4">← Back</button>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Portfolio Projects</h1>
        <p className="text-text-muted mb-8">Showcase your skills by completing real-world projects</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(project => (
            <div key={project.id} className="card space-y-4 hover:border-accent border-2 border-transparent transition cursor-pointer">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-text-primary">{project.title}</h3>
                <span className={`text-sm font-semibold ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <p className="text-text-muted text-sm">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span key={t} className="px-3 py-1 bg-accent/20 text-accent text-xs rounded-full">
                    {t}
                  </span>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Progress</span>
                  <span className="text-accent">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full transition" style={{width: `${project.progress}%`}}/>
                </div>
              </div>

              <button className="btn-secondary w-full">
                {project.status === 'not-started' ? 'Start Project' : 'Continue'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
