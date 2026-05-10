import { Link } from "react-router-dom";
import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary to-secondary p-10 text-primary-foreground">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="h-9 w-9 rounded-xl bg-card/20 inline-flex items-center justify-center font-bold">
            G
          </span>
          <span className="font-bold text-lg tracking-tight">{APP_NAME}</span>
        </Link>

        <div className="max-w-md -mt-10">
          <p className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight">
            "We have the right person for the job."
          </p>
          <p className="mt-4 text-sm xl:text-base opacity-90 leading-relaxed">
            Trusted artisans, escrow-protected payments. The Ghanaian way to get things done.
          </p>
        </div>

        <p className="text-xs opacity-70">© {new Date().getFullYear()} {APP_NAME}. Made in Kumasi.</p>
      </div>

      <div className="flex flex-col px-6 sm:px-12 py-10">
        <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
          <span className="h-9 w-9 rounded-xl bg-primary text-primary-foreground inline-flex items-center justify-center font-bold">
            G
          </span>
          <span className="font-bold text-lg">{APP_NAME}</span>
        </Link>
        <div className="m-auto w-full max-w-sm">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 text-sm text-center text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
