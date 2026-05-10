import { useEffect, useState } from "react";
import { toast } from "sonner";
import MarketingLayout from "@/components/layout/MarketingLayout";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

export default function Contact() {
  useEffect(() => { document.title = "Contact — GuyGuy"; }, []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!name || !email || !msg) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const tid = toast.loading("Sending…");
    setTimeout(() => {
      toast.success("Thanks! We'll get back to you within 24 hours.", { id: tid });
      setName(""); setEmail(""); setMsg("");
      setLoading(false);
    }, 900);
  };

  return (
    <MarketingLayout title="Contact us" subtitle="Questions, feedback, partnership? We read everything.">
      <p>Email us anytime at <a href="mailto:hello@guyguy.com.gh">hello@guyguy.com.gh</a> or fill in the form below.</p>
      <form onSubmit={submit} className="not-prose mt-8 space-y-4">
        <Input label="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Message</label>
          <textarea
            rows={5}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Tell us what's on your mind…"
          />
        </div>
        <Button type="submit" loading={loading}>Send message</Button>
      </form>
    </MarketingLayout>
  );
}
