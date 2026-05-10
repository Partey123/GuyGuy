import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/AuthLayout";
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const LENGTH = 6;
const VALID_CODE = "123456";

export default function OTPVerify() {
  const [params] = useSearchParams();
  const phone = params.get("phone") || "";
  const name = params.get("name") || "";
  const role = params.get("role") || "client";
  const mode = params.get("mode") || "login";

  const navigate = useNavigate();
  const { login } = useAuth();
  const [code, setCode] = useState(Array(LENGTH).fill(""));
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const focusAt = (i) => {
    const idx = Math.max(0, Math.min(LENGTH - 1, i));
    refs.current[idx]?.focus();
    refs.current[idx]?.select?.();
  };

  const setDigit = (i, v) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    setCode((c) => {
      const n = [...c];
      n[i] = digit;
      return n;
    });
    if (digit && i < LENGTH - 1) focusAt(i + 1);
  };

  const onKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (code[i]) {
        setCode((c) => {
          const n = [...c];
          n[i] = "";
          return n;
        });
      } else if (i > 0) {
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  const onPaste = (e) => {
    const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, LENGTH);
    if (!text) return;
    e.preventDefault();
    const next = Array(LENGTH).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setCode(next);
    focusAt(Math.min(text.length, LENGTH - 1));
  };

  const submit = (e) => {
    e.preventDefault();
    const value = code.join("");
    if (value.length < LENGTH) {
      setError("Enter the full 6-digit code.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (value !== VALID_CODE) {
      setError("Invalid code. Try 123456 in this demo.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setError("");
    login({ phone, role, name });
    toast.success("Welcome to GuyGuy!");
    if (mode === "register" && !role) navigate("/role");
    else if (role === "artisan") navigate("/artisan");
    else if (role === "admin") navigate("/admin");
    else navigate("/home");
  };

  const resend = () => {
    if (resendIn > 0) return;
    toast.info("Code resent to " + phone);
    setResendIn(30);
  };

  return (
    <>
      <style>{`
        @keyframes shake-row { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        .shake-row { animation: shake-row 0.45s ease-in-out; }
      `}</style>
      <AuthLayout title="Enter the 6-digit code" subtitle={`We sent it to ${phone || "your phone"}.`}>
        <form onSubmit={submit} className="space-y-5">
          <div className={cn("flex justify-between gap-2", shake && "shake-row")}>
            {code.map((d, i) => (
              <input
                key={i}
                ref={(el) => (refs.current[i] = el)}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                onPaste={onPaste}
                onFocus={(e) => e.target.select()}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                className="h-14 w-11 sm:w-12 text-center text-2xl font-semibold rounded-xl border border-input bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition"
              />
            ))}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full active:scale-95 transition-transform">
            Verify
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Didn't get it?{" "}
            <button type="button" onClick={resend} disabled={resendIn > 0} className="text-primary disabled:opacity-50">
              {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend"}
            </button>
          </p>
        </form>
      </AuthLayout>
    </>
  );
}
