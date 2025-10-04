# 🚀 Sahaja Krushi Backend Deployment Guide

## 📋 Prerequisites
- GitHub account
- Aiven account (free)
- Railway account (or Render account)

## 🌟 Step 1: Set up Aiven MySQL Database

### 1.1 Create Aiven Account
1. Go to [aiven.io/free-mysql-database](https://aiven.io/free-mysql-database)
2. Click "Start free trial"
3. Sign up with GitHub
4. Verify your email

### 1.2 Create MySQL Service
1. After login, click "Create service"
2. Select "MySQL" from database options
3. Choose "Free" plan (1 CPU, 1GB RAM, 1GB storage)
4. Select region closest to you (e.g., ap-south-1 for India)
5. Name: `sahaja-krushi-db`
6. Click "Create service"

### 1.3 Get Connection String
1. Wait for service creation (2-3 minutes)
2. Click on your service name
3. Go to "Overview" tab
4. Copy the "Connection URI":
   ```
   mysql://avnadmin:password@host:port/database?ssl-mode=REQUIRED
   ```

## 🚀 Step 2: Deploy Backend on Railway

### 2.1 Prepare Repository
1. Push your code to GitHub
2. Make sure all files are committed

### 2.2 Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `Sahaja_Krushi_Backend` repository
5. Railway will automatically detect it's a Node.js project

### 2.3 Configure Environment Variables
In Railway dashboard, go to your project → Variables tab and add:

```
DATABASE_URL=mysql://username:password@host:port/database?sslaccept=strict
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
```

### 2.4 Deploy
1. Railway will automatically deploy
2. Check the logs for any errors
3. Your API will be available at: `https://your-project-name.railway.app`

## 🌐 Step 3: Deploy Frontend on Render

### 3.1 Prepare Frontend
1. Go to your frontend directory
2. Update API base URL to your Railway backend URL

### 3.2 Deploy on Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Static Site"
4. Connect your `Sahaja_Krushi_Frontend` repository
5. Build Command: `npm run build`
6. Publish Directory: `dist` (or `build`)

## 🔧 Step 4: Run Database Migrations

### 4.1 Connect to PlanetScale
1. Go to PlanetScale dashboard
2. Click on your database
3. Go to "Console" tab
4. Run the following SQL commands:

```sql
-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create farmers table
CREATE TABLE farmers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create crop_reports table
CREATE TABLE crop_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmerId INT NOT NULL,
  cropName VARCHAR(255) NOT NULL,
  plantingDate DATE,
  expectedHarvestDate DATE,
  status ENUM('planted', 'growing', 'harvested') DEFAULT 'planted',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmerId) REFERENCES farmers(id)
);

-- Create crop_stages table
CREATE TABLE crop_stages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cropReportId INT NOT NULL,
  stageName VARCHAR(255) NOT NULL,
  stageDate DATE NOT NULL,
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cropReportId) REFERENCES crop_reports(id)
);

-- Create crop_stage_photos table
CREATE TABLE crop_stage_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cropStageId INT NOT NULL,
  photoPath VARCHAR(500) NOT NULL,
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cropStageId) REFERENCES crop_stages(id)
);

-- Create News table
CREATE TABLE News (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  imagePath VARCHAR(500),
  publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create queries table
CREATE TABLE queries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmerId INT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  imagePath VARCHAR(500),
  audioPath VARCHAR(500),
  videoPath VARCHAR(500),
  status ENUM('open', 'answered', 'closed', 'escalated') DEFAULT 'open',
  answer TEXT,
  escalatedAt DATETIME NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmerId) REFERENCES farmers(id)
);
```

## ✅ Step 5: Test Your Deployment

### 5.1 Test Backend
1. Visit: `https://your-backend-url.railway.app/health`
2. Should return: `{"status":"OK","timestamp":"...","uptime":...}`

### 5.2 Test Frontend
1. Visit your Render frontend URL
2. Test all functionality
3. Check browser console for any errors

## 🔧 Troubleshooting

### Common Issues:
1. **Database Connection**: Check DATABASE_URL format
2. **CORS Issues**: Update CORS settings in backend
3. **File Uploads**: Check upload directory permissions
4. **Environment Variables**: Ensure all required vars are set

### Logs:
- Railway: Project → Deployments → View logs
- Render: Dashboard → Service → Logs

## 📞 Support
If you encounter issues, check:
1. Railway deployment logs
2. PlanetScale database logs
3. Render build logs
4. Browser console errors
