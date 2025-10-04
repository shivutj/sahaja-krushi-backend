const mysql = require('mysql2/promise');
require('dotenv').config();

async function testAivenConnection() {
  console.log('🔍 Testing Aiven MySQL connection...');
  
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in environment variables');
    console.log('Please set DATABASE_URL in your .env file');
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
      database: url.pathname.substring(1), // Remove leading slash
      ssl: {
        rejectUnauthorized: false
      }
    };

    console.log('📡 Connecting to:', config.host + ':' + config.port);
    console.log('🗄️  Database:', config.database);
    
    const connection = await mysql.createConnection(config);
    
    // Test basic query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Connection successful!');
    console.log('📊 Test query result:', rows[0]);
    
    // Test database info
    const [dbInfo] = await connection.execute('SELECT DATABASE() as current_db, VERSION() as mysql_version');
    console.log('📋 Database info:', dbInfo[0]);
    
    await connection.end();
    console.log('🎉 Aiven connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if DATABASE_URL is correct');
    console.log('2. Ensure your Aiven service is running');
    console.log('3. Verify SSL settings');
    console.log('4. Check if your IP is whitelisted (if required)');
  }
}

// Run the test
testAivenConnection();
