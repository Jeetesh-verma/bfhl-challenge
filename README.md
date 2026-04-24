# SRM Full Stack Engineering Challenge - BFHL API

A complete full-stack implementation of the Hierarchy Processing System for the SRM Engineering Challenge.

## 🎯 Overview

This project processes node relationships (edges) in a graph and returns:
- **Tree Structures**: Valid hierarchies with depth calculation
- **Cycle Detection**: Identifies cyclic relationships
- **Validation**: Checks for invalid entries and duplicate edges
- **Summary Stats**: Counts trees, cycles, and identifies the largest tree

## 📋 Features

✅ **Backend API** (Node.js/Express)
- REST endpoint: `POST /bfhl`
- Complete validation logic per specification
- Cycle detection using DFS
- Tree construction with depth calculation
- CORS enabled for frontend integration
- Response under 3 seconds for 50+ nodes

✅ **Frontend Interface** (Vanilla JS)
- Beautiful, responsive single-page application
- Real-time input validation feedback
- Tree visualization with hierarchical display
- Error highlighting for invalid entries
- Example data loader
- Mobile-friendly design

✅ **Full Validation**
- Pattern validation: `X->Y` format (uppercase letters only)
- Self-loop detection and rejection
- Duplicate edge handling
- Whitespace trimming

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 1. Clone/Setup Repository

```bash
git clone <your-repo-url>
cd Bajaj
```

### 2. Backend Setup

```bash
cd backend
npm install
```

**Configure your credentials** in `backend/processor.js`:
```javascript
// Update these with your actual information
user_id: "yourname_ddmmyyyy",  // e.g., "johndoe_17091999"
email_id: "your.email@college.edu",
college_roll_number: "XXCSXXXX"
```

**Start the API:**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The API will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
# No installation needed for vanilla JS frontend
# Simply open index.html in a browser or serve it:
npx http-server -p 3000
# or
python -m http.server 3000
```

Visit `http://localhost:3000` in your browser.

## 📁 Project Structure

```
Bajaj/
├── backend/
│   ├── server.js           # Express server setup
│   ├── processor.js        # Core hierarchy processing logic
│   ├── package.json        # Dependencies
│   ├── .env                # Environment variables
│   └── .gitignore
│
├── frontend/
│   ├── index.html          # Main HTML
│   ├── styles.css          # Styling & animations
│   ├── script.js           # Frontend logic
│   └── package.json
│
└── vercel.json             # Deployment configuration
```

## 🔌 API Specification

### Endpoint

```
POST /bfhl
Content-Type: application/json
```

### Request Body

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

### Response

```json
{
  "user_id": "johndoe_17091999",
  "email_id": "john.doe@college.edu",
  "college_roll_number": "21CS1001",
  "hierarchies": [
    {
      "root": "A",
      "tree": { "A": { "B": { "D": {} }, "C": {} } },
      "depth": 3
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

## ✅ Validation Rules

### Valid Format
- Pattern: `X->Y` where X and Y are single uppercase letters (A-Z)
- Examples: `A->B`, `Z->X`, `M->N`

### Invalid Entries
- Self-loops: `A->A`
- Non-uppercase: `a->b`, `1->2`
- Wrong separator: `A-B`, `A=>B`
- Wrong format: `AB->C`, `A->`, `hello`
- Empty strings

### Duplicate Handling
- First occurrence: Used for tree construction
- Subsequent occurrences: Reported in `duplicate_edges`

### Cycle Detection
- If a cycle exists, `has_cycle: true` and `tree: {}`
- No `depth` field for cyclic groups

## 🌐 Deployment

### Deploy on Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd ..
vercel

# Configure:
# - Build Command: (leave default)
# - Output Directory: (leave default)
# - Install Command: npm install
```

### Deploy on Render

1. Create account on [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Set build command: `cd backend && npm install`
5. Set start command: `node server.js`

### Deploy on Railway

1. Create account on [railway.app](https://railway.app)
2. Connect GitHub repo
3. Set environment variables (if needed)
4. Deploy!

### Update Frontend API URL

After deployment, update the `API_URL` in `frontend/script.js`:

```javascript
// Before (development)
const API_URL = 'http://localhost:5000';

// After (production)
const API_URL = 'https://your-deployed-api.vercel.app';
```

## 🧪 Testing

### Test with Example Data

Input:
```
A->B
A->C
B->D
C->E
E->F
X->Y
Y->Z
Z->X
P->Q
Q->R
G->H
G->I
hello
1->2
A->
```

Expected:
- 3 valid trees (A, P, G)
- 1 cycle (X)
- Invalid entries: hello, 1->2, A->
- Duplicate: G->H

## 📊 Performance Notes

- API responds in **< 100ms** for typical inputs
- Handles up to **50+ nodes** efficiently
- Uses DFS for cycle detection: O(V+E) complexity
- Tree construction: O(V) space complexity

## 🛠️ Technology Stack

**Backend:**
- Node.js & Express.js
- CORS middleware
- dotenv for config

**Frontend:**
- Vanilla HTML5
- CSS3 with animations
- Fetch API for HTTP requests
- Responsive design

**Deployment:**
- Vercel / Render / Railway
- GitHub for version control

## 📝 Important Notes

1. **Update Credentials**: Must update `user_id`, `email_id`, and `college_roll_number` in `backend/processor.js`
2. **CORS Enabled**: API accepts requests from any origin (production should restrict this)
3. **Environment Variables**: Update `.env` file for production
4. **Response Format**: Strictly follows specification - do not modify
5. **No Hardcoded Responses**: All processing is dynamic

## ✨ UI Features

- 🎨 Modern gradient design
- 📱 Fully responsive layout
- ⚡ Smooth animations
- 🌳 Hierarchical tree visualization
- 🔴 Clear error highlighting
- 📊 Summary statistics display
- 🎯 Example data loader
- ♿ Accessible design

## 🐛 Troubleshooting

**"Cannot connect to API"**
- Ensure backend is running on the correct port
- Check that CORS is enabled
- Verify API_URL in script.js

**"Invalid format" errors**
- Ensure edges follow `X->Y` format
- Use only uppercase letters
- No spaces in edge definition

**"Cycle detected" but expected a tree**
- Check for circular relationships (A->B, B->C, C->A)
- Use the frontend to visualize and debug

## 📄 License

MIT License - Feel free to use and modify

## 👤 Author

Created for SRM Full Stack Engineering Challenge

---

**Ready to submit?** Make sure you have:
1. ✅ Updated credentials in `processor.js`
2. ✅ Deployed backend API (get the URL)
3. ✅ Deployed frontend (get the URL)
4. ✅ Updated API_URL in frontend
5. ✅ Pushed to GitHub public repository
6. ✅ Tested thoroughly with example data

Good luck! 🚀
