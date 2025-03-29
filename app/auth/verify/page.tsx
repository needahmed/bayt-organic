"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token provided.")
      return
    }

    const verifyEmail = async () => {
      try {
        // Call the verification API
        const response = await fetch(`/api/auth/verify?token=${token}`)
        const data = await response.json()

        if (!response.ok) {
          setStatus("error")
          setMessage(data.error || "Failed to verify email.")
        } else {
          setStatus("success")
          setMessage("Your email has been successfully verified.")
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/auth/login?verified=true")
          }, 3000)
        }
      } catch (error) {
        setStatus("error")
        setMessage("An error occurred during verification.")
      }
    }

    verifyEmail()
  }, [token, router])

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
          <h1 className="font-playfair text-2xl font-bold text-green-800 mt-4">Email Verification</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-800">Verify Your Email</CardTitle>
            <CardDescription>Confirming your email address</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            {status === "verifying" && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
                <p>Verifying your email address...</p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
                <p className="text-green-700">{message}</p>
                <p className="text-sm text-gray-500">Redirecting to login page...</p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <XCircle className="h-12 w-12 text-red-500" />
                <p className="text-red-500">{message}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {status === "error" && (
              <div className="space-y-4 w-full">
                <Button
                  onClick={() => router.push("/auth/signup")}
                  variant="outline"
                  className="w-full"
                >
                  Back to Sign Up
                </Button>
                <Button
                  onClick={() => router.push("/auth/login")}
                  className="w-full bg-green-700 hover:bg-green-800 text-white"
                >
                  Go to Sign In
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
} 