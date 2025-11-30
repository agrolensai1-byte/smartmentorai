import React, { useState } from 'react'
import { register, login } from '../lib/api'

export default function Login({ onLogin }){
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const fn = mode === 'register' ? register : login
      const user = await fn(name, password)
      onLogin(user, localStorage.getItem('token'))
    } catch (err) {
      setError(err.response?.data?.error || 'Error')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg-card to-bg flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="card space-y-6">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Username" className="input" value={name} onChange={(e)=>setName(e.target.value)} />
            <input type="password" placeholder="Password" className="input" value={password} onChange={(e)=>setPassword(e.target.value)} />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Loading...' : (mode === 'login' ? 'Sign In' : 'Register')}
            </button>
          </form>
          <button onClick={()=>setMode(mode==='login'?'register':'login')} className="btn-ghost w-full text-sm">
            {mode === 'login' ? 'Need account? Register' : 'Already have account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
