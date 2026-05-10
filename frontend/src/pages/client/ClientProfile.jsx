import { useState } from "react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

export default function ClientProfile() {
  const { user, logout } = useAuth();
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState(user?.address || "");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const save = () => {
    setLoading(true);
    const tid = toast.loading("Saving…");
    setTimeout(() => {
      updateProfile({ name, phone, email, address });
      toast.success("Profile updated!", { id: tid });
      setLoading(false);
    }, 800);
  };

  const onLogout = () => {
    logout();
    toast.info("Signed out");
  };

  return (
    <PageWrapper title="Profile">
      <div className="rounded-2xl bg-card border border-border p-6 flex items-center gap-4">
        <Avatar src={user.avatar} name={user.name} size="xl" />
        <div>
          <p className="text-xl font-bold">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.phone || "+233 24 000 0000"}</p>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="optional" />
        <Input label="Default address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Plot 12, Nhyiaeso" />
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={save} loading={loading}>Save changes</Button>
        <Button variant="outline" onClick={onLogout}>Sign out</Button>
      </div>
    </PageWrapper>
  );
}
