import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Career({ user }){
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('portfolio')

  const portfolioItems = [
    { id: 1, title: 'Chat Application', link: 'github.com/user/chat-app', description: 'Real-time messaging platform with Socket.IO' },
    { id: 2, title: 'Data Dashboard', link: 'github.com/user/dashboard', description: 'Analytics dashboard with D3.js visualization' }
  ]

  const jobs = [
    { id: 1, title: 'Senior React Developer', company: 'Tech Corp', salary: '$120k-150k', level: 'Senior' },
    { id: 2, title: 'Full-Stack Engineer', company: 'StartUp Inc', salary: '$100k-130k', level: 'Mid' },
    { id: 3, title: 'Frontend Developer', company: 'Design Studio', salary: '$80k-110k', level: 'Junior' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-bg-card py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={()=>navigate('/dashboard')} className="text-accent mb-4">← Back</button>
        <h1 className="text-3xl font-bold text-text-primary mb-8">Career Center</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          {['portfolio', 'interview', 'jobs'].map(tab => (
            <button
              key={tab}
              onClick={()=>setActiveTab(tab)}
              className={`pb-3 px-4 border-b-2 font-semibold transition ${
                activeTab === tab ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="card space-y-4">
              <h3 className="text-lg font-bold text-text-primary">Your Portfolio</h3>
              {portfolioItems.map(item => (
                <div key={item.id} className="border-b border-gray-700 pb-4 last:border-0 space-y-2">
                  <h4 className="font-semibold text-text-primary">{item.title}</h4>
                  <p className="text-text-muted text-sm">{item.description}</p>
                  <a href={`https://${item.link}`} target="_blank" rel="noopener noreferrer" className="text-accent text-sm hover:underline">
                    {item.link} →
                  </a>
                </div>
              ))}
            </div>
            <button className="btn-primary w-full">Add Project to Portfolio</button>
          </div>
        )}

        {/* Interview Tab */}
        {activeTab === 'interview' && (
          <div className="space-y-6">
            <div className="card space-y-4">
              <h3 className="text-lg font-bold text-text-primary mb-4">Interview Prep</h3>
              <div className="space-y-3">
                <div className="card bg-accent/10 border-2 border-accent space-y-3">
                  <h4 className="font-semibold text-accent">System Design Interview</h4>
                  <p className="text-text-muted text-sm">Learn to design scalable systems like Netflix, Uber, and Instagram</p>
                  <button className="btn-primary">Start Module</button>
                </div>
                <div className="card hover:border-accent border-2 border-transparent transition space-y-3">
                  <h4 className="font-semibold text-text-primary">Behavioral Interview Guide</h4>
                  <p className="text-text-muted text-sm">Master STAR method and common interview questions</p>
                  <button className="btn-secondary">View</button>
                </div>
              </div>
            </div>
            <button onClick={()=>navigate('/interview')} className="btn-primary w-full">
              Take Mock Interview
            </button>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="card space-y-3 hover:border-accent border-2 border-transparent transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-text-primary">{job.title}</h4>
                      <p className="text-text-muted text-sm">{job.company}</p>
                    </div>
                    <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded">
                      {job.level}
                    </span>
                  </div>
                  <p className="text-accent font-semibold">{job.salary}</p>
                  <button className="btn-secondary">Apply Now</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
