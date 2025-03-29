"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { ChevronLeft, CreditCard, Truck, Shield, AlertCircle } from "lucide-react"
import { useCart } from "@/app/context/CartContext"
import { calculateShippingCost } from "@/app/actions/shipping.action"
import { getUserProfile } from "@/app/actions/user.actions"
import { getUserAddresses, createAddress, AddressFormData } from "@/app/actions/address.action"
import { createOrder, OrderFormData } from "@/app/actions/orders.action"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, subtotal, total, isLoading, clearCart } = useCart()
  const [activeStep, setActiveStep] = useState("shipping")
  const [shippingCost, setShippingCost] = useState(0)
  const [shippingMessage, setShippingMessage] = useState("")
  const [isLoadingShipping, setIsLoadingShipping] = useState(true)
  const [discount, setDiscount] = useState(0)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState("")
  const [isCreatingAddress, setIsCreatingAddress] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
    saveInfo: true,
    paymentMethod: "cod",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })

  // Load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoadingUser(true);
        const result = await getUserProfile();
        
        if (result.success && result.data) {
          setUser(result.data);
          
          // Pre-fill form with user data
          const nameParts = result.data.name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          setFormData(prev => ({
            ...prev,
            firstName,
            lastName,
            email: result.data.email || '',
            phone: result.data.phone || '',
            address: result.data.address || '',
            city: result.data.city || '',
            state: result.data.state || '',
            postalCode: result.data.postalCode || '',
            country: result.data.country || 'Pakistan',
          }));
        } else {
          // User is not authenticated or profile couldn't be loaded
          // This is fine for guest checkout - don't show error
          console.log("User not authenticated or profile not found, proceeding with guest checkout");
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        // Don't show error toast for authentication issues
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUserProfile();
  }, []);

  // Load user addresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const result = await getUserAddresses();
        
        if (result.success && result.data) {
          setAddresses(result.data);
          
          // Select default address if available
          const defaultAddress = result.data.find((addr: any) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          } else if (result.data.length > 0) {
            setSelectedAddressId(result.data[0].id);
          }
        } else {
          // Don't show error for guest users
          console.log("No addresses found or user not authenticated");
        }
      } catch (error) {
        console.error("Error loading addresses:", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    // Only load addresses if user is authenticated
    if (!isLoadingUser && user) {
      loadAddresses();
    } else if (!isLoadingUser) {
      // If user is not authenticated, mark address loading as complete
      setIsLoadingAddresses(false);
    }
  }, [isLoadingUser, user]);

  // Load shipping cost
  useEffect(() => {
    const loadShippingCost = async () => {
      try {
        setIsLoadingShipping(true);
        const result = await calculateShippingCost(subtotal, formData.country === "Pakistan" ? "PK" : formData.country);
        
        if (result.success) {
          setShippingCost(result.shippingCost);
          setShippingMessage(result.message || "");
        } else {
          console.error("Failed to calculate shipping:", result.error);
          toast.error(result.error || "Failed to calculate shipping rates");
          setShippingCost(150); // Default shipping cost
        }
      } catch (error) {
        console.error("Error loading shipping cost:", error);
        setShippingCost(150); // Default shipping cost
      } finally {
        setIsLoadingShipping(false);
      }
    };

    if (cartItems.length > 0) {
      loadShippingCost();
    } else {
      setShippingCost(0);
      setIsLoadingShipping(false);
    }
  }, [subtotal, cartItems.length, formData.country]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      saveInfo: checked,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleRadioChange = (value: string) => {
    setFormData({
      ...formData,
      paymentMethod: value,
    })
  }

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
  }

  const handleCreateAddress = async () => {
    if (!user) {
      toast.error("You must be logged in to create an address");
      return;
    }
    
    try {
      setIsCreatingAddress(true);
      
      // Create address data from form
      const addressData: AddressFormData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        isDefault: addresses.length === 0 // Make default if first address
      };
      
      const result = await createAddress(addressData);
      
      if (result.success && result.data) {
        toast.success("Address saved successfully");
        setAddresses([...addresses, result.data]);
        setSelectedAddressId(result.data.id);
      } else {
        toast.error(result.error || "Failed to save address");
      }
    } catch (error) {
      console.error("Error creating address:", error);
      toast.error("An error occurred while saving your address");
    } finally {
      setIsCreatingAddress(false);
    }
  }

  // Helper function to retry failed operations
  const retry = async <T,>(
    fn: () => Promise<T>,
    retries = 2,
    delay = 1000,
    onRetry?: (attempt: number, error: any) => void
  ): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0) throw error;
      
      if (onRetry) onRetry(retries, error);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 1.5, onRetry);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (activeStep === "shipping") {
      // Check if a user is logged in and an address is selected
      if (user && selectedAddressId) {
        // If a saved address is selected, we can proceed without validating the form fields
        setActiveStep("payment");
        return;
      }
      
      // For guest checkout or when no saved address is selected, validate all shipping information
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
          !formData.address || !formData.city || !formData.state || 
          !formData.postalCode || !formData.country) {
        toast.error("Please fill in all required shipping information");
        return;
      }
      
      // If user is logged in and no address is selected, create a new address
      if (user && !selectedAddressId && addresses.length === 0) {
        await handleCreateAddress();
      }
      
      setActiveStep("payment")
    } else if (activeStep === "payment") {
      // Validate payment information for card payments
      if (formData.paymentMethod === "card" && 
          (!formData.cardName || !formData.cardNumber || !formData.cardExpiry || !formData.cardCvc)) {
        toast.error("Please fill in all required payment information");
        return;
      }
      
      // Process order
      console.log("Processing order from form submit");
      await handleCreateOrder();
    }
  }

  const handleCreateOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    // For logged-in users, we need an address ID
    if (user && !selectedAddressId && addresses.length > 0) {
      toast.error("Please select a shipping address");
      return;
    }
    
    try {
      setIsCreatingOrder(true);
      toast.info("Processing your order...");
      
      // Only validate the form fields if no saved address is selected
      if (!user || !selectedAddressId) {
        // Validate required fields for new address
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
            !formData.address || !formData.city || !formData.state || 
            !formData.postalCode || !formData.country) {
          toast.error("Please fill in all required shipping information");
          setIsCreatingOrder(false);
          return;
        }
      }
      
      // Debug log cart items
      console.log("Cart items:", cartItems);
      
      // Get shipping address data - either from selected address or form data
      let shippingAddress;
      
      if (user && selectedAddressId) {
        // Get selected address for logged-in users
        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
        if (selectedAddress) {
          shippingAddress = {
            name: selectedAddress.name,
            phone: selectedAddress.phone,
            street: selectedAddress.address,
            city: selectedAddress.city,
            state: selectedAddress.state,
            postalCode: selectedAddress.postalCode,
            country: selectedAddress.country
          };
        }
      } else {
        // Use form data for guest checkout
        shippingAddress = {
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        };
      }
      
      if (!shippingAddress) {
        toast.error("Invalid shipping address information");
        setIsCreatingOrder(false);
        return;
      }
      
      // For cart items, use productId as product's ID for order creation
      // We may have cart items where id === productId from our CartContext change
      const orderItems = cartItems.map(item => ({
        productId: item.productId || item.id, // Use productId field first, fall back to id if needed
        name: item.name,
        price: item.discountedPrice || item.price,
        quantity: item.quantity
      }));
      
      console.log("Order items:", orderItems);
      
      if (orderItems.length === 0) {
        toast.error("Your cart is empty. Please add items before checking out.");
        return;
      }
      
      // Prepare order data
      const orderData: Partial<OrderFormData> = {
        items: orderItems,
        shippingAddress,
        email: formData.email,
        subtotal,
        shipping: shippingCost,
        discount,
        total: (total - discount) + shippingCost,
        paymentMethod: formData.paymentMethod,
        notes: ""
      };
      
      // Only add userId if user is logged in with a valid ID
      if (user?.id && /^[0-9a-fA-F]{24}$/.test(user.id)) {
        orderData.userId = user.id;
      }
      
      // Only add addressId if user is logged in and address is selected
      if (user && selectedAddressId && /^[0-9a-fA-F]{24}$/.test(selectedAddressId)) {
        orderData.addressId = selectedAddressId;
      }
      
      console.log("Sending order data:", JSON.stringify(orderData, null, 2));
      
      // Call createOrder directly first for better error visibility
      try {
        const result = await createOrder(orderData as OrderFormData);
        console.log("Order creation result:", result);
        
        if (result.success && result.data) {
          toast.success("Order placed successfully!");
          clearCart(); // Clear the cart after successful order
          router.push(`/checkout/confirmation?orderId=${result.data.id}`);
        } else {
          toast.error(result.error || "Failed to place order");
          console.error("Order creation failed:", result.error);
        }
      } catch (orderError) {
        console.error("Caught error during order creation:", orderError);
        toast.error(orderError instanceof Error ? orderError.message : "An unexpected error occurred");
      }
    } catch (error) {
      console.error("Error in handleCreateOrder:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred while placing your order");
    } finally {
      setIsCreatingOrder(false);
    }
  }

  const finalTotal = (total - discount) + shippingCost;

  if (isLoading || isLoadingShipping || isLoadingUser || isLoadingAddresses) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-green-700 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-green-700">Loading checkout information...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Redirect to cart if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-xl font-medium text-green-800 mb-2">Your cart is empty</h2>
            <p className="text-green-600 mb-6">Add some items to your cart before checking out.</p>
            <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 bg-green-50/30">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-green-700 hover:text-green-800 mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-green-800 mb-2">Checkout</h1>
            <p className="text-green-700">Complete your order by providing your shipping and payment details</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeStep} className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-6">
                <TabsTrigger
                  value="shipping"
                  onClick={() => setActiveStep("shipping")}
                  className="data-[state=active]:bg-green-700 data-[state=active]:text-white"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Shipping
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  onClick={() => setActiveStep("payment")}
                  className="data-[state=active]:bg-green-700 data-[state=active]:text-white"
                  disabled={activeStep === "shipping"}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment
                </TabsTrigger>
              </TabsList>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <TabsContent value="shipping" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-800">Shipping Information</CardTitle>
                      <CardDescription>Enter your details for delivery</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Address selection for logged-in users */}
                        {user && addresses.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-green-800">Select a Shipping Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {addresses.map((address) => (
                                <div
                                  key={address.id}
                                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                    selectedAddressId === address.id
                                      ? "border-green-500 bg-green-50 shadow-sm"
                                      : "border-gray-200 hover:border-green-300"
                                  }`}
                                  onClick={() => handleAddressSelect(address.id)}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-green-800">{address.name}</h4>
                                    <div className="flex flex-col items-end gap-1">
                                      {address.isDefault && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>
                                      )}
                                      {selectedAddressId === address.id && (
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Selected</span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-green-700">{address.phone}</p>
                                  <p className="text-sm text-green-700">{address.address}</p>
                                  <p className="text-sm text-green-700">
                                    {address.city}, {address.state} {address.postalCode}
                                  </p>
                                  <p className="text-sm text-green-700">{address.country}</p>
                                </div>
                              ))}
                            </div>
                            
                            {selectedAddressId && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                                <div className="flex justify-between items-center">
                                  <p className="text-blue-800 font-medium">
                                    Using selected address for shipping
                                  </p>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedAddressId("")}
                                    className="text-blue-600 border-blue-200 hover:bg-blue-100"
                                  >
                                    Change
                                  </Button>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-2">
                              <div className="h-px flex-1 bg-gray-200"></div>
                              <span className="text-sm text-gray-500">Or enter a new address</span>
                              <div className="h-px flex-1 bg-gray-200"></div>
                            </div>
                          </div>
                        )}

                        {/* Guest checkout message */}
                        {!user && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="text-blue-800 font-medium mb-2">Guest Checkout</h3>
                            <p className="text-blue-700 text-sm">
                              You're checking out as a guest. <Link href="/auth/login" className="text-blue-600 underline">Log in</Link> to use your saved addresses and earn rewards.
                            </p>
                          </div>
                        )}

                        {/* Shipping information form */}
                        <form onSubmit={handleSubmit} id="shipping-form">
                          <h3 className="text-lg font-medium text-green-800 mb-4">
                            {user && addresses.length > 0 
                              ? selectedAddressId 
                                ? "New Shipping Address (Optional)" 
                                : "New Shipping Address"
                              : "Shipping Information"}
                          </h3>
                          
                          {user && selectedAddressId && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                              <p className="text-sm text-green-700">
                                You've selected a saved address for delivery. Fields below are optional unless you want to create a new address.
                              </p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required={!user || !selectedAddressId}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required={!user || !selectedAddressId}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required={!user || !selectedAddressId}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required={!user || !selectedAddressId}
                              />
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              required={!user || !selectedAddressId}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input 
                                id="city" 
                                name="city" 
                                value={formData.city} 
                                onChange={handleInputChange} 
                                required={!user || !selectedAddressId} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state">State/Province</Label>
                              <Input
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                required={!user || !selectedAddressId}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label htmlFor="postalCode">Postal Code</Label>
                              <Input
                                id="postalCode"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                required={!user || !selectedAddressId}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="country">Country</Label>
                              <Select
                                value={formData.country}
                                onValueChange={(value) => handleSelectChange("country", value)}
                              >
                                <SelectTrigger id="country">
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pakistan">Pakistan</SelectItem>
                                  <SelectItem value="US">United States</SelectItem>
                                  <SelectItem value="UK">United Kingdom</SelectItem>
                                  <SelectItem value="CA">Canada</SelectItem>
                                  <SelectItem value="AU">Australia</SelectItem>
                                  <SelectItem value="AE">United Arab Emirates</SelectItem>
                                  <SelectItem value="SA">Saudi Arabia</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="col-span-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="saveInfo"
                                checked={formData.saveInfo}
                                onCheckedChange={handleCheckboxChange}
                                disabled={!user}
                              />
                              <Label htmlFor="saveInfo" className="text-sm text-green-700">
                                {user ? "Save this address for future orders" : "Create an account to save this address (requires login)"}
                              </Label>
                            </div>
                          </div>
                        </form>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex justify-between w-full">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => router.push("/cart")}
                        >
                          Back to Cart
                        </Button>
                        <Button 
                          type="submit"
                          form="shipping-form"
                          disabled={isLoadingUser || isLoadingAddresses || isLoadingShipping}
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="payment" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-800">Payment Method</CardTitle>
                      <CardDescription>Complete your purchase securely</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} id="payment-form">
                        <RadioGroup
                          value={formData.paymentMethod}
                          onValueChange={handleRadioChange}
                          className="space-y-4 mb-6"
                        >
                          <div className="flex items-center space-x-3 border p-4 rounded-md opacity-50 cursor-not-allowed">
                            <RadioGroupItem value="card" id="card" disabled />
                            <Label htmlFor="card" className="flex items-center">
                              <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                              Credit/Debit Card (Coming Soon)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 border p-4 rounded-md">
                            <RadioGroupItem value="cod" id="cod" />
                            <Label htmlFor="cod" className="flex items-center">
                              <Truck className="h-5 w-5 mr-2 text-green-700" />
                              Cash on Delivery
                            </Label>
                          </div>
                        </RadioGroup>

                        {formData.paymentMethod === "card" && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardName">Name on Card</Label>
                              <Input
                                id="cardName"
                                name="cardName"
                                value={formData.cardName}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input
                                id="cardNumber"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="cardExpiry">Expiry Date (MM/YY)</Label>
                                <Input
                                  id="cardExpiry"
                                  name="cardExpiry"
                                  value={formData.cardExpiry}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cardCvc">CVC</Label>
                                <Input
                                  id="cardCvc"
                                  name="cardCvc"
                                  value={formData.cardCvc}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center mt-6">
                          <Shield className="h-5 w-5 text-green-700 mr-2" />
                          <p className="text-sm text-green-700">Your payment information is secure and encrypted</p>
                        </div>
                        
                        {/* Hidden Submit Button for form submission */}
                        <button type="submit" className="hidden"></button>
                      </form>
                    </CardContent>
                    <CardFooter>
                      <div className="w-full space-y-2">
                        <Button
                          type="button"
                          onClick={() => {
                            console.log("Complete Order button clicked");
                            handleCreateOrder();
                          }}
                          className="w-full bg-green-700 hover:bg-green-800 text-white"
                          disabled={isCreatingOrder}
                        >
                          {isCreatingOrder ? "Processing Order..." : "Complete Order"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-green-700 text-green-700 hover:bg-green-50"
                          onClick={() => setActiveStep("shipping")}
                          disabled={isCreatingOrder}
                        >
                          Back to Shipping
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </motion.div>
            </Tabs>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-green-800 truncate">{item.name}</p>
                          <p className="text-sm text-green-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right text-green-700">
                          Rs. {((item.discountedPrice || item.price) * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-green-700">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-pink-500">
                        <span>Discount</span>
                        <span>- Rs. {discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-2 text-green-600" />
                        <span>Shipping</span>
                      </div>
                      <span>
                        {shippingCost === 0 
                          ? "Free" 
                          : `Rs. ${shippingCost.toLocaleString()}`}
                      </span>
                    </div>
                    {shippingMessage && (
                      <div className="text-sm text-green-600 italic text-right">
                        {shippingMessage}
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-green-800 text-lg">
                      <span>Total</span>
                      <span>Rs. {finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

