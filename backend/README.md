# StudyBox AI Backend

A production-ready Node.js/Express backend API for StudyBox AI - an AI-powered student study kit platform.

## 🎯 Features

- **AI Study Pack Generator**: Uses OpenAI GPT-4o-mini to generate customized study packs based on student profile
- **Budget-Respecting AI**: Strictly adheres to budget constraints
- **Products API**: Full CRUD operations for product management
- **MongoDB Integration**: Persistent storage for generated packs and products
- **CORS Enabled**: Ready for frontend integration
- **Error Handling**: Comprehensive error handling middleware

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- OpenAI API key
- npm or yarn

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required environment variables:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/studybox-ai
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=http://localhost:5173
```

### 3. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:5000` and display the welcome message with available endpoints.

## 📡 API Endpoints

### Health Check

```bash
GET /api/health
```

Returns server status and uptime.

### AI Study Pack Generation

**Endpoint:** `POST /api/packs/generate`

**Request Body:**

```json
{
  "field": "Computer Science",
  "level": "L2",
  "goal": "exam",
  "studyStyle": "organized",
  "budget": 150
}
```

**Fields:**

- `field` (string, required): Academic field (e.g., "Computer Science", "Mathematics")
- `level` (string, required): Education level (e.g., "L1", "L2", "L3", "Bachelor", "Master")
- `goal` (string, required): One of: `exam`, `project`, `revision`, `learning`
- `studyStyle` (string, required): One of: `organized`, `last-minute`, `visual`, `minimal`
- `budget` (number, required): Budget in USD (minimum 0)

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "packName": "The Complete CS Foundation Kit",
    "description": "A comprehensive study pack designed for L2 Computer Science students preparing for exams...",
    "totalEstimatedCost": 145.99,
    "items": [
      {
        "name": "Introduction to Algorithms",
        "category": "books",
        "price": 49.99,
        "reason": "Essential foundational algorithms reference for any CS student"
      },
      {
        "name": "Code editor software (VS Code)",
        "category": "software",
        "price": 0,
        "reason": "Free industry-standard code editor"
      }
    ]
  }
}
```

### Get Study Pack

**Endpoint:** `GET /api/packs/:id`

Returns a previously generated study pack.

### List All Study Packs

**Endpoint:** `GET /api/packs`

Returns all generated study packs (limited to 50 most recent).

### Products API

**Get All Products:**

```bash
GET /api/products
```

Query parameters:
- `category`: Filter by category (books, stationery, tech, supplies, software, courses, other)
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `inStock`: true/false

**Get Single Product:**

```bash
GET /api/products/:id
```

**Create Product (Admin):**

```bash
POST /api/products
```

**Update Product (Admin):**

```bash
PATCH /api/products/:id
```

**Delete Product (Admin):**

```bash
DELETE /api/products/:id
```

## 🗄️ Database Models

### StudyPack

```javascript
{
  userId: ObjectId (optional),
  input: {
    field: String,
    level: String,
    goal: String (enum),
    studyStyle: String (enum),
    budget: Number
  },
  generatedPack: {
    packName: String,
    description: String,
    totalEstimatedCost: Number,
    items: [{
      name: String,
      category: String,
      price: Number,
      reason: String
    }]
  },
  tokensSaved: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product

```javascript
{
  name: String (required),
  price: Number (required),
  category: String (enum, required),
  image: String (optional),
  description: String,
  inStock: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧠 AI Generation Logic

The AI Pack Generator:

1. **Receives** user profile (field, level, goal, style, budget)
2. **Validates** all inputs
3. **Creates** a detailed prompt for OpenAI
4. **Requests** JSON response from GPT-4o-mini
5. **Validates** the response structure
6. **Verifies** budget constraints are met
7. **Saves** to MongoDB

The prompt is carefully structured to:
- Ensure budget compliance
- Generate realistic, student-appropriate items
- Provide clear reasoning for each item
- Return only valid JSON

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── openai.js        # OpenAI client
│   ├── controllers/
│   │   ├── packController.js      # AI pack generation logic
│   │   └── productController.js   # Product operations
│   ├── models/
│   │   ├── StudyPack.js     # StudyPack schema
│   │   ├── Product.js       # Product schema
│   │   └── User.js          # User schema (optional)
│   ├── routes/
│   │   ├── packs.js         # Pack endpoints
│   │   └── products.js      # Product endpoints
│   ├── middleware/
│   │   └── errorHandler.js  # Error handling
│   └── server.js             # Main server file
├── .env.example              # Environment template
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🔐 Security Considerations

- API keys are stored in `.env` (never committed)
- CORS is configured for your frontend URL
- Input validation on all endpoints
- MongoDB injection protection via Mongoose
- Budget constraints are validated on the backend

## 🚢 Deployment

### Deploy to Heroku

```bash
# Create Heroku app
heroku create studybox-ai-backend

# Set environment variables
heroku config:set OPENAI_API_KEY=your_key
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set FRONTEND_URL=https://yourdomain.com

# Deploy
git push heroku main
```

### Deploy to Railway, Render, or other platforms

Similar process - ensure all environment variables are configured.

## 🧪 Testing the API

### Using cURL

```bash
# Generate a study pack
curl -X POST http://localhost:5000/api/packs/generate \
  -H "Content-Type: application/json" \
  -d '{
    "field": "Web Development",
    "level": "L1",
    "goal": "learning",
    "studyStyle": "organized",
    "budget": 100
  }'

# Get all products
curl http://localhost:5000/api/products

# Health check
curl http://localhost:5000/api/health
```

### Using Postman

1. Import our API endpoints
2. Set environment variables for `base_url` = `http://localhost:5000`
3. Test each endpoint

## 📊 Error Handling

The API returns structured error responses:

```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad request (validation error)
- `404`: Not found
- `500`: Server error

## 🛠️ Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running locally or MongoDB Atlas connection string is correct
- Check `MONGODB_URI` in `.env`

**OpenAI API Error:**
- Verify your API key is correct
- Check OpenAI account has available credits
- Ensure API key has access to GPT-4o-mini

**CORS Error:**
- Verify `FRONTEND_URL` in `.env` matches your frontend
- Check browser console for exact URL mismatch

## 📝 License

ISC

## 👨‍💻 Support

For issues or questions, check:
1. Console error messages
2. MongoDB connection status
3. OpenAI API quota
4. Environment variables configuration

---

**Happy studying! 🎓**
