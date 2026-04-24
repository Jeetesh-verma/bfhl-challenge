# DEPLOYMENT GUIDE

## Overview
This guide will help you deploy the BFHL project to the cloud so it can be accessed publicly.

## Option 1: Deploy on Vercel (Recommended)

### Step 1: Prepare Your Repository
```bash
cd Bajaj
git init
git add .
git commit -m "Initial commit: BFHL full-stack project"
```

### Step 2: Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Create repository named `bfhl-challenge`
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/bfhl-challenge.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Select your `bfhl-challenge` repository
5. Configure:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: `npm install && cd backend && npm install`
   - Environment Variables:
     ```
     PORT=3000
     NODE_ENV=production
     ```
6. Click "Deploy"

### Step 4: Update Frontend API URL
After deployment, Vercel will give you a URL like `https://bfhl-xxx.vercel.app`

Update `frontend/script.js`:
```javascript
const API_URL = 'https://bfhl-xxx.vercel.app';
```

Then push again:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

---

## Option 2: Deploy on Render

### Step 1: Create Render Account
Go to [render.com](https://render.com) and sign up with GitHub

### Step 2: Create Web Service
1. Go to Dashboard → New → Web Service
2. Select your GitHub repo
3. Configure:
   - **Name**: `bfhl-api`
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free
4. Add environment variables:
   ```
   PORT=3000
   NODE_ENV=production
   ```
5. Click "Create Web Service"

### Step 3: Get Your API URL
Once deployed, you'll get a URL like `https://bfhl-api-xxxx.onrender.com`

### Step 4: Deploy Frontend
1. New → Static Site
2. Select your GitHub repo
3. Configure:
   - **Publish Directory**: `frontend`
4. Deploy

### Step 5: Update API URL in Frontend
Update `frontend/script.js`:
```javascript
const API_URL = 'https://bfhl-api-xxxx.onrender.com';
```

---

## Option 3: Deploy on Railway

### Step 1: Sign Up
Go to [railway.app](https://railway.app) and sign in with GitHub

### Step 2: Create Project
1. Dashboard → New Project
2. Provision PostgreSQL (optional)
3. Provision Node.js service from your GitHub repo

### Step 3: Configure
Set environment variables:
```
PORT=3000
NODE_ENV=production
```

Build Command: `cd backend && npm install`
Start Command: `cd backend && npm start`

### Step 4: Get URL
Railway will provide a public URL automatically

---

## Option 4: Deploy Locally with Docker

Create `Dockerfile`:
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY backend/package.json backend/package.json
RUN cd backend && npm install

COPY . .

EXPOSE 3000
CMD ["node", "backend/server.js"]
```

Build and run:
```bash
docker build -t bfhl-app .
docker run -p 3000:3000 bfhl-app
```

---

## Submission Checklist

- [ ] Updated `user_id`, `email_id`, `college_roll_number` in `processor.js`
- [ ] All tests pass: `node backend/test.js`
- [ ] Backend API deployed (get URL)
- [ ] Frontend deployed (get URL)
- [ ] Updated API_URL in `frontend/script.js`
- [ ] Tested API endpoint manually:
  ```bash
  curl -X POST https://your-api-url/bfhl \
    -H "Content-Type: application/json" \
    -d '{"data": ["A->B", "B->C"]}'
  ```
- [ ] Tested frontend in browser
- [ ] Code pushed to public GitHub repository
- [ ] No hardcoded sensitive information
- [ ] CORS enabled (check backend/server.js)

---

## Environment Variables

### Backend (.env)
```
PORT=3000
NODE_ENV=production
```

No secrets needed - the user credentials go directly in `processor.js`

---

## Troubleshooting

### "Cannot reach API from frontend"
- Check CORS is enabled in `backend/server.js`
- Verify API URL is correct in `frontend/script.js`
- Check that backend is actually running

### "Deployment fails on Vercel"
- Make sure `backend/package.json` exists
- Check that `npm start` works locally first
- View deployment logs in Vercel dashboard

### "Tests failing"
- Run `node backend/test.js` locally
- Check processor.js logic
- Ensure all validation rules are followed

---

## Performance Tips

1. **Backend**
   - Use production-ready database for scaling
   - Implement caching for repeated queries
   - Add request rate limiting

2. **Frontend**
   - Minify CSS/JS before deployment
   - Use CDN for static assets
   - Add service worker for offline support

3. **API Response**
   - Already optimized: < 100ms response time
   - Can handle 50+ nodes efficiently
   - DFS algorithm is O(V+E)

---

## After Deployment

1. **Monitor**: Check deployment logs regularly
2. **Test**: Run some test requests to production API
3. **Update**: Keep GitHub repo updated with any fixes
4. **Document**: Update API URL in README if you change it

---

Good luck with your submission! 🚀
