import Dexie from 'dexie'

export const db = new Dexie('SkillEdgeDB')
db.version(1).stores({
  users: '++id, name',
  courses: '++id, slug',
  progress: '++id, userId, moduleId'
})

// Sync queue for offline changes
export async function addToSyncQueue(action) {
  const syncDB = new Dexie('SyncQueue')
  syncDB.version(1).stores({ queue: '++id, timestamp' })
  await syncDB.queue.add({ ...action, timestamp: Date.now() })
}

export async function getSyncQueue() {
  const syncDB = new Dexie('SyncQueue')
  syncDB.version(1).stores({ queue: '++id, timestamp' })
  return await syncDB.queue.toArray()
}

export async function clearSyncQueue() {
  const syncDB = new Dexie('SyncQueue')
  syncDB.version(1).stores({ queue: '++id, timestamp' })
  await syncDB.queue.clear()
}

// User store
export async function saveUser(user) {
  await db.users.put(user)
}

export async function getUser(name) {
  return await db.users.where('name').equals(name).first()
}

// Course store
export async function saveCourse(course) {
  await db.courses.put(course)
}

export async function getCourse(slug) {
  return await db.courses.where('slug').equals(slug).first()
}

export async function getAllCourses() {
  return await db.courses.toArray()
}

// Progress store
export async function saveProgress(userId, moduleId, completed) {
  await db.progress.put({ userId, moduleId, completed, timestamp: Date.now() })
}

export async function getProgress(userId) {
  return await db.progress.where('userId').equals(userId).toArray()
}
