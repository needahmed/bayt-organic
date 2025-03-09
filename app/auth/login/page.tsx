"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      rememberMe: checked,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Login attempt with:", formData.email, formData.password)

      // For now, we'll use a simple check for "admin" credentials
      if (formData.email === "admin" && formData.password === "admin") {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log("Login successful, storing auth state...")

        // Store auth state in localStorage
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userRole", "admin")

        console.log("Auth state stored, redirecting to dashboard...")

        // Redirect to admin dashboard with a small delay to ensure localStorage is set
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 100)
      } else {
        setError("Invalid credentials. Try using 'admin' for both username and password.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50/50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/placeholder-logo.png"
              alt="Bayt Organic"
              width={150}
              height={75}
              className="h-16 w-auto mx-auto"
            />
          </Link>
          <h1 className="font-playfair text-2xl font-bold text-green-800 mt-4">Welcome Back</h1>
          <p className="text-green-700">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-800">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Username or Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your username or email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="text-sm text-pink-500 hover:text-pink-600">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" checked={formData.rememberMe} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="rememberMe" className="text-sm text-green-700 cursor-pointer">
                  Remember me
                </Label>
              </div>

              <Button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-green-700">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-pink-500 hover:text-pink-600 font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-sm text-green-700">
          <p>For demo purposes, use:</p>
          <p className="font-medium">Username: admin</p>
          <p className="font-medium">Password: admin</p>
        </div>
      </motion.div>
    </div>
  )
}

