  import crypto from 'crypto'

// Generate a secure token
export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

// Hash a password
export const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Verify a password
export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const hash = crypto.createHash('sha256').update(password).digest('hex')
  return hash === hashedPassword
} 