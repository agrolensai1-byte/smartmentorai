import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  const [courses, setCourses] = useState([])
  useEffect(()=>{
    fetch('/api/courses').then(r=>r.json()).then(setCourses).catch(()=>{})
  },[])
  return (
    <div className="home">
      <h1>Welcome to SkillEdge (MERN Demo)</h1>
      <p>This demo connects to a local server. Try seeding the demo course on the server, then refresh.</p>
      <h3>Courses</h3>
      <ul>
        {courses.map(c=> (
          <li key={c.slug}><Link to="/course">{c.title}</Link></li>
        ))}
      </ul>
    </div>
  )
}
