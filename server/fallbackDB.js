const fs = require('fs')
const path = require('path')

const DB_FILE = path.join(__dirname, 'data.json')

// Initialize data file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({
    users: [],
    courses: [
      {
        id: 1,
        slug: 'web-fundamentals',
        title: 'Web Fundamentals',
        description: 'Learn the basics of web development',
        modules: [
          { id: 'mod1', title: 'HTML Basics', content: 'Learn HTML structure and semantics' },
          { id: 'mod2', title: 'CSS Styling', content: 'Master CSS for beautiful layouts' },
          { id: 'mod3', title: 'JavaScript Fundamentals', content: 'Core JavaScript concepts' }
        ]
      },
      {
        id: 2,
        slug: 'react-advanced',
        title: 'React Advanced',
        description: 'Master advanced React patterns',
        modules: [
          { id: 'mod4', title: 'Hooks Deep Dive', content: 'Understanding React hooks' },
          { id: 'mod5', title: 'State Management', content: 'Redux and Context API' },
          { id: 'mod6', title: 'Performance Optimization', content: 'Making React fast' }
        ]
      }
    ]
  }, null, 2))
}

// Read from JSON file
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading database:', err)
    return { users: [], courses: [] }
  }
}

// Write to JSON file
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (err) {
    console.error('Error writing database:', err)
    return false
  }
}

// User operations
const createUser = (userData) => {
  const db = readDB()
  const newUser = {
    _id: Date.now().toString(),
    name: userData.name,
    passwordHash: userData.passwordHash,
    points: 0,
    badges: [],
    path: null,
    modules: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
  db.users.push(newUser)
  writeDB(db)
  return newUser
}

const findUserByName = (name) => {
  const db = readDB()
  return db.users.find(u => u.name === name)
}

const updateUser = (userId, updates) => {
  const db = readDB()
  const userIndex = db.users.findIndex(u => u._id === userId)
  if (userIndex >= 0) {
    db.users[userIndex] = { ...db.users[userIndex], ...updates, updatedAt: new Date() }
    writeDB(db)
    return db.users[userIndex]
  }
  return null
}

// Course operations
const getCourses = () => {
  const db = readDB()
  return db.courses
}

const getCourseBySlug = (slug) => {
  const db = readDB()
  return db.courses.find(c => c.slug === slug)
}

module.exports = {
  readDB,
  writeDB,
  createUser,
  findUserByName,
  updateUser,
  getCourses,
  getCourseBySlug
}
