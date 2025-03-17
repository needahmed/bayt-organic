"use client"

import { useState, useEffect } from "react"
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
import { getDiscounts, deleteDiscount } from "@/app/actions/discounts.action"
import { toast } from "sonner"
import { DiscountType } from "@prisma/client"

// Define Discount type
interface Discount {
  id: string;
  code: string;
  description: string | null;
  type: DiscountType;
  value: number;
  minAmount: number | null;
  maxAmount: number | null;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function DiscountsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([])
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch discounts from the database
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setIsLoading(true)
        const result = await getDiscounts()
        
        if (result.success) {
          setDiscounts(result.data || [])
        } else {
          toast.error(result.error || "Failed to load discounts")
        }
      } catch (error) {
        console.error("Error fetching discounts:", error)
        toast.error("An error occurred while loading discounts")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiscounts()
  }, [])

  const filteredDiscounts = discounts.filter(
    (discount) =>
      discount.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (discount.description && discount.description.toLowerCase().includes(searchQuery.toLowerCase())),
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

  // Helper function to format dates
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Helper function to check if a discount is expired
  const isExpired = (discount: Discount) => {
    return new Date(discount.endDate) < new Date();
  }

  // Helper function to get discount status
  const getDiscountStatus = (discount: Discount) => {
    if (!discount.isActive) return "Inactive";
    if (isExpired(discount)) return "Expired";
    if (new Date(discount.startDate) > new Date()) return "Scheduled";
    return "Active";
  }

  // Add delete discount function
  const handleDeleteDiscount = async (id: string) => {
    if (confirm("Are you sure you want to delete this discount?")) {
      try {
        const result = await deleteDiscount(id);
        
        if (result.success) {
          toast.success("Discount deleted successfully");
          // Refresh the discounts list
          const refreshResult = await getDiscounts();
          if (refreshResult.success) {
            setDiscounts(refreshResult.data || []);
          }
        } else {
          toast.error(result.error || "Failed to delete discount");
        }
      } catch (error) {
        console.error("Error deleting discount:", error);
        toast.error("An error occurred while deleting the discount");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Discounts</h1>
          <p className="text-muted-foreground">Create and manage discount codes</p>
        </div>
        <Button
          className="bg-green-700 hover:bg-green-800 text-white"
          onClick={() => router.push("/admin/discounts/add")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Discount
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search discounts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      data-state={isPartiallySelected ? "indeterminate" : isAllSelected ? "checked" : "unchecked"}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Min. Order</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                        <span>Loading discounts...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredDiscounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No discounts found.
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
                      <TableCell>{discount.type === "PERCENTAGE" ? "Percentage" : "Fixed Amount"}</TableCell>
                      <TableCell>
                        {discount.type === "PERCENTAGE" ? `${discount.value}%` : `Rs. ${discount.value}`}
                      </TableCell>
                      <TableCell>{discount.minAmount ? `Rs. ${discount.minAmount}` : "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{formatDate(discount.startDate)} - {formatDate(discount.endDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            getDiscountStatus(discount) === "Active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : getDiscountStatus(discount) === "Scheduled"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          }
                        >
                          {getDiscountStatus(discount)}
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/discounts/edit-discount?id=${discount.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(discount.code)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteDiscount(discount.id)}
                            >
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

