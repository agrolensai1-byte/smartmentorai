const mongoose = require('mongoose')

const ModuleSchema = new mongoose.Schema({ id: String, title: String, completed: { type: Boolean, default: false } }, { _id: false })

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String },
  passwordHash: { type: String },
  points: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  path: { title: String, progress: Number, modules: [ModuleSchema] }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
