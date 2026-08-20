import type { Order } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface InvoiceProps {
  order: Order;
}

export default function Invoice({ order }: InvoiceProps) {
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
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-2">
            OM
          </div>
          <h2 className="text-lg font-bold">Order Management Co.</h2>
          <p className="text-gray-600">100 Warehouse Blvd</p>
          <p className="text-gray-600">San Francisco, CA 94105</p>
          <p className="text-gray-600">tax@ordermgmt.co</p>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h1>
          <table className="text-sm ml-auto">
            <tbody>
              <tr>
                <td className="text-gray-500 pr-3">Invoice #</td>
                <td className="font-medium">{order.orderNumber}</td>
              </tr>
              <tr>
                <td className="text-gray-500 pr-3">Date</td>
                <td className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <td className="text-gray-500 pr-3">Payment</td>
                <td className="font-medium">{order.paymentStatus}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing Address */}
      <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b border-gray-200">
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
            Bill To
          </h3>
          <p className="font-bold">{order.customer.name}</p>
          <p>{order.customer.billingAddress.street}</p>
          <p>
            {order.customer.billingAddress.city},{" "}
            {order.customer.billingAddress.state}{" "}
            {order.customer.billingAddress.zip}
          </p>
          <p>{order.customer.billingAddress.country}</p>
          <p className="mt-1 text-gray-600">{order.customer.email}</p>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
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
          <tr className="bg-gray-100">
            <th className="text-left py-3 px-3 text-xs uppercase tracking-wider">
              Product
            </th>
            <th className="text-left py-3 px-3 text-xs uppercase tracking-wider">
              Variant
            </th>
            <th className="text-left py-3 px-3 text-xs uppercase tracking-wider">
              SKU
            </th>
            <th className="text-right py-3 px-3 text-xs uppercase tracking-wider">
              Qty
            </th>
            <th className="text-right py-3 px-3 text-xs uppercase tracking-wider">
              Unit Price
            </th>
            <th className="text-right py-3 px-3 text-xs uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-3 px-3">{item.productName}</td>
              <td className="py-3 px-3">{item.variant}</td>
              <td className="py-3 px-3 font-mono text-xs">{item.sku}</td>
              <td className="py-3 px-3 text-right">{item.quantity}</td>
              <td className="py-3 px-3 text-right">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="py-3 px-3 text-right">
                {formatCurrency(item.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(order.totals.subtotal)}</span>
          </div>
          {order.totals.discount > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Discount</span>
              <span className="text-red-600">
                -{formatCurrency(order.totals.discount)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Shipping</span>
            <span>{formatCurrency(order.totals.shipping)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Tax</span>
            <span>{formatCurrency(order.totals.tax)}</span>
          </div>
          <div className="flex justify-between py-2 border-t-2 border-black mt-2 font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(order.totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-gray-50 rounded-md p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Payment Status: </span>
            <span
              className={
                order.paymentStatus === "Paid"
                  ? "text-green-700 font-medium"
                  : "text-yellow-700 font-medium"
              }
            >
              {order.paymentStatus}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Payment Method: </span>
            <span className="font-medium">{order.paymentMethod}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
        <p>Thank you for your business!</p>
        <p className="mt-1">
          Order Management Co. | 100 Warehouse Blvd, San Francisco, CA 94105 |
          support@ordermgmt.co
        </p>
      </div>
    </div>
  );
}
