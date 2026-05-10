import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import AppRoutes from "@/routes/index.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}
