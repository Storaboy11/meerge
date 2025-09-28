"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

type AuthState = "signin" | "signup" | "verification"

interface SignUpData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

interface SignInData {
  email: string
  password: string
  rememberMe: boolean
}

export default function AuthPage() {
  const [authState, setAuthState] = useState<AuthState>("signin")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const { toast } = useToast()

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState<SignUpData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  // Sign In Form State
  const [signInData, setSignInData] = useState<SignInData>({
    email: "",
    password: "",
    rememberMe: false,
  })

  // Form Validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateSignUp = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!signUpData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!signUpData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!signUpData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!signUpData.password) {
      newErrors.password = "Password is required"
    } else if (signUpData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!signUpData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms of Service"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateSignIn = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!signInData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!signInData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSignUp()) return

    setIsLoading(true)

    // Mock API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setUserEmail(signUpData.email)
      setAuthState("verification")
      toast({
        title: "Account created successfully!",
        description: "Please check your email for verification code.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSignIn()) return

    setIsLoading(true)

    // Mock API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      })

      // Redirect to dashboard or home page
      window.location.href = "/"
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()

    if (verificationCode.length !== 6) {
      setErrors({ code: "Please enter a 6-digit verification code" })
      return
    }

    setIsLoading(true)

    // Mock API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Email verified successfully!",
        description: "Your account is now active. Welcome to Quick Market!",
      })

      // Redirect to dashboard or home page
      window.location.href = "/"
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Verification code sent!",
        description: "Please check your email for the new code.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderSignUpForm = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
        <CardDescription className="text-gray-600">Join Quick Market and start saving on groceries</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={signUpData.firstName}
                onChange={(e) => setSignUpData((prev) => ({ ...prev, firstName: e.target.value }))}
                className={errors.firstName ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={signUpData.lastName}
                onChange={(e) => setSignUpData((prev) => ({ ...prev, lastName: e.target.value }))}
                className={errors.lastName ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={signUpData.email}
              onChange={(e) => setSignUpData((prev) => ({ ...prev, email: e.target.value }))}
              className={errors.email ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={signUpData.password}
                onChange={(e) => setSignUpData((prev) => ({ ...prev, password: e.target.value }))}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={signUpData.confirmPassword}
                onChange={(e) => setSignUpData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeToTerms"
              checked={signUpData.agreeToTerms}
              onCheckedChange={(checked) => setSignUpData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))}
              disabled={isLoading}
            />
            <Label htmlFor="agreeToTerms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
            </Label>
          </div>
          {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthState("signin")}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  const renderSignInForm = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
        <CardDescription className="text-gray-600">Sign in to your Quick Market account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={signInData.email}
              onChange={(e) => setSignInData((prev) => ({ ...prev, email: e.target.value }))}
              className={errors.email ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={signInData.password}
                onChange={(e) => setSignInData((prev) => ({ ...prev, password: e.target.value }))}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={signInData.rememberMe}
                onCheckedChange={(checked) => setSignInData((prev) => ({ ...prev, rememberMe: checked as boolean }))}
                disabled={isLoading}
              />
              <Label htmlFor="rememberMe" className="text-sm">
                Remember me
              </Label>
            </div>
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthState("signup")}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  const renderVerificationForm = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Check Your Email</CardTitle>
        <CardDescription className="text-gray-600">
          We've sent a 6-digit verification code to <span className="font-medium text-gray-900">{userEmail}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerification} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verificationCode">Verification Code</Label>
            <Input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                setVerificationCode(value)
                setErrors({})
              }}
              placeholder="Enter 6-digit code"
              className={`text-center text-lg tracking-widest ${errors.code ? "border-red-500" : ""}`}
              disabled={isLoading}
              maxLength={6}
            />
            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Resend Code
              </button>
            </p>
            <button
              type="button"
              onClick={() => setAuthState("signin")}
              className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-900 mx-auto"
              disabled={isLoading}
            >
              <ArrowLeft size={16} />
              <span>Back to Sign In</span>
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {authState === "signin" && renderSignInForm()}
        {authState === "signup" && renderSignUpForm()}
        {authState === "verification" && renderVerificationForm()}
      </div>
    </div>
  )
}
