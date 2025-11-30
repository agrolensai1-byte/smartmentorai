import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCourses } from '../lib/api'
import { getAllCourses } from '../lib/db'

export default function Dashboard({ user }){
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const load = async () => {
      try {
        const data = await getCourses()
        setCourses(data)
      } catch {
        getAllCourses().then(setCourses)
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-bg-card py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="card space-y-4">
          <h1 className="text-3xl font-bold text-text-primary">Welcome back, {user?.name}!</h1>
          <p className="text-text-muted">Continue your learning journey towards becoming a top engineer</p>
          {user?.careerGoal && <p className="text-sm text-accent">Goal: {user.careerGoal}</p>}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card text-center space-y-2">
            <p className="text-4xl font-bold text-accent">{user?.points || 0}</p>
            <p className="text-text-muted">Points Earned</p>
          </div>
          <div className="card text-center space-y-2">
            <p className="text-4xl font-bold text-accent-2">{user?.badges?.length || 0}</p>
            <p className="text-text-muted">Badges</p>
          </div>
          <div className="card text-center space-y-2">
            <p className="text-4xl font-bold text-accent">{user?.modules?.filter(m=>m.completed).length || 0}</p>
            <p className="text-text-muted">Modules Complete</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button onClick={()=>navigate('/assessment')} className="card hover:border-accent transition border-2 border-transparent text-center space-y-3">
            <div className="text-3xl">📝</div>
            <p className="font-semibold text-text-primary">Assessment</p>
          </button>
          <button onClick={()=>navigate('/courses')} className="card hover:border-accent transition border-2 border-transparent text-center space-y-3">
            <div className="text-3xl">📚</div>
            <p className="font-semibold text-text-primary">Courses</p>
          </button>
          <button onClick={()=>navigate('/lab')} className="card hover:border-accent transition border-2 border-transparent text-center space-y-3">
            <div className="text-3xl">💻</div>
            <p className="font-semibold text-text-primary">Lab</p>
          </button>
          <button onClick={()=>navigate('/career')} className="card hover:border-accent transition border-2 border-transparent text-center space-y-3">
            <div className="text-3xl">🚀</div>
            <p className="font-semibold text-text-primary">Career</p>
          </button>
        </div>

        {/* Course List */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Your Learning Path</h2>
          {loading ? (
            <p className="text-text-muted">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map(course => (
                <div key={course.slug} className="card cursor-pointer hover:border-accent border-2 border-transparent transition" onClick={()=>navigate(`/courses/${course.slug}`)}>
                  <h3 className="text-lg font-semibold text-text-primary">{course.title}</h3>
                  <p className="text-text-muted text-sm mt-2">{course.modules?.length || 0} modules</p>
                  <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{width: '45%'}}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
