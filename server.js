const express = require('express')
const http = require('http')
const path = require('path')
const fs = require('fs')
const { Server } = require('socket.io')
const blockchainManager = require('./blockchain-utils')

const PORT = process.env.PORT || 3000
const DATA_FILE = path.join(__dirname, 'data.json')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// ==================== NETWORK MONITORING ====================
let networkStats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  averageResponseTime: 0,
  lastRequest: null,
  startTime: new Date()
};

// Middleware to track network requests
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Only track on successful responses
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    networkStats.totalRequests++;
    networkStats.lastRequest = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: responseTime,
      timestamp: new Date()
    };
    
    if (res.statusCode < 400) {
      networkStats.successfulRequests++;
    } else {
      networkStats.failedRequests++;
    }
    
    // Update average response time
    if (networkStats.totalRequests === 1) {
      networkStats.averageResponseTime = responseTime;
    } else {
      networkStats.averageResponseTime = 
        (networkStats.averageResponseTime * (networkStats.totalRequests - 1) + responseTime) / 
        networkStats.totalRequests;
    }
    
    console.log(`[${req.method}] ${req.path} - ${res.statusCode} (${responseTime}ms)`);
  });
  
  next();
});

// JSON parsing middleware
app.use(express.json())

// Serve root route - MUST be before static middleware
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'skilleedge-pro.html')
  console.log(`[ROOT ROUTE] Attempting to serve: ${filePath}`)
  console.log(`[ROOT ROUTE] File exists: ${fs.existsSync(filePath)}`)
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`[ROOT ROUTE ERROR] Failed to send file: ${err.message}`)
      console.error(`[ROOT ROUTE ERROR] Code: ${err.code}`)
      console.error(`[ROOT ROUTE ERROR] Status: ${err.status}`)
      // Try fallback - just send HTML directly
      try {
        const htmlContent = fs.readFileSync(filePath, 'utf8')
        res.type('text/html').send(htmlContent)
        console.log(`[ROOT ROUTE] Fallback: Sent HTML via read+send`)
      } catch (readErr) {
        console.error(`[ROOT ROUTE FALLBACK ERROR] ${readErr.message}`)
        res.status(500).send('Error loading application')
      }
    }
  })
})

// serve static prototype files (images, css, js, etc)
app.use(express.static(path.join(__dirname)))

// Network status endpoint
app.get('/api/network-status', (req, res) => {
  res.json({
    status: 'online',
    uptime: Date.now() - networkStats.startTime,
    stats: networkStats,
    timestamp: new Date()
  });
});

// ==================== BLOCKCHAIN API ROUTES ====================

// Get blockchain statistics
app.get('/api/blockchain/stats', (req, res) => {
  try {
    const stats = blockchainManager.getBlockchainStats()
    res.json({
      status: 'success',
      data: stats,
      timestamp: new Date()
    })
  } catch (err) {
    console.error('[BLOCKCHAIN] Stats error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Generate blockchain address for user
app.post('/api/blockchain/generate-address', (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) return res.status(400).json({ error: 'userId required' })
    
    const address = blockchainManager.generateBlockchainAddress(userId)
    res.json({
      status: 'success',
      address,
      timestamp: new Date()
    })
  } catch (err) {
    console.error('[BLOCKCHAIN] Generate address error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Issue achievement with blockchain verification
app.post('/api/blockchain/issue-achievement', (req, res) => {
  try {
    const { userId, userName, achievement } = req.body
    if (!userId || !achievement) return res.status(400).json({ error: 'Missing required fields' })
    
    const certificate = blockchainManager.createAchievementCertificate(
      { id: userId, name: userName },
      achievement
    )
    
    res.json({
      status: 'success',
      certificate,
      message: 'Achievement issued and verified on blockchain',
      timestamp: new Date()
    })
  } catch (err) {
    console.error('[BLOCKCHAIN] Issue achievement error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Create verifiable credential
app.post('/api/blockchain/verify-credential', (req, res) => {
  try {
    const { userId, userName, email, achievements } = req.body
    if (!userId || !achievements) return res.status(400).json({ error: 'Missing required fields' })
    
    const credential = blockchainManager.generateVerifiableCredential(
      { id: userId, name: userName, email },
      achievements
    )
    
    res.json({
      status: 'success',
      credential,
      message: 'Verifiable credential generated',
      timestamp: new Date()
    })
  } catch (err) {
    console.error('[BLOCKCHAIN] Verify credential error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Create NFT metadata for achievement
app.post('/api/blockchain/create-nft', (req, res) => {
  try {
    const { achievement, recipientAddress } = req.body
    if (!achievement || !recipientAddress) return res.status(400).json({ error: 'Missing required fields' })
    
    const nftMetadata = blockchainManager.createNFTMetadata(achievement, recipientAddress)
    
    res.json({
      status: 'success',
      nftMetadata,
      message: 'NFT metadata created for achievement badge',
      timestamp: new Date()
    })
  } catch (err) {
    console.error('[BLOCKCHAIN] Create NFT error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Create blockchain transaction
app.post('/api/blockchain/create-transaction', (req, res) => {
  try {
    const { from, to, data } = req.body
    if (!from || !to) return res.status(400).json({ error: 'from and to addresses required' })
    
    const transaction = blockchainManager.createTransaction(from, to, data)
    
    res.json({
      status: 'success',
      transaction,
      message: 'Transaction created on blockchain',
      timestamp: new Date()
    })
  } catch (err) {
    console.error('[BLOCKCHAIN] Create transaction error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Verify blockchain transaction
app.get('/api/blockchain/verify-transaction/:txHash', (req, res) => {
  try {
    const { txHash } = req.params
    const verification = blockchainManager.verifyTransaction(txHash)
    
    res.json({
      status: 'success',
      verification,
      timestamp: new Date()
    })
  } catch (err) {
    console.error('[BLOCKCHAIN] Verify transaction error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Smart contract interaction
app.post('/api/blockchain/contract-interaction', (req, res) => {
  try {
    const { contractAddress, functionName, parameters, caller, result } = req.body
    if (!functionName || !caller) return res.status(400).json({ error: 'Missing required fields' })
    
    const interaction = blockchainManager.createSmartContractInteraction({
      contractAddress,
      functionName,
      parameters,
      caller,
      result
    })
    
    res.json({
      status: 'success',
      interaction,
      message: 'Smart contract interaction recorded',
      timestamp: new Date()
    })
  } catch (err) {
    console.error('[BLOCKCHAIN] Contract interaction error:', err)
    res.status(500).json({ error: err.message })
  }
})

function loadData(){
  try{
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(raw || '{}')
  } catch(e){
    return { users: {} }
  }
}
function saveData(data){
  try{
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
  } catch(e){
    console.error('Failed to save data', e)
  }
}

let data = loadData()
if(!data.users) data.users = {}

// simple leaderboard endpoint
app.get('/api/leaderboard', (req, res)=>{
  const users = Object.values(data.users || {})
  users.sort((a,b)=> (b.points||0) - (a.points||0))
  res.json(users.slice(0,20))
})

// ChatGPT API endpoint to avoid CORS issues
app.post('/api/chat', async (req, res) => {
  try {
    const { apiKey, model, message, maxTokens, temperature } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`Forwarding request to OpenAI: model=${model}, tokens=${maxTokens}`);

    // Make the request to OpenAI API from the server
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert programming tutor. Provide clear, accurate, and helpful explanations with practical code examples. Format your response with clear sections and include code snippets when relevant.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: maxTokens || 1000,
        temperature: temperature || 0.7
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!chatResponse.ok) {
      const errorData = await chatResponse.json().catch(() => ({}));
      const errorMessage = errorData?.error?.message || 'Unknown error';
      console.error(`OpenAI API error (${chatResponse.status}):`, errorMessage);
      return res.status(chatResponse.status).json({ error: errorMessage });
    }

    const data = await chatResponse.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      console.warn('Empty response from OpenAI');
      return res.status(400).json({ error: 'Empty response from ChatGPT' });
    }

    console.log('Successfully received response from OpenAI');
    res.json({ content });
  } catch (error) {
    console.error('ChatGPT API Error:', error);
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timeout - API took too long to respond' });
    }
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

io.on('connection', socket =>{
  console.log('socket connected', socket.id)

  socket.on('user:join', payload =>{
    const { name } = payload || {}
    if(!name) return
    if(!data.users[name]){
      data.users[name] = { name, points: 0, badges: [], path: null }
      saveData(data)
    }
    // send current leaderboard
    const users = Object.values(data.users).sort((a,b)=> (b.points||0) - (a.points||0))
    socket.emit('leaderboard:update', users.slice(0,20))
  })

  socket.on('progress:update', payload =>{
    // payload: { name, path, moduleId, pointsDelta, pathProgress }
    try{
      const { name, path: userPath, moduleId, pointsDelta, pathProgress } = payload
      if(!name) return
      if(!data.users[name]) data.users[name] = { name, points:0, badges:[], path: null }
      const user = data.users[name]
      // merge path
      if(userPath) user.path = userPath
      if(typeof pathProgress === 'number') user.path.progress = pathProgress
      // mark module complete server-side
      if(moduleId && user.path && user.path.modules){
        const m = user.path.modules.find(x => x.id === moduleId)
        if(m) m.completed = true
      }
      if(pointsDelta) user.points = (user.points || 0) + pointsDelta
      // add a simple badge
      if(moduleId) user.badges = user.badges || []
      if(moduleId && !user.badges.includes(`Completed: ${moduleId}`)) user.badges.push(`Completed: ${moduleId}`)
      saveData(data)
      // broadcast to others
      io.emit('progress:broadcast', { name: user.name, points: user.points, badge: `Completed: ${moduleId}`, moduleId, path: user.path })
      // update leaderboard
      const users = Object.values(data.users).sort((a,b)=> (b.points||0) - (a.points||0))
      io.emit('leaderboard:update', users.slice(0,20))
    } catch(e){
      console.error('progress:update error', e)
    }
  })

  socket.on('disconnect', ()=>{
    // nothing for now
  })
})

// Catch-all route for undefined routes
app.use((req, res) => {
  console.log(`[CATCH-ALL] Undefined route: ${req.method} ${req.path}`)
  res.status(404).send('Not Found')
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[GLOBAL ERROR] ${err.message}`)
  console.error(err.stack)
  res.status(500).json({ error: err.message || 'Internal Server Error' })
})

const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1'

server.listen(PORT, HOST, ()=>{
  console.log(`\n========== SmartMentorAI Server ==========`)
  console.log(`SkillEdge prototype server listening on http://localhost:${PORT}`)
  console.log(`Ready! Navigate to http://localhost:${PORT}`)
  console.log(`Network Status Endpoint: http://localhost:${PORT}/api/network-status`)
  console.log(`Chat API Endpoint: http://localhost:${PORT}/api/chat`)
  console.log(`Leaderboard Endpoint: http://localhost:${PORT}/api/leaderboard`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`========================================\n`)
})
