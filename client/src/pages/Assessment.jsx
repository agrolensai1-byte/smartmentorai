import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { syncProgress } from '../lib/api'
import { saveUser } from '../lib/db'

export default function Assessment({ user, onUpdateUser }){
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ interests: [], skills: [], goal: '' })
  const [loading, setLoading] = useState(false)

  const interestOptions = ['Web Dev', 'Mobile', 'AI/ML', 'DevOps', 'Data Science', 'Blockchain']
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced']

  const handleInterestToggle = (interest) => {
    setAnswers({
      ...answers,
      interests: answers.interests.includes(interest)
        ? answers.interests.filter(x => x !== interest)
        : [...answers.interests, interest]
    })
  }

  const handleSkillSelect = (level) => {
    setAnswers({ ...answers, skills: [level] })
  }

  const handleSubmit = async () => {
    setLoading(true)
    const updated = { ...user, path: answers.interests[0] || 'web', skills: answers.skills, careerGoal: answers.goal }
    try {
      await syncProgress({ path: answers.interests[0] || 'web', changes: [{ type: 'set_goal', goal: answers.goal }] })
      onUpdateUser(updated)
      await saveUser(updated)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-bg-card py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Career Roadmap Assessment</h1>
            <div className="flex gap-2 justify-center">
              {[0,1,2].map(i=><div key={i} className={`h-2 w-16 rounded ${i<=step?'bg-accent':'bg-gray-700'}`}/>)}
            </div>
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-text-primary">What's your primary interest?</h3>
              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={()=>handleInterestToggle(opt)}
                    className={`p-4 rounded-lg border-2 transition ${answers.interests.includes(opt)?'border-accent bg-accent/10':'border-gray-600 bg-bg-card'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-text-primary">Current skill level?</h3>
              <div className="space-y-2">
                {skillLevels.map(level => (
                  <button
                    key={level}
                    onClick={()=>handleSkillSelect(level)}
                    className={`w-full p-4 rounded-lg border-2 transition text-left ${answers.skills.includes(level)?'border-accent bg-accent/10':'border-gray-600 bg-bg-card'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-text-primary">What's your career goal?</h3>
              <textarea
                value={answers.goal}
                onChange={(e)=>setAnswers({...answers, goal: e.target.value})}
                placeholder="E.g., Land a job as a senior full-stack engineer"
                className="input min-h-32"
              />
            </div>
          )}

          <div className="flex gap-4 justify-between">
            <button onClick={()=>setStep(Math.max(0, step-1))} className="btn-secondary" disabled={step===0}>← Back</button>
            {step < 2 ? (
              <button onClick={()=>setStep(step+1)} className="btn-primary" disabled={!answers.interests.length && step===0}>
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : 'Complete Assessment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
