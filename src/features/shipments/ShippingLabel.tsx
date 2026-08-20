import type { Shipment, Order } from "@/types";

interface ShippingLabelProps {
  shipment: Shipment;
  order: Order;
}

function BarcodeVisual({ value }: { value: string }) {
  const bars: number[] = [];
  for (let i = 0; i < value.length * 3; i++) {
    bars.push(((value.charCodeAt(i % value.length) * (i + 1)) % 3) + 1);
  }
  return (
    <div className="flex items-end justify-center gap-[1px] h-16">
      {bars.map((w, i) => (
        <div
          key={i}
          className="bg-black"
          style={{
            width: `${w}px`,
            height: `${40 + ((i * 7) % 20)}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function ShippingLabel({ shipment, order }: ShippingLabelProps) {
  return (
    <div className="print-area bg-white text-black p-8 max-w-[4in] mx-auto border-2 border-black font-mono text-sm">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 4in; border: 2px solid black; }
        }
      `}</style>

      {/* Header */}
      <div className="border-b-2 border-black pb-3 mb-3">
        <div className="flex justify-between items-start">
          <div className="font-bold text-lg">ORDER MGMT CO.</div>
          <div className="text-right text-xs">
            <div>{shipment.carrier}</div>
            <div>{shipment.status}</div>
          </div>
        </div>
      </div>

      {/* From */}
      <div className="border-b border-dashed border-black pb-3 mb-3">
        <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-1">
          From
        </div>
        <div>Order Management Co.</div>
        <div>100 Warehouse Blvd</div>
        <div>San Francisco, CA 94105</div>
        <div>US</div>
      </div>

      {/* To */}
      <div className="border-b border-dashed border-black pb-3 mb-3">
        <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-1">
          To
        </div>
        <div className="font-bold">{order.customer.name}</div>
        <div>{order.customer.shippingAddress.street}</div>
        <div>
          {order.customer.shippingAddress.city},{" "}
          {order.customer.shippingAddress.state}{" "}
          {order.customer.shippingAddress.zip}
        </div>
        <div>{order.customer.shippingAddress.country}</div>
      </div>

      {/* Tracking */}
      <div className="border-b border-dashed border-black pb-3 mb-3">
        <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-1">
          Tracking Number
        </div>
        <div className="text-lg font-bold tracking-wider">
          {shipment.trackingNumber}
        </div>
      </div>

      {/* Barcode */}
      <div className="py-3 border-b border-dashed border-black mb-3">
        <BarcodeVisual value={shipment.trackingNumber} />
        <div className="text-center text-xs mt-1 tracking-widest">
          {shipment.trackingNumber}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-xs">
        <div>
          <span className="text-gray-600">Order: </span>
          {order.orderNumber}
        </div>
        <div>
          <span className="text-gray-600">Date: </span>
          {new Date(shipment.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
