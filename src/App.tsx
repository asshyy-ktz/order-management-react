import { useState } from "react"
import { Layout } from "./components/Layout"
import { Dashboard } from "./features/dashboard/Dashboard"
import { OrderList } from "./features/orders/OrderList"
import { OrderDetail } from "./features/orders/OrderDetail"
import { ShipmentList } from "./features/shipments/ShipmentList"
import { ReturnList } from "./features/returns/ReturnList"

type Route =
  | { page: "dashboard" }
  | { page: "orders" }
  | { page: "order-detail"; orderId: string }
  | { page: "shipments" }
  | { page: "returns" }

export function App() {
  const [route, setRoute] = useState<Route>({ page: "dashboard" })

  const navigate = (r: Route) => setRoute(r)

  const renderPage = () => {
    switch (route.page) {
      case "dashboard":
        return <Dashboard />
      case "orders":
        return (
          <OrderList
            onViewOrder={(id) => navigate({ page: "order-detail", orderId: id })}
          />
        )
      case "order-detail":
        return (
          <OrderDetail
            orderId={route.orderId}
            onBack={() => navigate({ page: "orders" })}
          />
        )
      case "shipments":
        return <ShipmentList />
      case "returns":
        return <ReturnList />
    }
  }

  return (
    <Layout currentPage={route.page} onNavigate={navigate}>
      {renderPage()}
    </Layout>
  )
}
