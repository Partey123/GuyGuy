import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const role = params.get("role") || "client";
  const { signup } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!name.trim()) next.name = "Your name is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const tid = toast.loading("Creating your account…");
    try {
      await signup({ full_name: name, email, password, role });
      toast.success("Account created. Check your email for verification.", { id: tid });
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message || "Registration failed", { id: tid });
    } finally {
      setLoading(false);
    }
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
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button type="submit" loading={loading} className="w-full active:scale-95 transition-transform">
          Create account
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          By continuing you agree to our terms and privacy policy.
        </p>
      </form>
    </AuthLayout>
  );
}
