"use client"

import { useState, useEffect } from "react"
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Trash2, FileDown, FileText } from "lucide-react"
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: number
  quantity: number
}

interface CustomerDetails {
  name: string
  email: string
  address: string
  phone: string
}

export function InvoiceDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    email: "",
    address: "",
    phone: ""
  })
  const [products, setProducts] = useState<Product[]>([
    { id: Date.now().toString(), name: "", price: 0, quantity: 1 }
  ])
  const [discount, setDiscount] = useState<number>(0)
  const [discountType, setDiscountType] = useState<"amount" | "percentage">("amount")
  const [advancePayment, setAdvancePayment] = useState<number>(0)
  
  const addProduct = () => {
    setProducts([...products, { id: Date.now().toString(), name: "", price: 0, quantity: 1 }])
  }
  
  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id))
    }
  }
  
  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ))
  }
  
  const calculateSubtotal = () => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0)
  }
  
  const calculateDiscount = () => {
    const subtotal = calculateSubtotal()
    if (discountType === "amount") {
      return discount > subtotal ? subtotal : discount
    } else {
      return subtotal * (discount / 100)
    }
  }
  
  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount()
  }
  
  const calculatePendingPayment = () => {
    return calculateTotal() - advancePayment
  }
  
  const generateInvoicePDF = async () => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([595.28, 841.89]) // A4 size
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      
      // First, we need to fetch the logo
      const logoResponse = await fetch('/placeholder-logo.png')
      const logoImageBytes = await logoResponse.arrayBuffer()
      const logoImage = await pdfDoc.embedPng(new Uint8Array(logoImageBytes))
      
      // Set up some variables for consistent spacing
      const pageWidth = page.getWidth()
      const pageHeight = page.getHeight()
      const margin = 50
      
      // Add gradient background to top portion
      // Since PDF-lib doesn't support gradients directly, we'll simulate it with multiple rectangles
      const headerHeight = 180
      for (let i = 0; i < headerHeight; i++) {
        const opacity = 0.05 - (i / headerHeight) * 0.05 // Fade out from top to bottom
        page.drawRectangle({
          x: 0,
          y: pageHeight - i - 1,
          width: pageWidth,
          height: 1,
          color: rgb(0.2, 0.6, 0.3),
          opacity: opacity
        })
      }
      
      // Draw a green accent bar on the left side
      page.drawRectangle({
        x: 0,
        y: 0,
        width: 20,
        height: pageHeight,
        color: rgb(0.2, 0.6, 0.3),
      })
      
      // Scale the logo to a fixed height and compute y position
      const desiredLogoHeight = 100
      const scaleFactor = desiredLogoHeight / logoImage.height
      const logoDims = logoImage.scale(scaleFactor)
      const logoY = pageHeight - margin - logoDims.height
      
      // Draw company logo on left
      page.drawImage(logoImage, {
        x: margin,
        y: logoY,
        width: logoDims.width,
        height: logoDims.height,
      })
      
      // Draw 'INVOICE' heading horizontally aligned with logo
      const headingSize = 32
      const headingX = margin + logoDims.width + 20
      // Center text vertically relative to logo
      const headingY = logoY + (logoDims.height - headingSize) / 2
      page.drawText('INVOICE', {
        x: headingX,
        y: headingY,
        size: headingSize,
        font: helveticaBold,
        color: rgb(0.2, 0.6, 0.3),
      })
      
      // Add horizontal line underneath the header
      page.drawLine({
        start: { x: margin, y: pageHeight - headerHeight + 20 },
        end: { x: pageWidth - margin, y: pageHeight - headerHeight + 20 },
        thickness: 1,
        color: rgb(0.2, 0.6, 0.3),
        opacity: 0.5,
      })
      
      // Date and Invoice Number - with more modern styling
      const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`
      
      // Invoice details box
      page.drawRectangle({
        x: pageWidth - 230,
        y: pageHeight - headerHeight - 50,
        width: 180,
        height: 70,
        color: rgb(0.2, 0.6, 0.3),
        opacity: 0.1,
        borderColor: rgb(0.2, 0.6, 0.3),
        borderWidth: 0.5,
      })
      
      page.drawText('Invoice Number:', {
        x: pageWidth - 220,
        y: pageHeight - headerHeight, // Adjusted higher
        size: 10,
        font: helveticaBold,
        color: rgb(0.2, 0.6, 0.3)
      })
      
      page.drawText(invoiceNumber, {
        x: pageWidth - 220,
        y: pageHeight - headerHeight - 12, // Adjusted higher
        size: 10,
        font: helveticaFont
      })
      
      page.drawText('Date:', {
        x: pageWidth - 220,
        y: pageHeight - headerHeight - 24, // Adjusted higher
        size: 10,
        font: helveticaBold,
        color: rgb(0.2, 0.6, 0.3)
      })
      
      page.drawText(date, {
        x: pageWidth - 220,
        y: pageHeight - headerHeight - 36, // Adjusted higher
        size: 10,
        font: helveticaFont
      })
      
      // Customer details section with enhanced styling
      const customerBoxTop = pageHeight - headerHeight - 100
      const customerBoxHeight = 120
      
      // Add "From" section - company info
      page.drawText('From:', {
        x: margin,
        y: customerBoxTop,
        size: 12,
        font: helveticaBold,
        color: rgb(0.2, 0.6, 0.3)
      })
      
      page.drawText('Bayt Organic', {
        x: margin,
        y: customerBoxTop - 20,
        size: 11,
        font: helveticaBold
      })
      
      page.drawText('Natural Organic Skin Care', {
        x: margin,
        y: customerBoxTop - 35,
        size: 10,
        font: helveticaFont
      })
      
      page.drawText('baytorganic@gmail.com', {
        x: margin,
        y: customerBoxTop - 50,
        size: 10,
        font: helveticaFont
      })
      
      page.drawText('+923180542636', {
        x: margin,
        y: customerBoxTop - 65,
        size: 10,
        font: helveticaFont
      })
      
      // Bill To section with subtle background
      page.drawRectangle({
        x: pageWidth / 2,
        y: customerBoxTop - customerBoxHeight + 20,
        width: (pageWidth / 2) - margin,
        height: customerBoxHeight,
        color: rgb(0.96, 0.98, 0.96),
        borderColor: rgb(0.2, 0.6, 0.3),
        borderWidth: 0.5,
        opacity: 0.9,
      })
      
      page.drawText('Bill To:', {
        x: (pageWidth / 2) + 15,
        y: customerBoxTop,
        size: 12,
        font: helveticaBold,
        color: rgb(0.2, 0.6, 0.3)
      })
      
      // Add customer details with bold name
      page.drawText(customerDetails.name, {
        x: (pageWidth / 2) + 15,
        y: customerBoxTop - 20,
        size: 11,
        font: helveticaBold
      })
      
      page.drawText(customerDetails.email, {
        x: (pageWidth / 2) + 15,
        y: customerBoxTop - 40,
        size: 10,
        font: helveticaFont
      })
      
      page.drawText(customerDetails.address, {
        x: (pageWidth / 2) + 15,
        y: customerBoxTop - 60,
        size: 10,
        font: helveticaFont
      })
      
      page.drawText(customerDetails.phone, {
        x: (pageWidth / 2) + 15,
        y: customerBoxTop - 80,
        size: 10,
        font: helveticaFont
      })
      
      // Products table with enhanced styling
      const tableTop = customerBoxTop - customerBoxHeight - 40
      const tableLeft = margin
      const tableRight = pageWidth - margin
      const tableWidth = tableRight - tableLeft
      
      // Table title
      page.drawText('Order Details', {
        x: tableLeft,
        y: tableTop + 30,
        size: 14,
        font: helveticaBold,
        color: rgb(0.2, 0.6, 0.3)
      })
      
      // Table header with rounded corners (simulated)
      page.drawRectangle({
        x: tableLeft,
        y: tableTop - 5,
        width: tableWidth,
        height: 30,
        color: rgb(0.2, 0.6, 0.3),
      })
      
      // Table headers - with white text
      const textColor = rgb(1, 1, 1) // White text
      
      page.drawText('Item', {
        x: tableLeft + 15,
        y: tableTop + 10,
        size: 11,
        font: helveticaBold,
        color: textColor
      })
      
      page.drawText('Qty', {
        x: tableLeft + tableWidth - 280,
        y: tableTop + 10,
        size: 11,
        font: helveticaBold,
        color: textColor
      })
      
      page.drawText('Price', {
        x: tableLeft + tableWidth - 180,
        y: tableTop + 10,
        size: 11,
        font: helveticaBold,
        color: textColor
      })
      
      page.drawText('Total', {
        x: tableLeft + tableWidth - 80,
        y: tableTop + 10,
        size: 11,
        font: helveticaBold,
        color: textColor
      })
      
      // Products with enhanced styling and alternating row colors
      let yPosition = tableTop - 25
      products.forEach((product, index) => {
        // Alternating row background for better readability
        if (index % 2 === 0) {
          page.drawRectangle({
            x: tableLeft,
            y: yPosition - 5,
            width: tableWidth,
            height: 30,
            color: rgb(0.96, 0.98, 0.96),
            opacity: 1,
          })
        }
        
        // Item details
        page.drawText(product.name, {
          x: tableLeft + 15,
          y: yPosition,
          size: 10,
          font: helveticaFont
        })
        
        page.drawText(product.quantity.toString(), {
          x: tableLeft + tableWidth - 270,
          y: yPosition,
          size: 10,
          font: helveticaFont
        })
        
        page.drawText(`Rs. ${product.price}`, {
          x: tableLeft + tableWidth - 180,
          y: yPosition,
          size: 10,
          font: helveticaFont
        })
        
        page.drawText(`Rs. ${(product.price * product.quantity)}`, {
          x: tableLeft + tableWidth - 80,
          y: yPosition,
          size: 10,
          font: helveticaFont
        })
        
        yPosition -= 30
      })
      
      // Summary section with improved styling
      const totalBoxTop = yPosition - 10
      const totalBoxWidth = 220
      
      // Draw a subtle line above the summary
      page.drawLine({
        start: { x: tableLeft, y: totalBoxTop + 20 },
        end: { x: tableRight, y: totalBoxTop + 20 },
        thickness: 0.5,
        color: rgb(0.7, 0.7, 0.7),
        opacity: 0.5,
      })
      
      // Summary box with subtle styling
      page.drawRectangle({
        x: tableRight - totalBoxWidth,
        y: totalBoxTop - 140, // Increased height for additional fields
        width: totalBoxWidth,
        height: 150, // Increased height
        color: rgb(0.98, 0.98, 0.98),
        borderColor: rgb(0.2, 0.6, 0.3),
        borderWidth: 0.5,
        opacity: 0.8,
      })
      
      // Subtotal without decimals
      page.drawText('Subtotal:', {
        x: tableRight - totalBoxWidth + 15,
        y: totalBoxTop,
        size: 10,
        font: helveticaFont
      })
      
      page.drawText(`Rs. ${calculateSubtotal()}`, {
        x: tableRight - 80,
        y: totalBoxTop,
        size: 10,
        font: helveticaFont
      })
      
      // Discount without decimals
      page.drawText(`Discount (${discountType === 'percentage' ? discount + '%' : 'Rs. ' + discount}):`, {
        x: tableRight - totalBoxWidth + 15,
        y: totalBoxTop - 25,
        size: 10,
        font: helveticaFont
      })
      
      page.drawText(`Rs. ${calculateDiscount()}`, {
        x: tableRight - 80,
        y: totalBoxTop - 25,
        size: 10,
        font: helveticaFont
      })
      
      // Line before total
      page.drawLine({
        start: { x: tableRight - totalBoxWidth + 15, y: totalBoxTop - 40 },
        end: { x: tableRight - 15, y: totalBoxTop - 40 },
        thickness: 0.5,
        color: rgb(0.7, 0.7, 0.7),
      })
      
      // Total amount
      page.drawText('Total:', {
        x: tableRight - totalBoxWidth + 15,
        y: totalBoxTop - 60,
        size: 12,
        font: helveticaBold
      })
      
      page.drawText(`Rs. ${calculateTotal()}`, {
        x: tableRight - 80,
        y: totalBoxTop - 60,
        size: 12,
        font: helveticaBold
      })
      
      // Advance Payment
      page.drawText('Advance Payment:', {
        x: tableRight - totalBoxWidth + 15,
        y: totalBoxTop - 85,
        size: 10,
        font: helveticaFont
      })
      
      page.drawText(`Rs. ${advancePayment}`, {
        x: tableRight - 80,
        y: totalBoxTop - 85,
        size: 10,
        font: helveticaFont
      })
      
      // Line before pending amount
      page.drawLine({
        start: { x: tableRight - totalBoxWidth + 15, y: totalBoxTop - 100 },
        end: { x: tableRight - 15, y: totalBoxTop - 100 },
        thickness: 0.5,
        color: rgb(0.7, 0.7, 0.7),
      })
      
      // Total with highlighted background for pending payment
      page.drawRectangle({
        x: tableRight - totalBoxWidth,
        y: totalBoxTop - 140,
        width: totalBoxWidth,
        height: 40,
        color: rgb(0.2, 0.6, 0.3),
      })
      
      page.drawText('Pending Payment:', {
        x: tableRight - totalBoxWidth + 15,
        y: totalBoxTop - 120,
        size: 14,
        font: helveticaBold,
        color: rgb(1, 1, 1) // White text
      })
      
      page.drawText(`Rs. ${calculatePendingPayment()}`, {
        x: tableRight - 80,
        y: totalBoxTop - 120,
        size: 14,
        font: helveticaBold,
        color: rgb(1, 1, 1) // White text
      })
      
      // Modern footer design
      const footerTop = 130
      
      // Design element - small green square
      page.drawRectangle({
        x: margin,
        y: footerTop + 50,
        width: 10,
        height: 10,
        color: rgb(0.2, 0.6, 0.3),
      })
      
      // Footer heading with design element
      page.drawText('Thank you for your business!', {
        x: margin + 20,
        y: footerTop + 45,
        size: 14,
        font: helveticaBold,
        color: rgb(0.2, 0.6, 0.3)
      })
      
      // Footer text
      page.drawText('We appreciate your trust in our organic products.', {
        x: margin,
        y: footerTop + 20,
        size: 10,
        font: helveticaFont
      })
      
      page.drawText('Questions? Contact us at baytorganic@gmail.com', {
        x: margin,
        y: footerTop,
        size: 10,
        font: helveticaFont
      })
      
      // Website URL at bottom
      page.drawText('www.baytorganic.com', {
        x: pageWidth / 2 - 50,
        y: 50,
        size: 10,
        font: helveticaFont,
        color: rgb(0.2, 0.6, 0.3)
      })
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save()
      
      // Create blob and download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${invoiceNumber}-${customerDetails.name.replace(/\s+/g, '-')}.pdf`
      link.click()
      
      // Close the dialog
      setIsOpen(false)
      
      // Show success toast
      toast.success("Invoice generated successfully")
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error("Failed to generate invoice. Please try again.")
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <FileText className="h-4 w-4 mr-1" /> Generate Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Invoice</DialogTitle>
          <DialogDescription>
            Create an invoice by adding customer details and products.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div>
            <h3 className="text-lg font-medium mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Name</Label>
                <Input 
                  id="customerName" 
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                  placeholder="Customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input 
                  id="customerEmail" 
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                  placeholder="customer@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerAddress">Address</Label>
                <Input 
                  id="customerAddress" 
                  value={customerDetails.address}
                  onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                  placeholder="Customer address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone</Label>
                <Input 
                  id="customerPhone" 
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                  placeholder="Customer phone"
                />
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Products</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addProduct}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </div>
            
            {products.map((product, index) => (
              <Card key={product.id} className="mb-4">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-5 space-y-2">
                      <Label htmlFor={`product-${index}-name`}>Product Name</Label>
                      <Input 
                        id={`product-${index}-name`} 
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                        placeholder="Product name"
                        required
                      />
                    </div>
                    <div className="col-span-6 md:col-span-3 space-y-2">
                      <Label htmlFor={`product-${index}-price`}>Price (Rs.)</Label>
                      <Input 
                        id={`product-${index}-price`} 
                        type="number"
                        min="0"
                        value={product.price || ''}
                        onChange={(e) => updateProduct(product.id, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2 space-y-2">
                      <Label htmlFor={`product-${index}-quantity`}>Quantity</Label>
                      <Input 
                        id={`product-${index}-quantity`} 
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => updateProduct(product.id, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    <div className="col-span-2 flex items-end justify-end">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500"
                        onClick={() => removeProduct(product.id)}
                        disabled={products.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove product</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Discount</h3>
              <div className="flex flex-col md:flex-row items-end gap-4">
                <div className="space-y-2 w-full md:w-1/2">
                  <Label htmlFor="discountType">Type</Label>
                  <Select 
                    value={discountType} 
                    onValueChange={(value) => setDiscountType(value as 'amount' | 'percentage')}
                  >
                    <SelectTrigger id="discountType">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amount">Fixed Amount (Rs.)</SelectItem>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 w-full md:w-1/2">
                  <Label htmlFor="discountValue">Value</Label>
                  <Input 
                    id="discountValue" 
                    type="number"
                    min="0"
                    value={discount || ''}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    placeholder={discountType === 'amount' ? 'Rs.' : '%'}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Advance Payment</h3>
              <div className="space-y-2">
                <Label htmlFor="advancePayment">Amount (Rs.)</Label>
                <Input 
                  id="advancePayment" 
                  type="number"
                  min="0"
                  value={advancePayment || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    // Ensure advance payment doesn't exceed total
                    const total = calculateTotal();
                    setAdvancePayment(value > total ? total : value);
                  }}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-medium mb-2">
              <span>Subtotal:</span>
              <span>Rs. {calculateSubtotal()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discount:</span>
              <span>Rs. {calculateDiscount()}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-green-700 mb-4">
              <span>Total:</span>
              <span>Rs. {calculateTotal()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Advance Payment:</span>
              <span>Rs. {advancePayment}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-red-700 border-t pt-3">
              <span>Pending Payment:</span>
              <span>Rs. {calculatePendingPayment()}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            className="bg-green-700 hover:bg-green-800 text-white" 
            onClick={generateInvoicePDF}
            disabled={!customerDetails.name || products.some(p => !p.name)}
          >
            <FileDown className="h-4 w-4 mr-2" /> Generate Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 