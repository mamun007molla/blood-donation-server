# 🩸 Blood Donation Management Platform - Server

Backend API server for the Blood Donation Management Platform, providing secure and efficient endpoints for managing donors, recipients, and blood donation requests.

## 🌐 Live Links

- **Client Application**: [https://pawmartclient321.firebaseapp.com](https://pawmartclient321.firebaseapp.com)
- **Server Repository**: [GitHub](https://github.com/mamun007molla/blood-donation-server.git)
- **Client Repository**: [GitHub](https://github.com/mamun007molla/blood-Donation.git)

## 📋 Project Overview

The Blood Donation Server is a robust RESTful API built with Node.js and Express.js, designed to handle all backend operations for the blood donation platform. It manages user authentication, donor profiles, blood requests, and coordinates the matching of donors with recipients efficiently.

## 🛠️ Technologies Used

### Runtime & Framework
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework

### Database
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling

### Authentication & Security
- **JSON Web Tokens (JWT)** - Secure token-based authentication
- **bcrypt** - Password hashing and encryption
- **cors** - Cross-origin resource sharing middleware
- **helmet** - Security headers middleware
- **express-validator** - Input validation and sanitization

### Additional Tools
- **dotenv** - Environment variable management
- **nodemon** - Development auto-restart
- **morgan** - HTTP request logger

## ✨ Core Features

### 🔐 Authentication & Authorization
- User registration with encrypted passwords
- JWT-based secure login system
- Role-based access control (User, Admin)
- Password reset functionality
- Token refresh mechanism

### 👥 User Management
- Complete donor profile CRUD operations
- User profile updates
- Blood type and availability management
- Location-based user data
- Contact information handling

### 🩸 Blood Request System
- Create urgent blood requests
- Update request status
- Search requests by blood type
- Filter by location and urgency
- Mark requests as fulfilled

### 🔍 Search & Filter
- Search donors by blood group
- Location-based donor search
- Filter by availability status
- District-wise filtering
- Emergency request prioritization

### 📊 Analytics & Reports
- Donation statistics
- Request fulfillment tracking
- User activity logs
- Blood type distribution reports

## 📦 Dependencies

```json
{
  "dependencies": {
    "express": "^4.x",
    "mongodb": "^6.x",
    "mongoose": "^8.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "jsonwebtoken": "^9.x",
    "bcrypt": "^5.x",
    "helmet": "^7.x",
    "express-validator": "^7.x",
    "morgan": "^1.x"
  },
  "devDependencies": {
    "nodemon": "^3.x"
  }
}
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (Atlas account or local installation)
- **npm** or **yarn** package manager
- **Git**

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/mamun007molla/blood-donation-server.git
   cd blood-donation-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   CLIENT_URL=https://pawmartclient321.firebaseapp.com
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The server will start at `http://localhost:5000`

5. **Start production server**
   ```bash
   npm start
   # or
   yarn start
   ```

## 📡 API Endpoints

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "bloodType": "A+",
  "district": "Dhaka",
  "upazila": "Dhanmondi",
  "phone": "+8801234567890"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

### Donor Routes

#### Get All Donors
```http
GET /api/donors?bloodType=A+&district=Dhaka&status=available
```

#### Get Single Donor
```http
GET /api/donors/:id
```

#### Update Donor Profile
```http
PUT /api/donors/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "phone": "+8801234567890",
  "status": "available"
}
```

### Blood Request Routes

#### Get All Requests
```http
GET /api/requests?status=pending&bloodType=A+
```

#### Create Blood Request
```http
POST /api/requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "requesterName": "Jane Smith",
  "bloodType": "A+",
  "units": 2,
  "hospital": "Dhaka Medical College",
  "district": "Dhaka",
  "urgency": "high",
  "message": "Urgent requirement for surgery"
}
```

#### Update Request
```http
PUT /api/requests/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "fulfilled"
}
```

#### Delete Request
```http
DELETE /api/requests/:id
Authorization: Bearer <token>
```

### Admin Routes

#### Get All Users (Admin Only)
```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

#### Update User Status (Admin Only)
```http
PUT /api/admin/users/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "blocked"
}
```

## 📁 Project Structure

```
blood-donation-server/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── donorController.js # Donor management
│   ├── requestController.js # Blood requests
│   └── adminController.js # Admin operations
├── middleware/
│   ├── auth.js            # JWT verification
│   ├── admin.js           # Admin authorization
│   ├── validation.js      # Input validation
│   └── errorHandler.js    # Error handling
├── models/
│   ├── User.js            # User/Donor schema
│   ├── Request.js         # Blood request schema
│   └── Donation.js        # Donation history schema
├── routes/
│   ├── authRoutes.js
│   ├── donorRoutes.js
│   ├── requestRoutes.js
│   └── adminRoutes.js
├── utils/
│   ├── validation.js      # Validation helpers
│   ├── sendEmail.js       # Email functionality
│   └── helpers.js         # Utility functions
├── .env                   # Environment variables
├── .gitignore
├── server.js              # Entry point
└── package.json
```

## 🗄️ Database Schema

### User/Donor Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  bloodType: String (enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  phone: String (required),
  district: String (required),
  upazila: String (required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  status: String (enum: ['available', 'unavailable'], default: 'available'),
  lastDonation: Date,
  donationCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Blood Request Model
```javascript
{
  requester: ObjectId (ref: User),
  requesterName: String (required),
  bloodType: String (required),
  units: Number (required),
  hospital: String (required),
  hospitalAddress: String,
  district: String (required),
  upazila: String (required),
  urgency: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  status: String (enum: ['pending', 'fulfilled', 'cancelled'], default: 'pending'),
  message: String,
  donorResponses: [{
    donor: ObjectId (ref: User),
    message: String,
    respondedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Donation History Model
```javascript
{
  donor: ObjectId (ref: User),
  request: ObjectId (ref: Request),
  bloodType: String,
  units: Number,
  hospital: String,
  donationDate: Date,
  createdAt: Date
}
```

## 🔒 Security Features

- **Password Encryption**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Mongoose parameterized queries
- **XSS Protection**: Helmet.js security headers
- **CORS Configuration**: Restricted cross-origin access
- **Rate Limiting**: API rate limiting (recommended)
- **Environment Variables**: Sensitive data protection

## 🧪 Testing

### Run Tests
```bash
npm test
# or
yarn test
```

### Test Coverage
```bash
npm run test:coverage
```

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

## 🚀 Deployment

### Environment Setup
Ensure these environment variables are set in production:

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_production_secret
JWT_EXPIRE=7d
CLIENT_URL=https://your-production-url.com
NODE_ENV=production
```

### Deploy to Vercel/Heroku/Railway

1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables
4. Deploy

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Mamun Molla**
- GitHub: [@mamun007molla](https://github.com/mamun007molla)

## 🙏 Acknowledgments

- Thanks to the open-source community
- MongoDB for excellent database solutions
- Express.js for robust server framework

## ⚠️ Disclaimer

This API handles sensitive health information. Ensure compliance with local data protection regulations (HIPAA, GDPR, etc.). Always follow proper security practices and consult with legal professionals.

---

**💝 Building technology to save lives, one API call at a time.**
