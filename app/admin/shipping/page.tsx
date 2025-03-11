"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'
import { getShippingSettings, updateShippingSettings } from '@/app/actions/shipping.action'
import { toast } from 'sonner'

type ShippingRule = {
  id?: string
  minOrderValue: number
  maxOrderValue?: number
  shippingCost: number
}

type ShippingZone = {
  id?: string
  name: string
  countries: string[]
  shippingCost: number
}

export default function ShippingSettingsPage() {
  const [shippingRules, setShippingRules] = useState<ShippingRule[]>([])
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(2000)
  const [enableInternationalShipping, setEnableInternationalShipping] = useState<boolean>(false)
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  useEffect(() => {
    async function loadShippingSettings() {
      try {
        setIsLoading(true)
        const result = await getShippingSettings()
        if (result.success && result.data) {
          setShippingRules((result.data.rules || []).map((rule: any) => ({
            id: rule.id,
            minOrderValue: rule.minOrderValue,
            maxOrderValue: rule.maxOrderValue === null ? undefined : rule.maxOrderValue,
            shippingCost: rule.shippingCost
          })))
          setFreeShippingThreshold(result.data.freeShippingThreshold || 2000)
          setEnableInternationalShipping(result.data.internationalShipping || false)
          setShippingZones(result.data.zones || [])
        } else {
          toast.error('Failed to load shipping settings')
        }
      } catch (error) {
        console.error('Error loading shipping settings:', error)
        toast.error('Failed to load shipping settings')
      } finally {
        setIsLoading(false)
      }
    }

    loadShippingSettings()
  }, [])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      const result = await updateShippingSettings({
        freeShippingThreshold,
        internationalShipping: enableInternationalShipping,
        rules: shippingRules,
        zones: enableInternationalShipping ? shippingZones : undefined,
      })
      
      if (result.success) {
        toast.success('Shipping settings saved successfully')
      } else {
        toast.error('Failed to save shipping settings')
      }
    } catch (error) {
      console.error('Error saving shipping settings:', error)
      toast.error('Failed to save shipping settings')
    } finally {
      setIsSaving(false)
    }
  }

  const addShippingRule = () => {
    setShippingRules([
      ...shippingRules,
      { minOrderValue: 0, shippingCost: 0 }
    ])
  }

  const updateShippingRule = (index: number, field: keyof ShippingRule, value: any) => {
    const updatedRules = [...shippingRules]
    updatedRules[index] = { ...updatedRules[index], [field]: value }
    setShippingRules(updatedRules)
  }

  const removeShippingRule = (index: number) => {
    setShippingRules(shippingRules.filter((_, i) => i !== index))
  }

  const addShippingZone = () => {
    setShippingZones([
      ...shippingZones,
      { name: '', countries: [], shippingCost: 0 }
    ])
  }

  const updateShippingZone = (index: number, field: keyof ShippingZone, value: any) => {
    const updatedZones = [...shippingZones]
    updatedZones[index] = { ...updatedZones[index], [field]: value }
    setShippingZones(updatedZones)
  }

  const removeShippingZone = (index: number) => {
    setShippingZones(shippingZones.filter((_, i) => i !== index))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <p>Loading shipping settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shipping Settings</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Tabs defaultValue="domestic">
        <TabsList className="mb-6">
          <TabsTrigger value="domestic">Domestic Shipping</TabsTrigger>
          <TabsTrigger value="international">International Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="domestic">
          <Card>
            <CardHeader>
              <CardTitle>Domestic Shipping Rules</CardTitle>
              <CardDescription>
                Set up shipping costs based on order value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (in cents)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                    placeholder="2000"
                  />
                  <p className="text-sm text-muted-foreground">
                    Orders above this amount will qualify for free shipping
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Shipping Rules</h3>
                    <Button onClick={addShippingRule} variant="outline" size="sm">
                      Add Rule
                    </Button>
                  </div>

                  {shippingRules.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No shipping rules defined</p>
                  ) : (
                    <div className="space-y-4">
                      {shippingRules.map((rule, index) => (
                        <div key={index} className="flex items-end gap-4">
                          <div className="flex-1">
                            <Label>Min Order Value (cents)</Label>
                            <Input
                              type="number"
                              value={rule.minOrderValue}
                              onChange={(e) => updateShippingRule(index, 'minOrderValue', Number(e.target.value))}
                            />
                          </div>
                          <div className="flex-1">
                            <Label>Max Order Value (cents, optional)</Label>
                            <Input
                              type="number"
                              value={rule.maxOrderValue || ''}
                              onChange={(e) => updateShippingRule(index, 'maxOrderValue', e.target.value ? Number(e.target.value) : undefined)}
                              placeholder="No maximum"
                            />
                          </div>
                          <div className="flex-1">
                            <Label>Shipping Cost (cents)</Label>
                            <Input
                              type="number"
                              value={rule.shippingCost}
                              onChange={(e) => updateShippingRule(index, 'shippingCost', Number(e.target.value))}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeShippingRule(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="international">
          <Card>
            <CardHeader>
              <CardTitle>International Shipping</CardTitle>
              <CardDescription>
                Configure international shipping options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-international"
                    checked={enableInternationalShipping}
                    onCheckedChange={setEnableInternationalShipping}
                  />
                  <Label htmlFor="enable-international">Enable International Shipping</Label>
                </div>

                {enableInternationalShipping && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Shipping Zones</h3>
                      <Button onClick={addShippingZone} variant="outline" size="sm">
                        Add Zone
                      </Button>
                    </div>

                    {shippingZones.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No shipping zones defined</p>
                    ) : (
                      <div className="space-y-4">
                        {shippingZones.map((zone, index) => (
                          <div key={index} className="flex items-end gap-4">
                            <div className="flex-1">
                              <Label>Zone Name</Label>
                              <Input
                                value={zone.name}
                                onChange={(e) => updateShippingZone(index, 'name', e.target.value)}
                                placeholder="Europe"
                              />
                            </div>
                            <div className="flex-1">
                              <Label>Countries (comma separated)</Label>
                              <Input
                                value={zone.countries.join(', ')}
                                onChange={(e) => updateShippingZone(index, 'countries', e.target.value.split(',').map(c => c.trim()))}
                                placeholder="FR, DE, IT"
                              />
                            </div>
                            <div className="flex-1">
                              <Label>Shipping Cost (cents)</Label>
                              <Input
                                type="number"
                                value={zone.shippingCost}
                                onChange={(e) => updateShippingZone(index, 'shippingCost', Number(e.target.value))}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeShippingZone(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

