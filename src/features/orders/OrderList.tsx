import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Search,
  X,
  Package,
  Truck,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";
import type { Order, OrderFilters, FulfillmentStatus, PaymentStatus, OrderChannel } from "@/types";
import { getOrders } from "@/data/mock-data";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  Paid: "bg-green-100 text-green-800 border-green-200",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Failed: "bg-red-100 text-red-800 border-red-200",
};

const FULFILLMENT_STATUS_COLORS: Record<FulfillmentStatus, string> = {
  Unfulfilled: "bg-gray-100 text-gray-800 border-gray-200",
  "Partially Fulfilled": "bg-blue-100 text-blue-800 border-blue-200",
  Fulfilled: "bg-green-100 text-green-800 border-green-200",
  Shipped: "bg-purple-100 text-purple-800 border-purple-200",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

type TabValue = "all" | "processing" | "shipped" | "delivered" | "cancelled" | "returns";

const TAB_STATUS_MAP: Record<TabValue, FulfillmentStatus | null> = {
  all: null,
  processing: "Unfulfilled",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: null,
  returns: null,
};

const DEFAULT_FILTERS: OrderFilters = {
  search: "",
  status: "",
  paymentStatus: "",
  channel: "",
  dateFrom: "",
  dateTo: "",
  amountMin: null,
  amountMax: null,
};

interface OrderListProps {
  onViewOrder?: (orderId: string) => void;
}

export function OrderList({ onViewOrder }: OrderListProps) {
  const allOrders = useMemo(() => getOrders(), []);
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filteredOrders = useMemo(() => {
    let result = allOrders;

    // Tab filter
    const tabStatus = TAB_STATUS_MAP[activeTab];
    if (tabStatus) {
      result = result.filter((o) => o.fulfillmentStatus === tabStatus);
    }
    if (activeTab === "returns") {
      result = result.filter((o) => o.returns.length > 0);
    }

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q)
      );
    }

    // Status filters
    if (filters.status) {
      result = result.filter((o) => o.fulfillmentStatus === filters.status);
    }
    if (filters.paymentStatus) {
      result = result.filter((o) => o.paymentStatus === filters.paymentStatus);
    }
    if (filters.channel) {
      result = result.filter((o) => o.channel === filters.channel);
    }

    // Date range
    if (filters.dateFrom) {
      result = result.filter((o) => o.createdAt >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((o) => o.createdAt <= filters.dateTo + "T23:59:59");
    }

    // Amount range
    if (filters.amountMin !== null) {
      result = result.filter((o) => o.totals.total >= filters.amountMin!);
    }
    if (filters.amountMax !== null) {
      result = result.filter((o) => o.totals.total <= filters.amountMax!);
    }

    return result;
  }, [allOrders, activeTab, filters]);

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        size: 40,
      },
      {
        accessorKey: "orderNumber",
        header: "Order",
        cell: ({ row }) => (
          <button
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            onClick={() => onViewOrder?.(row.original.id)}
          >
            {row.original.orderNumber}
          </button>
        ),
      },
      {
        id: "customer",
        header: "Customer",
        accessorFn: (row) => row.customer.name,
        cell: ({ row }) => (
          <span className="font-medium">{row.original.customer.name}</span>
        ),
      },
      {
        id: "items",
        header: "Items",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.items.length} item
            {row.original.items.length !== 1 ? "s" : ""}
          </span>
        ),
      },
      {
        id: "total",
        header: "Total",
        accessorFn: (row) => row.totals.total,
        cell: ({ row }) => (
          <span className="font-medium">
            {formatCurrency(row.original.totals.total)}
          </span>
        ),
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment",
        cell: ({ row }) => (
          <Badge
            className={cn(
              PAYMENT_STATUS_COLORS[row.original.paymentStatus]
            )}
          >
            {row.original.paymentStatus}
          </Badge>
        ),
      },
      {
        accessorKey: "fulfillmentStatus",
        header: "Fulfillment",
        cell: ({ row }) => (
          <Badge
            className={cn(
              FULFILLMENT_STATUS_COLORS[row.original.fulfillmentStatus]
            )}
          >
            {row.original.fulfillmentStatus}
          </Badge>
        ),
      },
      {
        id: "date",
        header: "Date",
        accessorFn: (row) => row.createdAt,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {format(new Date(row.original.createdAt), "MMM d, yyyy")}
          </span>
        ),
      },
      {
        accessorKey: "channel",
        header: "Channel",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.channel}</span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Package className="mr-2 h-4 w-4" />
                Fulfill
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Truck className="mr-2 h-4 w-4" />
                Ship
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        size: 50,
      },
    ],
    [onViewOrder]
  );

  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const selectedCount = Object.keys(rowSelection).length;
  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.paymentStatus ||
    filters.channel ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.amountMin !== null ||
    filters.amountMax !== null;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as TabValue);
          setRowSelection({});
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 items-end">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            className="pl-9"
          />
        </div>

        <Select
          value={filters.status || "all"}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              status: v === "all" ? "" : (v as FulfillmentStatus),
            }))
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Fulfillment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Unfulfilled">Unfulfilled</SelectItem>
            <SelectItem value="Partially Fulfilled">Partially Fulfilled</SelectItem>
            <SelectItem value="Fulfilled">Fulfilled</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.paymentStatus || "all"}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              paymentStatus: v === "all" ? "" : (v as PaymentStatus),
            }))
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.channel || "all"}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              channel: v === "all" ? "" : (v as OrderChannel),
            }))
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All channels</SelectItem>
            <SelectItem value="Web">Web</SelectItem>
            <SelectItem value="Mobile">Mobile</SelectItem>
            <SelectItem value="In-Store">In-Store</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) =>
            setFilters((f) => ({ ...f, dateFrom: e.target.value }))
          }
          className="w-36"
          placeholder="From"
        />
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) =>
            setFilters((f) => ({ ...f, dateTo: e.target.value }))
          }
          className="w-36"
          placeholder="To"
        />

        <Input
          type="number"
          value={filters.amountMin ?? ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              amountMin: e.target.value ? Number(e.target.value) : null,
            }))
          }
          className="w-28"
          placeholder="Min $"
        />
        <Input
          type="number"
          value={filters.amountMax ?? ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              amountMax: e.target.value ? Number(e.target.value) : null,
            }))
          }
          className="w-28"
          placeholder="Max $"
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            <X className="mr-1 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Bulk actions bar */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 rounded-md bg-muted px-4 py-2">
          <span className="text-sm font-medium">
            {selectedCount} order{selectedCount !== 1 ? "s" : ""} selected
          </span>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm">
              Update Status
            </Button>
            <Button variant="outline" size="sm">
              Export Selected
            </Button>
            <Button variant="outline" size="sm">
              Print Packing Slips
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      header.column.getCanSort() && "cursor-pointer select-none"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}
          {" - "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            filteredOrders.length
          )}{" "}
          of {filteredOrders.length} orders
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
