# 🚀 Deploy SmartMentorAI Online

## Quick Deploy Options

### Option 1: Deploy to Render (EASIEST - Recommended)

**Render** offers free tier with automatic deployments from GitHub.

#### Steps:

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SmartMentorAI"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/smartmentorai.git
   git push -u origin main
   ```

2. **Sign Up on Render**
   - Go to https://render.com
   - Sign up with GitHub account
   - Connect your GitHub repository

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Select your smartmentorai repository
   - Fill in details:
     - **Name**: smartmentorai
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Instance Type**: Free

4. **Deploy**
   - Click "Create Web Service"
   - Wait 2-5 minutes for deployment
   - Your URL will be: `https://smartmentorai.onrender.com`

---

### Option 2: Deploy to Railway

**Railway** is also beginner-friendly with GitHub integration.

#### Steps:

1. **Push to GitHub** (same as Render - Option 1 step 1)

2. **Sign Up on Railway**
   - Go to https://railway.app
   - Sign up with GitHub

3. **Create New Project**
   - Click "Create New"
   - Select "Deploy from GitHub repo"
   - Choose your smartmentorai repository

4. **Configure**
   - Add environment variables:
     - `NODE_ENV`: production
     - `PORT`: 3000
   - Railway auto-detects Node.js and runs

5. **Access Your App**
   - URL shown in Railway dashboard
   - Example: `https://smartmentorai-production-xxxx.railway.app`

---

### Option 3: Deploy to Heroku (Paid after free tier ends)

#### Steps:

1. **Install Heroku CLI**
   ```bash
   choco install heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create smartmentorai
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View Live**
   ```bash
   heroku open
   ```
   Your URL: `https://smartmentorai.herokuapp.com`

---

### Option 4: Deploy to DigitalOcean (App Platform)

**DigitalOcean** offers simple deployment with GitHub sync.

#### Steps:

1. **Push to GitHub** (same as Render - Option 1 step 1)

2. **Sign Up on DigitalOcean**
   - Go to https://www.digitalocean.com
   - Create account

3. **Create New App**
   - Click "Create" → "Apps"
   - Connect GitHub repository
   - Select smartmentorai repo

4. **Configure**
   - DigitalOcean auto-detects Node.js
   - Set environment: `NODE_ENV=production`

5. **Deploy**
   - Click "Deploy"
   - Wait for build/deployment

---

## Recommended: Render (FREE & EASIEST)

### Complete Walkthrough:

**Step 1: Initialize Git Repository**
```powershell
cd "C:\Users\Lenovo\Downloads\Cardano Hackthon"
git init
git config user.name "Your Name"
git config user.email "your@email.com"
git add .
git commit -m "Initial commit: SmartMentorAI"
```

**Step 2: Create GitHub Repository**
- Go to https://github.com/new
- Create repository named `smartmentorai`
- Copy the commands shown and run:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smartmentorai.git
git push -u origin main
```

**Step 3: Deploy on Render**
- Go to https://render.com (sign up with GitHub)
- Click "New +" → "Web Service"
- Select your `smartmentorai` repository
- Settings:
  - Name: `smartmentorai`
  - Environment: `Node`
  - Build Command: `npm install`
  - Start Command: `node server.js`
- Click "Create Web Service"
- Wait 2-5 minutes
- Your live URL appears!

---

## Test Your Live Deployment

Once deployed, test these endpoints:

```bash
# Get network status
curl https://YOUR_APP_URL/api/network-status

# Get leaderboard
curl https://YOUR_APP_URL/api/leaderboard

# Open app in browser
https://YOUR_APP_URL/skilleedge-pro.html
```

---

## Environment Variables

Create `.env` file (copy from `.env.example`):

```
NODE_ENV=production
PORT=3000
```

On cloud platforms, add these in the dashboard.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check npm install succeeds locally: `npm install` |
| App crashes | Check logs: `node server.js` locally |
| Port error | Make sure you're using `process.env.PORT` ✓ Already configured |
| Timeout | Increase start time limit in platform settings |
| Not accessible | Check firewall/security groups allow HTTP/HTTPS |

---

## After Deployment

### Enable CORS (if needed for APIs)
Add to server.js before routes:
```javascript
const cors = require('cors')
app.use(cors())
```

Then install:
```bash
npm install cors
```

### Monitor Logs
- **Render**: Dashboard → Logs
- **Railway**: Project → Logs
- **Heroku**: `heroku logs --tail`

### Update Deployment
Simply push to GitHub and it auto-deploys:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

---

## Support Links

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://railway.app/docs
- **Heroku Docs**: https://devcenter.heroku.com
- **DigitalOcean Docs**: https://docs.digitalocean.com/products/app-platform/

---

## Your Project Files Ready for Deployment

✅ `package.json` - Dependencies configured
✅ `Procfile` - Deployment manifest
✅ `.env.example` - Environment template
✅ `.gitignore` - Git ignore rules
✅ `server.js` - Production-ready
✅ `skilleedge-pro.html` - Application UI
✅ `data.json` - Data storage

Everything is ready! Choose a platform and deploy! 🎉
