import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { formatCedi } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    title: z.string().min(4, "Briefly describe the job"),
    description: z.string().min(10, "Tell us more so they can prepare"),
    address: z.string().min(3, "Address is required"),
    scheduledFor: z.string().optional(),
    jobType: z.enum(["labour_only", "labour_and_materials"]),
    labourAmount: z.coerce.number().min(10, "Minimum GHS 10"),
    materialsAmount: z.coerce.number().min(0, "Cannot be negative").optional(),
  })
  .refine(
    (d) => d.jobType === "labour_only" || (d.materialsAmount ?? 0) >= 0,
    { message: "Materials amount required", path: ["materialsAmount"] },
  );

export default function BookingForm({ defaultValues, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);
  const [jobType, setJobType] = useState(defaultValues?.jobType || "labour_only");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      jobType: "labour_only",
      labourAmount: 100,
      materialsAmount: 0,
      ...defaultValues,
    },
  });

  const labour = Number(watch("labourAmount") || 0);
  const materials = jobType === "labour_and_materials" ? Number(watch("materialsAmount") || 0) : 0;
  const total = labour + materials;
  const fee = Math.round(labour * 0.1);
  const artisanGets = total - fee;

  const submit = async (data) => {
    setSubmitting(true);
    try {
      await onSubmit?.({ ...data, jobType, materialsAmount: materials });
    } finally {
      setSubmitting(false);
    }
  };

  const setType = (t) => {
    setJobType(t);
    setValue("jobType", t);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <Input
        label="Job title"
        placeholder="e.g. Replace ceiling fan"
        {...register("title")}
        error={errors.title?.message}
      />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Describe what you need done"
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.description && (
          <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Address" placeholder="House, area" {...register("address")} error={errors.address?.message} />
        <Input
          label="Preferred date"
          type="datetime-local"
          {...register("scheduledFor")}
          error={errors.scheduledFor?.message}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Job type</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["labour_only", "Labour only"],
            ["labour_and_materials", "Labour + Materials"],
          ].map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setType(k)}
              className={cn(
                "h-11 rounded-lg border text-sm font-medium transition active:scale-95",
                jobType === k
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-card hover:border-primary/40",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className={cn("grid gap-4", jobType === "labour_and_materials" ? "sm:grid-cols-2" : "")}>
        <Input
          label="Labour amount (GHS)"
          type="number"
          {...register("labourAmount")}
          error={errors.labourAmount?.message}
        />
        {jobType === "labour_and_materials" && (
          <Input
            label="Materials amount (GHS)"
            type="number"
            {...register("materialsAmount")}
            error={errors.materialsAmount?.message}
          />
        )}
      </div>

      <div className="rounded-xl bg-primary-muted p-3 text-sm space-y-1 text-primary">
        <div className="flex justify-between"><span>Total amount</span><span className="font-semibold">{formatCedi(total)}</span></div>
        <div className="flex justify-between"><span>Commission basis (labour)</span><span>{formatCedi(labour)}</span></div>
        <div className="flex justify-between"><span>GuyGuy fee (10%)</span><span>{formatCedi(fee)}</span></div>
        <div className="flex justify-between font-semibold border-t border-primary/20 pt-1 mt-1">
          <span>Artisan receives</span><span>{formatCedi(artisanGets)}</span>
        </div>
      </div>

      <Button type="submit" loading={submitting} className="w-full active:scale-95 transition-transform">
        Send request
      </Button>
    </form>
  );
}
