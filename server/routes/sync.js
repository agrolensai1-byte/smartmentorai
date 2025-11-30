const express = require('express')
const router = express.Router()
const User = require('../models/User')
const fallbackDB = require('../fallbackDB')
const mongoose = require('mongoose')

const isMongoConnected = () => mongoose.connection.readyState === 1

// Accept client sync payload: { name, path, changes }
router.post('/', async (req,res)=>{
  const { name, path, changes } = req.body
  if(!name) return res.status(400).json({ error: 'Missing name' })
  try{
    let user
    
    if (isMongoConnected()) {
      user = await User.findOne({ name })
      if(!user){
        user = new User({ name, points: 0, badges: [], path: path || null, modules: [] })
      } else {
        if(path) user.path = path
        if(Array.isArray(changes)){
          for(const ch of changes){
            if(ch.type === 'complete_module' || ch.type === 'complete'){
              user.points = (user.points || 0) + 10
              user.badges = user.badges || []
              if(!user.badges.includes('Module Complete')) user.badges.push('Module Complete')
              user.modules = user.modules || []
              const exists = user.modules.find(m => m.id === ch.module || m.id === ch.moduleId)
              if(!exists) {
                user.modules.push({ id: ch.module || ch.moduleId, completed: true })
              } else {
                exists.completed = true
              }
            }
          }
        }
      }
      await user.save()
    } else {
      user = fallbackDB.findUserByName(name)
      if(!user){
        user = fallbackDB.createUser({ name, passwordHash: '' })
      }
      if(path) user.path = path
      if(Array.isArray(changes)){
        for(const ch of changes){
          if(ch.type === 'complete_module' || ch.type === 'complete'){
            user.points = (user.points || 0) + 10
            user.badges = user.badges || []
            if(!user.badges.includes('Module Complete')) user.badges.push('Module Complete')
            user.modules = user.modules || []
            const exists = user.modules.find(m => m.id === ch.module || m.id === ch.moduleId)
            if(!exists) {
              user.modules.push({ id: ch.module || ch.moduleId, completed: true })
            } else {
              exists.completed = true
            }
          }
        }
      }
      fallbackDB.updateUser(user._id, user)
    }
    
    res.json({ user })
  }catch(err){
    console.error('Sync error:', err)
    res.status(500).json({ error: 'Sync failed: ' + err.message })
  }
})

module.exports = router
