const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    // Get a sample user
    const users = await prisma.user.findMany({
      take: 1
    })
    
    if (users.length === 0) {
      console.log('No users found in the database')
      return
    }
    
    const user = users[0]
    console.log('Sample user schema:')
    console.log(JSON.stringify(user, null, 2))
    
    // Check if our new fields exist
    const hasPhone = 'phone' in user
    const hasAddress = 'address' in user
    const hasCity = 'city' in user
    const hasState = 'state' in user
    const hasPostalCode = 'postalCode' in user
    const hasCountry = 'country' in user
    
    console.log('\nField existence check:')
    console.log(`phone: ${hasPhone}`)
    console.log(`address: ${hasAddress}`)
    console.log(`city: ${hasCity}`)
    console.log(`state: ${hasState}`)
    console.log(`postalCode: ${hasPostalCode}`)
    console.log(`country: ${hasCountry}`)
    
  } catch (error) {
    console.error('Error checking schema:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 