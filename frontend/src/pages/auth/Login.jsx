import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!email.trim()) next.email = "Enter your email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const tid = toast.loading("Signing you in…");
    try {
      const response = await login({ email, password });
      toast.success("Signed in successfully", { id: tid });
      navigate(response.dashboard_url || "/home");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message || "Login failed", { id: tid });
    } finally {
      setLoading(false);
    }
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
          label="Email"
          type="email"
          placeholder="kwame@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
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
