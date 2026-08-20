import type { Order } from "@/types";

interface PackingSlipProps {
  order: Order;
}

function BarcodeVisual({ value }: { value: string }) {
  const bars: number[] = [];
  for (let i = 0; i < value.length * 3; i++) {
    bars.push(((value.charCodeAt(i % value.length) * (i + 1)) % 3) + 1);
  }
  return (
    <div className="flex items-end justify-center gap-[1px] h-12">
      {bars.map((w, i) => (
        <div
          key={i}
          className="bg-black"
          style={{
            width: `${w}px`,
            height: `${30 + ((i * 7) % 15)}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function PackingSlip({ order }: PackingSlipProps) {
  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="print-area bg-white text-black p-8 max-w-2xl mx-auto font-sans text-sm">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">PACKING SLIP</h1>
          <p className="text-gray-600 mt-1">Order Management Co.</p>
          <p className="text-gray-600">100 Warehouse Blvd</p>
          <p className="text-gray-600">San Francisco, CA 94105</p>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <BarcodeVisual value={order.orderNumber} />
            <p className="text-xs tracking-widest mt-1">{order.orderNumber}</p>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-1">
            Order Number
          </h3>
          <p className="font-bold">{order.orderNumber}</p>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mt-3 mb-1">
            Date
          </h3>
          <p>{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-1">
            Ship To
          </h3>
          <p className="font-bold">{order.customer.name}</p>
          <p>{order.customer.shippingAddress.street}</p>
          <p>
            {order.customer.shippingAddress.city},{" "}
            {order.customer.shippingAddress.state}{" "}
            {order.customer.shippingAddress.zip}
          </p>
          <p>{order.customer.shippingAddress.country}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left py-2 text-xs uppercase tracking-wider">
              Product
            </th>
            <th className="text-left py-2 text-xs uppercase tracking-wider">
              Variant
            </th>
            <th className="text-left py-2 text-xs uppercase tracking-wider">
              SKU
            </th>
            <th className="text-right py-2 text-xs uppercase tracking-wider">
              Qty
            </th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-300">
              <td className="py-2">{item.productName}</td>
              <td className="py-2">{item.variant}</td>
              <td className="py-2 font-mono text-xs">{item.sku}</td>
              <td className="py-2 text-right">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-black">
            <td colSpan={3} className="py-2 font-bold">
              Total Items
            </td>
            <td className="py-2 text-right font-bold">{totalItems}</td>
          </tr>
        </tfoot>
      </table>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
        <p>Thank you for your order!</p>
        <p>Questions? Contact support@ordermgmt.co</p>
      </div>
    </div>
  );
}
