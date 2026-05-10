import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!identifier.trim()) next.identifier = "Enter your name or email";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const tid = toast.loading("Signing you in…");
    setTimeout(() => {
      toast.success("Verification code sent", { id: tid });
      setLoading(false);
      navigate(`/verify?phone=${encodeURIComponent(identifier)}&mode=login`);
    }, 1000);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to GuyGuy."
      footer={
        <>
          New to GuyGuy?{" "}
          <Link to="/register" className="text-primary font-medium">Create an account</Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Name or email"
          placeholder="kwame@example.com"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          error={errors.identifier}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button type="submit" loading={loading} className="w-full active:scale-95 transition-transform">
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
