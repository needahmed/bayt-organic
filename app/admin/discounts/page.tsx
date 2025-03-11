"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, MoreHorizontal, Edit, Trash, Copy, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

// Sample discounts data
const discounts = [
  {
    id: 1,
    code: "WELCOME10",
    description: "10% off for new customers",
    type: "Percentage",
    value: 10,
    minOrderValue: 0,
    applicableTo: "All Products",
    usageLimit: 1,
    usageCount: 45,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "Active",
  },
  {
    id: 2,
    code: "SUMMER20",
    description: "20% off summer collection",
    type: "Percentage",
    value: 20,
    minOrderValue: 1500,
    applicableTo: "Collection: Summer Essentials",
    usageLimit: 0,
    usageCount: 78,
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    status: "Active",
  },
  {
    id: 3,
    code: "FREESHIP",
    description: "Free shipping on all orders",
    type: "Fixed Amount",
    value: 150,
    minOrderValue: 2000,
    applicableTo: "Shipping",
    usageLimit: 0,
    usageCount: 120,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "Active",
  },
  {
    id: 4,
    code: "SOAP15",
    description: "15% off all soaps",
    type: "Percentage",
    value: 15,
    minOrderValue: 0,
    applicableTo: "Category: Soaps",
    usageLimit: 0,
    usageCount: 32,
    startDate: "2023-05-01",
    endDate: "2023-07-31",
    status: "Expired",
  },
  {
    id: 5,
    code: "HOLIDAY500",
    description: "Rs. 500 off on orders above Rs. 3000",
    type: "Fixed Amount",
    value: 500,
    minOrderValue: 3000,
    applicableTo: "All Products",
    usageLimit: 0,
    usageCount: 0,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    status: "Scheduled",
  },
]

export default function DiscountsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([])

  const filteredDiscounts = discounts.filter(
    (discount) =>
      discount.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discount.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDiscounts(filteredDiscounts.map((discount) => discount.id.toString()))
    } else {
      setSelectedDiscounts([])
    }
  }

  const handleSelectDiscount = (checked: boolean, discountId: string) => {
    if (checked) {
      setSelectedDiscounts([...selectedDiscounts, discountId])
    } else {
      setSelectedDiscounts(selectedDiscounts.filter((id) => id !== discountId))
    }
  }

  const isAllSelected = filteredDiscounts.length > 0 && selectedDiscounts.length === filteredDiscounts.length
  const isPartiallySelected = selectedDiscounts.length > 0 && !isAllSelected

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Discounts</h1>
          <p className="text-muted-foreground">Create and manage discount codes</p>
        </div>
        <Button
          className="bg-green-700 hover:bg-green-800 text-white"
          onClick={() => router.push("/admin/discounts/add")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Discount
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search discounts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      // @ts-ignore - indeterminate is not in the type but works in the component
                      indeterminate={isPartiallySelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Min. Order</TableHead>
                  <TableHead>Applicable To</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiscounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No discounts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDiscounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDiscounts.includes(discount.id.toString())}
                          onCheckedChange={(checked: boolean) => handleSelectDiscount(checked, discount.id.toString())}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{discount.code}</TableCell>
                      <TableCell className="max-w-xs truncate">{discount.description}</TableCell>
                      <TableCell>{discount.type}</TableCell>
                      <TableCell>
                        {discount.type === "Percentage" ? `${discount.value}%` : `Rs. ${discount.value}`}
                      </TableCell>
                      <TableCell>{discount.minOrderValue > 0 ? `Rs. ${discount.minOrderValue}` : "-"}</TableCell>
                      <TableCell className="max-w-xs truncate">{discount.applicableTo}</TableCell>
                      <TableCell>
                        {discount.usageCount} / {discount.usageLimit > 0 ? discount.usageLimit : "∞"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            discount.status === "Active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : discount.status === "Scheduled"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {discount.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/admin/discounts/edit/${discount.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              Adjust Dates
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

