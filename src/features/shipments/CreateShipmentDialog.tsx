import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { OrderItem, Shipment, ShipmentItem } from "@/types";
import { generateId } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const shipmentSchema = z.object({
  items: z
    .array(
      z.object({
        orderItemId: z.string(),
        selected: z.boolean(),
        quantity: z.number().min(1),
        maxQuantity: z.number(),
        productName: z.string(),
      })
    )
    .refine((items) => items.some((i) => i.selected), {
      message: "Select at least one item",
    }),
  carrier: z.string().min(1, "Carrier is required"),
  trackingNumber: z.string().min(1, "Tracking number is required"),
  estimatedDelivery: z.string().min(1, "Estimated delivery date is required"),
});

type ShipmentFormData = z.infer<typeof shipmentSchema>;

interface CreateShipmentDialogProps {
  orderId: string;
  items: OrderItem[];
  open: boolean;
  onClose: () => void;
  onSubmit: (shipment: Shipment) => void;
}

const carriers = ["UPS", "FedEx", "DHL", "USPS", "Other"];

export default function CreateShipmentDialog({
  orderId,
  items,
  open,
  onClose,
  onSubmit,
}: CreateShipmentDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      items: items.map((item) => ({
        orderItemId: item.id,
        selected: false,
        quantity: item.quantity - item.fulfilledQuantity,
        maxQuantity: item.quantity - item.fulfilledQuantity,
        productName: item.productName,
      })),
      carrier: "",
      trackingNumber: "",
      estimatedDelivery: "",
    },
  });

  const watchedItems = watch("items");

  const handleFormSubmit = (data: ShipmentFormData) => {
    const selectedItems: ShipmentItem[] = data.items
      .filter((i) => i.selected)
      .map((i) => ({
        orderItemId: i.orderItemId,
        quantity: i.quantity,
      }));

    const shipment: Shipment = {
      id: `SHP-${generateId()}`,
      orderId,
      items: selectedItems,
      carrier: data.carrier,
      trackingNumber: data.trackingNumber,
      status: "Label Created",
      estimatedDelivery: new Date(data.estimatedDelivery).toISOString(),
      trackingEvents: [
        {
          date: new Date().toISOString(),
          status: "Label Created",
          location: "",
          description: "Shipping label has been created",
        },
      ],
      createdAt: new Date().toISOString(),
    };

    onSubmit(shipment);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Shipment</DialogTitle>
          <DialogDescription>
            Select items and enter shipping details
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="text-sm font-medium">Items to Ship</Label>
            {watchedItems.map((item, index) => (
              <div
                key={item.orderItemId}
                className="flex items-center gap-3 rounded-md border p-3"
              >
                <Controller
                  control={control}
                  name={`items.${index}.selected`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={item.maxQuantity <= 0}
                    />
                  )}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    Available: {item.maxQuantity}
                  </p>
                </div>
                {item.selected && item.maxQuantity > 0 && (
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
            ))}
            {errors.items?.root && (
              <p className="text-sm text-destructive">
                {errors.items.root.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="carrier">Carrier</Label>
            <Controller
              control={control}
              name="carrier"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    {carriers.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.carrier && (
              <p className="text-sm text-destructive">
                {errors.carrier.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trackingNumber">Tracking Number</Label>
            <Input
              id="trackingNumber"
              placeholder="Enter tracking number"
              {...register("trackingNumber")}
            />
            {errors.trackingNumber && (
              <p className="text-sm text-destructive">
                {errors.trackingNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
            <Input
              id="estimatedDelivery"
              type="date"
              {...register("estimatedDelivery")}
            />
            {errors.estimatedDelivery && (
              <p className="text-sm text-destructive">
                {errors.estimatedDelivery.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Shipment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
