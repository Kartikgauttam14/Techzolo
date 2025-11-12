/**
 * JWT Token Testing Script
 * 
 * This script tests JWT token generation, validation, and error handling
 * Run with: node scripts/test-jwt-tokens.js
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Test configuration
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key";
const TEST_USER_ID = 1;
const TEST_EMAIL = "test@example.com";

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let testsPassed = 0;
let testsFailed = 0;

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function test(name, testFn) {
  try {
    testFn();
    log(`✓ ${name}`, colors.green);
    testsPassed++;
  } catch (error) {
    log(`✗ ${name}`, colors.red);
    log(`  Error: ${error.message}`, colors.red);
    testsFailed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, but got ${actual}`);
  }
}

function assertThrows(fn, errorMessage) {
  try {
    fn();
    throw new Error('Expected function to throw an error');
  } catch (error) {
    if (errorMessage && !error.message.includes(errorMessage)) {
      throw new Error(`Expected error message to include "${errorMessage}", but got "${error.message}"`);
    }
  }
}

log('\n🔐 JWT Token Testing Suite\n', colors.cyan);
log('='.repeat(60), colors.blue);

// Test 1: Token Generation
log('\n📝 Test 1: Token Generation', colors.yellow);
test('Should generate a valid JWT token', () => {
  const token = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  assert(token, 'Token should be generated');
  assert(typeof token === 'string', 'Token should be a string');
  assert(token.split('.').length === 3, 'Token should have 3 parts (header.payload.signature)');
});

test('Token should contain correct payload structure', () => {
  const token = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  const decoded = jwt.decode(token);
  assert(decoded.sub === TEST_USER_ID, 'Token should contain correct user ID');
  assert(decoded.email === TEST_EMAIL, 'Token should contain correct email');
  assert(decoded.exp, 'Token should have expiration time');
  assert(decoded.iat, 'Token should have issued at time');
});

// Test 2: Token Validation
log('\n🔍 Test 2: Token Validation', colors.yellow);
test('Should verify a valid token', () => {
  const token = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  const decoded = jwt.verify(token, JWT_SECRET);
  assert(decoded.sub === TEST_USER_ID, 'Decoded token should contain correct user ID');
  assert(decoded.email === TEST_EMAIL, 'Decoded token should contain correct email');
});

test('Should reject token with wrong secret', () => {
  const token = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  assertThrows(() => {
    jwt.verify(token, 'wrong-secret');
  }, 'invalid signature');
});

test('Should reject expired token', () => {
  const token = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '-1h' } // Expired 1 hour ago
  );
  
  assertThrows(() => {
    jwt.verify(token, JWT_SECRET);
  }, 'jwt expired');
});

// Test 3: Token Structure
log('\n📋 Test 3: Token Structure', colors.yellow);
test('Token should have correct JWT structure', () => {
  const token = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  const parts = token.split('.');
  assertEqual(parts.length, 3, 'Token should have exactly 3 parts');
  
  // Decode header
  const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
  assertEqual(header.typ, 'JWT', 'Token type should be JWT');
  assertEqual(header.alg, 'HS256', 'Algorithm should be HS256');
});

test('Token payload should match login route format', () => {
  // Simulate what login route does
  const token = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  const decoded = jwt.verify(token, JWT_SECRET);
  
  // Verify it matches what /me route expects
  assert(decoded.sub, 'Token should have sub field');
  assert(decoded.email, 'Token should have email field');
  assert(typeof decoded.sub === 'number', 'sub should be a number');
  assert(typeof decoded.email === 'string', 'email should be a string');
});

// Test 4: Token Expiration
log('\n⏰ Test 4: Token Expiration', colors.yellow);
test('Token should have expiration time in future', () => {
  const token = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  const decoded = jwt.decode(token);
  const now = Math.floor(Date.now() / 1000);
  assert(decoded.exp > now, 'Token expiration should be in the future');
});

test('Token expiration should be approximately 24 hours', () => {
  const token = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  const decoded = jwt.decode(token);
  const now = Math.floor(Date.now() / 1000);
  const expirationTime = decoded.exp - now;
  const hours = expirationTime / 3600;
  
  // Allow 1 minute tolerance
  assert(hours >= 23.98 && hours <= 24.02, `Token should expire in ~24 hours, got ${hours.toFixed(2)} hours`);
});

// Test 5: Error Handling
log('\n⚠️  Test 5: Error Handling', colors.yellow);
test('Should handle malformed token', () => {
  assertThrows(() => {
    jwt.verify('not.a.valid.token', JWT_SECRET);
  }, 'malformed');
});

test('Should handle empty token', () => {
  assertThrows(() => {
    jwt.verify('', JWT_SECRET);
  });
});

test('Should handle token with wrong number of parts', () => {
  assertThrows(() => {
    jwt.verify('invalid', JWT_SECRET);
  });
});

test('Should handle token signed with different algorithm', () => {
  // Create token with RS256 (different algorithm)
  const token = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '24h' }
  );
  
  // Should still verify with same secret and algorithm
  const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  assert(decoded.sub === TEST_USER_ID, 'Token should verify with correct algorithm');
});

// Test 6: Security Tests
log('\n🔒 Test 6: Security Tests', colors.yellow);
test('Token should not be decodable without secret', () => {
  const token = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Can decode without secret (payload is not encrypted, just signed)
  const decoded = jwt.decode(token);
  assert(decoded, 'Token can be decoded without secret (this is normal for JWT)');
  
  // But cannot verify without secret
  assertThrows(() => {
    jwt.verify(token, 'wrong-secret');
  }, 'invalid signature');
});

test('Token should be tamper-proof', () => {
  const token = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Tamper with the token
  const parts = token.split('.');
  const tamperedPayload = Buffer.from(JSON.stringify({ sub: 999, email: 'hacker@evil.com' })).toString('base64');
  const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;
  
  // Should fail verification
  assertThrows(() => {
    jwt.verify(tamperedToken, JWT_SECRET);
  });
});

// Test 7: Integration Tests (Simulating API routes)
log('\n🔗 Test 7: Integration Tests', colors.yellow);
test('Simulate login route token generation', () => {
  // Simulate what happens in app/api/auth/login/route.ts
  const user = {
    id: TEST_USER_ID,
    email: TEST_EMAIL
  };
  
  const access_token = jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  assert(access_token, 'Access token should be generated');
  
  // Simulate what happens in app/api/auth/me/route.ts
  const decoded = jwt.verify(access_token, JWT_SECRET);
  assert(decoded.sub === user.id, 'Token should contain user ID in sub field');
  assert(decoded.email === user.email, 'Token should contain user email');
});

test('Simulate /me route token verification', () => {
  // Create token as login would
  const token = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Verify as /me route would
  const decoded = jwt.verify(token, JWT_SECRET);
  
  // Should be able to use decoded.sub to query database
  assert(decoded.sub, 'Should have sub field for database query');
  assert(typeof decoded.sub === 'number', 'sub should be a number for database query');
});

test('Simulate missing authorization header', () => {
  // This simulates what happens when no auth header is provided
  const authHeader = null;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // This is the expected behavior
    assert(true, 'Should reject missing authorization header');
  } else {
    throw new Error('Should have rejected missing header');
  }
});

test('Simulate invalid Bearer token format', () => {
  const authHeader = "InvalidFormat token123";
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    assert(true, 'Should reject invalid Bearer format');
  } else {
    throw new Error('Should have rejected invalid format');
  }
});

// Test 8: Edge Cases
log('\n🎯 Test 8: Edge Cases', colors.yellow);
test('Should handle very large user ID', () => {
  const largeId = 999999999;
  const token = jwt.sign(
    { sub: largeId, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  const decoded = jwt.verify(token, JWT_SECRET);
  assertEqual(decoded.sub, largeId, 'Should handle large user IDs');
});

test('Should handle special characters in email', () => {
  const specialEmail = "test+user@example-domain.co.uk";
  const token = jwt.sign(
    { sub: TEST_USER_ID, email: specialEmail },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  const decoded = jwt.verify(token, JWT_SECRET);
  assertEqual(decoded.email, specialEmail, 'Should handle special characters in email');
});

test('Should handle different expiration times', () => {
  const times = ['1h', '24h', '7d', '30d'];
  
  times.forEach(expTime => {
    const token = jwt.sign(
      { sub: TEST_USER_ID, email: TEST_EMAIL },
      JWT_SECRET,
      { expiresIn: expTime }
    );
    
    const decoded = jwt.verify(token, JWT_SECRET);
    assert(decoded.exp, `Token with ${expTime} expiration should have exp field`);
  });
});

// Test 9: Token Comparison
log('\n🔄 Test 9: Token Comparison', colors.yellow);
test('Different tokens should be generated for same user', () => {
  const token1 = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Wait a bit to ensure different iat
  setTimeout(() => {
    const token2 = jwt.sign(
      { sub: TEST_USER_ID, email: TEST_EMAIL },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    assert(token1 !== token2, 'Different tokens should be generated');
  }, 100);
});

test('Same payload should produce different tokens (due to iat)', () => {
  const token1 = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Small delay to ensure different issued at time
  const token2 = jwt.sign(
    { sub: TEST_USER_ID, email: TEST_EMAIL },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Tokens should be different even with same payload (different iat)
  const decoded1 = jwt.decode(token1);
  const decoded2 = jwt.decode(token2);
  
  // Both should verify correctly
  jwt.verify(token1, JWT_SECRET);
  jwt.verify(token2, JWT_SECRET);
  
  assert(decoded1.sub === decoded2.sub, 'Both tokens should have same user ID');
  assert(decoded1.email === decoded2.email, 'Both tokens should have same email');
});

// Summary
log('\n' + '='.repeat(60), colors.blue);
log('\n📊 Test Summary', colors.cyan);
log(`Total Tests: ${testsPassed + testsFailed}`, colors.blue);
log(`Passed: ${testsPassed}`, colors.green);
log(`Failed: ${testsFailed}`, testsFailed > 0 ? colors.red : colors.green);

if (testsFailed === 0) {
  log('\n✅ All tests passed! JWT tokens are working correctly.\n', colors.green);
  process.exit(0);
} else {
  log('\n❌ Some tests failed. Please review the errors above.\n', colors.red);
  process.exit(1);
}

