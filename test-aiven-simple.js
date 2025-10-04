const mysql = require('mysql2/promise');
require('dotenv').config();

async function testAivenConnection() {
  console.log('🔍 Testing Aiven MySQL connection...');
  
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in environment variables');
    return;
  }

  try {
    console.log('📡 Connection string:', connectionString.replace(/:[^:]*@/, ':***@'));
    
    // Create connection with SSL
    const connection = await mysql.createConnection({
      uri: connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    console.log('✅ Connection successful!');
    
    // Test basic query
    const [rows] = await connection.execute('SELECT 1 as test, NOW() as current_time');
    console.log('📊 Test query result:', rows[0]);
    
    // Test database info
    const [dbInfo] = await connection.execute('SELECT DATABASE() as current_db, VERSION() as mysql_version');
    console.log('📋 Database info:', dbInfo[0]);
    
    await connection.end();
    console.log('🎉 Aiven connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('Access denied')) {
      console.log('\n🔧 IP Whitelist Issue:');
      console.log('1. Go to your Aiven console');
      console.log('2. Click on your MySQL service');
      console.log('3. Look for "IP whitelist" or "Access control"');
      console.log('4. Add your IP address or allow all IPs (0.0.0.0/0)');
      console.log('5. Wait 1-2 minutes for changes to take effect');
    }
  }
}

// Run the test
testAivenConnection();
