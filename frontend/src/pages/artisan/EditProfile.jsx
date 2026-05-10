import { useState } from "react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Avatar from "@/components/common/Avatar";
import { TRADES } from "@/lib/mockData";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { user } = useAuth();
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [trade, setTrade] = useState("electrician");
  const [bio, setBio] = useState("");
  const [momoNumber, setMomoNumber] = useState(user?.momoNumber || "");
  const [momoNetwork, setMomoNetwork] = useState(user?.momoNetwork || "mtn");
  const [skills, setSkills] = useState("");
  const [serviceArea, setServiceArea] = useState(user?.serviceArea || "");
  const [rate, setRate] = useState(user?.rate || 80);
  const [yearsExp, setYearsExp] = useState(user?.yearsExp || 10);
  const [loading, setLoading] = useState(false);

  const save = () => {
    setLoading(true);
    const tid = toast.loading("Saving profile…");
    setTimeout(() => {
      updateProfile({ name, phone, momoNumber, momoNetwork, trade, bio, skills, serviceArea, rate: Number(rate), yearsExp: Number(yearsExp) });
      toast.success("Profile saved!", { id: tid });
      setLoading(false);
    }, 1000);
  };

  const cancel = () => {
    toast.info("Changes discarded");
    navigate(-1);
  };

  return (
    <PageWrapper title="Edit your profile" subtitle="A complete profile gets more bookings.">
      <div className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatar} name={user?.name} size="xl" />
          <div>
            <Button variant="outline" size="sm">Change photo</Button>
            <p className="text-xs text-muted-foreground mt-1">JPG or PNG, up to 4MB</p>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="MoMo number" placeholder="024 XXX XXXX" inputMode="tel" value={momoNumber} onChange={(e) => setMomoNumber(e.target.value)} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium">MoMo network</label>
            <select
              value={momoNetwork}
              onChange={(e) => setMomoNetwork(e.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm"
            >
              <option value="mtn">MTN Mobile Money</option>
              <option value="vodafone">Vodafone Cash</option>
              <option value="airteltigo">AirtelTigo Money</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium">Trade</label>
            <select
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm"
            >
              {TRADES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <Input label="Service area" placeholder="e.g. Kumasi, Suame, Asokwa" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
          <Input label="Starting rate (GHS)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
          <Input label="Years of experience" type="number" value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} />
          <Input
            label="Skills (comma separated)"
            placeholder="wiring, fans, sockets, industrial"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1.5">About you</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell clients about your work and experience"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={cancel}>Cancel</Button>
          <Button onClick={save} loading={loading} className="active:scale-95 transition-transform">Save changes</Button>
        </div>
      </div>
    </PageWrapper>
  );
}
