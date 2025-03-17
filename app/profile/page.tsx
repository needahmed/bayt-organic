"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { User, Package, Heart, CreditCard, LogOut, Edit2, Save } from "lucide-react"
import { getUserProfile, updateUserProfile, handleLogout } from "@/app/actions/user.actions"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("account")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  
  const [userData, setUserData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    role: "",
  })

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        setIsLoading(true)
        const result = await getUserProfile()
        
        if (!result.success) {
          // If not authenticated, redirect to login
          if (result.error === 'Not authenticated') {
            router.push('/auth/login')
            return
          }
          
          setError(result.error || "Failed to load profile data")
          return
        }
        
        const user = result.data
        
        if (!user) {
          setError("User data not found")
          return
        }
        
        // Split name into first and last name
        const nameParts = user.name ? user.name.split(' ') : ['', '']
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        
        setUserData({
          id: user.id || '',
          firstName,
          lastName,
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          postalCode: user.postalCode || '',
          country: user.country || '',
          role: user.role || '',
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserData()
  }, [router])

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const saveChanges = async () => {
    try {
      setIsLoading(true)
      
      // Create FormData object
      const formData = new FormData()
      formData.append('firstName', userData.firstName)
      formData.append('lastName', userData.lastName)
      formData.append('phone', userData.phone)
      formData.append('address', userData.address)
      formData.append('city', userData.city)
      formData.append('state', userData.state)
      formData.append('postalCode', userData.postalCode)
      formData.append('country', userData.country)
      
      const result = await updateUserProfile(formData)
      
      if (result.success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
          variant: "default",
        })
        setIsEditing(false)
      } else {
        toast({
          title: "Update failed",
          description: result.error || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onLogout = async () => {
    try {
      await handleLogout()
      // The redirect is handled by the server action
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Logout failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Loading state
  if (isLoading && !userData.id) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-green-500 border-green-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-green-800">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
          <p className="mb-6">{error}</p>
          <Button onClick={() => router.push('/auth/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  // Sample order history - in a real app, this would come from the database
  const orders = [
    {
      id: "BO-12345",
      date: "June 15, 2023",
      status: "Delivered",
      total: 3700,
      items: [
        {
          name: "Honey & Oats Body Soap",
          quantity: 2,
        },
        {
          name: "Coconut Milk Shampoo Bar",
          quantity: 1,
        },
      ],
    },
    {
      id: "BO-12346",
      date: "May 22, 2023",
      status: "Delivered",
      total: 2100,
      items: [
        {
          name: "Anti-Aging Face Serum",
          quantity: 1,
        },
        {
          name: "Lavender Lip Balm",
          quantity: 2,
        },
      ],
    },
  ]

  // Sample wishlist - in a real app, this would come from the database
  const wishlist = [
    {
      id: 1,
      name: "Neem Body Soap",
      price: 900,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      name: "Hair Growth Oil",
      price: 1200,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 3,
      name: "Dental Powder",
      price: 700,
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-green-800 mb-2">My Account</h1>
          <p className="text-green-700 mb-8">Manage your account details and track your orders</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:w-[240px] flex-shrink-0"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-green-700" />
                  </div>
                  <h2 className="font-medium text-green-800 text-lg">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <p className="text-green-600 text-sm">{userData.email}</p>
                </div>

                <div className="w-full">
                  <TabsList className="flex flex-col h-auto bg-transparent space-y-1 w-full">
                    <TabsTrigger
                      value="account"
                      className="justify-start data-[state=active]:bg-green-50 data-[state=active]:text-green-800 w-full"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </TabsTrigger>
                    <TabsTrigger
                      value="orders"
                      className="justify-start data-[state=active]:bg-green-50 data-[state=active]:text-green-800 w-full"
                      onClick={() => router.push('/dashboard/orders')}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Orders
                    </TabsTrigger>
                    <TabsTrigger
                      value="wishlist"
                      className="justify-start data-[state=active]:bg-green-50 data-[state=active]:text-green-800 w-full"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </TabsTrigger>
                    <TabsTrigger
                      value="payment"
                      className="justify-start data-[state=active]:bg-green-50 data-[state=active]:text-green-800 w-full"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Methods
                    </TabsTrigger>
                  </TabsList>
                </div>

                <Separator className="my-6" />

                <Button
                  variant="outline"
                  className="w-full border-pink-500 text-pink-500 hover:bg-pink-50 hover:text-pink-600"
                  onClick={onLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex-1">
            <TabsContent value="account" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-green-800">Account Information</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleEdit}
                    className={
                      isEditing
                        ? "border-pink-500 text-pink-500 hover:bg-pink-50"
                        : "border-green-700 text-green-700 hover:bg-green-50"
                    }
                  >
                    {isEditing ? (
                      <>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" value={userData.email} disabled />
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={userData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={userData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={userData.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          name="state"
                          value={userData.state}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={userData.postalCode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={userData.country}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                {isEditing && (
                  <CardFooter className="flex justify-end">
                    <Button 
                      onClick={saveChanges} 
                      className="bg-green-700 hover:bg-green-800"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800">Order History</CardTitle>
                  <CardDescription>View and track your recent orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-green-50 p-4 flex flex-col md:flex-row justify-between md:items-center">
                            <div>
                              <h3 className="font-medium text-green-800">Order #{order.id}</h3>
                              <p className="text-sm text-green-600">Placed on {order.date}</p>
                            </div>
                            <div className="flex items-center mt-2 md:mt-0">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  order.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {order.status}
                              </span>
                              <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="ml-4 text-green-700 hover:text-green-800 hover:bg-green-50"
                              >
                                <Link href={`/profile/orders/${order.id}`}>View Details</Link>
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-green-700">
                                    {item.name} × {item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <Separator className="my-3" />
                            <div className="flex justify-between font-medium">
                              <span className="text-green-800">Total</span>
                              <span className="text-green-800">Rs. {order.total.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-green-300 mx-auto mb-4" />
                      <h3 className="font-medium text-green-800 mb-1">No Orders Yet</h3>
                      <p className="text-green-600 mb-4">You haven't placed any orders yet.</p>
                      <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
                        <Link href="/">Start Shopping</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800">My Wishlist</CardTitle>
                  <CardDescription>Products you've saved for later</CardDescription>
                </CardHeader>
                <CardContent>
                  {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((item) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden group">
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-pink-500 hover:text-pink-600">
                              <Heart className="h-4 w-4 fill-current" />
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-green-800 mb-1">{item.name}</h3>
                            <p className="text-pink-500 font-medium mb-3">Rs. {item.price.toLocaleString()}</p>
                            <div className="flex space-x-2">
                              <Button className="flex-1 bg-green-700 hover:bg-green-800 text-white" size="sm">
                                Add to Cart
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-pink-500 text-pink-500 hover:bg-pink-50"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-pink-300 mx-auto mb-4" />
                      <h3 className="font-medium text-green-800 mb-1">Your Wishlist is Empty</h3>
                      <p className="text-green-600 mb-4">Save your favorite products to your wishlist for later.</p>
                      <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
                        <Link href="/">Explore Products</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800">Payment Methods</CardTitle>
                  <CardDescription>Manage your saved payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-blue-600 rounded mr-4"></div>
                        <div>
                          <h3 className="font-medium text-green-800">Visa ending in 1234</h3>
                          <p className="text-sm text-green-600">Expires 12/2025</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-700 hover:text-green-800 hover:bg-green-50"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-pink-500 hover:text-pink-600 hover:bg-pink-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-green-700 hover:bg-green-800 text-white">Add New Payment Method</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

