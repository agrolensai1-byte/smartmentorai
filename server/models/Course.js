const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  modules: [{ id: String, title: String, content: String }]
}, { timestamps: true })

module.exports = mongoose.model('Course', CourseSchema)
