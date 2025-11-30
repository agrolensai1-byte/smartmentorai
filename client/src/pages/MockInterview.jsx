import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveUser, addToSyncQueue } from '../lib/db'

export default function MockInterview({ user, onUpdateUser }){
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [recording, setRecording] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [stage, setStage] = useState('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const questions = [
    'Tell me about yourself and your experience',
    'What is your greatest achievement?',
    'How do you handle conflicts in a team?',
    'Describe a challenging project you led'
  ]

  const startInterview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setStage('recording')
    } catch (err) {
      alert('Camera access denied')
    }
  }

  const finishInterview = async () => {
    setStage('feedback')
    const mockFeedback = 'Great responses! Your communication is clear. Work on providing more specific examples. Score: 8.2/10'
    setFeedback(mockFeedback)

    const updated = { ...user, points: (user.points || 0) + 30, badges: [...(user.badges || []), 'Interview Ready'] }
    onUpdateUser(updated)
    await saveUser(updated)
    await addToSyncQueue({ type: 'complete_interview', score: 8.2 })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-bg-card py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={()=>navigate('/career')} className="text-accent mb-4">← Back</button>
        <h1 className="text-3xl font-bold text-text-primary mb-8">AI Mock Interview</h1>

        {stage === 'intro' && (
          <div className="card space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎥</div>
              <h2 className="text-2xl font-bold text-text-primary">Interview Practice</h2>
              <p className="text-text-muted">
                Practice your interview skills with AI-powered feedback. Answer 4 behavioral questions and get scored.
              </p>
            </div>
            <div className="bg-accent/10 border-2 border-accent rounded-lg p-4 space-y-2">
              <p className="text-accent font-semibold">What to expect:</p>
              <ul className="text-text-muted text-sm space-y-1">
                <li>✓ 4 behavioral interview questions</li>
                <li>✓ 2-3 minutes per response</li>
                <li>✓ AI analysis of your communication</li>
                <li>✓ Scoring and recommendations</li>
              </ul>
            </div>
            <button onClick={startInterview} className="btn-primary w-full">
              Start Interview
            </button>
          </div>
        )}

        {stage === 'recording' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Video Feed */}
              <div className="card space-y-4">
                <h3 className="font-bold text-text-primary">Your Camera</h3>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 bg-black rounded-lg"
                />
              </div>

              {/* Question & Timer */}
              <div className="card space-y-6">
                <div>
                  <p className="text-text-muted text-sm mb-2">Question {currentQuestion + 1} of {questions.length}</p>
                  <h3 className="text-lg font-bold text-text-primary">{questions[currentQuestion]}</h3>
                </div>

                <div className="bg-accent/10 border-2 border-accent rounded-lg p-4">
                  <p className="text-accent font-bold text-2xl">2:45</p>
                  <p className="text-accent text-sm">Time remaining</p>
                </div>

                <div className="space-y-2">
                  <button onClick={()=>setCurrentQuestion(Math.min(currentQuestion+1, questions.length-1))} className="btn-primary w-full">
                    Next Question
                  </button>
                  {currentQuestion === questions.length - 1 && (
                    <button onClick={finishInterview} className="btn-accent w-full bg-gradient-to-r from-accent to-accent-2">
                      Finish Interview
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === 'feedback' && (
          <div className="card space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-4">
              <div className="text-5xl">🏆</div>
              <h2 className="text-2xl font-bold text-accent">Interview Complete!</h2>
            </div>

            <div className="bg-accent/10 border-2 border-accent rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Your Score</span>
                <span className="text-4xl font-bold text-accent">8.2/10</span>
              </div>
              <p className="text-text-muted">{feedback}</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-text-primary">Recommendations</h4>
              <ul className="text-text-muted text-sm space-y-2">
                <li>• Add more specific examples from your projects</li>
                <li>• Practice explaining technical decisions clearly</li>
                <li>• Work on pacing - speak slower and more deliberately</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button onClick={()=>{setStage('intro'); setCurrentQuestion(0)}} className="btn-secondary flex-1">
                Try Again
              </button>
              <button onClick={()=>navigate('/dashboard')} className="btn-primary flex-1">
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
