import type {
  Order,
  Customer,
  OrderItem,
  Shipment,
  Return,
  DashboardMetrics,
  FulfillmentStatus,
} from '../types';

// ============================================================
// Customers
// ============================================================

const customers: Customer[] = [
  {
    id: 'cust-001', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '(555) 123-4567',
    shippingAddress: { street: '742 Evergreen Terrace', city: 'Portland', state: 'OR', zip: '97201', country: 'US' },
    billingAddress: { street: '742 Evergreen Terrace', city: 'Portland', state: 'OR', zip: '97201', country: 'US' },
  },
  {
    id: 'cust-002', name: 'Michael Chen', email: 'mchen@techcorp.io', phone: '(555) 234-5678',
    shippingAddress: { street: '1200 Market St, Apt 4B', city: 'San Francisco', state: 'CA', zip: '94103', country: 'US' },
    billingAddress: { street: '1200 Market St, Apt 4B', city: 'San Francisco', state: 'CA', zip: '94103', country: 'US' },
  },
  {
    id: 'cust-003', name: 'Emily Rodriguez', email: 'emily.r@gmail.com', phone: '(555) 345-6789',
    shippingAddress: { street: '89 Congress Ave', city: 'Austin', state: 'TX', zip: '78701', country: 'US' },
    billingAddress: { street: '89 Congress Ave', city: 'Austin', state: 'TX', zip: '78701', country: 'US' },
  },
  {
    id: 'cust-004', name: 'James Wilson', email: 'jwilson@outlook.com', phone: '(555) 456-7890',
    shippingAddress: { street: '555 Broadway', city: 'New York', state: 'NY', zip: '10012', country: 'US' },
    billingAddress: { street: '555 Broadway', city: 'New York', state: 'NY', zip: '10012', country: 'US' },
  },
  {
    id: 'cust-005', name: 'Aisha Patel', email: 'aisha.patel@company.com', phone: '(555) 567-8901',
    shippingAddress: { street: '302 Pine Street', city: 'Seattle', state: 'WA', zip: '98101', country: 'US' },
    billingAddress: { street: '302 Pine Street', city: 'Seattle', state: 'WA', zip: '98101', country: 'US' },
  },
  {
    id: 'cust-006', name: 'David Kim', email: 'dkim@proton.me', phone: '(555) 678-9012',
    shippingAddress: { street: '1440 Peachtree St NW', city: 'Atlanta', state: 'GA', zip: '30309', country: 'US' },
    billingAddress: { street: '1440 Peachtree St NW', city: 'Atlanta', state: 'GA', zip: '30309', country: 'US' },
  },
  {
    id: 'cust-007', name: 'Laura Martinez', email: 'laura.m@yahoo.com', phone: '(555) 789-0123',
    shippingAddress: { street: '7700 Forsyth Blvd', city: 'St. Louis', state: 'MO', zip: '63105', country: 'US' },
    billingAddress: { street: '7700 Forsyth Blvd', city: 'St. Louis', state: 'MO', zip: '63105', country: 'US' },
  },
  {
    id: 'cust-008', name: 'Robert Taylor', email: 'rtaylor@icloud.com', phone: '(555) 890-1234',
    shippingAddress: { street: '2100 Woodward Ave', city: 'Detroit', state: 'MI', zip: '48201', country: 'US' },
    billingAddress: { street: '2100 Woodward Ave', city: 'Detroit', state: 'MI', zip: '48201', country: 'US' },
  },
  {
    id: 'cust-009', name: 'Sophie Anderson', email: 'sophie.a@fastmail.com', phone: '(555) 901-2345',
    shippingAddress: { street: '450 S Orange Ave', city: 'Orlando', state: 'FL', zip: '32801', country: 'US' },
    billingAddress: { street: '450 S Orange Ave', city: 'Orlando', state: 'FL', zip: '32801', country: 'US' },
  },
  {
    id: 'cust-010', name: 'Chris Nguyen', email: 'cnguyen@hey.com', phone: '(555) 012-3456',
    shippingAddress: { street: '1515 Arapahoe St', city: 'Denver', state: 'CO', zip: '80202', country: 'US' },
    billingAddress: { street: '1515 Arapahoe St', city: 'Denver', state: 'CO', zip: '80202', country: 'US' },
  },
];

// ============================================================
// Helper to build order items
// ============================================================

function makeItem(
  id: string, productName: string, variant: string, sku: string,
  quantity: number, unitPrice: number, imageUrl: string, fulfilledQuantity: number = 0,
): OrderItem {
  return { id, productName, variant, sku, quantity, unitPrice, total: quantity * unitPrice, imageUrl, fulfilledQuantity };
}

function makeTotals(items: OrderItem[], discount = 0, shipping = 9.99) {
  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
  return { subtotal, discount, shipping, tax, total: Math.round((subtotal - discount + shipping + tax) * 100) / 100 };
}

// ============================================================
// Mock Orders (25)
// ============================================================

const orders: Order[] = [
  // 1 — Delivered, Paid
  {
    id: 'ord-001', orderNumber: 'ORD-1001',
    customer: customers[0],
    items: [
      makeItem('item-001', 'MacBook Pro 14"', 'Space Gray / 16GB', 'MBP-14-SG-16', 1, 1999.00, '/images/macbook-pro.jpg', 1),
      makeItem('item-002', 'USB-C Hub 7-in-1', 'Silver', 'HUB-7IN1-SLV', 1, 49.99, '/images/usb-hub.jpg', 1),
    ],
    totals: makeTotals([
      makeItem('item-001', '', '', '', 1, 1999.00, '', 1),
      makeItem('item-002', '', '', '', 1, 49.99, '', 1),
    ], 0, 0),
    paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Delivered', channel: 'Web',
    createdAt: '2026-07-20T10:23:00Z', updatedAt: '2026-07-25T14:30:00Z',
    notes: [
      { id: 'note-001', type: 'internal', content: 'VIP customer, expedite shipping.', author: 'Admin', mentions: [], createdAt: '2026-07-20T10:30:00Z' },
    ],
    timeline: [
      { id: 'tl-001', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-07-20T10:23:00Z' },
      { id: 'tl-002', type: 'status_change', message: 'Payment confirmed', user: 'System', timestamp: '2026-07-20T10:24:00Z' },
      { id: 'tl-003', type: 'note', message: 'VIP customer, expedite shipping.', user: 'Admin', timestamp: '2026-07-20T10:30:00Z' },
      { id: 'tl-004', type: 'status_change', message: 'Order fulfilled', user: 'Warehouse', timestamp: '2026-07-21T08:00:00Z' },
      { id: 'tl-005', type: 'status_change', message: 'Shipped via FedEx', user: 'System', timestamp: '2026-07-21T09:15:00Z' },
      { id: 'tl-006', type: 'email', message: 'Shipping confirmation sent to customer', user: 'System', timestamp: '2026-07-21T09:16:00Z' },
      { id: 'tl-007', type: 'status_change', message: 'Delivered', user: 'System', timestamp: '2026-07-25T14:30:00Z' },
    ],
    shipments: [
      {
        id: 'ship-001', orderId: 'ord-001',
        items: [{ orderItemId: 'item-001', quantity: 1 }, { orderItemId: 'item-002', quantity: 1 }],
        carrier: 'FedEx', trackingNumber: 'FX-789456123',
        status: 'Delivered', estimatedDelivery: '2026-07-25',
        trackingEvents: [
          { date: '2026-07-21T09:15:00Z', status: 'Label Created', location: 'Portland, OR', description: 'Shipment label created' },
          { date: '2026-07-22T06:00:00Z', status: 'In Transit', location: 'Sacramento, CA', description: 'Package in transit' },
          { date: '2026-07-24T14:00:00Z', status: 'In Transit', location: 'Portland, OR', description: 'Arrived at local facility' },
          { date: '2026-07-25T10:00:00Z', status: 'Out for Delivery', location: 'Portland, OR', description: 'Out for delivery' },
          { date: '2026-07-25T14:30:00Z', status: 'Delivered', location: 'Portland, OR', description: 'Delivered - signed by S. JOHNSON' },
        ],
        createdAt: '2026-07-21T09:15:00Z',
      },
    ],
    returns: [],
  },

  // 2 — Shipped, Paid
  {
    id: 'ord-002', orderNumber: 'ORD-1002',
    customer: customers[1],
    items: [
      makeItem('item-003', 'Sony WH-1000XM5 Headphones', 'Black', 'SNY-WH1000XM5-BLK', 1, 349.99, '/images/sony-headphones.jpg', 1),
      makeItem('item-004', 'Leather Headphone Case', 'Brown', 'HC-LTH-BRN', 1, 29.99, '/images/headphone-case.jpg', 1),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 349.99, ''), makeItem('', '', '', '', 1, 29.99, '')], 20, 5.99),
    paymentStatus: 'Paid', paymentMethod: 'PayPal',
    fulfillmentStatus: 'Shipped', channel: 'Web',
    createdAt: '2026-07-28T14:45:00Z', updatedAt: '2026-07-30T11:00:00Z',
    notes: [],
    timeline: [
      { id: 'tl-008', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-07-28T14:45:00Z' },
      { id: 'tl-009', type: 'status_change', message: 'Payment confirmed via PayPal', user: 'System', timestamp: '2026-07-28T14:46:00Z' },
      { id: 'tl-010', type: 'status_change', message: 'Shipped via UPS', user: 'Warehouse', timestamp: '2026-07-30T11:00:00Z' },
    ],
    shipments: [
      {
        id: 'ship-002', orderId: 'ord-002',
        items: [{ orderItemId: 'item-003', quantity: 1 }, { orderItemId: 'item-004', quantity: 1 }],
        carrier: 'UPS', trackingNumber: '1Z999AA10123456784',
        status: 'In Transit', estimatedDelivery: '2026-08-03',
        trackingEvents: [
          { date: '2026-07-30T11:00:00Z', status: 'Label Created', location: 'San Francisco, CA', description: 'Shipment label created' },
          { date: '2026-07-31T07:00:00Z', status: 'In Transit', location: 'Oakland, CA', description: 'Package picked up' },
        ],
        createdAt: '2026-07-30T11:00:00Z',
      },
    ],
    returns: [],
  },

  // 3 — Unfulfilled, Pending payment
  {
    id: 'ord-003', orderNumber: 'ORD-1003',
    customer: customers[2],
    items: [
      makeItem('item-005', 'Nike Air Max 90', 'White/Black / Size 10', 'NK-AM90-WB-10', 1, 129.99, '/images/nike-airmax.jpg', 0),
      makeItem('item-006', 'Nike Dri-FIT T-Shirt', 'Navy / Large', 'NK-DFT-NVY-L', 2, 34.99, '/images/nike-tshirt.jpg', 0),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 129.99, ''), makeItem('', '', '', '', 2, 34.99, '')]),
    paymentStatus: 'Pending', paymentMethod: 'Bank Transfer',
    fulfillmentStatus: 'Unfulfilled', channel: 'Mobile',
    createdAt: '2026-08-03T09:12:00Z', updatedAt: '2026-08-03T09:12:00Z',
    notes: [
      { id: 'note-002', type: 'system', content: 'Awaiting bank transfer confirmation.', author: 'System', mentions: [], createdAt: '2026-08-03T09:12:00Z' },
    ],
    timeline: [
      { id: 'tl-011', type: 'system', message: 'Order placed via mobile app', user: 'System', timestamp: '2026-08-03T09:12:00Z' },
      { id: 'tl-012', type: 'status_change', message: 'Awaiting bank transfer', user: 'System', timestamp: '2026-08-03T09:13:00Z' },
    ],
    shipments: [],
    returns: [],
  },

  // 4 — Partially Fulfilled, Paid
  {
    id: 'ord-004', orderNumber: 'ORD-1004',
    customer: customers[3],
    items: [
      makeItem('item-007', 'Samsung 65" OLED TV', '65" / 4K', 'SAM-OLED65-4K', 1, 1799.99, '/images/samsung-tv.jpg', 1),
      makeItem('item-008', 'Soundbar with Subwoofer', 'Black', 'SB-SUB-BLK', 1, 299.99, '/images/soundbar.jpg', 0),
      makeItem('item-009', 'HDMI Cable 6ft', 'Gold-plated', 'HDMI-6FT-GLD', 2, 12.99, '/images/hdmi-cable.jpg', 2),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 1799.99, ''), makeItem('', '', '', '', 1, 299.99, ''), makeItem('', '', '', '', 2, 12.99, '')], 50, 0),
    paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Partially Fulfilled', channel: 'Web',
    createdAt: '2026-07-25T16:30:00Z', updatedAt: '2026-07-28T09:00:00Z',
    notes: [
      { id: 'note-003', type: 'internal', content: 'Soundbar backordered, expected restock Aug 5.', author: 'Warehouse Team', mentions: ['@inventory'], createdAt: '2026-07-27T10:00:00Z' },
    ],
    timeline: [
      { id: 'tl-013', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-07-25T16:30:00Z' },
      { id: 'tl-014', type: 'status_change', message: 'Payment confirmed', user: 'System', timestamp: '2026-07-25T16:31:00Z' },
      { id: 'tl-015', type: 'status_change', message: 'TV and HDMI cables fulfilled', user: 'Warehouse', timestamp: '2026-07-27T08:00:00Z' },
      { id: 'tl-016', type: 'note', message: 'Soundbar backordered', user: 'Warehouse Team', timestamp: '2026-07-27T10:00:00Z' },
      { id: 'tl-017', type: 'status_change', message: 'Partial shipment sent via UPS', user: 'System', timestamp: '2026-07-28T09:00:00Z' },
    ],
    shipments: [
      {
        id: 'ship-003', orderId: 'ord-004',
        items: [{ orderItemId: 'item-007', quantity: 1 }, { orderItemId: 'item-009', quantity: 2 }],
        carrier: 'UPS', trackingNumber: '1Z888BB20234567890',
        status: 'In Transit', estimatedDelivery: '2026-08-02',
        trackingEvents: [
          { date: '2026-07-28T09:00:00Z', status: 'Label Created', location: 'New York, NY', description: 'Shipment label created' },
          { date: '2026-07-29T12:00:00Z', status: 'In Transit', location: 'Newark, NJ', description: 'Package in transit' },
        ],
        createdAt: '2026-07-28T09:00:00Z',
      },
    ],
    returns: [],
  },

  // 5 — Delivered with Return
  {
    id: 'ord-005', orderNumber: 'ORD-1005',
    customer: customers[4],
    items: [
      makeItem('item-010', 'Patagonia Down Jacket', 'Blue / Medium', 'PAT-DJ-BLU-M', 1, 279.00, '/images/patagonia-jacket.jpg', 1),
      makeItem('item-011', 'Merino Wool Beanie', 'Gray', 'MW-BNE-GRY', 1, 35.00, '/images/beanie.jpg', 1),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 279.00, ''), makeItem('', '', '', '', 1, 35.00, '')]),
    paymentStatus: 'Paid', paymentMethod: 'Apple Pay',
    fulfillmentStatus: 'Delivered', channel: 'Mobile',
    createdAt: '2026-07-15T11:00:00Z', updatedAt: '2026-07-22T16:00:00Z',
    notes: [
      { id: 'note-004', type: 'customer', content: 'The jacket runs small. Requesting a return for exchange.', author: 'Aisha Patel', mentions: [], createdAt: '2026-07-22T16:00:00Z' },
    ],
    timeline: [
      { id: 'tl-018', type: 'system', message: 'Order placed via mobile', user: 'System', timestamp: '2026-07-15T11:00:00Z' },
      { id: 'tl-019', type: 'status_change', message: 'Payment confirmed', user: 'System', timestamp: '2026-07-15T11:01:00Z' },
      { id: 'tl-020', type: 'status_change', message: 'Delivered', user: 'System', timestamp: '2026-07-20T13:00:00Z' },
      { id: 'tl-021', type: 'note', message: 'Customer requested return for jacket (too small)', user: 'Aisha Patel', timestamp: '2026-07-22T16:00:00Z' },
      { id: 'tl-022', type: 'status_change', message: 'Return approved', user: 'Support', timestamp: '2026-07-22T17:00:00Z' },
    ],
    shipments: [
      {
        id: 'ship-004', orderId: 'ord-005',
        items: [{ orderItemId: 'item-010', quantity: 1 }, { orderItemId: 'item-011', quantity: 1 }],
        carrier: 'USPS', trackingNumber: '9400111899223100001234',
        status: 'Delivered', estimatedDelivery: '2026-07-20',
        trackingEvents: [
          { date: '2026-07-16T08:00:00Z', status: 'Label Created', location: 'Seattle, WA', description: 'Label created' },
          { date: '2026-07-18T10:00:00Z', status: 'In Transit', location: 'Boise, ID', description: 'In transit' },
          { date: '2026-07-20T13:00:00Z', status: 'Delivered', location: 'Seattle, WA', description: 'Delivered to mailbox' },
        ],
        createdAt: '2026-07-16T08:00:00Z',
      },
    ],
    returns: [
      {
        id: 'ret-001', orderId: 'ord-005',
        items: [{ orderItemId: 'item-010', quantity: 1, reason: 'Too Small', condition: 'New' }],
        reason: 'Too Small', condition: 'New', status: 'Approved',
        refundAmount: 279.00, refundMethod: 'original',
        createdAt: '2026-07-22T16:00:00Z', notes: 'Customer will ship back within 14 days.',
      },
    ],
  },

  // 6 — Failed payment
  {
    id: 'ord-006', orderNumber: 'ORD-1006',
    customer: customers[5],
    items: [
      makeItem('item-012', 'iPad Air M2', 'Starlight / 256GB', 'IPAD-AIR-M2-SL-256', 1, 799.00, '/images/ipad-air.jpg', 0),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 799.00, '')]),
    paymentStatus: 'Failed', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Unfulfilled', channel: 'Web',
    createdAt: '2026-08-02T20:15:00Z', updatedAt: '2026-08-02T20:16:00Z',
    notes: [
      { id: 'note-005', type: 'system', content: 'Payment declined: insufficient funds. Customer notified.', author: 'System', mentions: [], createdAt: '2026-08-02T20:16:00Z' },
    ],
    timeline: [
      { id: 'tl-023', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-08-02T20:15:00Z' },
      { id: 'tl-024', type: 'status_change', message: 'Payment failed: card declined', user: 'System', timestamp: '2026-08-02T20:16:00Z' },
      { id: 'tl-025', type: 'email', message: 'Payment failure notification sent', user: 'System', timestamp: '2026-08-02T20:17:00Z' },
    ],
    shipments: [],
    returns: [],
  },

  // 7 — Fulfilled, Paid, In-Store
  {
    id: 'ord-007', orderNumber: 'ORD-1007',
    customer: customers[6],
    items: [
      makeItem('item-013', 'Levi\'s 501 Original Jeans', 'Dark Wash / 32x30', 'LEV-501-DW-3230', 2, 69.50, '/images/levis-jeans.jpg', 2),
      makeItem('item-014', 'Cotton Oxford Shirt', 'White / Large', 'OXF-SHT-WHT-L', 1, 59.99, '/images/oxford-shirt.jpg', 1),
      makeItem('item-015', 'Leather Belt', 'Brown / 34', 'LB-BRN-34', 1, 45.00, '/images/leather-belt.jpg', 1),
    ],
    totals: makeTotals([makeItem('', '', '', '', 2, 69.50, ''), makeItem('', '', '', '', 1, 59.99, ''), makeItem('', '', '', '', 1, 45.00, '')], 24.35, 0),
    paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Fulfilled', channel: 'In-Store',
    createdAt: '2026-08-01T13:00:00Z', updatedAt: '2026-08-01T13:15:00Z',
    notes: [],
    timeline: [
      { id: 'tl-026', type: 'system', message: 'In-store purchase', user: 'POS Terminal 3', timestamp: '2026-08-01T13:00:00Z' },
      { id: 'tl-027', type: 'status_change', message: 'Payment processed', user: 'POS Terminal 3', timestamp: '2026-08-01T13:01:00Z' },
      { id: 'tl-028', type: 'status_change', message: 'Items handed to customer', user: 'Store Associate', timestamp: '2026-08-01T13:15:00Z' },
    ],
    shipments: [],
    returns: [],
  },

  // 8 — Shipped, Paid
  {
    id: 'ord-008', orderNumber: 'ORD-1008',
    customer: customers[7],
    items: [
      makeItem('item-016', 'KitchenAid Stand Mixer', 'Empire Red', 'KA-SM-RED', 1, 379.99, '/images/kitchenaid.jpg', 1),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 379.99, '')]),
    paymentStatus: 'Paid', paymentMethod: 'Google Pay',
    fulfillmentStatus: 'Shipped', channel: 'Web',
    createdAt: '2026-07-30T08:45:00Z', updatedAt: '2026-08-01T10:00:00Z',
    notes: [
      { id: 'note-006', type: 'internal', content: 'Heavy item, requires signature on delivery.', author: 'Shipping Dept', mentions: [], createdAt: '2026-07-31T09:00:00Z' },
    ],
    timeline: [
      { id: 'tl-029', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-07-30T08:45:00Z' },
      { id: 'tl-030', type: 'status_change', message: 'Payment confirmed', user: 'System', timestamp: '2026-07-30T08:46:00Z' },
      { id: 'tl-031', type: 'status_change', message: 'Shipped via FedEx Ground', user: 'Warehouse', timestamp: '2026-08-01T10:00:00Z' },
    ],
    shipments: [
      {
        id: 'ship-005', orderId: 'ord-008',
        items: [{ orderItemId: 'item-016', quantity: 1 }],
        carrier: 'FedEx', trackingNumber: 'FX-456789012',
        status: 'In Transit', estimatedDelivery: '2026-08-05',
        trackingEvents: [
          { date: '2026-08-01T10:00:00Z', status: 'Label Created', location: 'Detroit, MI', description: 'Label created' },
          { date: '2026-08-02T07:00:00Z', status: 'In Transit', location: 'Toledo, OH', description: 'In transit to destination' },
        ],
        createdAt: '2026-08-01T10:00:00Z',
      },
    ],
    returns: [],
  },

  // 9 — Delivered, Paid, with return (Refunded)
  {
    id: 'ord-009', orderNumber: 'ORD-1009',
    customer: customers[8],
    items: [
      makeItem('item-017', 'Dyson V15 Detect Vacuum', 'Yellow/Nickel', 'DYS-V15-YN', 1, 749.99, '/images/dyson-v15.jpg', 1),
      makeItem('item-018', 'Extra HEPA Filter', 'Standard', 'DYS-HEPA-STD', 2, 29.99, '/images/dyson-filter.jpg', 2),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 749.99, ''), makeItem('', '', '', '', 2, 29.99, '')]),
    paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Delivered', channel: 'Web',
    createdAt: '2026-07-10T15:20:00Z', updatedAt: '2026-07-28T12:00:00Z',
    notes: [
      { id: 'note-007', type: 'customer', content: 'Vacuum arrived with cracked handle. Very disappointed.', author: 'Sophie Anderson', mentions: [], createdAt: '2026-07-17T09:00:00Z' },
      { id: 'note-008', type: 'internal', content: 'Approved full refund for vacuum. Damage confirmed from photos.', author: 'CS Manager', mentions: ['@returns'], createdAt: '2026-07-17T11:00:00Z' },
    ],
    timeline: [
      { id: 'tl-032', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-07-10T15:20:00Z' },
      { id: 'tl-033', type: 'status_change', message: 'Delivered', user: 'System', timestamp: '2026-07-15T14:00:00Z' },
      { id: 'tl-034', type: 'note', message: 'Customer reported damaged item', user: 'Sophie Anderson', timestamp: '2026-07-17T09:00:00Z' },
      { id: 'tl-035', type: 'status_change', message: 'Return approved - damaged item', user: 'CS Manager', timestamp: '2026-07-17T11:00:00Z' },
      { id: 'tl-036', type: 'status_change', message: 'Return received at warehouse', user: 'Warehouse', timestamp: '2026-07-24T10:00:00Z' },
      { id: 'tl-037', type: 'status_change', message: 'Refund processed: $749.99', user: 'System', timestamp: '2026-07-28T12:00:00Z' },
    ],
    shipments: [
      {
        id: 'ship-006', orderId: 'ord-009',
        items: [{ orderItemId: 'item-017', quantity: 1 }, { orderItemId: 'item-018', quantity: 2 }],
        carrier: 'FedEx', trackingNumber: 'FX-321654987',
        status: 'Delivered', estimatedDelivery: '2026-07-15',
        trackingEvents: [
          { date: '2026-07-11T08:00:00Z', status: 'Label Created', location: 'Orlando, FL', description: 'Label created' },
          { date: '2026-07-15T14:00:00Z', status: 'Delivered', location: 'Orlando, FL', description: 'Delivered at front door' },
        ],
        createdAt: '2026-07-11T08:00:00Z',
      },
    ],
    returns: [
      {
        id: 'ret-002', orderId: 'ord-009',
        items: [{ orderItemId: 'item-017', quantity: 1, reason: 'Damaged in Shipping', condition: 'Damaged' }],
        reason: 'Damaged in Shipping', condition: 'Damaged', status: 'Refunded',
        refundAmount: 749.99, refundMethod: 'original',
        createdAt: '2026-07-17T09:00:00Z', notes: 'Cracked handle confirmed from customer photos. Full refund approved.',
      },
    ],
  },

  // 10 — Unfulfilled, Paid, today's order
  {
    id: 'ord-010', orderNumber: 'ORD-1010',
    customer: customers[9],
    items: [
      makeItem('item-019', 'Bose QuietComfort Ultra', 'Black', 'BOSE-QCU-BLK', 1, 429.00, '/images/bose-qcu.jpg', 0),
      makeItem('item-020', 'Wireless Charging Pad', 'White', 'WCP-WHT', 1, 39.99, '/images/charging-pad.jpg', 0),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 429.00, ''), makeItem('', '', '', '', 1, 39.99, '')], 0, 7.99),
    paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Unfulfilled', channel: 'Web',
    createdAt: '2026-08-04T07:30:00Z', updatedAt: '2026-08-04T07:30:00Z',
    notes: [],
    timeline: [
      { id: 'tl-038', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-08-04T07:30:00Z' },
      { id: 'tl-039', type: 'status_change', message: 'Payment confirmed', user: 'System', timestamp: '2026-08-04T07:31:00Z' },
    ],
    shipments: [],
    returns: [],
  },

  // 11 — Today's order, Pending, Mobile
  {
    id: 'ord-011', orderNumber: 'ORD-1011',
    customer: customers[0],
    items: [
      makeItem('item-021', 'AirPods Pro 2nd Gen', 'White', 'APOD-PRO2-WHT', 1, 249.00, '/images/airpods-pro.jpg', 0),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 249.00, '')], 0, 0),
    paymentStatus: 'Pending', paymentMethod: 'Apple Pay',
    fulfillmentStatus: 'Unfulfilled', channel: 'Mobile',
    createdAt: '2026-08-04T08:15:00Z', updatedAt: '2026-08-04T08:15:00Z',
    notes: [],
    timeline: [
      { id: 'tl-040', type: 'system', message: 'Order placed via mobile', user: 'System', timestamp: '2026-08-04T08:15:00Z' },
    ],
    shipments: [],
    returns: [],
  },

  // 12 — Today's order, Paid, Web
  {
    id: 'ord-012', orderNumber: 'ORD-1012',
    customer: customers[2],
    items: [
      makeItem('item-022', 'Running Shoes', 'Gray / Size 9', 'RS-GRY-9', 1, 119.99, '/images/running-shoes.jpg', 0),
      makeItem('item-023', 'Athletic Socks 3-Pack', 'White', 'AS-3PK-WHT', 2, 14.99, '/images/athletic-socks.jpg', 0),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 119.99, ''), makeItem('', '', '', '', 2, 14.99, '')]),
    paymentStatus: 'Paid', paymentMethod: 'PayPal',
    fulfillmentStatus: 'Unfulfilled', channel: 'Web',
    createdAt: '2026-08-04T09:00:00Z', updatedAt: '2026-08-04T09:00:00Z',
    notes: [],
    timeline: [
      { id: 'tl-041', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-08-04T09:00:00Z' },
      { id: 'tl-042', type: 'status_change', message: 'Payment confirmed via PayPal', user: 'System', timestamp: '2026-08-04T09:01:00Z' },
    ],
    shipments: [],
    returns: [],
  },

  // 13 — Delivered, In-Store pickup
  {
    id: 'ord-013', orderNumber: 'ORD-1013',
    customer: customers[3],
    items: [
      makeItem('item-024', 'Canon EOS R6 Mark II', 'Body Only', 'CAN-R6M2-BO', 1, 2499.00, '/images/canon-r6.jpg', 1),
      makeItem('item-025', 'SD Card 128GB', 'UHS-II', 'SD-128-UHS2', 2, 24.99, '/images/sd-card.jpg', 2),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 2499.00, ''), makeItem('', '', '', '', 2, 24.99, '')], 0, 0),
    paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Delivered', channel: 'In-Store',
    createdAt: '2026-07-29T10:00:00Z', updatedAt: '2026-07-29T10:30:00Z',
    notes: [],
    timeline: [
      { id: 'tl-043', type: 'system', message: 'In-store purchase', user: 'POS Terminal 1', timestamp: '2026-07-29T10:00:00Z' },
      { id: 'tl-044', type: 'status_change', message: 'Fulfilled and delivered in-store', user: 'Store Associate', timestamp: '2026-07-29T10:30:00Z' },
    ],
    shipments: [],
    returns: [],
  },

  // 14 — Shipped, Paid, multiple items
  {
    id: 'ord-014', orderNumber: 'ORD-1014',
    customer: customers[5],
    items: [
      makeItem('item-026', 'Standing Desk Frame', 'Black / Electric', 'SD-FRM-BLK-E', 1, 449.00, '/images/standing-desk.jpg', 1),
      makeItem('item-027', 'Desktop Mat', 'Dark Gray / Large', 'DM-DG-L', 1, 39.99, '/images/desk-mat.jpg', 1),
      makeItem('item-028', 'Monitor Arm', 'Silver', 'MA-SLV', 1, 129.99, '/images/monitor-arm.jpg', 1),
      makeItem('item-029', 'Cable Management Kit', 'Black', 'CMK-BLK', 1, 19.99, '/images/cable-kit.jpg', 1),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 449.00, ''), makeItem('', '', '', '', 1, 39.99, ''), makeItem('', '', '', '', 1, 129.99, ''), makeItem('', '', '', '', 1, 19.99, '')], 30, 0),
    paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Shipped', channel: 'Web',
    createdAt: '2026-07-27T12:00:00Z', updatedAt: '2026-07-29T14:00:00Z',
    notes: [
      { id: 'note-009', type: 'internal', content: 'Customer requested white-glove delivery. Contact for appointment.', author: 'Sales Rep', mentions: ['@delivery'], createdAt: '2026-07-27T14:00:00Z' },
    ],
    timeline: [
      { id: 'tl-045', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-07-27T12:00:00Z' },
      { id: 'tl-046', type: 'status_change', message: 'Payment confirmed', user: 'System', timestamp: '2026-07-27T12:01:00Z' },
      { id: 'tl-047', type: 'note', message: 'White-glove delivery requested', user: 'Sales Rep', timestamp: '2026-07-27T14:00:00Z' },
      { id: 'tl-048', type: 'status_change', message: 'All items fulfilled and shipped via freight', user: 'Warehouse', timestamp: '2026-07-29T14:00:00Z' },
    ],
    shipments: [
      {
        id: 'ship-007', orderId: 'ord-014',
        items: [
          { orderItemId: 'item-026', quantity: 1 }, { orderItemId: 'item-027', quantity: 1 },
          { orderItemId: 'item-028', quantity: 1 }, { orderItemId: 'item-029', quantity: 1 },
        ],
        carrier: 'FedEx Freight', trackingNumber: 'FXF-112233445566',
        status: 'In Transit', estimatedDelivery: '2026-08-06',
        trackingEvents: [
          { date: '2026-07-29T14:00:00Z', status: 'Label Created', location: 'Atlanta, GA', description: 'Freight shipment booked' },
          { date: '2026-07-30T08:00:00Z', status: 'In Transit', location: 'Atlanta, GA', description: 'Picked up by carrier' },
        ],
        createdAt: '2026-07-29T14:00:00Z',
      },
    ],
    returns: [],
  },

  // 15 — Delivered with return (store credit)
  {
    id: 'ord-015', orderNumber: 'ORD-1015',
    customer: customers[7],
    items: [
      makeItem('item-030', 'Winter Parka', 'Olive / XL', 'WP-OLV-XL', 1, 199.99, '/images/winter-parka.jpg', 1),
      makeItem('item-031', 'Thermal Gloves', 'Black / Large', 'TG-BLK-L', 1, 34.99, '/images/thermal-gloves.jpg', 1),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 199.99, ''), makeItem('', '', '', '', 1, 34.99, '')]),
    paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Delivered', channel: 'Web',
    createdAt: '2026-07-05T09:30:00Z', updatedAt: '2026-07-20T15:00:00Z',
    notes: [
      { id: 'note-010', type: 'customer', content: 'Changed my mind about the parka. Would like store credit.', author: 'Robert Taylor', mentions: [], createdAt: '2026-07-15T10:00:00Z' },
    ],
    timeline: [
      { id: 'tl-049', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-07-05T09:30:00Z' },
      { id: 'tl-050', type: 'status_change', message: 'Delivered', user: 'System', timestamp: '2026-07-10T16:00:00Z' },
      { id: 'tl-051', type: 'note', message: 'Return requested - changed mind', user: 'Robert Taylor', timestamp: '2026-07-15T10:00:00Z' },
      { id: 'tl-052', type: 'status_change', message: 'Return received, store credit issued', user: 'Returns Dept', timestamp: '2026-07-20T15:00:00Z' },
    ],
    shipments: [
      {
        id: 'ship-008', orderId: 'ord-015',
        items: [{ orderItemId: 'item-030', quantity: 1 }, { orderItemId: 'item-031', quantity: 1 }],
        carrier: 'USPS', trackingNumber: '9400111899223100005678',
        status: 'Delivered', estimatedDelivery: '2026-07-10',
        trackingEvents: [
          { date: '2026-07-06T08:00:00Z', status: 'Label Created', location: 'Detroit, MI', description: 'Label created' },
          { date: '2026-07-10T16:00:00Z', status: 'Delivered', location: 'Detroit, MI', description: 'Delivered' },
        ],
        createdAt: '2026-07-06T08:00:00Z',
      },
    ],
    returns: [
      {
        id: 'ret-003', orderId: 'ord-015',
        items: [{ orderItemId: 'item-030', quantity: 1, reason: 'Changed Mind', condition: 'New' }],
        reason: 'Changed Mind', condition: 'New', status: 'Refunded',
        refundAmount: 199.99, refundMethod: 'store_credit',
        createdAt: '2026-07-15T10:00:00Z', notes: 'Customer preferred store credit. Credit applied to account.',
      },
    ],
  },

  // 16 — Unfulfilled, Paid, today
  {
    id: 'ord-016', orderNumber: 'ORD-1016',
    customer: customers[4],
    items: [
      makeItem('item-032', 'Yoga Mat Premium', 'Teal / 6mm', 'YM-TL-6', 1, 68.00, '/images/yoga-mat.jpg', 0),
      makeItem('item-033', 'Yoga Block Set', 'Cork', 'YB-CRK-2', 1, 24.99, '/images/yoga-blocks.jpg', 0),
      makeItem('item-034', 'Resistance Bands Set', '5-Pack', 'RB-5PK', 1, 19.99, '/images/resistance-bands.jpg', 0),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 68.00, ''), makeItem('', '', '', '', 1, 24.99, ''), makeItem('', '', '', '', 1, 19.99, '')]),
    paymentStatus: 'Paid', paymentMethod: 'Google Pay',
    fulfillmentStatus: 'Unfulfilled', channel: 'Mobile',
    createdAt: '2026-08-04T10:45:00Z', updatedAt: '2026-08-04T10:45:00Z',
    notes: [],
    timeline: [
      { id: 'tl-053', type: 'system', message: 'Order placed via mobile app', user: 'System', timestamp: '2026-08-04T10:45:00Z' },
      { id: 'tl-054', type: 'status_change', message: 'Payment confirmed', user: 'System', timestamp: '2026-08-04T10:46:00Z' },
    ],
    shipments: [],
    returns: [],
  },

  // 17 — Fulfilled, Paid
  {
    id: 'ord-017', orderNumber: 'ORD-1017',
    customer: customers[6],
    items: [
      makeItem('item-035', 'Instant Pot Duo 8-Qt', 'Stainless', 'IP-DUO-8QT-SS', 1, 99.99, '/images/instant-pot.jpg', 1),
      makeItem('item-036', 'Silicone Utensil Set', '10-Piece / Gray', 'SUS-10-GRY', 1, 24.99, '/images/utensil-set.jpg', 1),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 99.99, ''), makeItem('', '', '', '', 1, 24.99, '')]),
    paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Fulfilled', channel: 'Web',
    createdAt: '2026-08-02T14:20:00Z', updatedAt: '2026-08-03T11:00:00Z',
    notes: [],
    timeline: [
      { id: 'tl-055', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-08-02T14:20:00Z' },
      { id: 'tl-056', type: 'status_change', message: 'Payment confirmed', user: 'System', timestamp: '2026-08-02T14:21:00Z' },
      { id: 'tl-057', type: 'status_change', message: 'Order fulfilled, awaiting carrier pickup', user: 'Warehouse', timestamp: '2026-08-03T11:00:00Z' },
    ],
    shipments: [],
    returns: [],
  },

  // 18 — Shipped, Paid, out for delivery
  {
    id: 'ord-018', orderNumber: 'ORD-1018',
    customer: customers[9],
    items: [
      makeItem('item-037', 'Gaming Keyboard Mechanical', 'RGB / Cherry MX Red', 'GK-RGB-MXRED', 1, 149.99, '/images/gaming-keyboard.jpg', 1),
      makeItem('item-038', 'Gaming Mouse Wireless', 'Black', 'GM-WL-BLK', 1, 79.99, '/images/gaming-mouse.jpg', 1),
      makeItem('item-039', 'XL Mouse Pad', 'Black', 'MP-XL-BLK', 1, 19.99, '/images/mouse-pad.jpg', 1),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 149.99, ''), makeItem('', '', '', '', 1, 79.99, ''), makeItem('', '', '', '', 1, 19.99, '')], 10, 5.99),
    paymentStatus: 'Paid', paymentMethod: 'PayPal',
    fulfillmentStatus: 'Shipped', channel: 'Web',
    createdAt: '2026-07-31T16:00:00Z', updatedAt: '2026-08-04T06:00:00Z',
    notes: [],
    timeline: [
      { id: 'tl-058', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-07-31T16:00:00Z' },
      { id: 'tl-059', type: 'status_change', message: 'Shipped via USPS', user: 'Warehouse', timestamp: '2026-08-02T09:00:00Z' },
      { id: 'tl-060', type: 'status_change', message: 'Out for delivery', user: 'System', timestamp: '2026-08-04T06:00:00Z' },
    ],
    shipments: [
      {
        id: 'ship-009', orderId: 'ord-018',
        items: [
          { orderItemId: 'item-037', quantity: 1 }, { orderItemId: 'item-038', quantity: 1 },
          { orderItemId: 'item-039', quantity: 1 },
        ],
        carrier: 'USPS', trackingNumber: '9400111899223100009999',
        status: 'Out for Delivery', estimatedDelivery: '2026-08-04',
        trackingEvents: [
          { date: '2026-08-02T09:00:00Z', status: 'Label Created', location: 'Denver, CO', description: 'Label created' },
          { date: '2026-08-03T14:00:00Z', status: 'In Transit', location: 'Kansas City, MO', description: 'In transit' },
          { date: '2026-08-04T06:00:00Z', status: 'Out for Delivery', location: 'Denver, CO', description: 'Out for delivery' },
        ],
        createdAt: '2026-08-02T09:00:00Z',
      },
    ],
    returns: [],
  },

  // 19 — Delivered, Paid, return requested
  {
    id: 'ord-019', orderNumber: 'ORD-1019',
    customer: customers[1],
    items: [
      makeItem('item-040', 'Espresso Machine', 'Stainless Steel', 'EM-SS', 1, 599.99, '/images/espresso-machine.jpg', 1),
      makeItem('item-041', 'Coffee Beans 2lb', 'Dark Roast', 'CB-DR-2LB', 2, 18.99, '/images/coffee-beans.jpg', 2),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 599.99, ''), makeItem('', '', '', '', 2, 18.99, '')]),
    paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Delivered', channel: 'Web',
    createdAt: '2026-07-18T11:30:00Z', updatedAt: '2026-08-01T09:00:00Z',
    notes: [
      { id: 'note-011', type: 'customer', content: 'Machine makes grinding noise. Not as described.', author: 'Michael Chen', mentions: [], createdAt: '2026-08-01T09:00:00Z' },
    ],
    timeline: [
      { id: 'tl-061', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-07-18T11:30:00Z' },
      { id: 'tl-062', type: 'status_change', message: 'Delivered', user: 'System', timestamp: '2026-07-23T15:00:00Z' },
      { id: 'tl-063', type: 'note', message: 'Customer reported defective machine', user: 'Michael Chen', timestamp: '2026-08-01T09:00:00Z' },
      { id: 'tl-064', type: 'status_change', message: 'Return requested', user: 'System', timestamp: '2026-08-01T09:05:00Z' },
    ],
    shipments: [
      {
        id: 'ship-010', orderId: 'ord-019',
        items: [{ orderItemId: 'item-040', quantity: 1 }, { orderItemId: 'item-041', quantity: 2 }],
        carrier: 'UPS', trackingNumber: '1Z777CC30345678901',
        status: 'Delivered', estimatedDelivery: '2026-07-23',
        trackingEvents: [
          { date: '2026-07-19T08:00:00Z', status: 'Label Created', location: 'San Francisco, CA', description: 'Label created' },
          { date: '2026-07-23T15:00:00Z', status: 'Delivered', location: 'San Francisco, CA', description: 'Delivered' },
        ],
        createdAt: '2026-07-19T08:00:00Z',
      },
    ],
    returns: [
      {
        id: 'ret-004', orderId: 'ord-019',
        items: [{ orderItemId: 'item-040', quantity: 1, reason: 'Defective', condition: 'Used' }],
        reason: 'Defective', condition: 'Used', status: 'Requested',
        refundAmount: 599.99, refundMethod: 'original',
        createdAt: '2026-08-01T09:05:00Z', notes: 'Customer reports grinding noise. Awaiting return shipment.',
      },
    ],
  },

  // 20 — Unfulfilled, Failed payment
  {
    id: 'ord-020', orderNumber: 'ORD-1020',
    customer: customers[8],
    items: [
      makeItem('item-042', 'Smart Watch Ultra', 'Titanium / 49mm', 'SW-ULT-TI-49', 1, 799.00, '/images/smart-watch.jpg', 0),
      makeItem('item-043', 'Sport Band', 'Orange / M/L', 'SB-ORG-ML', 1, 49.00, '/images/sport-band.jpg', 0),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 799.00, ''), makeItem('', '', '', '', 1, 49.00, '')]),
    paymentStatus: 'Failed', paymentMethod: 'Apple Pay',
    fulfillmentStatus: 'Unfulfilled', channel: 'Mobile',
    createdAt: '2026-08-03T18:00:00Z', updatedAt: '2026-08-03T18:01:00Z',
    notes: [
      { id: 'note-012', type: 'system', content: 'Apple Pay authorization failed. Customer contacted.', author: 'System', mentions: [], createdAt: '2026-08-03T18:01:00Z' },
    ],
    timeline: [
      { id: 'tl-065', type: 'system', message: 'Order placed via mobile', user: 'System', timestamp: '2026-08-03T18:00:00Z' },
      { id: 'tl-066', type: 'status_change', message: 'Payment authorization failed', user: 'System', timestamp: '2026-08-03T18:01:00Z' },
      { id: 'tl-067', type: 'email', message: 'Payment failure email sent to customer', user: 'System', timestamp: '2026-08-03T18:02:00Z' },
    ],
    shipments: [],
    returns: [],
  },

  // 21 — Delivered, Paid, In-Store, no issues
  {
    id: 'ord-021', orderNumber: 'ORD-1021',
    customer: customers[3],
    items: [
      makeItem('item-044', 'Bluetooth Speaker Portable', 'Teal', 'BTS-PRT-TL', 1, 129.99, '/images/bt-speaker.jpg', 1),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 129.99, '')], 0, 0),
    paymentStatus: 'Paid', paymentMethod: 'Cash on Delivery',
    fulfillmentStatus: 'Delivered', channel: 'In-Store',
    createdAt: '2026-08-03T14:30:00Z', updatedAt: '2026-08-03T14:35:00Z',
    notes: [],
    timeline: [
      { id: 'tl-068', type: 'system', message: 'In-store purchase', user: 'POS Terminal 2', timestamp: '2026-08-03T14:30:00Z' },
      { id: 'tl-069', type: 'status_change', message: 'Cash payment received', user: 'Cashier', timestamp: '2026-08-03T14:33:00Z' },
      { id: 'tl-070', type: 'status_change', message: 'Handed to customer', user: 'Cashier', timestamp: '2026-08-03T14:35:00Z' },
    ],
    shipments: [],
    returns: [],
  },

  // 22 — Partially Fulfilled, Paid
  {
    id: 'ord-022', orderNumber: 'ORD-1022',
    customer: customers[6],
    items: [
      makeItem('item-045', 'Bookshelf 5-Tier', 'Walnut', 'BS-5T-WLN', 1, 189.99, '/images/bookshelf.jpg', 0),
      makeItem('item-046', 'Desk Lamp LED', 'Matte Black', 'DL-LED-MB', 1, 59.99, '/images/desk-lamp.jpg', 1),
      makeItem('item-047', 'Picture Frames Set', '4x6 / Gold / 3-Pack', 'PF-4X6-GLD-3', 1, 22.99, '/images/picture-frames.jpg', 1),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 189.99, ''), makeItem('', '', '', '', 1, 59.99, ''), makeItem('', '', '', '', 1, 22.99, '')]),
    paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Partially Fulfilled', channel: 'Web',
    createdAt: '2026-08-01T16:00:00Z', updatedAt: '2026-08-03T08:00:00Z',
    notes: [
      { id: 'note-013', type: 'internal', content: 'Bookshelf out of stock at primary warehouse. Transferring from secondary.', author: 'Inventory', mentions: ['@warehouse-b'], createdAt: '2026-08-02T09:00:00Z' },
    ],
    timeline: [
      { id: 'tl-071', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-08-01T16:00:00Z' },
      { id: 'tl-072', type: 'status_change', message: 'Payment confirmed', user: 'System', timestamp: '2026-08-01T16:01:00Z' },
      { id: 'tl-073', type: 'note', message: 'Bookshelf out of stock, transferring', user: 'Inventory', timestamp: '2026-08-02T09:00:00Z' },
      { id: 'tl-074', type: 'status_change', message: 'Lamp and frames shipped', user: 'Warehouse', timestamp: '2026-08-03T08:00:00Z' },
    ],
    shipments: [
      {
        id: 'ship-011', orderId: 'ord-022',
        items: [{ orderItemId: 'item-046', quantity: 1 }, { orderItemId: 'item-047', quantity: 1 }],
        carrier: 'USPS', trackingNumber: '9400111899223100007777',
        status: 'In Transit', estimatedDelivery: '2026-08-07',
        trackingEvents: [
          { date: '2026-08-03T08:00:00Z', status: 'Label Created', location: 'St. Louis, MO', description: 'Label created' },
        ],
        createdAt: '2026-08-03T08:00:00Z',
      },
    ],
    returns: [],
  },

  // 23 — Today's order, Paid, big order
  {
    id: 'ord-023', orderNumber: 'ORD-1023',
    customer: customers[4],
    items: [
      makeItem('item-048', 'Ergonomic Office Chair', 'Gray Mesh', 'EOC-GM', 1, 549.00, '/images/office-chair.jpg', 0),
      makeItem('item-049', 'Standing Desk Top', 'Bamboo / 60"', 'SDT-BMB-60', 1, 299.00, '/images/desk-top.jpg', 0),
      makeItem('item-050', 'Filing Cabinet 3-Drawer', 'White', 'FC-3D-WHT', 1, 179.00, '/images/filing-cabinet.jpg', 0),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 549.00, ''), makeItem('', '', '', '', 1, 299.00, ''), makeItem('', '', '', '', 1, 179.00, '')], 50, 0),
    paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Unfulfilled', channel: 'Web',
    createdAt: '2026-08-04T11:20:00Z', updatedAt: '2026-08-04T11:20:00Z',
    notes: [
      { id: 'note-014', type: 'customer', content: 'Please ship everything together if possible.', author: 'Aisha Patel', mentions: [], createdAt: '2026-08-04T11:25:00Z' },
    ],
    timeline: [
      { id: 'tl-075', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-08-04T11:20:00Z' },
      { id: 'tl-076', type: 'status_change', message: 'Payment confirmed', user: 'System', timestamp: '2026-08-04T11:21:00Z' },
      { id: 'tl-077', type: 'note', message: 'Customer requests combined shipment', user: 'Aisha Patel', timestamp: '2026-08-04T11:25:00Z' },
    ],
    shipments: [],
    returns: [],
  },

  // 24 — Shipped, exception
  {
    id: 'ord-024', orderNumber: 'ORD-1024',
    customer: customers[0],
    items: [
      makeItem('item-051', 'Ceramic Dinner Set', '16-Piece / White', 'CDS-16-WHT', 1, 89.99, '/images/dinner-set.jpg', 1),
    ],
    totals: makeTotals([makeItem('', '', '', '', 1, 89.99, '')]),
    paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Shipped', channel: 'Web',
    createdAt: '2026-07-29T09:00:00Z', updatedAt: '2026-08-03T16:00:00Z',
    notes: [
      { id: 'note-015', type: 'internal', content: 'Delivery exception: address not found. Contacting customer.', author: 'Support', mentions: ['@sarah.johnson'], createdAt: '2026-08-03T16:00:00Z' },
    ],
    timeline: [
      { id: 'tl-078', type: 'system', message: 'Order placed', user: 'System', timestamp: '2026-07-29T09:00:00Z' },
      { id: 'tl-079', type: 'status_change', message: 'Shipped via USPS', user: 'Warehouse', timestamp: '2026-07-30T10:00:00Z' },
      { id: 'tl-080', type: 'status_change', message: 'Delivery exception: address issue', user: 'System', timestamp: '2026-08-03T16:00:00Z' },
      { id: 'tl-081', type: 'email', message: 'Address verification email sent', user: 'Support', timestamp: '2026-08-03T16:05:00Z' },
    ],
    shipments: [
      {
        id: 'ship-012', orderId: 'ord-024',
        items: [{ orderItemId: 'item-051', quantity: 1 }],
        carrier: 'USPS', trackingNumber: '9400111899223100003333',
        status: 'Exception', estimatedDelivery: '2026-08-02',
        trackingEvents: [
          { date: '2026-07-30T10:00:00Z', status: 'Label Created', location: 'Portland, OR', description: 'Label created' },
          { date: '2026-07-31T14:00:00Z', status: 'In Transit', location: 'Salem, OR', description: 'In transit' },
          { date: '2026-08-02T09:00:00Z', status: 'Out for Delivery', location: 'Portland, OR', description: 'Out for delivery' },
          { date: '2026-08-02T14:00:00Z', status: 'Exception', location: 'Portland, OR', description: 'Address not found - returned to post office' },
        ],
        createdAt: '2026-07-30T10:00:00Z',
      },
    ],
    returns: [],
  },

  // 25 — Today, In-Store, Paid
  {
    id: 'ord-025', orderNumber: 'ORD-1025',
    customer: customers[5],
    items: [
      makeItem('item-052', 'Portable Charger 20000mAh', 'Black', 'PC-20K-BLK', 2, 44.99, '/images/portable-charger.jpg', 2),
      makeItem('item-053', 'Lightning Cable 6ft', 'White / 2-Pack', 'LC-6FT-WHT-2', 1, 16.99, '/images/lightning-cable.jpg', 1),
    ],
    totals: makeTotals([makeItem('', '', '', '', 2, 44.99, ''), makeItem('', '', '', '', 1, 16.99, '')], 0, 0),
    paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    fulfillmentStatus: 'Delivered', channel: 'In-Store',
    createdAt: '2026-08-04T12:00:00Z', updatedAt: '2026-08-04T12:10:00Z',
    notes: [],
    timeline: [
      { id: 'tl-082', type: 'system', message: 'In-store purchase', user: 'POS Terminal 1', timestamp: '2026-08-04T12:00:00Z' },
      { id: 'tl-083', type: 'status_change', message: 'Payment processed, items handed to customer', user: 'Store Associate', timestamp: '2026-08-04T12:10:00Z' },
    ],
    shipments: [],
    returns: [],
  },
];

// ============================================================
// Helper Functions
// ============================================================

export function getOrders(): Order[] {
  return orders;
}

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id || o.orderNumber === id);
}

export function getShipments(): Shipment[] {
  return orders.flatMap((o) => o.shipments);
}

export function getReturns(): Return[] {
  return orders.flatMap((o) => o.returns);
}

export function getDashboardMetrics(): DashboardMetrics {
  const today = '2026-08-04';
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(today));
  const revenueToday = todayOrders.reduce((sum, o) => sum + o.totals.total, 0);
  const allPaidOrders = orders.filter((o) => o.paymentStatus === 'Paid');
  const avgOrderValue = allPaidOrders.length > 0
    ? Math.round((allPaidOrders.reduce((sum, o) => sum + o.totals.total, 0) / allPaidOrders.length) * 100) / 100
    : 0;
  const fulfilledStatuses: FulfillmentStatus[] = ['Fulfilled', 'Shipped', 'Delivered'];
  const fulfillmentRate = orders.length > 0
    ? Math.round((orders.filter((o) => fulfilledStatuses.includes(o.fulfillmentStatus)).length / orders.length) * 10000) / 100
    : 0;

  return {
    ordersToday: todayOrders.length,
    revenueToday: Math.round(revenueToday * 100) / 100,
    avgOrderValue,
    fulfillmentRate,
  };
}

export function getOrdersByStatus(status: FulfillmentStatus): Order[] {
  return orders.filter((o) => o.fulfillmentStatus === status);
}

export { orders, customers };
