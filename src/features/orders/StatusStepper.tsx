import { Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { FulfillmentStatus, TimelineEvent } from "@/types";

const STEPS = [
  "Order Placed",
  "Processing",
  "Packed",
  "Shipped",
  "In Transit",
  "Delivered",
] as const;

const STATUS_TO_STEP_INDEX: Record<FulfillmentStatus, number> = {
  Unfulfilled: 0,
  "Partially Fulfilled": 1,
  Fulfilled: 2,
  Shipped: 3,
  Delivered: 5,
};

interface StatusStepperProps {
  currentStatus: FulfillmentStatus;
  timeline: TimelineEvent[];
}

function getStepTimestamp(
  stepLabel: string,
  timeline: TimelineEvent[]
): string | null {
  const match = timeline.find(
    (e) =>
      e.type === "status_change" &&
      e.message.toLowerCase().includes(stepLabel.toLowerCase())
  );
  return match ? match.timestamp : null;
}

export function StatusStepper({ currentStatus, timeline }: StatusStepperProps) {
  const currentIndex = STATUS_TO_STEP_INDEX[currentStatus] ?? 0;

  return (
    <div className="w-full overflow-x-auto">
      {/* Horizontal layout (md+) */}
      <div className="hidden md:flex items-start justify-between relative min-w-[600px]">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;
          const timestamp = isCompleted
            ? getStepTimestamp(step, timeline)
            : null;

          return (
            <div key={step} className="flex flex-col items-center flex-1 relative">
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={cn(
                    "absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2",
                    isCompleted || isCurrent
                      ? "bg-green-500"
                      : "bg-muted-foreground/20"
                  )}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* Circle */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                  isCompleted &&
                    "bg-green-500 border-green-500 text-white",
                  isCurrent &&
                    "bg-blue-500 border-blue-500 text-white animate-pulse",
                  isFuture &&
                    "bg-background border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center",
                  isCompleted && "text-green-600",
                  isCurrent && "text-blue-600",
                  isFuture && "text-muted-foreground"
                )}
              >
                {step}
              </span>

              {/* Timestamp */}
              {timestamp && (
                <span className="mt-0.5 text-[10px] text-muted-foreground">
                  {format(new Date(timestamp), "MMM d, h:mm a")}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Vertical layout (mobile) */}
      <div className="flex flex-col md:hidden gap-0">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;
          const timestamp = isCompleted
            ? getStepTimestamp(step, timeline)
            : null;

          return (
            <div key={step} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-full border-2",
                    isCompleted && "bg-green-500 border-green-500 text-white",
                    isCurrent && "bg-blue-500 border-blue-500 text-white animate-pulse",
                    isFuture && "bg-background border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 h-8",
                      index < currentIndex
                        ? "bg-green-500"
                        : "bg-muted-foreground/20"
                    )}
                  />
                )}
              </div>
              <div className="pt-1">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isCompleted && "text-green-600",
                    isCurrent && "text-blue-600",
                    isFuture && "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
                {timestamp && (
                  <p className="text-[10px] text-muted-foreground">
                    {format(new Date(timestamp), "MMM d, h:mm a")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
