import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  Package,
  Truck,
  XCircle,
  RotateCcw,
  MessageSquare,
  Mail,
  Settings,
  Clock,
} from "lucide-react";

import { cn, formatCurrency, generateId } from "@/lib/utils";
import type { Order, Note, NoteType, TimelineEvent } from "@/types";
import { getOrderById } from "@/data/mock-data";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { StatusStepper } from "./StatusStepper";

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  Paid: "bg-green-100 text-green-800 border-green-200",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Failed: "bg-red-100 text-red-800 border-red-200",
};

const FULFILLMENT_STATUS_COLORS: Record<string, string> = {
  Unfulfilled: "bg-gray-100 text-gray-800 border-gray-200",
  "Partially Fulfilled": "bg-blue-100 text-blue-800 border-blue-200",
  Fulfilled: "bg-green-100 text-green-800 border-green-200",
  Shipped: "bg-purple-100 text-purple-800 border-purple-200",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const TIMELINE_DOT_COLORS: Record<string, string> = {
  status_change: "bg-green-500",
  note: "bg-blue-500",
  email: "bg-purple-500",
  system: "bg-gray-400",
};

const NOTE_BG_COLORS: Record<string, string> = {
  internal: "bg-yellow-50 border-yellow-200",
  customer: "bg-blue-50 border-blue-200",
  system: "bg-gray-50 border-gray-200",
};

interface OrderDetailProps {
  orderId: string;
  onBack?: () => void;
}

export function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const order = useMemo(() => getOrderById(orderId), [orderId]);

  const [notes, setNotes] = useState<Note[]>(order?.notes ?? []);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteType, setNewNoteType] = useState<NoteType>("internal");

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg">Order not found</p>
        <Button variant="link" onClick={onBack} className="mt-2">
          Back to Orders
        </Button>
      </div>
    );
  }

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;

    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = mentionRegex.exec(newNoteContent)) !== null) {
      mentions.push(match[1]);
    }

    const note: Note = {
      id: generateId(),
      type: newNoteType,
      content: newNoteContent,
      author: "Current User",
      mentions,
      createdAt: new Date().toISOString(),
    };

    setNotes((prev) => [note, ...prev]);
    setNewNoteContent("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">
              {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
        <Badge
          className={cn(
            "text-sm",
            FULFILLMENT_STATUS_COLORS[order.fulfillmentStatus]
          )}
        >
          {order.fulfillmentStatus}
        </Badge>
      </div>

      {/* Status Stepper */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusStepper
            currentStatus={order.fulfillmentStatus}
            timeline={order.timeline}
          />
        </CardContent>
      </Card>

      {/* Items table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Fulfilled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-16 w-16 rounded object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.productName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.variant}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {item.sku}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        item.fulfilledQuantity >= item.quantity
                          ? "text-green-600"
                          : "text-yellow-600"
                      )}
                    >
                      {item.fulfilledQuantity} / {item.quantity}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Summary + Customer side by side */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.totals.subtotal)}</span>
            </div>
            {order.totals.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-red-600">
                  -{formatCurrency(order.totals.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatCurrency(order.totals.shipping)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(order.totals.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(order.totals.total)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-muted-foreground">Payment Status</span>
              <Badge
                className={cn(PAYMENT_STATUS_COLORS[order.paymentStatus])}
              >
                {order.paymentStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Customer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-sm text-muted-foreground">
                {order.customer.email}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.customer.phone}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground mb-1">
                  Shipping Address
                </p>
                <p className="text-sm">{order.customer.shippingAddress.street}</p>
                <p className="text-sm">
                  {order.customer.shippingAddress.city},{" "}
                  {order.customer.shippingAddress.state}{" "}
                  {order.customer.shippingAddress.zip}
                </p>
                <p className="text-sm">
                  {order.customer.shippingAddress.country}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground mb-1">
                  Billing Address
                </p>
                <p className="text-sm">{order.customer.billingAddress.street}</p>
                <p className="text-sm">
                  {order.customer.billingAddress.city},{" "}
                  {order.customer.billingAddress.state}{" "}
                  {order.customer.billingAddress.zip}
                </p>
                <p className="text-sm">
                  {order.customer.billingAddress.country}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Fulfill Order
        </Button>
        <Button variant="outline">
          <Truck className="mr-2 h-4 w-4" />
          Add Shipment
        </Button>
        <Button variant="destructive">
          <XCircle className="mr-2 h-4 w-4" />
          Cancel Order
        </Button>
        <Button variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Refund
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            document.getElementById("add-note-textarea")?.focus()
          }
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      {/* Timeline */}
      {order.timeline.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-0">
              {order.timeline.map((event, index) => (
                <div key={event.id} className="flex gap-4 pb-6 last:pb-0">
                  {/* Vertical line + dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "h-3 w-3 rounded-full mt-1 shrink-0",
                        TIMELINE_DOT_COLORS[event.type]
                      )}
                    />
                    {index < order.timeline.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm">{event.message}</p>
                      <TimelineIcon type={event.type} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {event.user}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(
                          new Date(event.timestamp),
                          "MMM d, yyyy 'at' h:mm a"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add note form */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Textarea
                  id="add-note-textarea"
                  placeholder="Add a note... Use @name to mention someone"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="note-type" className="text-sm">
                Type:
              </Label>
              <Select
                value={newNoteType}
                onValueChange={(v) => setNewNoteType(v as NoteType)}
              >
                <SelectTrigger className="w-32" id="note-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" onClick={handleAddNote}>
                Add Note
              </Button>
            </div>
          </div>

          <Separator />

          {/* Notes list */}
          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No notes yet
            </p>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "rounded-md border p-3",
                    NOTE_BG_COLORS[note.type]
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {note.author}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {note.type}
                        </Badge>
                      </div>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {format(new Date(note.createdAt), "MMM d, h:mm a")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TimelineIcon({ type }: { type: string }) {
  const className = "h-4 w-4 text-muted-foreground shrink-0";
  switch (type) {
    case "status_change":
      return <Settings className={className} />;
    case "note":
      return <MessageSquare className={className} />;
    case "email":
      return <Mail className={className} />;
    case "system":
      return <Clock className={className} />;
    default:
      return null;
  }
}
