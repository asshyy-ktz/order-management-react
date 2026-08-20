// ============================================================
// Order Management System — TypeScript Types
// ============================================================

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  shippingAddress: Address;
  billingAddress: Address;
}

export interface OrderItem {
  id: string;
  productName: string;
  variant: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  imageUrl: string;
  fulfilledQuantity: number;
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed';
export type PaymentMethod = 'Credit Card' | 'PayPal' | 'Apple Pay' | 'Google Pay' | 'Bank Transfer' | 'Cash on Delivery';
export type FulfillmentStatus = 'Unfulfilled' | 'Partially Fulfilled' | 'Fulfilled' | 'Shipped' | 'Delivered';
export type OrderChannel = 'Web' | 'Mobile' | 'In-Store';

export type ReturnReason = 'Defective' | 'Wrong Item' | 'Not as Described' | 'Changed Mind' | 'Too Large' | 'Too Small' | 'Damaged in Shipping' | 'Other';
export type ReturnCondition = 'New' | 'Used' | 'Damaged' | 'Opened';
export type ReturnStatus = 'Requested' | 'Approved' | 'Received' | 'Refunded' | 'Rejected';
export type RefundMethod = 'original' | 'store_credit';

export type TimelineEventType = 'status_change' | 'note' | 'email' | 'system';
export type NoteType = 'internal' | 'customer' | 'system';

export interface ShipmentItem {
  orderItemId: string;
  quantity: number;
}

export interface TrackingEvent {
  date: string;
  status: string;
  location: string;
  description: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  items: ShipmentItem[];
  carrier: string;
  trackingNumber: string;
  status: 'Label Created' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception';
  estimatedDelivery: string;
  trackingEvents: TrackingEvent[];
  createdAt: string;
}

export interface ReturnItem {
  orderItemId: string;
  quantity: number;
  reason: ReturnReason;
  condition: ReturnCondition;
}

export interface Return {
  id: string;
  orderId: string;
  items: ReturnItem[];
  reason: ReturnReason;
  condition: ReturnCondition;
  status: ReturnStatus;
  refundAmount: number;
  refundMethod: RefundMethod;
  createdAt: string;
  notes: string;
}

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  message: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface Note {
  id: string;
  type: NoteType;
  content: string;
  author: string;
  mentions: string[];
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  fulfillmentStatus: FulfillmentStatus;
  channel: OrderChannel;
  createdAt: string;
  updatedAt: string;
  notes: Note[];
  timeline: TimelineEvent[];
  shipments: Shipment[];
  returns: Return[];
}

export interface OrderFilters {
  search: string;
  status: FulfillmentStatus | '';
  paymentStatus: PaymentStatus | '';
  channel: OrderChannel | '';
  dateFrom: string;
  dateTo: string;
  amountMin: number | null;
  amountMax: number | null;
}

export interface DashboardMetrics {
  ordersToday: number;
  revenueToday: number;
  avgOrderValue: number;
  fulfillmentRate: number;
}
