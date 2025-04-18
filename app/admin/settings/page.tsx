"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { 
  getStoreSettings, 
  getEmailSettings, 
  saveStoreSettings, 
  saveEmailSettings 
} from "@/app/actions/settings.action"

export default function SettingsPage() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Bayt Organic",
    storeEmail: "info@baytorganic.com",
    storePhone: "+92 300 1234567",
    storeAddress: "123 Green Street, Clifton, Karachi, 75600, Pakistan",
    currency: "PKR",
    timezone: "Asia/Karachi",
    orderPrefix: "BO-",
  })

  const [emailSettings, setEmailSettings] = useState({
    senderName: "Bayt Organic",
    senderEmail: "noreply@baytorganic.com",
    enableOrderConfirmation: true,
    enableShippingConfirmation: true,
    enableAbandonedCart: false,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch settings from API on initial load
  useEffect(() => {
    async function fetchSettings() {
      try {
        setIsLoading(true)
        
        // Fetch store settings
        const storeResult = await getStoreSettings()
        if (storeResult.success && storeResult.data) {
          setStoreSettings(storeResult.data)
        }
        
        // Fetch email settings
        const emailResult = await getEmailSettings()
        if (emailResult.success && emailResult.data) {
          setEmailSettings(emailResult.data)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
        toast({
          variant: "destructive",
          title: "Failed to load settings",
          description: "Please refresh the page to try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSettings()
  }, [toast])

  const handleStoreSettingChange = (key: keyof typeof storeSettings, value: string) => {
    setStoreSettings({ ...storeSettings, [key]: value })
  }

  const handleEmailSettingChange = (key: keyof typeof emailSettings, value: string | boolean) => {
    setEmailSettings({ ...emailSettings, [key]: value })
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // Save both setting types
      const storeResult = await saveStoreSettings(storeSettings)
      const emailResult = await saveEmailSettings(emailSettings)
      
      if (storeResult.success && emailResult.success) {
        toast({
          title: "Settings saved",
          description: "Your settings have been saved successfully.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Failed to save settings",
          description: storeResult.error || emailResult.error || "Please try again.",
        })
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-700" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-muted-foreground">Manage your store's general settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Basic information about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeSettings.storeName}
                  onChange={(e) => handleStoreSettingChange("storeName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeSettings.storeEmail}
                  onChange={(e) => handleStoreSettingChange("storeEmail", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">Store Phone</Label>
                <Input
                  id="storePhone"
                  value={storeSettings.storePhone}
                  onChange={(e) => handleStoreSettingChange("storePhone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Store Address</Label>
                <Textarea
                  id="storeAddress"
                  value={storeSettings.storeAddress}
                  onChange={(e) => handleStoreSettingChange("storeAddress", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Store Preferences</CardTitle>
              <CardDescription>Set your store's currency and timezone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={storeSettings.currency}
                  onValueChange={(value) => handleStoreSettingChange("currency", value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PKR">Pakistani Rupee (PKR)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={storeSettings.timezone}
                  onValueChange={(value) => handleStoreSettingChange("timezone", value)}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Karachi">Pakistan (GMT+5)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (GMT-5)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (GMT-8)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Asia/Dubai">Dubai (GMT+4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderPrefix">Order Number Prefix</Label>
                <Input
                  id="orderPrefix"
                  value={storeSettings.orderPrefix}
                  onChange={(e) => handleStoreSettingChange("orderPrefix", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure your store's email settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  id="senderName"
                  value={emailSettings.senderName}
                  onChange={(e) => handleEmailSettingChange("senderName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderEmail">Sender Email</Label>
                <Input
                  id="senderEmail"
                  type="email"
                  value={emailSettings.senderEmail}
                  onChange={(e) => handleEmailSettingChange("senderEmail", e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="orderConfirmation"
                  checked={emailSettings.enableOrderConfirmation}
                  onCheckedChange={(checked) => handleEmailSettingChange("enableOrderConfirmation", checked)}
                />
                <Label htmlFor="orderConfirmation">Send Order Confirmation Emails</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="shippingConfirmation"
                  checked={emailSettings.enableShippingConfirmation}
                  onCheckedChange={(checked) => handleEmailSettingChange("enableShippingConfirmation", checked)}
                />
                <Label htmlFor="shippingConfirmation">Send Shipping Confirmation Emails</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="abandonedCart"
                  checked={emailSettings.enableAbandonedCart}
                  onCheckedChange={(checked) => handleEmailSettingChange("enableAbandonedCart", checked)}
                />
                <Label htmlFor="abandonedCart">Send Abandoned Cart Emails</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button 
        onClick={handleSave} 
        className="bg-green-700 hover:bg-green-800 text-white" 
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Settings'
        )}
      </Button>
    </div>
  )
}

