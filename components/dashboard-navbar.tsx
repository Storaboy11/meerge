"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ChevronDown, Bell, ShoppingCart, User, Package } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchBar } from "@/components/search-bar"

interface DashboardNavbarProps {
  selectedLocation: string
  cartItemCount: number
}

export function DashboardNavbar({ selectedLocation, cartItemCount }: DashboardNavbarProps) {
  const router = useRouter()
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await fetch("/api/notifications/unread-count")
        const data = await response.json()
        if (data.success) {
          setNotificationCount(data.data.unreadCount)
        }
      } catch (error) {
        console.error("Error fetching notification count:", error)
      }
    }

    fetchNotificationCount()

    const interval = setInterval(fetchNotificationCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    } else {
      router.push("/")
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer">Quick Market</h1>
            </Link>
          </div>

          {/* Location Indicator */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Delivering to</span>
            <span className="font-medium text-foreground">{selectedLocation}</span>
          </div>

          {/* Enhanced Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <SearchBar
              onSearch={handleSearchSubmit}
              placeholder="Search for products..."
              showVoiceSearch={true}
              className="w-full"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative" onClick={() => router.push("/notifications")}>
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative" onClick={() => router.push("/cart")}>
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </Badge>
              )}
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/orders")}>
                  <Package className="mr-2 h-4 w-4" />
                  Order History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/notifications")}>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                  {notificationCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/select-location")}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Change Location
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Location Indicator */}
        <div className="md:hidden flex items-center justify-center space-x-2 text-sm text-muted-foreground pb-2">
          <MapPin className="h-4 w-4" />
          <span>Delivering to</span>
          <span className="font-medium text-foreground">{selectedLocation}</span>
        </div>
      </div>
    </nav>
  )
}
