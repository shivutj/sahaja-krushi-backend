# Sahaja Krushi Backend

A comprehensive agricultural management system backend built with Node.js and Express. This API provides endpoints for farmer management, crop tracking, query handling, news management, and user authentication.

## Overview

Sahaja Krushi Backend is a RESTful API designed to support agricultural activities by providing:
- Farmer registration and profile management
- Crop reporting and stage tracking with photo documentation
- Query handling system for farmer support
- News and document management
- Role-based authentication and authorization
- File upload support for images, documents, audio, and video

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (Aiven)
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Joi
- **Logging**: Winston
- **Email**: Nodemailer
- **Deployment**: Railway

## Features

### User Management
- User authentication with JWT
- Role-based access control (SUPER_ADMIN, ADMIN)
- User CRUD operations for administrators
- Profile management with complete user details

### Farmer Management
- Farmer registration with auto-generated farmer IDs (FARMER-YYYY-XXX)
- Comprehensive farmer profiles including:
  - Personal information (Aadhar, contact details)
  - Location details (state, district, village)
  - Agricultural information (land size, crops, equipment)
  - Banking information
  - Document uploads (Aadhar card, land proof, bank passbook)
- KYC status tracking
- Active/Inactive status management

### Crop Management
- Crop report creation and tracking
- Multiple crop stages per report
- Photo documentation for each crop stage
- Crop status tracking (active, completed, abandoned)
- Expected harvest date management

### Query System
- Farmer query submission
- Multi-media support (images, audio, video, documents)
- Query status tracking (open, answered, closed, escalated)
- Escalation handling with timestamps

### News Management
- News article publishing
- Document attachments
- Timestamp management

## Project Structure

```
sahaja-krushi-backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── config.js
│   │   ├── db.js
│   │   ├── server-config.js
│   │   └── logger-config.js
│   ├── controllers/      # Request handlers
│   │   ├── auth-controller.js
│   │   ├── farmer-controller.js
│   │   ├── crop-report-controller.js
│   │   ├── query-controller.js
│   │   └── news-controller.js
│   ├── middlewares/      # Express middlewares
│   │   ├── auth-middleware.js
│   │   ├── error-handler.js
│   │   ├── upload-middleware.js
│   │   ├── farmer-middleware.js
│   │   ├── user-middleware.js
│   │   └── news-middleware.js
│   ├── models/           # Sequelize models
│   │   ├── user.js
│   │   ├── farmer.js
│   │   ├── cropReport.js
│   │   ├── cropStage.js
│   │   ├── cropStagePhoto.js
│   │   ├── query.js
│   │   └── news.js
│   ├── repositories/     # Data access layer
│   │   ├── user-repository.js
│   │   ├── farmer-repository.js
│   │   ├── news-repositories.js
│   │   └── crud-repository.js
│   ├── routes/           # API routes
│   │   └── V1/
│   │       ├── auth-routes.js
│   │       ├── farmer-routes.js
│   │       ├── crop-report-routes.js
│   │       ├── query-routes.js
│   │       └── news-routes.js
│   ├── services/         # Business logic
│   │   ├── auth-service.js
│   │   ├── farmer-service.js
│   │   ├── crop-report-service.js
│   │   ├── query-service.js
│   │   ├── news-service.js
│   │   └── notification-service.js
│   ├── migrations/       # Database migrations
│   ├── seeders/          # Database seeders
│   ├── validation/       # Validation schemas
│   └── utils/            # Utility functions
├── uploads/              # Uploaded files directory
├── logs/                 # Application logs
├── index.js              # Entry point
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL database (local or Aiven)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd sahaja-krushi-backend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure environment variables (see Environment Variables section)

5. Run database migrations
```bash
npm run migrate
```

6. Seed initial data (optional)
```bash
npm run seed
```

7. Start the development server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=mysql://username:password@host:port/database
# OR use individual parameters:
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PWD=password
MYSQL_DB=sahaja_krushi

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Application Settings
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

## API Endpoints

### Authentication
- `POST /api/V1/auth/login` - User login
- `POST /api/V1/auth/users` - Create user (SUPER_ADMIN only)
- `GET /api/V1/auth/users` - Get all users (SUPER_ADMIN only)
- `GET /api/V1/auth/users/:id` - Get user by ID (SUPER_ADMIN only)
- `PUT /api/V1/auth/users/:id` - Update user (SUPER_ADMIN only)
- `DELETE /api/V1/auth/users/:id` - Delete user (SUPER_ADMIN only)

### Farmers
- `POST /api/V1/farmers` - Register new farmer
- `GET /api/V1/farmers` - Get all farmers
- `GET /api/V1/farmers/:id` - Get farmer by ID
- `PUT /api/V1/farmers/:id` - Update farmer
- `DELETE /api/V1/farmers/:id` - Delete farmer

### Crop Reports
- `POST /api/V1/crop-reports` - Create crop report
- `GET /api/V1/crop-reports` - Get all crop reports
- `GET /api/V1/crop-reports/:id` - Get crop report by ID
- `PUT /api/V1/crop-reports/:id` - Update crop report
- `DELETE /api/V1/crop-reports/:id` - Delete crop report

### Queries
- `POST /api/V1/queries` - Submit query
- `GET /api/V1/queries` - Get all queries
- `GET /api/V1/queries/:id` - Get query by ID
- `PUT /api/V1/queries/:id` - Update query
- `DELETE /api/V1/queries/:id` - Delete query

### News
- `POST /api/V1/news` - Create news article
- `GET /api/V1/news` - Get all news
- `GET /api/V1/news/:id` - Get news by ID
- `PUT /api/V1/news/:id` - Update news
- `DELETE /api/V1/news/:id` - Delete news

### Health Check
- `GET /health` - Server health check

## Authentication

The API uses JWT-based authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Most endpoints require authentication except for login and health check.

## File Uploads

The API supports file uploads for:
- Images (JPG, PNG)
- Documents (PDF, DOCX)
- Audio files (M4A, MP3)
- Video files (MP4)

Uploads are stored in the `uploads/` directory and served statically at `/uploads`.

## Database Schema

### Users Table
- Administrators and super admins
- JWT-based authentication
- Role-based access control

### Farmers Table
- Farmer profiles with comprehensive information
- Auto-generated farmer IDs
- Document management
- KYC status tracking

### Crop Reports Table
- Links to farmers
- Crop information and dates
- Status tracking

### Crop Stages Table
- Stage progression tracking
- Detailed descriptions

### Crop Stage Photos Table
- Photo documentation for stages
- File path storage

### Queries Table
- Farmer queries with multimedia support
- Status tracking (open, answered, closed, escalated)
- Answer management

### News Table
- News articles with attachments
- Publishing dates

## Database Migrations

Run migrations to set up the database:

```bash
npm run migrate
```

Migrations are located in `src/migrations/` and include:
- User management tables
- Farmer registration system
- Crop reporting structure
- News management
- Query handling system

## Logging

The application uses Winston for logging:
- Console output for development
- File logging to `logs/error.log`
- Structured logging with timestamps

## Error Handling

Centralized error handling middleware:
- Standardized error responses
- Detailed error logging
- Appropriate HTTP status codes

## Development Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run migrate    # Run database migrations
npm run seed       # Seed database with initial data
npm run test-aiven # Test Aiven database connection
npm run setup-db   # Setup Aiven database
```

## Deployment

### Railway Deployment

1. Connect your GitHub repository to Railway
2. Configure environment variables in Railway dashboard
3. Railway auto-detects Node.js and deploys
4. The application will be available at your Railway URL

### Database Setup (Aiven)

1. Create Aiven account
2. Create MySQL service with free tier
3. Get connection string from Aiven dashboard
4. Configure DATABASE_URL in environment variables

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based authorization
- CORS configuration
- Input validation with Joi
- SQL injection prevention through Sequelize ORM
- File upload validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC


## Support

For issues and questions, please open an issue on the repository.

