# Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Update Your Information

Edit `backend/processor.js` (line ~285):

```javascript
// Change these to your actual details
user_id: "yourname_ddmmyyyy",        // e.g. "johndoe_17091999"
email_id: "your.email@college.edu",  // Your college email
college_roll_number: "XXCSXXXX"      // Your roll number
```

### Step 2: Start Backend

```bash
cd backend
npm install          # (already done if you ran setup)
npm start
```

You should see:
```
✓ Server running on port 5000
✓ API: http://localhost:5000/bfhl
```

### Step 3: Start Frontend (New Terminal)

```bash
cd frontend
npx http-server -p 3000
```

Or use Python:
```bash
python -m http.server 3000
```

### Step 4: Open in Browser

Visit: **http://localhost:3000**

---

## 🧪 Test It Locally

Click **"📋 Load Example"** button to load sample data, then click **"Process Hierarchies"**.

You should see:
- ✅ 3 valid trees
- ✅ 1 cycle detected
- ✅ Invalid entries highlighted
- ✅ Beautiful tree visualization

---

## 🚀 Deploy to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed steps to deploy on:
- Vercel (recommended)
- Render
- Railway

**Quick Vercel Deploy:**
```bash
npm install -g vercel
vercel login
vercel
```

---

## 📋 Submission Checklist

Before submitting:

- [ ] Updated user credentials in `processor.js`
- [ ] Backend tests pass: `npm test` in backend folder
- [ ] Tested locally at `http://localhost:3000`
- [ ] API deployed (get URL)
- [ ] Updated API_URL in `frontend/script.js`
- [ ] Frontend deployed (get URL)
- [ ] Code pushed to GitHub
- [ ] README.md is complete
- [ ] DEPLOYMENT.md reviewed

---

## 🆘 Troubleshooting

### "Cannot connect to API"
- Check backend is running: `http://localhost:5000/health` should return `OK`
- Make sure ports are not in use:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  
  # Mac/Linux
  lsof -i :5000
  ```

### "Port already in use"
- Use different port: `npm start -- --port 5001`
- Or kill the process: `taskkill /PID <pid>`

### "Tests failing"
- Make sure you're in `backend` directory
- Run: `node test.js`
- Check processor.js for logic errors

### Frontend shows loading spinner forever
- Check console (F12) for errors
- Verify API URL matches your backend URL
- Try `http://localhost:5000/health` directly

---

## 📚 Documentation

- **[README.md](README.md)** - Full project overview
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to cloud
- **API Spec** - See the PDF specification
- **Backend Code** - `backend/processor.js` - Clean, well-commented

---

## 💡 Tips for Success

1. **Read the Spec Carefully**: Edge cases matter for evaluation
2. **Test Thoroughly**: Use the example data first
3. **Beautiful UI Matters**: Evaluators like good-looking interfaces
4. **Performance**: API should respond in < 100ms (we achieve this)
5. **Error Handling**: Show clear messages for invalid input
6. **Code Quality**: Keep it clean and readable

---

Good luck! 🎯
