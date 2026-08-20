import { useState, useMemo } from "react";
import { getOrders } from "@/data/mock-data";
import type { Return, ReturnStatus, ReturnReason } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, RotateCcw } from "lucide-react";

const statusColors: Record<ReturnStatus, string> = {
  Requested: "bg-yellow-100 text-yellow-800",
  Approved: "bg-blue-100 text-blue-800",
  Received: "bg-purple-100 text-purple-800",
  Refunded: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

const statusActions: Record<ReturnStatus, { label: string; nextStatus: ReturnStatus }[]> = {
  Requested: [
    { label: "Approve", nextStatus: "Approved" },
    { label: "Reject", nextStatus: "Rejected" },
  ],
  Approved: [{ label: "Mark Received", nextStatus: "Received" }],
  Received: [{ label: "Process Refund", nextStatus: "Refunded" }],
  Refunded: [],
  Rejected: [],
};

interface ReturnWithOrder extends Return {
  orderNumber: string;
}

export default function ReturnList() {
  const orders = useMemo(() => getOrders(), []);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reasonFilter, setReasonFilter] = useState<string>("all");
  const [returnsState, setReturnsState] = useState<ReturnWithOrder[]>(() =>
    orders.flatMap((order) =>
      order.returns.map((r) => ({
        ...r,
        orderId: order.id,
        orderNumber: order.orderNumber,
      }))
    )
  );

  const reasons = useMemo(() => {
    const set = new Set(returnsState.map((r) => r.reason));
    return [...set];
  }, [returnsState]);

  const filtered = useMemo(() => {
    return returnsState.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (reasonFilter !== "all" && r.reason !== reasonFilter) return false;
      return true;
    });
  }, [returnsState, statusFilter, reasonFilter]);

  const handleAction = (returnId: string, nextStatus: ReturnStatus) => {
    setReturnsState((prev) =>
      prev.map((r) => (r.id === returnId ? { ...r, status: nextStatus } : r))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Returns</h2>
          <p className="text-muted-foreground">
            Manage return requests and refunds
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {filtered.length} return{filtered.length !== 1 ? "s" : ""}
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
                <SelectItem value="Requested">Requested</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                {reasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
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
                <TableHead>Return ID</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Refund</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <RotateCcw className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No returns found
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((ret) => {
                const actions = statusActions[ret.status];
                return (
                  <TableRow key={ret.id}>
                    <TableCell className="font-mono text-sm">
                      {ret.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {ret.orderNumber}
                    </TableCell>
                    <TableCell className="text-center">
                      {ret.items.reduce((s, i) => s + i.quantity, 0)}
                    </TableCell>
                    <TableCell>{ret.reason}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "border-0",
                          statusColors[ret.status]
                        )}
                      >
                        {ret.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(ret.refundAmount)}
                    </TableCell>
                    <TableCell>
                      {ret.refundMethod === "original"
                        ? "Original Payment"
                        : "Store Credit"}
                    </TableCell>
                    <TableCell>
                      {new Date(ret.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {actions.length > 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions.map((action) => (
                              <DropdownMenuItem
                                key={action.nextStatus}
                                onClick={() =>
                                  handleAction(ret.id, action.nextStatus)
                                }
                              >
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
