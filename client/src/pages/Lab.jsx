import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveUser, addToSyncQueue } from '../lib/db'

export default function Lab({ user, onUpdateUser }){
  const navigate = useNavigate()
  const [code, setCode] = useState('function solution() {\n  // Write your code here\n}')
  const [output, setOutput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState('')

  const runCode = () => {
    try {
      const fn = new Function(code)
      fn()
      setOutput('✓ Code executed successfully')
      setFeedback('Good start! Make sure to follow the function specification.')
    } catch (err) {
      setOutput(`Error: ${err.message}`)
    }
  }

  const submitSolution = async () => {
    const updated = { ...user, points: (user.points || 0) + 50, badges: [...(user.badges || []), 'Lab Completed'] }
    onUpdateUser(updated)
    await saveUser(updated)
    await addToSyncQueue({ type: 'submit_lab', code })
    setSubmitted(true)
    setFeedback('Lab submitted! You earned 50 points and a badge.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-bg-card py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={()=>navigate('/dashboard')} className="text-accent mb-4">← Back</button>
        <h1 className="text-3xl font-bold text-text-primary mb-8">Coding Lab: Build a Function</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="card space-y-4">
            <h3 className="font-bold text-text-primary">Code Editor</h3>
            <textarea
              value={code}
              onChange={(e)=>setCode(e.target.value)}
              className="w-full bg-black border border-gray-700 p-4 rounded font-mono text-sm text-green-400 focus:outline-none focus:border-accent"
              rows="12"
            />
            <div className="flex gap-2">
              <button onClick={runCode} className="btn-primary">▶ Run</button>
              <button onClick={submitSolution} disabled={submitted} className="btn-secondary">
                {submitted ? '✓ Submitted' : 'Submit'}
              </button>
            </div>
          </div>

          {/* Output & Feedback */}
          <div className="space-y-4">
            <div className="card space-y-3">
              <h3 className="font-bold text-text-primary">Console Output</h3>
              <div className="bg-black p-4 rounded font-mono text-sm text-text-muted border border-gray-700 min-h-32">
                {output || 'No output yet'}
              </div>
            </div>
            {feedback && (
              <div className="card space-y-3 bg-accent/10 border-2 border-accent">
                <h3 className="font-bold text-accent">Feedback</h3>
                <p className="text-text-muted">{feedback}</p>
              </div>
            )}
            <div className="card space-y-3">
              <h3 className="font-bold text-text-primary">Task</h3>
              <p className="text-text-muted">Write a function that takes a number and returns its square. Test with values 2, 5, and 10.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
