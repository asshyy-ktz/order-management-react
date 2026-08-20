import { useState, useMemo } from "react";
import { getOrders } from "@/data/mock-data";
import type { Shipment, Order, TrackingEvent } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight, Package, Truck } from "lucide-react";

type ShipmentStatus = Shipment["status"];

const statusColors: Record<ShipmentStatus, string> = {
  "Label Created": "bg-gray-100 text-gray-800",
  "In Transit": "bg-blue-100 text-blue-800",
  "Out for Delivery": "bg-yellow-100 text-yellow-800",
  Delivered: "bg-green-100 text-green-800",
  Exception: "bg-red-100 text-red-800",
};

interface ShipmentWithOrder extends Shipment {
  orderNumber: string;
}

function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="relative pl-6 py-2">
      <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-muted" />
      {sorted.map((event, i) => (
        <div key={i} className="relative mb-4 last:mb-0">
          <div
            className={cn(
              "absolute left-[-19px] top-1 h-3 w-3 rounded-full border-2 border-background",
              i === 0 ? "bg-primary" : "bg-muted-foreground/40"
            )}
          />
          <div className="ml-2">
            <p className="text-sm font-medium">{event.status}</p>
            <p className="text-xs text-muted-foreground">{event.description}</p>
            <div className="flex gap-3 mt-1">
              <span className="text-xs text-muted-foreground">
                {new Date(event.date).toLocaleDateString()}{" "}
                {new Date(event.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {event.location && (
                <span className="text-xs text-muted-foreground">
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ShipmentList() {
  const orders = useMemo(() => getOrders(), []);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [carrierFilter, setCarrierFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const shipmentsWithOrders: ShipmentWithOrder[] = useMemo(() => {
    return orders.flatMap((order) =>
      order.shipments.map((s) => ({
        ...s,
        orderId: order.id,
        orderNumber: order.orderNumber,
      }))
    );
  }, [orders]);

  const carriers = useMemo(
    () => [...new Set(shipmentsWithOrders.map((s) => s.carrier))],
    [shipmentsWithOrders]
  );

  const filtered = useMemo(() => {
    return shipmentsWithOrders.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (carrierFilter !== "all" && s.carrier !== carrierFilter) return false;
      return true;
    });
  }, [shipmentsWithOrders, statusFilter, carrierFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Shipments</h2>
          <p className="text-muted-foreground">
            Track and manage all shipments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {filtered.length} shipment{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Label Created">Label Created</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Out for Delivery">
                  Out for Delivery
                </SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Exception">Exception</SelectItem>
              </SelectContent>
            </Select>

            <Select value={carrierFilter} onValueChange={setCarrierFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Carriers</SelectItem>
                {carriers.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Shipment ID</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Tracking Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead>Est. Delivery</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No shipments found
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((shipment) => {
                const isExpanded = expandedId === shipment.id;
                return (
                  <TableRow
                    key={shipment.id}
                    className="cursor-pointer"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : shipment.id)
                    }
                  >
                    <TableCell>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {shipment.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {shipment.orderNumber}
                    </TableCell>
                    <TableCell>{shipment.carrier}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {shipment.trackingNumber}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "border-0",
                          statusColors[shipment.status]
                        )}
                      >
                        {shipment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {shipment.items.reduce((s, i) => s + i.quantity, 0)}
                    </TableCell>
                    <TableCell>
                      {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.map(
                (shipment) =>
                  expandedId === shipment.id && (
                    <TableRow key={`${shipment.id}-detail`}>
                      <TableCell colSpan={9} className="bg-muted/50 p-4">
                        <div className="max-w-xl">
                          <h4 className="text-sm font-semibold mb-2">
                            Tracking History
                          </h4>
                          {shipment.trackingEvents.length > 0 ? (
                            <TrackingTimeline
                              events={shipment.trackingEvents}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No tracking events yet
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
