# StudyBox AI Backend - Deployment Guide

## Table of Contents
1. [Heroku](#heroku)
2. [Railway](#railway)
3. [Render](#render)
4. [Vercel/Serverless](#vercel-serverless)
5. [Docker](#docker)
6. [Environment Checklist](#environment-checklist)

---

## Heroku

### Prerequisites
- Heroku CLI installed
- Heroku account

### Steps

```bash
# 1. Login to Heroku
heroku login

# 2. Create app
heroku create studybox-ai-backend

# 3. Add MongoDB Atlas addon (or use external URI)
heroku addons:create mongolab:sandbox

# 4. Set environment variables
heroku config:set OPENAI_API_KEY=your_key_here
heroku config:set FRONTEND_URL=https://your-frontend-domain.com
heroku config:set NODE_ENV=production

# 5. Deploy
git push heroku main

# 6. View logs
heroku logs --tail
```

---

## Railway

### Prerequisites
- Railway account
- GitHub repository

### Steps

1. Visit [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Select this repository
5. Configure environment variables in Railway dashboard
6. Deploy automatically on push

---

## Render

### Prerequisites
- Render account
- GitHub repository

### Steps

1. Visit [render.com](https://render.com)
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub repository
5. Configure:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables
7. Deploy

---

## Vercel/Serverless

⚠️ **Note:** Traditional Vercel is for Front-end. Use Railway or Render for Node backend instead.

---

## Docker

### Build & Run with Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Build Image
```bash
docker build -t studybox-ai-backend:latest .
```

### Run Container
```bash
docker run -p 5000:5000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e OPENAI_API_KEY=your_key \
  -e FRONTEND_URL=http://localhost:5173 \
  studybox-ai-backend:latest
```

### Docker Compose (Multi-service)

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    environment:
      MONGO_INITDB_DATABASE: studybox-ai
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongodb:27017/studybox-ai
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      FRONTEND_URL: http://localhost:5173
    depends_on:
      - mongodb

volumes:
  mongo_data:
```

Run with:
```bash
docker-compose up
```

---

## Environment Checklist

### Production Environment Variables

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studybox-ai?retryWrites=true&w=majority

# OpenAI
OPENAI_API_KEY=sk-...

# Frontend
FRONTEND_URL=https://your-website.com

# Optional
API_VERSION=v1
LOG_LEVEL=info
```

### Pre-Deployment Checks

- [ ] MongoDB URI tested and working
- [ ] OpenAI API key valid and has available credits
- [ ] FRONTEND_URL matches your actual domain
- [ ] NODE_ENV set to "production"
- [ ] PORT variable set (usually done by platform)
- [ ] CORS configured for your domain
- [ ] All environment variables are exported
- [ ] Database backups configured
- [ ] SSL/HTTPS enabled

---

## Monitoring & Logs

### Heroku
```bash
heroku logs --tail
heroku logs --dyno=web
```

### Railway
View in Railway dashboard > Logs tab

### Render
View in Render dashboard > Logs

---

## Scaling Considerations

1. **Database**: MongoDB Atlas can auto-scale
2. **API Calls**: OpenAI has rate limits - consider implementing caching
3. **Concurrent Requests**: Node.js is single-threaded but highly concurrent
4. **Costs**:
   - OpenAI charges per token (~$0.0005 per 1K input tokens)
   - MongoDB Atlas has free tier but scales with usage

---

## Cost Optimization

1. Use MongoDB Atlas free tier for development
2. Set up budget alerts on OpenAI
3. Implement request caching to reduce API calls
4. Use Railway or Render for free tier hosting (limited)
5. Monitor API usage regularly

---

## Troubleshooting Production Issues

### Cold Starts (Serverless)
Solution: Not applicable - use Railway/Render which handle this

### MongoDB Connection Timeout
```bash
# Check connection string
# Ensure IP whitelist includes your server
# On MongoDB Atlas: Network Access > IP Whitelist
```

### OpenAI Rate Limits
```javascript
// Add retry logic if needed
```

### Memory Issues
- Node default: ~512MB
- Upgrade dyno/instance if needed

---

## Post-Deployment

1. Test all endpoints
2. Monitor error logs
3. Set up alerts for API failures
4. Keep OpenAI API key secure
5. Regular database backups
6. Monitor costs monthly

---

**Questions?** Check logs and ensure all environment variables are set correctly.
