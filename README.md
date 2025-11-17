# SCCG Shop Backend API

Node.js/Express backend API for the SCCG e-commerce application.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for all)
6. Get your connection string

**Option B: Local MongoDB**
1. Install MongoDB Community Server
2. Use connection string: `mongodb://localhost:27017/sccg-shop`

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Edit `.env` and update:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_random_secret_key_here
NODE_ENV=development
```

### 4. Run the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get single order (protected)
- `GET /api/orders/all/admin` - Get all orders (admin only)
- `PUT /api/orders/:id` - Update order status (admin only)

## Testing the API

Use Postman or curl to test:

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'

# Get products
curl http://localhost:5000/api/products
```

## Deployment

### Deploy to Hostinger (if Node.js supported)
1. Upload all backend files via FTP
2. Install dependencies on server
3. Configure environment variables
4. Start the server

### Deploy to Railway/Render (Recommended for Node.js)
1. Create account on Railway.app or Render.com
2. Connect your GitHub repository
3. Add environment variables
4. Deploy automatically

## Next Steps

After backend is running:
1. Seed initial products to database
2. Update React frontend to use API endpoints
3. Test all functionality
4. Deploy both frontend and backend
