"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import type { Product } from "@/app/api/items/route"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string, quantity: number) => void
  isOrderWindowOpen: boolean
}

export function ProductCard({ product, onAddToCart, isOrderWindowOpen }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change)
    setQuantity(newQuantity)
  }

  const handleAddToCart = async () => {
    if (!isOrderWindowOpen || product.stockQty === 0 || product.availabilityStatus === "Out of Stock") {
      return
    }

    setIsAdding(true)
    try {
      console.log("[v0] Adding to cart:", product.id, quantity)
      onAddToCart(product.id, quantity)
      setQuantity(1) // Reset quantity after adding
      console.log("[v0] Successfully added to cart")
    } catch (error) {
      console.error("[v0] Error adding to cart:", error)
      try {
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        })
      } catch (toastError) {
        console.error("[v0] Toast error:", toastError)
      }
    } finally {
      setIsAdding(false)
    }
  }

  const handleProductClick = () => {
    router.push(`/product/${product.id}`)
  }

  const getStockStatus = () => {
    if (product.stockQty === 0) return { text: "Out of Stock", variant: "destructive" as const }
    if (product.stockQty < 20) return { text: "Low Stock", variant: "secondary" as const }
    return { text: "In Stock", variant: "default" as const }
  }

  const getAvailabilityColor = () => {
    switch (product.availabilityStatus) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Seasonal":
        return "bg-yellow-100 text-yellow-800"
      case "Out of Stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stockStatus = getStockStatus()
  const isDisabled = !isOrderWindowOpen || product.stockQty === 0 || product.availabilityStatus === "Out of Stock"

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        {/* Product Image */}
        <div
          className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
          onClick={handleProductClick}
        >
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {/* Availability Badge */}
          <Badge className={`absolute top-2 right-2 text-xs ${getAvailabilityColor()}`}>
            {product.availabilityStatus}
          </Badge>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div>
            <h3
              className="font-semibold text-sm line-clamp-2 text-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={handleProductClick}
            >
              {product.name}
            </h3>
            <Badge variant="outline" className="text-xs mt-1">
              {product.category}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-primary">₦{product.pricePerKg.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">per kg</p>
            </div>
            <Badge variant={stockStatus.variant} className="text-xs">
              {stockStatus.text}
            </Badge>
          </div>

          {/* Quantity Selector */}
          {!isDisabled && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || isAdding}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={isAdding}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button onClick={handleAddToCart} disabled={isDisabled || isAdding} className="w-full text-sm" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isAdding ? "Adding..." : isDisabled ? "Unavailable" : "Add to Cart"}
          </Button>

          {!isOrderWindowOpen && <p className="text-xs text-muted-foreground text-center">Order window closed</p>}
        </div>
      </CardContent>
    </Card>
  )
}
