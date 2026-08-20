import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type {
  OrderItem,
  Return,
  ReturnItem,
  ReturnReason,
  ReturnCondition,
  RefundMethod,
} from "@/types";
import { generateId, formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reasons: ReturnReason[] = [
  "Defective",
  "Wrong Item",
  "Not as Described",
  "Changed Mind",
  "Too Large",
  "Too Small",
  "Damaged in Shipping",
  "Other",
];

const conditions: ReturnCondition[] = ["New", "Used", "Damaged", "Opened"];

const returnSchema = z.object({
  items: z
    .array(
      z.object({
        orderItemId: z.string(),
        selected: z.boolean(),
        quantity: z.number().min(1),
        maxQuantity: z.number(),
        productName: z.string(),
        unitPrice: z.number(),
        condition: z.enum(["New", "Used", "Damaged", "Opened"]),
      })
    )
    .refine((items) => items.some((i) => i.selected), {
      message: "Select at least one item",
    }),
  reason: z.string().min(1, "Reason is required"),
  refundMethod: z.enum(["original", "store_credit"]),
  notes: z.string(),
});

type ReturnFormData = z.infer<typeof returnSchema>;

interface CreateReturnDialogProps {
  orderId: string;
  items: OrderItem[];
  open: boolean;
  onClose: () => void;
  onSubmit: (ret: Return) => void;
}

export default function CreateReturnDialog({
  orderId,
  items,
  open,
  onClose,
  onSubmit,
}: CreateReturnDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<ReturnFormData>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      items: items.map((item) => ({
        orderItemId: item.id,
        selected: false,
        quantity: item.quantity,
        maxQuantity: item.quantity,
        productName: item.productName,
        unitPrice: item.unitPrice,
        condition: "New" as ReturnCondition,
      })),
      reason: "",
      refundMethod: "original",
      notes: "",
    },
  });

  const watchedItems = watch("items");
  const watchedReason = watch("reason");

  const refundAmount = watchedItems
    .filter((i) => i.selected)
    .reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const handleFormSubmit = (data: ReturnFormData) => {
    const selectedItems: ReturnItem[] = data.items
      .filter((i) => i.selected)
      .map((i) => ({
        orderItemId: i.orderItemId,
        quantity: i.quantity,
        reason: data.reason as ReturnReason,
        condition: i.condition as ReturnCondition,
      }));

    const ret: Return = {
      id: `RET-${generateId()}`,
      orderId,
      items: selectedItems,
      reason: data.reason as ReturnReason,
      condition: selectedItems[0]?.condition ?? "New",
      status: "Requested",
      refundAmount,
      refundMethod: data.refundMethod as RefundMethod,
      createdAt: new Date().toISOString(),
      notes: data.notes,
    };

    onSubmit(ret);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Return</DialogTitle>
          <DialogDescription>
            Select items to return and provide details
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="text-sm font-medium">Items to Return</Label>
            {watchedItems.map((item, index) => (
              <div
                key={item.orderItemId}
                className="rounded-md border p-3 space-y-2"
              >
                <div className="flex items-center gap-3">
                  <Controller
                    control={control}
                    name={`items.${index}.selected`}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.unitPrice)} each
                    </p>
                  </div>
                  {item.selected && (
                    <Input
                      type="number"
                      min={1}
                      max={item.maxQuantity}
                      className="w-20"
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  )}
                </div>
                {item.selected && (
                  <div className="ml-9">
                    <Label className="text-xs">Condition</Label>
                    <Controller
                      control={control}
                      name={`items.${index}.condition`}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {conditions.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
            {errors.items?.root && (
              <p className="text-sm text-destructive">
                {errors.items.root.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Reason</Label>
            <Controller
              control={control}
              name="reason"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasons.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">
                {errors.reason.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Refund Method</Label>
            <Controller
              control={control}
              name="refundMethod"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original Payment</SelectItem>
                    <SelectItem value="store_credit">Store Credit</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              rows={3}
              {...register("notes")}
            />
          </div>

          <div className="rounded-md bg-muted p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Estimated Refund</span>
              <span className="text-lg font-bold">
                {formatCurrency(refundAmount)}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Return</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
