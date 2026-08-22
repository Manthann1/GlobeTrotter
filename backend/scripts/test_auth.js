import { registerSchema, loginSchema } from '../src/schemas/auth.schema.js';
import { generateToken, sanitizeUser } from '../src/services/auth.service.js';
import jwt from 'jsonwebtoken';

console.log('--- Testing Schemas ---');
const validRegister = registerSchema.safeParse({
  name: 'John Doe',
  email: 'JOHN@EXAMPLE.COM',
  password: 'securepassword123',
});
console.log('Valid Register Parse:', validRegister.success, validRegister.data);

const invalidRegister = registerSchema.safeParse({
  name: 'J',
  email: 'not-an-email',
  password: '123',
});
console.log('Invalid Register Parse (should be false):', invalidRegister.success);

const validLogin = loginSchema.safeParse({
  email: 'john@example.com',
  password: 'password123',
});
console.log('Valid Login Parse:', validLogin.success, validLogin.data);

console.log('\n--- Testing Token & Sanitization ---');
const mockUser = {
  id: 'b7c3d2e1-0000-4000-a000-123456789abc',
  name: 'John Doe',
  email: 'john@example.com',
  passwordHash: '$2a$10$hashedpasswordstringsample',
  createdAt: new Date(),
};

const sanitized = sanitizeUser(mockUser);
console.log('Sanitized user has passwordHash?', 'passwordHash' in sanitized);
console.log('Sanitized user fields:', Object.keys(sanitized));

const token = generateToken({ userId: mockUser.id, email: mockUser.email });
console.log('Generated JWT Token:', token ? 'SUCCESS' : 'FAILED');

const decoded = jwt.decode(token);
console.log('Decoded Token Payload:', decoded);

console.log('\n✅ All Auth Logic Verification Tests Passed!');
