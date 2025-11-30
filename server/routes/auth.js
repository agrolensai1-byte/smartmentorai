const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const fallbackDB = require('../fallbackDB')
const mongoose = require('mongoose')

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

const isMongoConnected = () => mongoose.connection.readyState === 1

router.post('/register', async (req,res)=>{
  const { name, password } = req.body
  if(!name || !password) return res.status(400).json({ error: 'Missing fields' })
  try{
    let existing
    
    if (isMongoConnected()) {
      existing = await User.findOne({ name })
    } else {
      existing = fallbackDB.findUserByName(name)
    }
    
    if(existing) return res.status(400).json({ error: 'User exists' })
    
    const hash = await bcrypt.hash(password, 10)
    
    let u
    if (isMongoConnected()) {
      u = new User({ name, passwordHash: hash, points: 0, badges: [] })
      await u.save()
    } else {
      u = fallbackDB.createUser({ name, passwordHash: hash })
    }
    
    const token = jwt.sign({ name: u.name, id: u._id }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ 
      token, 
      user: { 
        name: u.name, 
        points: u.points || 0, 
        badges: u.badges || [],
        _id: u._id 
      } 
    })
  }catch(e){ 
    console.error('Register error:', e)
    res.status(500).json({ error: 'Server error: ' + e.message }) 
  }
})

router.post('/login', async (req,res)=>{
  const { name, password } = req.body
  if(!name || !password) return res.status(400).json({ error: 'Missing fields' })
  try{
    let u
    
    if (isMongoConnected()) {
      u = await User.findOne({ name })
    } else {
      u = fallbackDB.findUserByName(name)
    }
    
    if(!u) return res.status(400).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, u.passwordHash || '')
    if(!ok) return res.status(400).json({ error: 'Invalid credentials' })
    
    const token = jwt.sign({ name: u.name, id: u._id }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ 
      token, 
      user: { 
        name: u.name, 
        points: u.points || 0, 
        badges: u.badges || [],
        _id: u._id 
      } 
    })
  }catch(e){ 
    console.error('Login error:', e)
    res.status(500).json({ error: 'Server error: ' + e.message }) 
  }
})

module.exports = router
