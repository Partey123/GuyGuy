import { useRef, useState } from "react";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import Button from "@/components/common/Button";
import { findArtisan } from "@/lib/mockData";
import { useAuth } from "@/hooks/useAuth";

export default function Portfolio() {
  const { user } = useAuth();
  const artisan = findArtisan(user?.artisanId);
  const [items, setItems] = useState(artisan?.portfolio || []);
  const fileRef = useRef(null);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const tid = toast.loading("Uploading photo…");
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setItems((it) => [url, ...it]);
      toast.success("Photo added to your portfolio", { id: tid });
    }, 1500);
    e.target.value = "";
  };

  const remove = (url) => {
    setItems((it) => it.filter((x) => x !== url));
    toast.info("Photo removed");
  };

  const openPicker = () => fileRef.current?.click();

  return (
    <PageWrapper
      title="Portfolio"
      subtitle="Show off past work — clients hire what they can see."
      action={
        <>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
          <Button onClick={openPicker} className="active:scale-95 transition-transform">
            <Plus className="h-4 w-4" /> Add photo
          </Button>
        </>
      }
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-3xl bg-surface border border-dashed border-border">
          <div className="h-16 w-16 rounded-2xl bg-primary-muted text-primary inline-flex items-center justify-center mb-5">
            <ImageIcon className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold">No portfolio photos yet</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
            Add your best work — clients hire what they can see.
          </p>
          <Button onClick={openPicker} className="mt-5 active:scale-95 transition-transform">
            <Plus className="h-4 w-4" /> Add your first photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((src) => (
            <div key={src} className="relative group aspect-square rounded-2xl overflow-hidden border border-border bg-muted">
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => remove(src)}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/90 inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
