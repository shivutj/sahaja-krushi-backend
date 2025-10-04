const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupAivenDatabase() {
  console.log('🚀 Setting up Sahaja Krushi database on Aiven...');
  
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in environment variables');
    return;
  }

  try {
    // Parse the connection string
    const url = new URL(connectionString);
    const config = {
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1),
      ssl: {
        rejectUnauthorized: false
      }
    };

    console.log('📡 Connecting to Aiven MySQL...');
    const connection = await mysql.createConnection(config);
    
    console.log('✅ Connected successfully!');
    
    // Create tables
    const tables = [
      {
        name: 'users',
        sql: `CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role ENUM('admin', 'user') DEFAULT 'user',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'farmers',
        sql: `CREATE TABLE IF NOT EXISTS farmers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20),
          address TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'crop_reports',
        sql: `CREATE TABLE IF NOT EXISTS crop_reports (
          id INT AUTO_INCREMENT PRIMARY KEY,
          farmerId INT NOT NULL,
          cropName VARCHAR(255) NOT NULL,
          plantingDate DATE,
          expectedHarvestDate DATE,
          status ENUM('planted', 'growing', 'harvested') DEFAULT 'planted',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (farmerId) REFERENCES farmers(id)
        )`
      },
      {
        name: 'crop_stages',
        sql: `CREATE TABLE IF NOT EXISTS crop_stages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          cropReportId INT NOT NULL,
          stageName VARCHAR(255) NOT NULL,
          stageDate DATE NOT NULL,
          description TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (cropReportId) REFERENCES crop_reports(id)
        )`
      },
      {
        name: 'crop_stage_photos',
        sql: `CREATE TABLE IF NOT EXISTS crop_stage_photos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          cropStageId INT NOT NULL,
          photoPath VARCHAR(500) NOT NULL,
          description TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (cropStageId) REFERENCES crop_stages(id)
        )`
      },
      {
        name: 'News',
        sql: `CREATE TABLE IF NOT EXISTS News (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          imagePath VARCHAR(500),
          publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'queries',
        sql: `CREATE TABLE IF NOT EXISTS queries (
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
        )`
      }
    ];

    console.log('📋 Creating tables...');
    
    for (const table of tables) {
      try {
        await connection.execute(table.sql);
        console.log(`✅ Created table: ${table.name}`);
      } catch (error) {
        console.log(`⚠️  Table ${table.name}: ${error.message}`);
      }
    }

    // Add escalatedAt column to queries if it doesn't exist
    try {
      await connection.execute(`
        ALTER TABLE queries 
        ADD COLUMN IF NOT EXISTS escalatedAt DATETIME NULL AFTER answer
      `);
      console.log('✅ Added escalatedAt column to queries table');
    } catch (error) {
      console.log('⚠️  escalatedAt column:', error.message);
    }

    // Show table count
    const [tablesResult] = await connection.execute(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `);
    
    console.log(`\n🎉 Database setup completed!`);
    console.log(`📊 Total tables created: ${tablesResult[0].table_count}`);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if DATABASE_URL is correct');
    console.log('2. Ensure your Aiven service is running');
    console.log('3. Verify you have the correct permissions');
  }
}

// Run the setup
setupAivenDatabase();
