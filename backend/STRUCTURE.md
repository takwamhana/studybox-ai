# 📁 Complete Backend Folder Structure & Guide

```
studybox-ai/
├── src/                                    # Frontend (React)
│   └── ...
│
└── backend/                                # ✨ NEW BACKEND (YOUR PRODUCTION API)
    ├── src/
    │   ├── config/
    │   │   ├── database.js                 # MongoDB connection setup
    │   │   │   └── Exports: connectDB()
    │   │   │
    │   │   └── openai.js                   # OpenAI client initialization
    │   │       └── Exports: openai instance
    │   │
    │   ├── models/                         # 📊 Database Schemas
    │   │   ├── StudyPack.js               # Generated AI packs
    │   │   │   └── Fields: userId, input, generatedPack, createdAt
    │   │   │
    │   │   ├── Product.js                  # Student items catalog
    │   │   │   └── Fields: name, price, category, image, description
    │   │   │
    │   │   └── User.js                     # User data (optional)
    │   │       └── Fields: name, email, createdAt
    │   │
    │   ├── controllers/                    # 🧠 Business Logic
    │   │   ├── packController.js          # AI generation logic
    │   │   │   ├── generateStudyPack()    # 🔥 Core AI function
    │   │   │   ├── getStudyPack()
    │   │   │   └── getAllStudyPacks()
    │   │   │
    │   │   └── productController.js        # Product management
    │   │       ├── getAllProducts()
    │   │       ├── getProductById()
    │   │       ├── createProduct()
    │   │       ├── updateProduct()
    │   │       └── deleteProduct()
    │   │
    │   ├── routes/                         # 🛣️ API Routes
    │   │   ├── packs.js                    # /api/packs/* endpoints
    │   │   └── products.js                 # /api/products/* endpoints
    │   │
    │   ├── middleware/
    │   │   └── errorHandler.js             # Error handling & 404
    │   │
    │   └── server.js                       # 🚀 Main server file
    │       ├── Starts Express
    │       ├── Connects MongoDB
    │       ├── Mounts routes
    │       └── Starts listening on PORT
    │
    ├── scripts/
    │   └── seed.js                        # Populate DB with sample products
    │
    ├── docs/
    │   ├── GETTING-STARTED.md             # THIS FILE - START HERE
    │   ├── README.md                      # Full API documentation
    │   ├── DEPLOYMENT.md                  # Production deployment guide
    │   └── API-EXAMPLES.txt               # Copy-paste API tests
    │
    ├── setup.sh                           # Quick setup script
    ├── .env.example                       # Environment template
    ├── .gitignore                         # Git configuration
    ├── package.json                       # Node dependencies
    │   ├── express                        # Web framework
    │   ├── mongoose                       # MongoDB ORM
    │   ├── dotenv                         # Environment vars
    │   ├── cors                           # Cross-origin support
    │   └── openai                         # OpenAI API client
    │
    └── .git/                              # Git configuration
```

---

# 🔄 Request/Response Flow

## AI Study Pack Generation Flow

```
Frontend (React)
    │
    ├─ POST /api/packs/generate
    │  {field, level, goal, studyStyle, budget}
    │
    ▼
Backend Express Server (server.js)
    │
    ├─ Route handler (routes/packs.js)
    │
    ▼
Controller (packController.js:generateStudyPack)
    │
    ├─1. Validate input
    ├─2. Build prompt with constraints
    │
    ▼
OpenAI GPT-4o-mini
    │
    ├─ Receives prompt + budget
    ├─ Generates JSON response
    │
    ▼
packController.js (resumed)
    │
    ├─3. Parse JSON response
    ├─4. Validate structure
    ├─5. Verify budget ✓
    ├─6. Save to MongoDB (StudyPack model)
    │
    ▼
JSON Response to Frontend
    {
      "success": true,
      "data": {
        "packName": "...",
        "description": "...",
        "totalEstimatedCost": 149.99,
        "items": [...]
      }
    }
```

---

# 📡 All API Endpoints at a Glance

## Core Endpoints

| Method | Path | Function | Returns |
|--------|------|----------|---------|
| `GET` | `/` | API info | Welcome message |
| `GET` | `/api/health` | Status check | {status: "ok", uptime} |

## Study Packs (🔥 Main Feature)

| Method | Path | Function | Auth |
|--------|------|----------|------|
| `POST` | `/api/packs/generate` | **Generate AI pack** | ✓ Public |
| `GET` | `/api/packs` | List all packs | ✓ Public |
| `GET` | `/api/packs/:id` | Get one pack | ✓ Public |

## Products (Catalog)

| Method | Path | Function | Auth |
|--------|------|----------|------|
| `GET` | `/api/products` | List products | ✓ Public |
| `GET` | `/api/products/:id` | Get one product | ✓ Public |
| `POST` | `/api/products` | Create product | ⚠️ Admin |
| `PATCH` | `/api/products/:id` | Update product | ⚠️ Admin |
| `DELETE` | `/api/products/:id` | Delete product | ⚠️ Admin |

---

# 🔐 Environment Variables Required

```env
# Core
PORT=5000                              # Server port
NODE_ENV=development                   # or "production"

# Database
MONGODB_URI=mongodb+srv://...          # MongoDB Atlas connection

# AI
OPENAI_API_KEY=sk-...                 # OpenAI API key

# Frontend
FRONTEND_URL=http://localhost:5173    # For CORS

# Optional
API_VERSION=v1                         # API version
```

---

# 🚀 Running the Backend

## Development (with auto-reload)
```bash
npm run dev
```
Using `node --watch` for file changes

## Production
```bash
npm start
```
Standard Node.js execution

## Database Setup
```bash
node scripts/seed.js
```
Populates 12 sample products

---

# 🛠️ Key Technologies

```
┌─────────────────────────────────────┐
│        StudyBox AI Backend          │
├─────────────────────────────────────┤
│                                     │
│  Express.js   ──────────────────┐   │
│  (Web Server)                   │   │
│                                 ▼   │
│  ┌─────────────────────────────────┐│
│  │  Controllers & Routes           ││
│  │  (Business Logic)               ││
│  └────────────┬────────────────────┘│
│               │                     │
│       ┌───────┴────────┐            │
│       ▼                ▼            │
│   MongoDB         OpenAI API       │
│  (Mongoose)      (GPT-4o-mini)     │
│  (Database)      (AI Generation)   │
│                                     │
│   CORS  ──  dotenv  ──  Error      │
│                      Handling       │
│                                     │
└─────────────────────────────────────┘

Frontend (React)  ◄──►  [HTTP/REST]  ◄──►  Backend
```

---

# ✨ Special Features Implemented

## 1. AI Budget Constraint
- **Problem:** AI might suggest items over budget
- **Solution:** Strict validation in prompt + backend verification
- **Result:** 100% budget compliance guaranteed

## 2. JSON Quality Assurance
- **Problem:** OpenAI might return invalid JSON
- **Solution:** Try/catch parsing + structure validation
- **Result:** Reliable, structured responses

## 3. Realistic Recommendations
- **Problem:** AI might suggest random items
- **Solution:** Prompt engineering + student-focused categories
- **Result:** Useful, practical study packs

## 4. Error Handling
- **Problem:** API errors break the frontend
- **Solution:** Comprehensive error middleware
- **Result:** Clean error responses with proper HTTP codes

## 5. CORS Configuration
- **Problem:** Frontend blocked by browser
- **Solution:** CORS middleware configured for frontend URL
- **Result:** Seamless frontend-backend communication

---

# 📊 Data Persistence

All data is saved to MongoDB:

**StudyPack Collection Example:**
```javascript
{
  _id: ObjectId("..."),
  userId: null,
  input: {
    field: "Computer Science",
    level: "L2",
    goal: "exam",
    studyStyle: "organized",
    budget: 150
  },
  generatedPack: {
    packName: "The Complete CS Foundation Kit",
    description: "...",
    totalEstimatedCost: 145.99,
    items: [
      {
        name: "Introduction to Algorithms",
        category: "books",
        price: 49.99,
        reason: "Essential foundational reference..."
      },
      // ... more items
    ]
  },
  createdAt: ISODate("2024-04-27T..."),
  updatedAt: ISODate("2024-04-27T...")
}
```

---

# 🎯 What's Next?

1. ✅ Backend created & structured
2. ✅ All endpoints implemented
3. ✅ Database models ready
4. ✅ AI integration complete
5. 📍 Next: Install & configure locally
6. 📍 Then: Connect to React frontend
7. 📍 Finally: Deploy to production

---

See **GETTING-STARTED.md** for detailed setup instructions.
