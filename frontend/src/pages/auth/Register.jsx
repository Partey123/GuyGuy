import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const role = params.get("role") || "client";

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!name.trim()) next.name = "Your name is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email";
    if (phone.replace(/\s/g, "").length < 9) next.phone = "Enter a valid Ghana mobile number";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const tid = toast.loading("Sending verification code…");
    setTimeout(() => {
      toast.success("Code sent to " + phone, { id: tid });
      setLoading(false);
      navigate(
        `/verify?phone=${encodeURIComponent(phone)}&name=${encodeURIComponent(name)}&role=${role}&mode=register`,
      );
    }, 1100);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle={role === "artisan" ? "Set up your artisan profile in minutes." : "Find a trusted guy for any job."}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium">Login</Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Kwame Asante"
          error={errors.name}
        />
        <Input
          label="Email"
          type="email"
          inputMode="email"
          placeholder="kwame@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          label="Phone number"
          inputMode="tel"
          placeholder="024 XXX XXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          hint="Ghana mobile number"
          error={errors.phone}
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button type="submit" loading={loading} className="w-full active:scale-95 transition-transform">
          Continue
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          By continuing you agree to our terms and privacy policy.
        </p>
      </form>
    </AuthLayout>
  );
}
