'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// We need to run a Prisma migration first to add these models
// For now, we'll use a type assertion to avoid TypeScript errors
const prismaWithShipping = prisma as unknown as typeof prisma & {
  shippingSettings: {
    findFirst: (args?: any) => Promise<any>
    create: (args: any) => Promise<any>
    update: (args: any) => Promise<any>
  }
  shippingRule: {
    deleteMany: (args: any) => Promise<any>
    create: (args: any) => Promise<any>
  }
  shippingZone: {
    deleteMany: (args: any) => Promise<any>
    create: (args: any) => Promise<any>
  }
}

// Get shipping settings
export async function getShippingSettings() {
  try {
    // Find the first shipping settings or create a default one if none exists
    let settings = await prismaWithShipping.shippingSettings.findFirst({
      include: {
        rules: true,
        zones: true,
      },
    })

    if (!settings) {
      // Create default shipping settings
      settings = await prismaWithShipping.shippingSettings.create({
        data: {
          freeShippingThreshold: 2000,
          internationalShipping: false,
          rules: {
            create: [
              { minOrderValue: 0, maxOrderValue: 1000, shippingCost: 150 },
              { minOrderValue: 1001, maxOrderValue: 2000, shippingCost: 100 },
              { minOrderValue: 2001, shippingCost: 0 },
            ],
          },
        },
        include: {
          rules: true,
          zones: true,
        },
      })
    }

    return { success: true, data: settings }
  } catch (error) {
    console.error('Error getting shipping settings:', error)
    return { success: false, error: 'Failed to get shipping settings' }
  }
}

// Update shipping settings
export async function updateShippingSettings(data: {
  freeShippingThreshold?: number
  internationalShipping?: boolean
  rules: { id?: string; minOrderValue: number; maxOrderValue?: number; shippingCost: number }[]
  zones?: { id?: string; name: string; countries: string[]; shippingCost: number }[]
}) {
  try {
    // Find existing settings or create new ones
    let settings = await prismaWithShipping.shippingSettings.findFirst()
    
    if (!settings) {
      settings = await prismaWithShipping.shippingSettings.create({
        data: {
          freeShippingThreshold: data.freeShippingThreshold,
          internationalShipping: data.internationalShipping || false,
        },
      })
    } else {
      // Update existing settings
      settings = await prismaWithShipping.shippingSettings.update({
        where: { id: settings.id },
        data: {
          freeShippingThreshold: data.freeShippingThreshold,
          internationalShipping: data.internationalShipping,
        },
      })
    }

    // Handle shipping rules
    // Delete existing rules
    await prismaWithShipping.shippingRule.deleteMany({
      where: { settingsId: settings.id },
    })

    // Create new rules
    for (const rule of data.rules) {
      await prismaWithShipping.shippingRule.create({
        data: {
          minOrderValue: rule.minOrderValue,
          maxOrderValue: rule.maxOrderValue,
          shippingCost: rule.shippingCost,
          settingsId: settings.id,
        },
      })
    }

    // Handle shipping zones if international shipping is enabled
    if (data.internationalShipping && data.zones) {
      // Delete existing zones
      await prismaWithShipping.shippingZone.deleteMany({
        where: { settingsId: settings.id },
      })

      // Create new zones
      for (const zone of data.zones) {
        await prismaWithShipping.shippingZone.create({
          data: {
            name: zone.name,
            countries: zone.countries,
            shippingCost: zone.shippingCost,
            settingsId: settings.id,
          },
        })
      }
    }

    revalidatePath('/admin/shipping')
    return { success: true, data: settings }
  } catch (error) {
    console.error('Error updating shipping settings:', error)
    return { success: false, error: 'Failed to update shipping settings' }
  }
} 