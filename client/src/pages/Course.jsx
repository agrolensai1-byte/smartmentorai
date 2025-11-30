import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCourse, syncProgress } from '../lib/api'
import { getCourse as getDBCourse, saveUser, addToSyncQueue } from '../lib/db'

export default function Course({ user, onUpdateUser }){
  const { slug } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [activeModule, setActiveModule] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const load = async () => {
      try {
        const data = await getCourse(slug)
        setCourse(data)
      } catch {
        const data = await getDBCourse(slug)
        setCourse(data)
      }
      setLoading(false)
    }
    load()
  }, [slug])

  const markComplete = async () => {
    if (!course) return
    const module = course.modules[activeModule]
    const updated = {
      ...user,
      modules: (user.modules || []).map(m =>
        m.id === module.id ? { ...m, completed: true } : m
      ),
      points: (user.points || 0) + 10
    }
    onUpdateUser(updated)
    await saveUser(updated)
    await addToSyncQueue({ type: 'complete_module', module: module.id })
    try {
      await syncProgress({ path: user.path, changes: [{ type: 'complete_module', module: module.id }] })
    } catch (err) {
      console.log('Offline - queued for sync')
    }
  }

  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center"><p>Loading...</p></div>
  if (!course) return <div className="min-h-screen bg-bg flex items-center justify-center"><p>Course not found</p></div>

  const module = course.modules[activeModule]
  const isComplete = user?.modules?.some(m => m.id === module?.id && m.completed)

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-bg-card py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button onClick={()=>navigate('/dashboard')} className="text-accent mb-4">← Back</button>
        <h1 className="text-3xl font-bold text-text-primary mb-8">{course.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Module Sidebar */}
          <div className="md:col-span-1">
            <div className="card space-y-2">
              <h3 className="font-bold text-text-primary mb-4">Modules</h3>
              {course.modules?.map((mod, i) => (
                <button
                  key={i}
                  onClick={()=>setActiveModule(i)}
                  className={`w-full text-left p-3 rounded transition ${
                    i === activeModule ? 'bg-accent text-bg font-semibold' : 'hover:bg-bg-card text-text-muted'
                  }`}
                >
                  {mod.title}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="card space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-4">{module?.title}</h2>
                <div className="prose prose-invert max-w-none text-text-muted">
                  <p>{module?.content}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <p className="text-sm text-text-muted">Progress: {course.modules?.filter((m,i)=>i<=activeModule && user?.modules?.some(u=>u.id===m.id && u.completed)).length}/{course.modules?.length}</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full transition" style={{width: `${(activeModule+1)/course.modules?.length*100}%`}}/>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button onClick={markComplete} disabled={isComplete} className={`${isComplete?'opacity-50 cursor-not-allowed':''}btn-primary`}>
                  {isComplete ? '✓ Complete' : 'Mark Complete'}
                </button>
                {activeModule < course.modules.length - 1 && (
                  <button onClick={()=>setActiveModule(activeModule+1)} className="btn-secondary">
                    Next Module →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
