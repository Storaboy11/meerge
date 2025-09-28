"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastContainer } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export default function VerifyPage() {
  const [isResending, setIsResending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  const handleResendEmail = async () => {
    setIsResending(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setEmailSent(true)
      addToast({
        type: "success",
        title: "Verification email sent!",
        description: "Please check your inbox and spam folder.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to send email",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">Check your email</h2>
          <p className="mt-2 text-sm text-muted-foreground">We've sent a verification link to your email address</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">
              Click the link in your email to verify your account and start using Quick Market
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Email sent to your inbox</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Don't forget to check your spam or junk folder if you don't see the email in your inbox.
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleResendEmail}
                disabled={isResending || emailSent}
                variant="outline"
                className="w-full bg-transparent"
              >
                {isResending ? "Sending..." : emailSent ? "Email sent!" : "Resend verification email"}
              </Button>

              <div className="text-center">
                <Link href="/auth/login" className="text-sm text-primary hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="text-xs text-muted-foreground text-center space-y-2">
                <p>Having trouble?</p>
                <p>
                  Contact our support team at{" "}
                  <a href="mailto:support@quickmarket.com" className="text-primary hover:underline">
                    support@quickmarket.com
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}
