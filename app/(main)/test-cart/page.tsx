'use client'

import { useCart } from '@/app/context/CartContext'
import { Button } from '@/components/ui/button'

export default function TestCartPage() {
  const { cartItems, addItem, itemCount } = useCart()

  const handleAddTestItem = () => {
    addItem({
      productId: 'test-product',
      name: 'Test Product',
      price: 1000,
      quantity: 1,
      image: '/placeholder.svg',
      weight: '100g'
    })
  }

  return (
    <div className="container mx-auto py-24">
      <h1 className="text-2xl font-bold mb-4">Test Cart Page</h1>
      <p className="mb-4">Current items in cart: {itemCount}</p>
      <Button onClick={handleAddTestItem}>Add Test Item</Button>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Cart Items:</h2>
        {cartItems.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li key={item.id} className="p-4 border rounded">
                <p><strong>{item.name}</strong> - Quantity: {item.quantity}</p>
                <p>Price: Rs. {item.price}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
} 