"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Users, ShoppingCart, CheckCircle, ArrowRight } from "lucide-react"
import { REFERRAL_REWARDS } from "@/lib/referral-types"

export default function JoinWithReferralPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [referralCode, setReferralCode] = useState<string>("")
  const [isValidCode, setIsValidCode] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.code) {
      setReferralCode(params.code as string)
      validateReferralCode(params.code as string)
    }
  }, [params.code])

  const validateReferralCode = async (code: string) => {
    try {
      setLoading(true)
      // In real implementation, validate the referral code
      // For now, we'll assume all codes are valid
      setIsValidCode(true)
    } catch (error) {
      setIsValidCode(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = () => {
    // Store referral code in localStorage for signup process
    localStorage.setItem("referralCode", referralCode)
    router.push("/auth/signup")
  }

  const handleSignIn = () => {
    router.push("/auth/signin")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating referral code...</p>
        </div>
      </div>
    )
  }

  if (isValidCode === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Referral Code</h2>
            <p className="text-gray-600 mb-6">The referral code you're trying to use is not valid or has expired.</p>
            <Button onClick={() => router.push("/")} className="bg-red-600 hover:bg-red-700">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Already Signed In</h2>
            <p className="text-gray-600 mb-6">
              You're already signed in to Quick Market. Start shopping to enjoy fresh groceries delivered to your door!
            </p>
            <Button onClick={() => router.push("/dashboard")} className="bg-red-600 hover:bg-red-700">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <Gift className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">Special Offer</Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Quick Market!</h1>
          <p className="text-xl text-gray-600 mb-2">
            You've been invited to join Lagos's favorite grocery delivery service
          </p>
          <p className="text-lg text-gray-500">
            Referral Code: <span className="font-bold text-red-600">{referralCode}</span>
          </p>
        </div>

        {/* Offer Details */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">
              Save {formatCurrency(REFERRAL_REWARDS.REFEREE_REWARD)} on Your First Order!
            </CardTitle>
            <CardDescription className="text-lg">
              Plus, help your friend earn {formatCurrency(REFERRAL_REWARDS.REFERRER_REWARD)} in credits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Join Quick Market</h3>
                <p className="text-gray-600">Create your account with the referral code</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Place Your Order</h3>
                <p className="text-gray-600">Shop for fresh groceries and get them delivered</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Gift className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Enjoy Savings</h3>
                <p className="text-gray-600">Get {formatCurrency(REFERRAL_REWARDS.REFEREE_REWARD)} off automatically</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Why Choose Quick Market?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Fresh groceries delivered in 2-4 hours</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Competitive prices with regular discounts</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Wide selection of local and imported products</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Flexible subscription plans</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Reliable delivery across Lagos</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 rounded-full p-1 flex-shrink-0">
                    <span className="block w-6 h-6 text-xs font-bold text-red-600 flex items-center justify-center">
                      1
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sign Up</h4>
                    <p className="text-gray-600 text-sm">Create your account in under 2 minutes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-red-100 rounded-full p-1 flex-shrink-0">
                    <span className="block w-6 h-6 text-xs font-bold text-red-600 flex items-center justify-center">
                      2
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Choose Location</h4>
                    <p className="text-gray-600 text-sm">Select your delivery area and subscription plan</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-red-100 rounded-full p-1 flex-shrink-0">
                    <span className="block w-6 h-6 text-xs font-bold text-red-600 flex items-center justify-center">
                      3
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Start Shopping</h4>
                    <p className="text-gray-600 text-sm">Browse products and place your first order</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="text-center">
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button
              onClick={handleSignUp}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg w-full sm:w-auto"
            >
              Sign Up & Save {formatCurrency(REFERRAL_REWARDS.REFEREE_REWARD)}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              onClick={handleSignIn}
              variant="outline"
              size="lg"
              className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 text-lg w-full sm:w-auto bg-transparent"
            >
              Already have an account? Sign In
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
