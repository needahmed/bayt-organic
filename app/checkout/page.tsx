"use client"

import { useState } from "react"
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
import { ChevronLeft, CreditCard, Truck, Shield } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState("shipping")
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
    paymentMethod: "card",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCheckboxChange = (checked) => {
    setFormData({
      ...formData,
      saveInfo: checked,
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleRadioChange = (value) => {
    setFormData({
      ...formData,
      paymentMethod: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (activeStep === "shipping") {
      setActiveStep("payment")
    } else if (activeStep === "payment") {
      // Process payment and redirect to confirmation
      router.push("/checkout/confirmation")
    }
  }

  const cartItems = [
    {
      id: 1,
      name: "Honey & Oats Body Soap",
      price: 1000,
      quantity: 2,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      name: "Coconut Milk Shampoo Bar",
      price: 1200,
      quantity: 1,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 3,
      name: "Anti-Aging Face Serum",
      price: 1500,
      quantity: 1,
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const discount = 0 // No discount in this example
  const shipping = subtotal > 2000 ? 0 : 150
  const total = subtotal - discount + shipping

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
                      <form onSubmit={handleSubmit} id="shipping-form">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
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
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
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
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State/Province</Label>
                            <Input
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
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
                              required
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
                                <SelectItem value="India">India</SelectItem>
                                <SelectItem value="UAE">UAE</SelectItem>
                                <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-6">
                          <Checkbox id="saveInfo" checked={formData.saveInfo} onCheckedChange={handleCheckboxChange} />
                          <Label htmlFor="saveInfo" className="text-green-700">
                            Save this information for next time
                          </Label>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type="submit" form="shipping-form" className="bg-green-700 hover:bg-green-800 text-white">
                        Continue to Payment
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="payment" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-800">Payment Method</CardTitle>
                      <CardDescription>Choose how you want to pay</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} id="payment-form">
                        <RadioGroup
                          value={formData.paymentMethod}
                          onValueChange={handleRadioChange}
                          className="space-y-4 mb-6"
                        >
                          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-green-50 cursor-pointer">
                            <RadioGroupItem value="card" id="card" className="text-green-700" />
                            <Label htmlFor="card" className="flex-1 cursor-pointer">
                              <div className="font-medium text-green-800">Credit/Debit Card</div>
                              <div className="text-sm text-green-600">Pay securely with your card</div>
                            </Label>
                            <div className="flex space-x-1">
                              <div className="w-10 h-6 bg-blue-600 rounded"></div>
                              <div className="w-10 h-6 bg-red-500 rounded"></div>
                              <div className="w-10 h-6 bg-yellow-400 rounded"></div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-green-50 cursor-pointer">
                            <RadioGroupItem value="cod" id="cod" className="text-green-700" />
                            <Label htmlFor="cod" className="flex-1 cursor-pointer">
                              <div className="font-medium text-green-800">Cash on Delivery</div>
                              <div className="text-sm text-green-600">Pay when you receive your order</div>
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
                                placeholder="1234 5678 9012 3456"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="cardExpiry">Expiration Date</Label>
                                <Input
                                  id="cardExpiry"
                                  name="cardExpiry"
                                  value={formData.cardExpiry}
                                  onChange={handleInputChange}
                                  placeholder="MM/YY"
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
                                  placeholder="123"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-6 flex items-center space-x-2 text-green-700">
                          <Shield className="h-5 w-5" />
                          <span className="text-sm">Your payment information is secure and encrypted</span>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        className="border-green-700 text-green-700 hover:bg-green-50"
                        onClick={() => setActiveStep("shipping")}
                      >
                        Back to Shipping
                      </Button>
                      <Button type="submit" form="payment-form" className="bg-green-700 hover:bg-green-800 text-white">
                        Complete Order
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </motion.div>
            </Tabs>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-green-800 line-clamp-1">{item.name}</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Qty: {item.quantity}</span>
                        <span className="text-green-700 font-medium">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

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
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString()}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-green-800">
                    <span>Total</span>
                    <span>Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-green-50 flex flex-col items-start text-sm text-green-700 space-y-2">
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  <span>Free shipping on orders over Rs. 2000</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Secure checkout</span>
                </div>
              </CardFooter>
            </Card>

            <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-green-800 mb-2">Need Help?</h3>
              <p className="text-sm text-green-700 mb-2">
                Our customer service team is here to help you with any questions about your order.
              </p>
              <Link href="/contact" className="text-sm text-pink-500 hover:text-pink-600 font-medium">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

