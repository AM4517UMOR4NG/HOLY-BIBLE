// Simple authentication test script
// Run with: node test-auth.js

const BASE_URL = 'http://localhost:4000';

async function testAuth() {
  console.log('🧪 Testing Authentication API\n');
  
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'Test1234';
  const testName = 'Test User';

  try {
    // Test 1: Register
    console.log('1️⃣ Testing Registration...');
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        name: testName
      })
    });

    const registerData = await registerResponse.json();
    
    if (registerResponse.status === 201 && registerData.success) {
      console.log('✅ Registration successful!');
      console.log(`   User ID: ${registerData.user.id}`);
      console.log(`   Email: ${registerData.user.email}`);
      console.log(`   Name: ${registerData.user.name}\n`);
    } else {
      console.log('❌ Registration failed!');
      console.log(registerData);
      return;
    }

    // Test 2: Login
    console.log('2️⃣ Testing Login...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.status === 200 && loginData.success) {
      console.log('✅ Login successful!');
      console.log(`   Access Token: ${loginData.accessToken.substring(0, 20)}...`);
      console.log(`   Refresh Token: ${loginData.refreshToken.substring(0, 20)}...\n`);
      
      const { accessToken, refreshToken } = loginData;

      // Test 3: Get Current User
      console.log('3️⃣ Testing Get Current User...');
      const meResponse = await fetch(`${BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      const meData = await meResponse.json();
      
      if (meResponse.status === 200 && meData.success) {
        console.log('✅ Get current user successful!');
        console.log(`   User ID: ${meData.user.id}`);
        console.log(`   Email: ${meData.user.email}\n`);
      } else {
        console.log('❌ Get current user failed!');
        console.log(meData);
      }

      // Test 4: Refresh Token
      console.log('4️⃣ Testing Refresh Token...');
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      const refreshData = await refreshResponse.json();
      
      if (refreshResponse.status === 200 && refreshData.success) {
        console.log('✅ Refresh token successful!');
        console.log(`   New Access Token: ${refreshData.accessToken.substring(0, 20)}...\n`);
      } else {
        console.log('❌ Refresh token failed!');
        console.log(refreshData);
      }

      // Test 5: Logout
      console.log('5️⃣ Testing Logout...');
      const logoutResponse = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      const logoutData = await logoutResponse.json();
      
      if (logoutResponse.status === 200 && logoutData.success) {
        console.log('✅ Logout successful!\n');
      } else {
        console.log('❌ Logout failed!');
        console.log(logoutData);
      }

    } else {
      console.log('❌ Login failed!');
      console.log(loginData);
    }

    // Test 6: Validation Tests
    console.log('6️⃣ Testing Validation...');
    
    // Test weak password
    const weakPasswordResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test2${Date.now()}@example.com`,
        password: 'weak',
        name: 'Test'
      })
    });

    const weakPasswordData = await weakPasswordResponse.json();
    
    if (weakPasswordResponse.status === 400) {
      console.log('✅ Weak password validation works!');
      console.log(`   Error: ${weakPasswordData.errors[0].message}\n`);
    } else {
      console.log('❌ Weak password validation failed!');
    }

    // Test duplicate email
    const duplicateResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        name: testName
      })
    });

    const duplicateData = await duplicateResponse.json();
    
    if (duplicateResponse.status === 409) {
      console.log('✅ Duplicate email validation works!');
      console.log(`   Error: ${duplicateData.message}\n`);
    } else {
      console.log('❌ Duplicate email validation failed!');
    }

    console.log('🎉 All tests completed!\n');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n⚠️  Make sure the server is running on http://localhost:4000');
  }
}

// Run tests
testAuth();
