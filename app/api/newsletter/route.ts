import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ 
        success: false, 
        error: 'Email is required' 
      }, { status: 400 })
    }

    // Check if email already exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email }
    })

    if (existingSubscription) {
      if (existingSubscription.active) {
        return NextResponse.json({ 
          success: false, 
          error: 'This email is already subscribed to our newsletter' 
        }, { status: 400 })
      } else {
        // Re-activate the subscription
        await prisma.newsletter.update({
          where: { email },
          data: { active: true }
        })

        return NextResponse.json({ 
          success: true, 
          message: 'Thank you for re-subscribing to our newsletter!' 
        })
      }
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: {
        email,
        active: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for subscribing to our newsletter!' 
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to subscribe to newsletter. Please try again.' 
    }, { status: 500 })
  }
} 