import { type ReactNode, useState, useEffect } from "react"
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  RotateCcw,
  Menu,
  X,
  Bell,
  Package,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getOrders } from "@/data/mock-data"
import { toast } from "sonner"

interface LayoutProps {
  children: ReactNode
  currentPage: string
  onNavigate: (route: { page: string; orderId?: string }) => void
}

const navItems = [
  { page: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "orders", label: "Orders", icon: ShoppingCart },
  { page: "shipments", label: "Shipments", icon: Truck },
  { page: "returns", label: "Returns", icon: RotateCcw },
]

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [newOrderCount, setNewOrderCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const orders = getOrders()
      const recentOrders = orders.filter((o) => {
        const diff = Date.now() - new Date(o.orderDate).getTime()
        return diff < 3600000
      })
      if (recentOrders.length > newOrderCount && newOrderCount > 0) {
        toast.success("New order received!", {
          description: `Order ${recentOrders[0]?.orderNumber}`,
        })
      }
      setNewOrderCount(recentOrders.length)
    }, 30000)
    return () => clearInterval(interval)
  }, [newOrderCount])

  const pendingOrders = getOrders().filter(
    (o) => o.fulfillmentStatus === "Unfulfilled",
  ).length

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2 p-6 border-b">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold">OrderFlow</h1>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                onNavigate({ page: item.page })
                setSidebarOpen(false)
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                currentPage === item.page || (currentPage === "order-detail" && item.page === "orders")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.page === "orders" && pendingOrders > 0 && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "ml-auto text-xs",
                    currentPage === "orders" || currentPage === "order-detail"
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "",
                  )}
                >
                  {pendingOrders}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-card flex items-center justify-between px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {pendingOrders > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {pendingOrders}
              </span>
            )}
          </Button>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
