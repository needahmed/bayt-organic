"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

  const handleStoreSettingChange = (key: keyof typeof storeSettings, value: string) => {
    setStoreSettings({ ...storeSettings, [key]: value })
  }

  const handleEmailSettingChange = (key: keyof typeof emailSettings, value: string | boolean) => {
    setEmailSettings({ ...emailSettings, [key]: value })
  }

  const handleSave = () => {
    // Here you would typically save the settings to your backend
    console.log("Saving settings:", { storeSettings, emailSettings })
    // Implement API call to save settings
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
                    <SelectItem value="Asia/Karachi">Asia/Karachi</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
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

      <Button onClick={handleSave} className="bg-green-700 hover:bg-green-800 text-white">
        Save Settings
      </Button>
    </div>
  )
}

