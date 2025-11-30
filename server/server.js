require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000
const MONGO = process.env.MONGO_URI || 'mongodb+srv://skilledge:SkillEdge2024@cluster0.mongodb.net/skilledge?retryWrites=true&w=majority'

// Models
const User = require('./models/User')
const Course = require('./models/Course')

// MongoDB Connection with proper error handling
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    })
    console.log('✅ Connected to MongoDB successfully')
    return true
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
    console.log('⚠️  Falling back to JSON file storage...')
    return false
  }
}

let mongoConnected = false

connectDB().then(connected => {
  mongoConnected = connected
  if (!mongoConnected) {
    console.log('⚠️  Using fallback JSON storage mode')
  }
})

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/courses', require('./routes/courses'))
app.use('/api/sync', require('./routes/sync'))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongoConnected,
    message: mongoConnected ? 'MongoDB connected' : 'Using fallback storage'
  })
})

// Serve client built files when available
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))
app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'))
})

app.listen(PORT, ()=> console.log(`Server listening on http://localhost:${PORT}`))
