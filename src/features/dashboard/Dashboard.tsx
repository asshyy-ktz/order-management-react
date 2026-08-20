import { useState } from "react";
import { format } from "date-fns";
import {
  Package,
  DollarSign,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { getDashboardMetrics, getOrders, getOrdersByStatus } from "@/data/mock-data";
import type { FulfillmentStatus } from "@/types";

// ---------------------------------------------------------------------------
// Mock chart data
// ---------------------------------------------------------------------------

function buildLast7DaysData() {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({
      date: format(d, "MMM dd"),
      orders: Math.floor(Math.random() * 20) + 10,
    });
  }
  return data;
}

const revenueByChannel = [
  { channel: "Web", revenue: 12480 },
  { channel: "Mobile", revenue: 8320 },
  { channel: "In-Store", revenue: 5640 },
];

const topProducts = [
  { name: "Wireless Headphones", quantity: 142 },
  { name: "Mechanical Keyboard", quantity: 98 },
  { name: "Laptop Stand", quantity: 87 },
  { name: "Webcam HD", quantity: 76 },
  { name: "Wireless Mouse", quantity: 64 },
];

const slaData = [
  { label: "Shipped within 24h", value: 68 },
  { label: "Shipped within 48h", value: 87 },
  { label: "Shipped within 72h", value: 96 },
];

const STATUS_COLORS: Record<string, string> = {
  Unfulfilled: "#6366f1",
  "Partially Fulfilled": "#f59e0b",
  Fulfilled: "#3b82f6",
  Shipped: "#8b5cf6",
  Delivered: "#10b981",
};

const BADGE_CLASSES: Record<FulfillmentStatus, string> = {
  Unfulfilled: "bg-amber-100 text-amber-800 border-amber-200",
  "Partially Fulfilled": "bg-orange-100 text-orange-800 border-orange-200",
  Fulfilled: "bg-blue-100 text-blue-800 border-blue-200",
  Shipped: "bg-violet-100 text-violet-800 border-violet-200",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Dashboard() {
  const [metrics] = useState(() => getDashboardMetrics());
  const [orders] = useState(() => getOrders());
  const [ordersByStatus] = useState(() => getOrdersByStatus());
  const [ordersOverTime] = useState(() => buildLast7DaysData());

  const statusChartData = Object.entries(ordersByStatus).map(([status, list]) => ({
    name: status,
    value: list.length,
  }));

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Metric cards config
  const metricCards = [
    {
      title: "Orders Today",
      value: metrics.ordersToday.toString(),
      icon: Package,
      accent: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Revenue Today",
      value: formatCurrency(metrics.revenueToday),
      icon: DollarSign,
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(metrics.avgOrderValue),
      icon: TrendingUp,
      accent: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Fulfillment Rate",
      value: `${metrics.fulfillmentRate.toFixed(1)}%`,
      icon: CheckCircle,
      accent: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your store performance and recent activity.
        </p>
      </div>

      {/* ---- Metric Cards ---- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`rounded-md p-2 ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.accent}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ---- Charts 2x2 ---- */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Orders Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#4f46e5" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status (Donut) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {statusChartData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_COLORS[entry.name] ?? "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Channel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByChannel}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="channel" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products (Horizontal Bar) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={130}
                  />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#818cf8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---- Fulfillment SLA ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fulfillment SLA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {slaData.map((sla) => (
            <div key={sla.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{sla.label}</span>
                <span className="font-semibold">{sla.value}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${sla.value}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ---- Recent Orders ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{formatCurrency(order.totals.total)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={BADGE_CLASSES[order.fulfillmentStatus]}
                    >
                      {order.fulfillmentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
