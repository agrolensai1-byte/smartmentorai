const express = require('express')
const router = express.Router()
const Course = require('../models/Course')
const fallbackDB = require('../fallbackDB')
const mongoose = require('mongoose')

const isMongoConnected = () => mongoose.connection.readyState === 1

// GET all courses
router.get('/', async (req,res)=>{
  try {
    let courses
    
    if (isMongoConnected()) {
      courses = await Course.find({})
    } else {
      courses = fallbackDB.getCourses()
    }
    
    res.json(courses)
  } catch (err) {
    console.error('Error fetching courses:', err)
    res.status(500).json({ error: 'Server error: ' + err.message })
  }
})

// GET single course
router.get('/:slug', async (req,res)=>{
  try {
    let course
    
    if (isMongoConnected()) {
      course = await Course.findOne({ slug: req.params.slug })
    } else {
      course = fallbackDB.getCourseBySlug(req.params.slug)
    }
    
    if(!course) return res.status(404).json({ error: 'Course not found' })
    res.json(course)
  } catch (err) {
    console.error('Error fetching course:', err)
    res.status(500).json({ error: 'Server error: ' + err.message })
  }
})

// Simple route to seed a demo course (for development)
router.post('/seed-demo', async (req,res)=>{
  try {
    const slug = 'web-fundamentals'
    let course
    
    if (isMongoConnected()) {
      course = await Course.findOne({ slug })
      if(!course) {
        course = new Course({ 
          slug, 
          title: 'Web Fundamentals',
          description: 'Learn the basics of web development',
          modules: [
            { id: 'mod1', title: 'HTML Basics', content: 'Learn HTML structure and semantics' },
            { id: 'mod2', title: 'CSS Styling', content: 'Master CSS for beautiful layouts' },
            { id: 'mod3', title: 'JavaScript Fundamentals', content: 'Core JavaScript concepts' }
          ]
        })
        await course.save()
      }
    } else {
      course = fallbackDB.getCourseBySlug(slug)
    }
    
    res.json(course)
  } catch (err) {
    console.error('Error seeding demo:', err)
    res.status(500).json({ error: 'Server error: ' + err.message })
  }
})

module.exports = router
