'use server';

import bcrypt from 'bcrypt';

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Compare a password with a hash
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
} 